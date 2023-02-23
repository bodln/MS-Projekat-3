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

//KOMPONENTE VIZUELNO
const divisorC = document.querySelector(".divisor")
const remainderC = document.querySelector('.remainder')
const controlC = document.querySelector(".control")
const aluC = document.querySelector(".alu")

const components = [divisorC, remainderC, controlC, aluC]

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

    animate()
}

doButton.addEventListener("click", e => {
    stepEvent()
})

buttonConclude.addEventListener("click", e => {
    var concludeInterval = setInterval( () => {
        stepEvent()
        if ( alu.iteration == divisor.value.length ) {
            clearInterval(concludeInterval)
        }
    }, 1000 )
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
    animate()
    if(alu.undoStack.length == 0) {
        for(const component of components) {
            component.classList.remove("active")
        }
    }

    document.querySelector("#control-view-port").textContent = ""
})

buttonReset.addEventListener("click", e => {
    // <---------------------------------------------------------------- Dion-chan -------------------------------------------------
    for(let i = 0; i < divisor.value.length * 2; i++){
        undoEvent()
    }

    for(const component of components) {
        component.classList.remove("active")
    }
    document.querySelector("#control-view-port").textContent = ""
    remandquot.setValue(remandquot.value)
})

const animate = () => {
    //EL RESETO
    for(const component of components) {
        component.classList.remove("active")
    }
    document.querySelector("#control-view-port").textContent = ""

    remainderC.classList.add("active")
    if(alu.currStep === 0) {
        //POSTAVI RAZLIKU U CONTROL
        controlC.classList.add("active")

        const resault = parseInt(formater.binToDec(divisor.value)) - parseInt(formater.binToDec(remandquot.value))

        aluC.classList.add("active")
        controlC.style.setProperty("--animation-primary", "red")
        document.querySelector("#control-view-port").textContent = resault
        divisorC.classList.add("active")

        if ( alu.replaceLSB == '1' && resault >= 0 ) {
            controlC.style.setProperty("--animation-primary", "green") 
            const initial = remandquot.value
            remandquot.view.innerHTML = ""
            remandquot.view.innerHTML += `${initial.slice(0, -1)}<span class='active-span'>${initial.slice(-1)}</span>`
        }
    }
}