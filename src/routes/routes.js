const express = require('express');
const router = express.Router();
const { body,validationResult} = require('express-validator');
const { json } = require('body-parser');
const register = require('../models/register.js');
const login = require('../models/login.js');
const createNodes = require('../models/createNodes.js');
const updateTeam = require('../models/updateTeam.js');
const createReq = require('../models/createReq.js');
const checkSession = require('../models/checkSession.js');
const updateRelationships = require('../models/updateRelationships.js');
const Redis = require('ioredis');
const createEmployee = require('../models/createEmployee.js');


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

createNodes(redis, function(result){
  console.log(result)
});

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
      console.log(result)
      res.json(result)
    }
    else{
      console.log(result)
      res.json(result)
    }
  })
});

router.post('/api/login', [
  body().isObject(),
  body('email').isEmail(),
  body('password').isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  console.log(req.body)  

  login(req.body, redis, function(result){
    //console.log(result)
    if(result === 'Correct'){
      req.session.user = req.body['email'];
      req.session.save;
      res.json(result)
    }
    else{
      req.session.destroy();
      res.json(result)
    }
  })
});

//Get email
router.get('/api/getEmail', (req, res) => {
  //console.log(req.query)
  if(checkSession(req)){
      res.json(req.session.user)
  }
});

router.post('/api/profile', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log(req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator
  //Get user's username/ID from session and include in JSON when creating graph node

  createEmployee(req.body, redis, function(result){
    console.log(result)
    res.json(result)
  })

    
});

router.post('/api/team', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log(req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator

  updateTeam(req.body, redis, function(result){
    console.log(result)
    res.json(result)
  })
});

router.post('/api/team/req', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log(req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator

  createReq(req.body, redis, function(result){
    console.log(result)
    res.json(result)
  })
});

//check session
router.get('/api/checkSession', (req, res) => {
  //console.log('Check Session')
  checkSession(req, function(result){
      if(result){
        res.json('Active')
      }
      else{
        res.json('Inactive')
      }
    });
});




module.exports = router;