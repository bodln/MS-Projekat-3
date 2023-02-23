
import Multiplicant from "../../components/multiplication/multiplicandOptimised.js"
import Product from "../../components/multiplication/product-multiplier.js"
import Router from "../../config/router.js"
import Formater from "../../middleware/formatMiddleware.js"
import BaseExtender from "../../middleware/bitBaseExtentionMiddleware.js"
import ALUoptimised from "../../components/multiplication/ALUoptimised.js"


const formater = new Formater()

const baseValues = { 
    multiplicant: sessionStorage.getItem("firstOperand"),
    multiplier: sessionStorage.getItem("secondOperand")
}

//Provera inicijalnih vrednost sesije, direktni pristupi
if (!baseValues.multiplicant || !baseValues.multiplier) {
    alert("initial values haven't been set, please go back and set them")
    Router.home()
}

//COMPONENTS
const multiplicant = new Multiplicant(document.querySelector("#multiplicant-view-port"), baseValues.multiplicant.slice(baseValues.multiplicant.length/2))
const alu = new ALUoptimised()
const product = new Product(document.querySelector("#product-view-port"), BaseExtender(baseValues.multiplier, baseValues.multiplicant.length))

//COMPONENTS VISUAL
const multiplicantC = document.querySelector(".multiplicant")
const aluC = document.querySelector(".alu")
const productC = document.querySelector(".product")
const controlC = document.querySelector(".control")
const components = [multiplicantC, aluC, productC, controlC]

alu.steps.push(formater.addBin)
alu.steps.push(product.shiftR)

//buttons
const buttonStep = document.querySelector("#do")
const buttonUndo = document.querySelector("#undo")
const buttonConclude = document.querySelector("#conclude")
const buttonReset = document.querySelector("#reset")

let historyLog = []

let stepEvent = () => {
    const possibleProduct = alu.stepFunc(product.value, multiplicant.value)
    if(possibleProduct[0] != undefined) {
        product.setValue(possibleProduct[0])
    }
    if(possibleProduct[1] != undefined){
        historyLog.push(possibleProduct[1])
        renderHistory()
    }

    animate()
}

buttonStep.addEventListener("click", e  => {
    stepEvent()
})

buttonConclude.addEventListener("click", e => {
    var concludeInterval = setInterval(() => {
        stepEvent()
        alu.iteration === multiplicant.value.length ? clearInterval(concludeInterval) : ""
    }, 1000)
})

let renderHistory = () => {

    const history = document.getElementById("history");
    history.innerHTML = "";

    historyLog.forEach((log) => {

        const liElement = document.createElement("li");
        liElement.classList.add("historyItem");
        liElement.innerText = log;
        history.appendChild(liElement);

        // history.innerHTML += `<li class="historyItem">${log}</li> `
    })
}

let undoEvent = () => {
    const prevState = alu.undo()
    if(historyLog.length > 0){
        historyLog.pop()
        renderHistory()
    }
    if(prevState) {
        switch(prevState[0]) {
            case "productandmultiplier":
                product.setValue(prevState[1])
                break;
            default:
                console.log("Someting went oh so terribly wrong....")
        }
    }
}

buttonUndo.addEventListener("click", e => {
    undoEvent()
    animate()
})

buttonReset.addEventListener("click", e => {
    // <---------------------------------------------------------------- Dion-chan -------------------------------------------------
    for(let i = 0; i < multiplicant.value.length * 2; i++){
        undoEvent()
    }

    for(const component of components) {
        component.classList.remove("active")
    }
})

const animate = () => {
    //RESET ALL COMPONENTS 
    for(let i = 0 ; i < components.length-1; i++) {
        components[i].classList.remove("active")
    }

    controlC.classList.add("active")
    productC.classList.add("active")

    if (alu.currStep === 1) {
        signalLSB(product.viewBind)   
        const LSB = product.value.slice(-1)
        document.querySelector("#control-view-port").textContent = `Carry out = ${LSB}`
        LSB === '1' ? controlC.style.setProperty("--animation-primary", "green") : controlC.style.setProperty("--animation-primary", "red")

        if(isLSBOne(product.value)) {
            const viewPort = product.viewBind
            const initial = viewPort.textContent
            viewPort.innerHTML = ""
            viewPort.innerHTML += `${multiplicant.value} <br><span style= 'margin-left: -2ch' >+ ${alu.undoStack[alu.undoStack.length-1][1]}</span><br>`
            viewPort.innerHTML += `<span class= 'active-span'> ${initial.slice(0, initial.length/2)} </span>`
            viewPort.innerHTML += `${initial.slice(initial.length/2-1, initial.length)}`
            multiplicantC.classList.add("active")
            aluC.classList.add("active")
        }

    }
}

const signalLSB = (viewPort) => {
    const initial = viewPort.textContent.split("")
    viewPort.innerHTML = ""
    for(let i = 0; i < initial.length-1 ; i++) {
        viewPort.innerHTML += initial[i]
    }
    viewPort.innerHTML += `<span class = 'active-span'>${initial[initial.length-1]}</span>`
}

const isLSBOne = (binary) => {
    if(binary.slice(-1) === '1')
        return true

    return false
}