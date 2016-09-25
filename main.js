// DOM elements
let passwordInput = document.getElementById('main-pass'),
    accountInput = document.getElementById('account'),
    keepShortCheckbox = document.getElementById('keep-short'),
    displayCheckbox = document.getElementById('display'),
    resultDiv = document.getElementById('result')

// Password generation

let generationCallback = () => {
    clearTimeout(resetTimer)
    resultDiv.innerText = generatePassword(passwordInput.value, accountInput.value, keepShortCheckbox.checked)
    resetTimerProgressBar.set(1)
    resetTimerProgressBar.animate(0)
    resetTimer = setTimeout(reset, 10000)
}

passwordInput.addEventListener('keyup', generationCallback)
accountInput.addEventListener('keyup', generationCallback)
keepShortCheckbox.addEventListener('click', generationCallback)

function generatePassword(password, account, keepShort) {
    //let time = new Date().getTime()
    let salt = 'a38V7C!320A$50b/877Z9'
    let pass = sha512((password + account + salt).repeat(2))

    for (let i = 0; i < 10000; i++) pass = sha512(pass)

    pass = translatePass(pass).substr(0, [40,16][+keepShort])
    //console.log(new Date().getTime() - time)

    return pass
}

// Reset everything in 10 seconds

let resetTimer

function reset() {
    passwordInput.value = ''
    accountInput.value = ''
    keepShortCheckbox.checked = false
    resultDiv.innerText = ''
}

// Reset timer progress bar
let resetTimerProgressBar = new ProgressBar.Line('#reset-timer', {
    strokeWidth: 2,
    duration: 10000,
    color: '#fff',
    trailColor: 'rgba(0,0,0,0)',
    //trailColor: '#bbb',
    trailWidth: 0,
    svgStyle: {width: '100%', height: '100%'},
    from: {color: '#fff'},
    to: {color: '#fff'},
    step: (state, bar) => bar.path.setAttribute('stroke', state.color)
})

// Translation

function translate(input, inputAlphabet, outputAlphabet) {
    function decode(input, alphabet) {
        return input
            .split('')
            .reverse()
            .map((n,p) => alphabet.indexOf(n) * Math.pow(alphabet.length, p))
            .reduce((a,b) => a + b)
    }

    function encode(input, alphabet) {
        let rixit,
            residual = Math.floor(input),
            result = '',
            size = alphabet.length

        while (residual != 0) {
            rixit = residual % size
            result = alphabet[rixit] + result
            residual = Math.floor(residual / size)
        }

        return result;
    }

    return encode(decode(input, inputAlphabet), outputAlphabet)
}

function translatePass(password) {
    return translate(
        password,
        '0123456789abcdefghijklmnopqrstuvwxyz'.split(''),
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,?.;:/+=%*$()!-_&@#<>|'.split('')
    )
}
