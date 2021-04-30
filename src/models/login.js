const bcrypt = require('bcrypt');

const login = async (req, redis, callback) => {
    // Escape . and @ in the email for searching
    const emailAddress = req['email'].replace(/\./g, '\\.').replace(/\@/g, '\\@');

    const searchResults = await redis.call('FT.SEARCH', `usersidx`, `@email:{${emailAddress}}`, 'RETURN', '1', 'password', 'LIMIT', '0', 1);
    
    if (searchResults.length === 3) {
        const passwordCorrect = await bcrypt.compare(req['password'], searchResults[2][1]);

        if (passwordCorrect) {
            console.log("Logged in")
            return callback('Correct');
        }
    }

    console.log("Incorrect credentials")
    return callback('Incorrect');
}

module.exports = login;
