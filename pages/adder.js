import Multiplicand from './components/multiplicand.js'
import Multiplier from './components/multiplier.js'    
import Product from './components/product.js'
import Control from './components/control.js'
import ALU from './components/ALU.js'
import formater from './middleware/formatMiddleware.js'

export default function Adder() {

    const mulLocal = new Multiplicand()
    const mulpLocal = new Multiplier()
    const product = new Product(8)
    const controlLocal = new Control()
    const formaterLocal = new formater()
    const ALULocal = new ALU()

    const doStep = () => {
        
    }
}


ALULocal.steps.push(mulpLocal.shiftR)
ALULocal.steps.push(formaterLocal.addBin)
ALULocal.steps.push(mulLocal.shiftL)

button.addEventListener("click", e=> {
    const test = ALULocal.stepFunc(product.value, mulLocal.value, mulpLocal.value.slice(-1))
    
    if(test) {console.log(test)
        product.set(test)
    }
    app.innerHTML = mulLocal.render() + mulpLocal.render() + product.render() + controlLocal.body + ALULocal.render()
})

app.innerHTML = mulLocal.render() + mulpLocal.render() + product.render()+ ALULocal.render() + controlLocal.body