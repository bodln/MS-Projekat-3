import Divisor from "../../components/division/divisor.js"
import Quotient from "../../components/division/quotient.js"
import ALU from "../../components/division/ALUdivision.js"
import Remainder from "../../components/division/remainder.js"
import Router from "../../config/router.js"
import Extender from "../../middleware/bitBaseExtentionMiddleware.js"
import Formater from "../../middleware/formatMiddleware.js"

console.log("After import");

const initialValues = {
    divident: sessionStorage.getItem("firstOperand"),
    divisor: sessionStorage.getItem("secondOperand")
}

if(!initialValues.divident  || !initialValues.divisor) {
    alert("initial values have not been set, returning to set form")
    Router.home()
}

const formater = new Formater()

//LOGICAL COMPONENTS
const divisor = new Divisor(document.querySelector("#divisor-view-port"), `${initialValues.divisor}${Extender("0", initialValues.divisor.length)}`)
const quotient = new Quotient(document.querySelector("#quotient-view-port"), Extender("0", initialValues.divisor.length))
const remainder = new Remainder(document.querySelector("#remainder-view-port"), `${initialValues.divident}`)
const alu = new ALU()

//DOM COMPONENTS
const divisorC = document.querySelector(".divisor")
const quotientC = document.querySelector(".quotient")
const remainderC = document.querySelector(".remainder")
const ALUC = document.querySelector(".alu")
const controlC = document.querySelector(".control")

const components = [divisorC, quotientC, remainderC, ALUC, controlC]

console.log(initialValues.divident)

alu.steps.push(formater.subBinDec)
alu.steps.push(quotient.shiftL)
alu.steps.push(divisor.shiftR)

//buttons
const doButton = document.querySelector("#do")
const undoButton = document.querySelector("#undo")
const buttonConclude = document.querySelector("#conclude")
const buttonReset = document.querySelector("#reset")

let historyLog = []

let stepEvent = () => {
    const testDiv = alu.stepFunc(remainder.value, divisor.value, quotient.value)
    if(testDiv[0]) {
        remainder.setValue(testDiv[0])
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
    //VAR ZATO STO INTERVAL CLIRAMO KAD SE FUKNCIJA ZAVRSI I LOKALNE PROMENLJIVE NESTANU 
    var concludeInterval = setInterval( () => {
        stepEvent()
        alu.iteration === (quotient.value.length + 1) ? clearInterval(concludeInterval) : ""
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
            case "quotient":
                quotient.setValue(prevState[1])
                break;
            case "remainder":
                remainder.setValue(prevState[1])
                break;
            case "divisor":
                divisor.setValue(prevState[1])
                break;
            default:
                console.log("Someting went oh so terribly wrong....")
        }

        animate()
    }
}

undoButton.addEventListener("click", e => {
    undoEvent()
})

buttonReset.addEventListener("click", e => {
    // <---------------------------------------------------------------- Dion-chan -------------------------------------------------
    for(let i = 0; i < (quotient.value.length + 1) * 3; i++){
        undoEvent()
    }
})

const animate = () => {
    //RESET ALL ANIMATION ON COMPONENTS 
    for (const component of components) {
        component.classList.remove("active")
    }
    ALUC.classList.remove("active");
    divisor.setValue(divisor.value)
    quotient.setValue(quotient.value)
    remainder.setValue(remainder.value)
    
    //GET THE LAST COMPONENT TROUGH UNDOSTACK
    const componentName = alu.undoStack[alu.undoStack.length-1][0]

    //GET THE DOM COMPONENT WITH THAT NAME AND ACTIVATE IT
    document.querySelector(`.${componentName}`).classList.add("active")

    //CHANGE THE VISUAL VALUE FOR CARRY IN WHEN REMAINDER SHIFTS
    if (componentName === "quotient") {
        //REPRESENT CHECKS FOR CONTROL AND SET ANIMATION COLOR TO: GREEN -> GOES TROUGH; RED -> DOENST GO TROUGH

        alu.carryIn === "1" ? controlC.style.setProperty("--animation-primary", "green") : controlC.style.setProperty("--animation-primary", "red")

        document.querySelector("#control-view-port").textContent = `Carry in = ${alu.carryIn}`
        controlC.classList.add("active")
        console.log(ALUC.classList);
    }

    //ACTIVATE ALU WHEN SUBTRACTION DOES THE THING AS WELL AS DIVISOR
    if (componentName === "remainder") {
        divisorC.classList.add("active")
        ALUC.classList.add("actve");
    }

    if ( componentName == "divisor" ) {
        divisor.view.textContent = `${alu.undoStack[alu.undoStack.length-1][1]} --> ${divisor.value}`
    }

    if (alu.currStep==1) {
        ALUC.classList.add("active")
    }
}