const bcrypt = require('bcrypt');

const getEmployeeId = async (req, redis, callback) => {
    // Escape . and @ in the email for searching
    const emailAddress = req.session.user.replace(/\./g, '\\.').replace(/\@/g, '\\@');

    const searchResults = await redis.call('FT.SEARCH', `usersidx`, `@email:{${emailAddress}}`, 'RETURN', '1', 'id', 'LIMIT', '0', 1);
    
    if (searchResults.length === 3) {
        // console.log(JSON.stringify(searchResults))

        return callback(searchResults[2][1])
    }

    // console.log(searchResults)
    return callback('Error Retrieving Profile');
}

module.exports = getEmployeeId;
