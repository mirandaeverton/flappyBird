const flappy = document.querySelector('[wm-flappy]')
const cenario = document.querySelector('.cenario')
let caindo, voando, movendo, rodando
let proximoObstaculo = 0
const velocidadeDoJogo = 50
const passoDeJogo = 5
const posicaoCenario = cenario.getBoundingClientRect().x

function voar() {
    console.log('voando')
    clearInterval(caindo)
    const velocidadeSubida = 30
    const passoDeSubida = 5
    let posicaoAtual = flappy.offsetTop
    let limiteSuperior = passoDeSubida
    voando = setInterval(() => {
        if (posicaoAtual > limiteSuperior) {
            posicaoAtual -= passoDeSubida
            flappy.style.top = `${posicaoAtual}px`
        }
    }, velocidadeSubida)
}

function cair() {
    console.log('caindo')
    clearInterval(voando)
    const velocidadeQueda = 40
    const passoDeQueda = 5
    let posicaoAtual = flappy.offsetTop
    let limiteInferior = cenario.clientHeight - flappy.clientHeight
    caindo = setInterval(() => {
        if (posicaoAtual < limiteInferior) {
            posicaoAtual += passoDeQueda
            flappy.style.top = `${posicaoAtual}px`
        }
    }, velocidadeQueda)
}

function criarObstáculo() {
    const tamanhoPassagem = 150
    const max = cenario.clientHeight - tamanhoPassagem - 50
    const min = 50
    const tamanho = Math.floor(Math.random() * (max - min)) + min

    const obstaculo = document.createElement('div')
    obstaculo.classList.add('obstaculo')

    obstaculo.appendChild(criarTuboSuperior(tamanho))
    obstaculo.appendChild(criarTuboInferior(tamanho))
    cenario.appendChild(obstaculo)
}

function criarTuboSuperior(tamanho) {
    const tubo = document.createElement('div')
    const pontaTubo = document.createElement('div')
    const baseTubo = document.createElement('div')

    tubo.classList.add('tubo')
    pontaTubo.classList.add('ponta-tubo')
    baseTubo.classList.add('base-tubo')
    tubo.style.height = `${tamanho}px`
    tubo.style.top = '0px'


    tubo.appendChild(baseTubo)
    tubo.appendChild(pontaTubo)

    return tubo
}

function criarTuboInferior(tamanho) {
    const tubo = document.createElement('div')
    const pontaTubo = document.createElement('div')
    const baseTubo = document.createElement('div')

    tubo.classList.add('tubo')
    pontaTubo.classList.add('ponta-tubo')
    baseTubo.classList.add('base-tubo')
    tubo.style.height = `${cenario.clientHeight - tamanho - 100}px`
    tubo.style.bottom = '0px'


    tubo.appendChild(pontaTubo)
    tubo.appendChild(baseTubo)

    return tubo
}

function moverObstaculos() {
    const obstaculos = document.querySelectorAll('.obstaculo')
    
    obstaculos.forEach(obstaculo => {
        const posicaoInicioObstaculo = obstaculo.getBoundingClientRect().x
        const posicaoAtual = posicaoInicioObstaculo - posicaoCenario
        const movimento = posicaoAtual - passoDeJogo
        obstaculo.style.left = `${movimento}px`

        if(!document.querySelector('[atual]')) {
            obstaculo.setAttribute('atual', true)
        }

        if(proximoObstaculo >= 700) {
            proximoObstaculo = 0
            criarObstáculo()
        }
        
        const posicaoFlappy = flappy.getBoundingClientRect().x - flappy.clientWidth - obstaculo.clientWidth
        const meioDoCenario = flappy.getBoundingClientRect().x
        
        console.log('movimento', movimento)

        if (movimento < meioDoCenario && movimento > posicaoFlappy) {
            verificarColisao()
        }

        if(movimento < posicaoFlappy) {
            obstaculo.removeAttribute('atual')
            obstaculo.nextElementSibling.setAttribute('atual', true)
        }

        const posicaoFimObstaculo = obstaculo.getBoundingClientRect().x + obstaculo.getBoundingClientRect().width
        if (posicaoFimObstaculo < posicaoCenario) {
            obstaculo.remove()
        }
    })
}

function verificarColisao() {
    console.log('verificando colisao')
    const tuboSuperior = document.querySelector('[atual]').firstElementChild
    const tuboInferior = document.querySelector('[atual]').lastElementChild

    const coordenadasFlappy = flappy.getBoundingClientRect().y
    const coordenadasTuboSuperior = tuboSuperior.getBoundingClientRect().y + tuboSuperior.clientHeight //Considerar a parte de baixo do tubo. Logo, soma-se sua altura
    const coordenadasTuboInferior = tuboInferior.getBoundingClientRect().y
    console.log('flappy', coordenadasFlappy)
    console.log('superior', coordenadasTuboSuperior)
    console.log('inferior', coordenadasTuboInferior)
    if(coordenadasFlappy < coordenadasTuboSuperior || coordenadasFlappy > coordenadasTuboInferior) {
        console.log('Colisão')
        clearInterval(rodando)
    }
}

function play() {
    criarObstáculo()
    rodando = setInterval(() => {
        moverObstaculos()
        proximoObstaculo += passoDeJogo
    }, velocidadeDoJogo)
    document.addEventListener('DOMContentLoaded', cair, false)
    document.onkeydown = voar
    document.onkeyup = cair
}

play()



