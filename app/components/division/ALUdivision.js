import formatMiddleware from "../../middleware/formatMiddleware.js"

export default function ALUdivision() {
    this.body = `<div class="alu"> ALU </div>`
    this.steps = []
    this.currStep = 0
    this.iteration = 0
    this.carryIn = '0'
    this.formater = new formatMiddleware()
    this.stepFunc = (remainder, divisor, quotient) => {
        
        let returnValue = undefined

        if(this.iteration < quotient.length + 1){
            if(this.currStep == 0){
                let rem = this.steps[this.currStep](remainder, divisor)
                if(rem < 0){
                    this.carryIn = '0'
                    rem = this.formater.binToDec(remainder)
                    //console.log("Because the difference between Remainder and Divisor is negative, Remainder stays the same.")
                }else{
                    this.carryIn = '1'
                    //console.log("The Remainder has changed.")
                }
                returnValue = this.formater.decToBin(rem)
                while(returnValue.length < remainder.length){
                    returnValue = '0' + returnValue
                }
            }else if(this.currStep == 1){
                this.steps[this.currStep](this.carryIn)
                if(this.carryIn == '1'){
                    //console.log("Quotinet shifts to the left, the new bit is '1' because the difference between Remainder and Divisor is a non-negative number.")
                }else{
                    //console.log("Quotinet shifts to the left, the new bit is '0' because the difference between Remainder and Divisor is a negative number.")
                }
            }else if(this.currStep == 2){
                this.steps[this.currStep]()
                this.iteration++
                //console.log("Divisor shifts to the right.")
            }
            
        }else{
            //console.log("This computation has concluded kindly sod off")
        }
        
        this.currStep++
        this.currStep %= this.steps.length

        if(returnValue !== undefined){
            return returnValue
        }
    }
}