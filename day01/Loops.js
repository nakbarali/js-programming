
for(let i = 0; i < 5; i++) {
    console.log("Hello World");
}

console.log("___________________________");

for(let i = 1; i <= 5; i++) {
    console.log(i);
    if(i === 5) {
        break; // terminates the loop when i is equal to 5
    }
}


console.log("___________________________");

for(let i = 1; i <= 10; i++) {
    if(i === 3 || i === 7 || i === 9) {
        continue; // skips the iteration when i is equal to 3
    }
    console.log(i);
}