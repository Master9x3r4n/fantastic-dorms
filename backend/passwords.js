import js_sha3 from 'js-sha3';
import argon2 from 'argon2';
import { Input } from 'postcss';
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

    async generateDigest(input) {
        try 
        {
            const hash = await argon2.hash(input, {
                type: argon2.argon2id,  
                memoryCost: 65536,      
                timeCost: 3,            
                parallelism: 4          
            });
            return hash;
        } 
        catch (err) 
        {
            console.error("Hashing failed:", err);
            throw err;
        } 
    };

    async verifyUser(storedHash, providedPassword) {

        try 
        {
            return await argon2.verify(storedHash, providedPassword);
        } 
        catch (err) 
        {
            return false;
        }
        
    };

    
}

export default new PasswordsUtils();