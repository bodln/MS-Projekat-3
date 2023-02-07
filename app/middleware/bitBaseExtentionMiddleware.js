export default function (input, base) {
    console.log(typeof(input));
    let inputBaseExtended = input.split("")
    console.log(inputBaseExtended);

    while(inputBaseExtended.length != base) {
        inputBaseExtended.unshift("0")
    }

    return inputBaseExtended.join('')
}