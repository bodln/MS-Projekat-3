import Divisor from "../../components/division/divisorOptimised.js"
import RemainderAndQuotient from "../../components/division/remainder-quotient.js"
import ALU from "../../components/division/ALUoptimisedDivison.js"
import Router from "../../config/router.js"
import Extender from "../../middleware/bitBaseExtentionMiddleware.js"
import Formater from "../../middleware/formatMiddleware.js"

const initialValues = {
    divident: sessionStorage.getItem("firstOperand"),
    divisor: sessionStorage.getItem("secondOperand")
}

if(!initialValues.divident  || !initialValues.divisor) {
    alert("initial values have not been set, returning to set form")
    Router.home()
}

const formater = new Formater()

const divisor = new Divisor(document.querySelector("#divisor-view-port"), `${Extender("0", initialValues.divisor.length)}${initialValues.divisor}`)
const remandquot = new RemainderAndQuotient(document.querySelector("#remainder-view-port"), `${Extender("0", initialValues.divisor.length * 2)}${initialValues.divident}`)
const alu = new ALU()



alu.steps.push(remandquot.shiftL)
alu.steps.push(formater.subBinDec)

//buttons
const doButton = document.querySelector("#do")
const undoButton = document.querySelector("#undo")
const buttonConclude = document.querySelector("#conclude")
const buttonReset = document.querySelector("#reset")

let historyLog = []

let stepEvent = () => {
    const testDiv = alu.stepFunc(remandquot.value, divisor.value)
    if(testDiv[0]) {
        remandquot.setValue(testDiv[0])
    }
    if(testDiv[1] != undefined){
        historyLog.push(testDiv[1])
        renderHistory()
    }
}

doButton.addEventListener("click", e => {
    stepEvent()
})

buttonConclude.addEventListener("click", e => {
    for(let i = 0; i < divisor.value.length * 2; i++){
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
        case "remandquot":
            remandquot.setValue(prevState[1])
            break;
        default:
            console.log("Someting went oh so terribly wrong....")
        }
    }
}

undoButton.addEventListener("click", e => {
    undoEvent()
})

buttonReset.addEventListener("click", e => {
    // <---------------------------------------------------------------- Dion-chan -------------------------------------------------
    for(let i = 0; i < divisor.value.length * 2; i++){
        undoEvent()
    }
})