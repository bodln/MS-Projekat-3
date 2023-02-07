//Sve promenljive stizu i vracaju se kao string
export default function formatMiddleware() {
    this.binToHex= (value) => {
        return parseInt(value, 2).toString(16)
    },

    this.hexToBin= (value) => {
        return parseInt(value, 16).toString(2)
    },

    this.hexToDec= (value) => {
        return parseInt(value, 16).toString()
    },

    this.binToDec= (value) => {
        return parseInt(value, 2).toString()
    },

    this.decToBin= (value) => {
        return value.toString(2)
    },

    this.decToHex= (value) => {
        return value.toString(16)
    },

    this.addBin= (valueFirst, valueSecond) => {
        return this.decToBin(parseInt(this.binToDec(valueFirst))+parseInt(this.binToDec(valueSecond)))
    }

}
