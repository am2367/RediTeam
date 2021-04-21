const express = require('express');
const router = express.Router();
const Redis = require('ioredis');
const bcrypt = require('bcrypt'); 
const { body,validationResult} = require('express-validator');

const redis = new Redis({
  host: "localhost",
  port: 6379,
  password: null,
});

redis.call('FT.CREATE', 'usersidx', 'ON', 'HASH', 'PREFIX', '1', 'users', 'SCHEMA', 'email', 'TAG', 'firstName', 'TEXT', 'lastName', 'TEXT', (err, result) => { 
  if (err) {
    console.log(err)
    console.log("Error creating users index");
  }
  else{
    console.log("Users index has been created")
  }
})

// .catch(e => {
//   console.log(e["ReplyError"])
//   if(e.includes('Index already exists')){
//     console.log("Users index is already create")
//   }
// });

router.get('/api/health', (req, res) => {
  //console.log(req.query)
  res.json('API Healthy')
});

router.get('/api/redis_health', (req, res) => {
  //console.log(req.query)

  res.json(`Redis Connection Status: ${redis.status}`)
});

router.post('/api/register', [
  body().isObject(),
  body('email').isEmail(),
  body('password').isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  console.log(req.body)

  const emailAddress = req.body["email"].replace(/\./g, '\\.').replace(/\@/g, '\\@');

  const searchResults = await redis.call('FT.SEARCH', 'usersidx', `@email:{${emailAddress}}`, 'LIMIT', '0', '1')

  if (searchResults[0] !== 0) {
    return res.json("Email is already taken")
  }

  const passwordHash = await bcrypt.hash(req.body["password"], 10)
  
  const id = Math.floor(Math.random() * 1000 + 1000);
  console.log(id)

  const obj = {"id" : id, "email" : req.body['email'], 'password' : passwordHash}
  console.log(obj)
  
  const insertResults = redis.hset(`users:${id}`, obj)
  if (insertResults[0] !== null) {
    return res.json("Registered Successfuly")
  }
  
  return res.status(400).json("Encountered an error")

});




module.exports = router;