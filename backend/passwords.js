import argon2 from 'argon2';

class PasswordsUtils {
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