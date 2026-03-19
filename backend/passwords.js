// import js_sha3 from 'js-sha3';
// const sha3_384 = js_sha3.sha3_384;
const js_sha3 = require('js-sha3');
const sha3_384 = js_sha3.sha3_384;

const generateSalt = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < 5; i++) 
    {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

const generateDigest = (input) => {
    const hash = sha3_384(input);
    return hash; 
}

// export default { generateSalt, generateDigest };
module.exports = { generateSalt, generateDigest };