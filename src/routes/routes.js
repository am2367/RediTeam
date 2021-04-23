const express = require('express');
const router = express.Router();
const { body,validationResult} = require('express-validator');
const { json } = require('body-parser');
const register = require('../models/register.js');
const Redis = require('ioredis');

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

  register(req.body, redis, function(result){
    //console.log(result)
    if(result === 'Registered'){
      res.json(result)
    }
    else{
      return res.status(400).json(result)
    }
  })
});




module.exports = router;