import Multiplicand from './components/multiplication/multiplicand.js'
import Multiplier from './components/multiplication/multiplier.js'    
import Product from './components/multiplication/product.js'
import Control from './components/multiplication/control.js'
import ALU from './components/multiplication/ALU.js'

import { routeMultiplier, routeMultiplierOptimized, routeDivider, routeDividerOptimized } from './config/router.js'

//Middleware
import formater from './middleware/formatMiddleware.js'
import extender from './middleware/bitBaseExtentionMiddleware.js'

//app
const app = document.querySelector("#main")

//buttons
const buttonTest = document.querySelector(".test")
const buttonUndo = document.querySelector(".undo")
const buttonSubmit = document.querySelector(".form-button")

//Components
const mulLocal = new Multiplicand()
const mulpLocal = new Multiplier()
const product = new Product(8)
const controlLocal = new Control()
const formaterLocal = new formater()
const ALULocal = new ALU()

//Connecting components
ALULocal.steps.push(mulpLocal.shiftR)
ALULocal.steps.push(formaterLocal.addBin)
ALULocal.steps.push(mulLocal.shiftL)

//Multiplier logic
buttonTest.addEventListener("click", e=> {
    const test = ALULocal.stepFunc(product.value, mulLocal.value, mulpLocal.value)
    
    if(test) {console.log(test)
        product.set(test)
    }
    renderMultiplier()
})

buttonUndo.addEventListener('click', e => {
    const undoStep = ALULocal.undo()
    if(undoStep){
        if(undoStep[0] == 'multiplier'){
            mulpLocal.value = undoStep[1]
        }else if(undoStep[0] == 'multiplicand'){
            mulLocal.value = undoStep[1]
        }else{
            product.value = undoStep[1]
        }
        console.log(undoStep)
        renderMultiplier()
    }
    
})

const renderMultiplier = () => {
    app.innerHTML = mulLocal.render() + mulpLocal.render() + product.render() + controlLocal.body + ALULocal.render()
}

//Kreiranje aplikacije
app.style.setProperty("display", "none")

//INPUT SEGMENT

//input DOM
//??? Naci bolji nacin razdvajanja radio button-a
const type = document.querySelector("#type")
const radios = document.querySelectorAll("input[type=radio]")
const firstOperand = document.querySelector("#first-operand")
const secondOperand = document.querySelector("#second-operand")
const firstLabel = document.querySelector("label[for='first-operand']")
const secondLabel = document.querySelector("label[for='second-operand'")

const additional = document.querySelector(".custom-dropdown")
additional.style.setProperty("display", "none")

let bits

//Two way binding for bit input
let firstOperandInput = "";
let secondOperandInput = "";

type.addEventListener("change", e => {
    additional.style.setProperty("display", "flex")

    if(type.value.startsWith("multiplier")) {
        firstLabel.textContent = "Multiplicand"
        secondLabel.textContent = "Multiplier"     
        return
    }

    firstLabel.textContent = "Divident"
    secondLabel.textContent = "Divisor"
})

//Changing widths of input fields based on bits needed
for (const radio of radios) {
    radio.addEventListener("click", e=> {
        bits = Number(radio.value)
        firstOperand.style.setProperty("width", `${bits}ch`)
        secondOperand.style.setProperty("width", `${bits}ch`)
        console.log(firstOperand);
        console.log(secondOperand);
    })
}

//Bit inoput validation
const checkValidation = (input, range) => {
    const chars = input.split("") 

    if(input == "")
    return true

    //Checking for 0/1
    if(!["0", "1"].includes(chars[chars.length-1])) {
        return false
    }

    console.log("throguh 0-1");
    //Checking for the needed length
    if(chars.length > range) {
        return false
    };

    return true
}

firstOperand.addEventListener("input", e=> {
    if(checkValidation(firstOperand.value, bits)){
        firstOperandInput = firstOperand.value
        return 
    }
    firstOperand.value = firstOperandInput
})

secondOperand.addEventListener("input", e=> {
    if(checkValidation(secondOperand.value, bits/2)) {
        secondOperandInput = secondOperand.value
        return
    }
    secondOperand.value = secondOperandInput
})

buttonSubmit.addEventListener("click", e=> {
    e.preventDefault()
    const firstOperandExtended = extender(firstOperandInput, bits)
    const secondOperandExtended = extender(secondOperandInput, bits/2)
    app.style.setProperty("display", "grid")
    
    sessionStorage.setItem("firstOperand", `${firstOperandExtended}`)
    sessionStorage.setItem("secondOperand", `${secondOperandExtended}`)

    console.log(type);

    switch(type.value) {
        case "multiplier":
            routeMultiplier()
            break;
        case "multiplier-optimised":
            routeMultiplierOptimized
            break;
        case "divider":
            routeDivider()
            break;
        case "divider-optimised":
            routeDividerOptimized()
            break;
        default:
            alert("Please select the type of architecture you want") 
    }
})