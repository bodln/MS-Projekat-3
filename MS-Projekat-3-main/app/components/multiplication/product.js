export default function Product() {
    this.body = `<div class='product'>Product ${this.value}</div>`
    this.value = "0000000000000000"
    this.set = (value) => {
        this.value = value
        while(this.value.length < 16) {
            this.value = 0 + this.value
        }
    }
    this.render = () => {
        this.body = `<div class='product'>Product ${this.value}</div>`
        return this.body
    }
}