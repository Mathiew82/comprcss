var codeCSS = `
#menu-vertical {
	width: 75px;
	height: 100vh;
	background-color: rgba(10, 11, 12, 0.9);
	box-shadow: 5px 0px 0px rgba(119, 204, 255, 0.7);
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100;
}
#menu-vertical > #menu-web {
	list-style-type: none;
	list-style-position: inside;
	margin: 0;
	padding: 0;
}
#menu-vertical > #menu-web li {
	width: 100%;
	height: 75px;
	position: relative;
	transform: translate3d(0, 3000px, 0);
	animation: bounceInUp 0.3s;
	animation-fill-mode: forwards;
}
#menu-vertical > #menu-web li:nth-of-type(1) {
	animation-delay: 0.1s;
}
#menu-vertical > #menu-web li:nth-of-type(2) {
	animation-delay: 0.2s;
}
#menu-vertical > #menu-web li:nth-of-type(3) {
	animation-delay: 0.3s;
}
#menu-vertical > #menu-web li:nth-of-type(4) {
	animation-delay: 0.4s;
}
#menu-vertical > #menu-web li:nth-of-type(5) {
	animation-delay: 0.5s;
}
#menu-vertical > #menu-web li:nth-of-type(6) {
	animation-delay: 0.6s;
}
.test1,
.test2,
.test3 {
  color: red;
}
`;

var loading = false

window.onload = function () {
  var codeInput = document.querySelector('.code-input')
  var codeCompress = document.querySelector('.code-compress')

  codeInput.focus()

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
      var codeResult = document.querySelector('.code-result')
      compressCss(codeInput.value).then(function (result) {
        codeResult.innerHTML = result

        loading = false
        checkLoading(loading)

        codeInput.value = ''
        codeInput.focus()
      })
    }, 2000)
  }
}

function compressCss (code) {
  return new Promise(function (resolve, reject) {
    console.log(code.length)

    var result = ''
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
        code[i].match(/[a-z0-9\{\}\:\;\#\.\[\]\^\~\+\/\*\(\)\,\>\-]/i) ||
        ((controlPoint === '}' && code[i] === ' ') || controlPoint === ':')
      ) {
        result += code[i]
      }
    }

    result = result.replace(/ {/g, '{')
    result = result.replace(/: /g, ':')
    result = result.replace(/;}/g, '}')
    result = result.replace(/0\./g, '.')
    result = result.replace(/ > /g, '>')
    result = result.replace(/ \+ /g, '+')
    result = result.replace(/ ~ /g, '~')
    result = result.replace(/, /g, ',')

    console.log(result.length)

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
