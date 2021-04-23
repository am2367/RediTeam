const bcrypt = require('bcrypt');

const register = async (req, redis, callback) => {
    const emailAddress = req["email"].replace(/\./g, '\\.').replace(/\@/g, '\\@');

    const searchResults = await redis.call('FT.SEARCH', 'usersidx', `@email:{${emailAddress}}`, 'LIMIT', '0', '1')

    if (searchResults[0] !== 0) {
        callback("Email is already taken")
        return;
    }

    const passwordHash = await bcrypt.hash(req["password"], 10)

    const id = Math.floor(Math.random() * 1000 + 1000);
    console.log(id)

    const obj = {"id" : id, "email" : req['email'], 'password' : passwordHash}
    console.log(obj)

    const insertResults = redis.hset(`users:${id}`, obj)
    
    if (insertResults[0] !== null) {
        callback("Registered")
        return
    }else{
        callback("Encountered an error")
        return;
    }
}

module.exports = register;
