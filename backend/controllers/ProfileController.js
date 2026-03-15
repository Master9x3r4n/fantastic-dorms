const Profile = require('./Profile'); 

const { generateDigest, generateSalt } = require('../passwords');

function createProfile(username, pwInput)
{
    const exists = Profile.findOne({username: username});

    if (exists)
    {
        console.log('Username taken!');
        return false;
    }
    else
    {
        console.log('Username available!');
        salt = generateSalt();

        Profile.create({
            username: username,
            salt: salt,
            saltedPassword: generateDigest(pwInput + salt),
            joinDate: new Date()
        })
    }
    
}
