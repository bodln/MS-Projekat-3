import Router from './config/router.js'
import Formater from "./middleware/formatMiddleware.js"

const formater = new Formater()

//Middleware
import extender from './middleware/bitBaseExtentionMiddleware.js'
//app
const app = document.querySelector("#main")

//form button
const buttonSubmit = document.querySelector(".form-button")
    

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

let defaultSize = document.getElementById('bit8')
defaultSize.checked = true

let bits = 8

for (const radio of radios) {
    radio.addEventListener("click", e => {
        bits = radio.value
        //console.log(bits);
    })
}

type.addEventListener("change", e => {

    if(!type.value) {
        additional.style.setProperty("display", "none");
        return
    }

    additional.style.setProperty("display", "flex")

    if(type.value.startsWith("multiplier")) {
        firstLabel.textContent = "Multiplicand"
        secondLabel.textContent = "Multiplier"     
        return
    }

    firstLabel.textContent = "Divident"
    secondLabel.textContent = "Divisor"
})

//Bit inoput validation
const checkValidation = (input, range) => {
    if(2**range/2-1 < input || 2**range/2 * (-1) > input) {
        return false
    }

    return true
}

firstOperand.addEventListener("input", e=> {
    console.log(checkValidation(firstOperand.value, bits));
    if(!checkValidation(firstOperand.value, bits)){
        e.target.style.setProperty("outline-color", "red")
        return 
    }  
    e.target.style.setProperty("outline-color", "black")
})

secondOperand.addEventListener("input", e=> {
    if(!checkValidation(secondOperand.value, bits/2)) {
        e.target.style.setProperty("outline-color", "red")
        return
    }
    e.target.style.setProperty("outline-color", "black")
})

buttonSubmit.addEventListener("click", e=> {
    e.preventDefault()
    
    if (!type.value){
        alert("Izaberite zeljeni hardver.");
        return
    }

    if (firstOperand.value == "" || secondOperand.value == "") {
        //@bodln Ovo treba da se izbaci negde ispod forme kao warning error
        alert("Unesite inicijalne vrednosti.");
        return
    }

    if (!checkValidation(firstOperand.value, bits) || !checkValidation(secondOperand.value, bits/2)) {
        //@bodln I ovde
        alert("Uneseni broj ne može biti predstavljen trenutnim brojem bitova.")
        return
    }

    const firstOperandValueBin = formater.decToBin(Number(firstOperand.value))
    const secondOperandValueBin = formater.decToBin(Number(secondOperand.value))
    
    sessionStorage.setItem("firstOperand", `${extender(firstOperandValueBin, bits)}`)
    sessionStorage.setItem("secondOperand", `${extender(secondOperandValueBin, bits/2)}`)

    console.log(type);

    switch(type.value) {
        case "multiplier":
            Router.multiplier()
            break;
        case "multiplier-optimised":
            Router.multiplierOptimized()
            break;
        case "divider":
            Router.divider()
            break;
        case "divider-optimised":
            Router.dividerOptimized()
            break;
        default:
            alert("Izaberite zeljeni hardver.") 
    }
})