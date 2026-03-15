function generateSalt() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < 5; i++) 
    {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


import { sha384 } from 'js-sha3';

function generateDigest(input) {
    const hash = sha384(input);
    return hash; 
}

console.log(generateSalt());