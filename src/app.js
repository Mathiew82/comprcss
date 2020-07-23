/** ------------- */
/** | Script JS | */
/** ------------- */

/** Global Variables */
var
loading     = false,
beforeBytes = 0,
afterBytes  = 0,
percentage  = 0

/** Onload Event */
window.onload = function () {
  /** HTML Elements */
  var
  codeInput           = document.querySelector('.code-input'),
  codeCompress        = document.querySelector('.code-compress'),
  codeResultContent   = document.querySelector('.code-result__content'),
  copybutton          = document.querySelector('.copy-btn'),
  resetButton         = document.querySelector('.reset-btn'),
  compressionValue    = document.querySelector('.compression-value'),
  compressionLevel    = document.querySelector('.compression-level'),
  compressionLevelBar = document.querySelector('.compression-level__bar'),
  compressionIcons    = document.querySelector('.compression-icons')

  /*+ Focus Start */
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
        compressionValue.innerHTML = '<span class="compression-value__percentage">' + percentage + '%</span> compression | ' + beforeBytes + ' > ' + afterBytes + ' (bytes)'
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
  var
  localResult  = '',
  controlPoint = '}'

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
    afterBytes  = result.length
    percentage  = 100 - parseInt(afterBytes * 100 / beforeBytes)

    resolve(result)
  })
}

function checkLoading (state) {
  var
  loader    = document.querySelector('.lds-dual-ring'),
  button    = document.querySelector('.code-compress'),
  codeInput = document.querySelector('.code-input')

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
  element.removeAttribute('disabled')
  element.select()
  element.setSelectionRange(0, 99999) /*For mobile devices*/
  document.execCommand('copy')
  clearSelection()
  element.setAttribute('disabled', 'disabled')
  showNotification('<i class="icon icon-ok"></i> Code copied!')
}

function clearSelection () {
  if (window.getSelection) {
    window.getSelection().removeAllRanges()
  } else if (document.selection) {
    document.selection.empty()
  }
}

function showNotification (content) {
  var
  notification = document.createElement('div')
  notification.classList.add('notification')
  notification.innerHTML = content
  document.body.appendChild(notification)

  setTimeout(function () {
    document.body.removeChild(notification)
  }, 3000)
}
