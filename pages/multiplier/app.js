import Multiplier from "../../components/multiplication/multiplier.js"
import Multiplicant from "../../components/multiplication/multiplicand.js"
import ALU from "../../components/multiplication/ALU.js"
import Product from "../../components/multiplication/product.js"
import Router from "../../config/router.js"
import Formater from "../../middleware/formatMiddleware.js"
import BaseExtender from "../../middleware/bitBaseExtentionMiddleware.js"


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

//COMPONENTS DOM
const multiplierC = document.querySelector(".multiplier")
const multiplicandC = document.querySelector(".multiplicand")
const controlC = document.querySelector(".control")
const ALUC = document.querySelector(".alu")
const productC = document.querySelector(".product")

const components = [multiplierC, multiplicandC, ALUC, productC, controlC]

//COMPONENTS LOGIC
const multiplier = new Multiplier(document.querySelector("#multiplier-view-port"), baseValues.multiplier)
const multiplicant = new Multiplicant(document.querySelector("#multiplicant-view-port"), baseValues.multiplicant)
const alu = new ALU()
const product = new Product(document.querySelector("#product-view-port"), BaseExtender("000", multiplicant.value.length))

alu.steps.push(multiplier.shiftR)
alu.steps.push(formater.addBin)
alu.steps.push(multiplicant.shiftL)

//buttons
const buttonStep = document.querySelector("#do")
const buttonUndo = document.querySelector("#undo")
const buttonConclude = document.querySelector("#conclude")
const buttonReset = document.querySelector("#reset")

let historyLog = []

let stepEvent = () => {
    const possibleProduct = alu.stepFunc(product.value, multiplicant.value, multiplier.value)
    if(possibleProduct[0] != undefined) {
        product.setValue(possibleProduct[0])
    }
    if(possibleProduct[1]){
        historyLog.push(possibleProduct[1])
        renderHistory()
    }

    animate()
}

buttonStep.addEventListener("click", e  => {
    stepEvent()
})

buttonConclude.addEventListener("click", e => {
    var doInterval = setInterval( () => {
        stepEvent()
        if (alu.iteration == multiplier.value.length) {
            clearInterval(doInterval)
        }
    }, 1000)
})

let renderHistory = () => {

    const history = document.getElementById("history");
    //SEKURITI RISC, REFACTOR CODE?
    history.innerHTML = "";

    historyLog.forEach((log) => {

        const liElement = document.createElement("li");
        liElement.classList.add("historyItem");
        liElement.innerText = log;
        console.log(log)
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
            case "multiplicand":
                multiplicant.setValue(prevState[1])
                break;
            case "multiplier":
                multiplier.setValue(prevState[1])
                break;
            case "product":
                product.setValue(prevState[1])
                break;
            default:
                console.log("Someting went oh so terribly wrong....")
        }
        animate()
    }
}

buttonUndo.addEventListener("click", e => {
    undoEvent()
})

buttonReset.addEventListener("click", e => {
    // <---------------------------------------------------------------- @dejanaksovic DONE -------------------------------------------------
    for(let i = 0; i < multiplier.value.length * 3; i++){
        undoEvent()
    }
    for(const component of components) {
        component.classList.remove("active")
    }
})

const animate = () => {
    //RESET ALL COMPONENTS EXCEPT CONTROL, WHICH IS TO BE DETERMENED TO COLOR
    for(let i=0; i<components.length; i++) {
        components[i].classList.remove("active")
    }
    
    multiplier.setValue(multiplier.value)
    multiplicant.setValue(multiplicant.value)
    product.setValue(product.value)

    ALUC.classList.remove("active");

    //ACTRIVATE CONTROL
    controlC.classList.add("active")

    //POSLEDNJA KOMPONENTA NA KOJOJ JE IZVRSENA KOMPUTACIJA IZ ALU STACKA SE UZIMA I STAVLJA SE DA JE ACTIVE
    const componentName = alu.undoStack[alu.undoStack.length-1][0]
    document.querySelector(`.${componentName}`).classList.add("active")
    console.log(componentName, document.querySelector(`.${componentName}`));

    //CPROVERA ZA CONTROL, UKOLIKO JE POSLEDNJA KOMPONENTA MULTIPLIER, PROMENA CARRY OUT-A
    if (componentName === "multiplier") {
        multiplier.viewBind.textContent = `${alu.undoStack[alu.undoStack.length-1][1]} ---> ${multiplier.value}`
        document.querySelector("#control-view-port").textContent = `Carry out = ${alu.carryOut}`
        //AKO JE SABIRANJE DOZVOLJENO ZELENI GLOW, A AKO NIJE CRVENI
        alu.carryOut === "0" ? controlC.style.setProperty("--animation-primary", "red") : controlC.style.setProperty("--animation-primary", "green")
    }

    if (componentName === "multiplicand") {
        multiplicant.viewBind.textContent = `${alu.undoStack[alu.undoStack.length-1][1]} <--- ${multiplicant.value}`
    }

    if (componentName === "product" && alu.carryOut === '1') {
        product.viewBind.textContent= (`${alu.undoStack[alu.undoStack.length-1][1]} \n +${multiplicant.value} \n ${product.value}`)
        ALUC.classList.add("active");
        multiplicandC.classList.add("active")
    }

}
