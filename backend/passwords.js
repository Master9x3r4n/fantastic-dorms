import js_sha3 from 'js-sha3';
const sha3_384 = js_sha3.sha3_384;

class PasswordsUtils {
    generateSalt() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let result = '';
        for (let i = 0; i < 5; i++) 
        {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    generateDigest(input) {
        const hash = sha3_384(input);
        return hash; 
    };
}

export default new PasswordsUtils();