/** Script JS */
/** Global Variables */
var loading     = false
var beforeBytes = 0
var afterBytes  = 0
var percentage  = 0

/** Onload Event */
window.onload = function () {
  /** HTML Elements */
  var codeInput           = document.querySelector('.code-input')
  var codeCompress        = document.querySelector('.code-compress')
  var codeResultContent   = document.querySelector('.code-result__content')
  var copybutton          = document.querySelector('.copy-btn')
  var resetButton         = document.querySelector('.reset-btn')
  var compressionValue    = document.querySelector('.compression-value')
  var compressionLevel    = document.querySelector('.compression-level')
  var compressionLevelBar = document.querySelector('.compression-level__bar')
  var compressionIcons    = document.querySelector('.compression-icons')

  codeInput.focus()

  /** Events */
  copybutton.onclick = function () {
    copyToClipboard(codeResultContent)
  }

  resetButton.onclick = function () {
    codeResultContent.innerHTML = ''

    compressionValue.classList.remove('show')
    compressionLevel.classList.remove('show')
    compressionIcons.classList.remove('show')

    codeInput.value = ''
    codeInput.focus()
  }

  codeInput.onkeyup = function (event) {
    if (event.keyCode === 13) {
      event.preventDefault()
      codeCompress.click()
    }
  }

  codeCompress.onclick = function () {
    loading = true
    checkLoading(loading)

    setTimeout(function () {
      compressCss(codeInput.value).then(function (result) {
        loading = false
        checkLoading(loading)

        codeResultContent.innerHTML = result

        compressionValue.classList.add('show')
        compressionValue.innerHTML = '<span class="compression-value__percentage">' + percentage + '%</span> de compresión | ' + beforeBytes + ' > ' + afterBytes + ' (bytes)'
        compressionLevel.classList.add('show')
        compressionLevelBar.style.width = percentage + '%'
        compressionIcons.classList.add('show')

        codeInput.value = ''
        codeInput.focus()
      })
    }, 500)
  }
}

/** Functions */
function firstPartCompression (code) {
  var localResult = ''
  var controlPoint = '}'
  
  for(var i = 0; i < code.length; i++) {
    if (
      code[i] === '{' ||
      code[i] === '}' ||
      code[i] === ':' ||
      code[i] === ';'
    ) {
      controlPoint = code[i]
    }
    if (
      code[i].length === 1 &&
      code[i].match(/[a-z0-9\{\}\:\;\#\.\[\]\^\~\+\/\*\(\)\,\>\@\%\-]/i) ||
      ((controlPoint === '}' && code[i] === ' ') || controlPoint === ':')
    ) {
      localResult += code[i]
    }
  }

  return localResult
}

function secondPartCompression (result) {
  result = result.replace(/ {/g, '{')
  result = result.replace(/: /g, ':')
  result = result.replace(/;}/g, '}')
  result = result.replace(/}  /g, '}')
  result = result.replace(/} /g, '}')
  result = result.replace(/0\./g, '.')
  result = result.replace(/ > /g, '>')
  result = result.replace(/ \+ /g, '+')
  result = result.replace(/ ~ /g, '~')
  result = result.replace(/, /g, ',')
  return result
}

function removeComments (result) {
  result = result.replace(/\/\*(.*)\*\//g, '')
  return result
}

function compressCss (code) {
  return new Promise(function (resolve, reject) {
    var
    result = removeComments(code)
    result = firstPartCompression(result)
    result = secondPartCompression(result)

    beforeBytes = code.length
    afterBytes = result.length
    percentage = 100 - parseInt(afterBytes * 100 / beforeBytes)

    resolve(result)
  })
}

function checkLoading (state) {
  var loader = document.querySelector('.lds-dual-ring')
  var button = document.querySelector('.code-compress')
  var codeInput = document.querySelector('.code-input')

  if (state) {
    loader.classList.add('show')
    button.classList.add('hide')
    codeInput.setAttribute('disabled', 'disabled')
  } else {
    loader.classList.remove('show')
    button.classList.remove('hide')
    codeInput.removeAttribute('disabled')
  }
}

function copyToClipboard (element) {
  element.select()
  element.setSelectionRange(0, 99999) /*For mobile devices*/
  document.execCommand('copy')
  clearSelection()
  showNotification('<i class="icon icon-ok"></i> Ya puedes pegar tu código!')
}

function clearSelection () {
  if (window.getSelection) {
    window.getSelection().removeAllRanges()
  } else if (document.selection) {
    document.selection.empty()
  }
}

function showNotification (content) {
  var notification = document.createElement('div')
  notification.classList.add('notification')
  notification.innerHTML = content
  document.body.appendChild(notification)

  setTimeout(function () {
    document.body.removeChild(notification)
  }, 3000)
}
