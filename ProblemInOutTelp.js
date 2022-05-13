function generateInput(){
    let input = [];
    for(let i = 0; i < 1000; i++){
        input.push(Math.floor(Math.random() * 10));
    }
    return input;
}

function generateOutput(input){
    //count even numbers
    let count = 0;
    for(let i = 0; i < input.length; i++){
        if(input[i] % 2 === 0){
            count++;
        }
    }
    return count;
}
const input=generateInput();
setGeneratedInOut({"input":input,"output":generateOutput(input)});