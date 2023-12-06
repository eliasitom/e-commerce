// const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

// const frase = "mi primera chambaaaa, me aucerdo el dia que de la chamba yo me enamoreeeee"

// let current = ""

// const printMessage = () => {
//   for (let i = 0; i < frase.length; i++) {
//     for (let i_ = 0; i_ < alphabet.length; i_++) {
//       console.log(current + alphabet[i_])
//       if(alphabet[i_] === frase[i]) {
//           current += alphabet[i_]
//         console.log(current)
//           break
//       } else if (frase[i] === " ") {
//           current += " "
//           break
//       }
//     }
// }
// }
// printMessage()


// PRUEBA TÉCNICA

//Ejercicio 1: Dado un array de números, escribe una función que devuelva la suma de los elementos pares del array. Por ejemplo, si el array es [1, 2, 3, 4, 5, 6], la función debería devolver 12 (que es la suma de 2, 4 y 6).

function sumaDePares(arr) {
  let resultado = 0
  let numerosPares = arr.filter(current => current % 2 === 0)
  numerosPares.forEach(element => {
    resultado += element
  });
  return resultado
}
//console.log(sumaDePares([1, 2, 3, 4, 5, 6]))



// Ejercicio 2: Escribe una función que tome un string como argumento y devuelva el string con todas las palabras en orden inverso. Por ejemplo, si el string es "Hola mundo",
// la función debería devolver "mundo Hola".

function invertirString(string) {
  let palabras = string.split(" ")
  palabras = palabras.reverse()
  let fraseInvertida = palabras.join(" ")
  return fraseInvertida
}
//console.log(invertirString("hola mundo"))




// Ejercicio 3: Escribe una función que tome un array de números y devuelva el número más grande del array. Por ejemplo, si el array es [1, 5, 3, 2, 4], la función debería devolver 5.

function numeroMayor(arr) {
  const nuevoArray = arr.sort((a, b) => b - a)
  return nuevoArray[0]
}
//console.log(numeroMayor([1, 5, 3, 2, 4]))





// Ejercicio 4: Escribe una función que tome un string como argumento y devuelva el string con todas las vocales en mayúscula. Por ejemplo, si el string es "Hola mundo",
// la función debería devolver "HOlA mUndO".

function vocalesEnMayus(string) {
  let arrayDeLetras = string.split("")
  let nuevoArray = arrayDeLetras.map(e => {
    if(e === "a" || e === "e" || e === "i" || e === "o" || e === "u") {
      return e.toUpperCase()
    } else {
      return e
    }
  })
  nuevoArray = nuevoArray.join("")
  return nuevoArray
}

console.log(vocalesEnMayus("hola mundo"))