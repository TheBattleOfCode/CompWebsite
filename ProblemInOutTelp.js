function generateInput(){
    // generate input and return it
    let input = [];
    for(let i = 0; i < 1000; i++){
        input.push(Math.floor(Math.random() * 10));
    }
    return input;
}

function generateOutput(input){
    //generate output and return it
    let count = 0;
    for(let i = 0; i < input.length; i++){
        if(input[i] % 2 === 0){
            count++;
        }
    }
    return count;
}
// don't touch this code
const input=generateInput();
setGeneratedInOut({"input":input,"output":generateOutput(input)});