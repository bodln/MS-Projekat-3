
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
}

buttonStep.addEventListener("click", e  => {
    stepEvent()
})

buttonConclude.addEventListener("click", e => {
    for(let i = 0; i < multiplicant.value.length * 2; i++){
        stepEvent()
    }
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
})

buttonReset.addEventListener("click", e => {
    // <---------------------------------------------------------------- Dion-chan -------------------------------------------------
    for(let i = 0; i < multiplicant.value.length * 2; i++){
        undoEvent()
    }
})