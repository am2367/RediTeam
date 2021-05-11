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
const getTeamReqs = require('../models/getTeamReqs.js');
const getReqs = require('../models/getReqs.js');
const getReqsApplied = require('../models/getReqsApplied.js');
const applyForReq = require('../models/applyForReq.js');
const rejectReq = require('../models/rejectReq.js');
const acceptReq = require('../models/acceptReq.js');
const deleteReq = require('../models/deleteReq.js');
const getTeamReqApplications = require('../models/getTeamReqApplications.js');

let redisGraph = null;
let redisSearch = null

if (process.env.REDIS_SEARCH_URL){
  redisSearch = new Redis({
    host: process.env.REDIS_SEARCH_URL,
    port: process.env.REDIS_SEARCH_PORT,
    password: process.env.REDIS_SEARCH_PASS
  });
  
  redisGraph = new Redis({
    host: process.env.REDIS_GRAPH_URL,
    port: process.env.REDIS_GRAPH_PORT,
    password: process.env.REDIS_GRAPH_PASS
  });
}
//If local then use local redis
else{
  const redis = new Redis({
    host: "localhost",
    port: "6379",
    password: ""
  });

  redisSearch = redis
  redisGraph = redis
}

redisSearch.call('FT.CREATE', 'usersidx', 'ON', 'HASH', 'PREFIX', '1', 'users', 'SCHEMA', 'email', 'TAG', 'firstName', 'TEXT', 'lastName', 'TEXT', (err, result) => { 
  if (err) {
    console.log(err.message)
  }
  else{
    console.log("Users index has been created")
  }
})

createNodes(redisGraph, function(result){
  console.log(result)
});

router.get('/api/health', (req, res) => {
  //console.log(req.query)
  res.json('API Healthy')
});

router.get('/api/redis_health', (req, res) => {
  //console.log(req.query)

  res.json(`RedisGraph Connection Status: ${redisGraph.status} || RedisSearch Connection Status: ${redisSearch.status}`)
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

  register(req.body, redisSearch, function(result){
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

  login(req.body, redisSearch, function(result){
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

  createEmployee(req.body, redisGraph, function(result){
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

  updateTeam(req.body, redisGraph, function(result){
    console.log(result)
    res.json(result)
  })
});

router.get('/api/team', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log(req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator

  getTeam(req.query, redisGraph, function(result){
    console.log(result)
    res.json(JSON.stringify(result))
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

  createReq(req.body, redisGraph, function(result){
    console.log(result)
    res.json(JSON.stringify(result))
  })
});

router.get('/api/team/reqs', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log(req.query)

  //TODO
  //Add validation for JSON fields, possibly using express-validator

  getTeamReqs(req.query, redisGraph, function(result){
    console.log(result)
    res.json(JSON.stringify(result))
  })
});

router.get('/api/team/applications', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log(req.query)

  //TODO
  //Add validation for JSON fields, possibly using express-validator

  getTeamReqApplications(req.query, redisGraph, function(result){
    console.log(result)
    res.json(JSON.stringify(result))
  })
});

router.get('/api/reqs', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log(req.query)

  //TODO
  //Add validation for JSON fields, possibly using express-validator

  getReqs(req.query, redisGraph, function(result){
    console.log(result)
    res.json(JSON.stringify(result))
  })
});

router.get('/api/reqs/applied', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log(req.query)

  //TODO
  //Add validation for JSON fields, possibly using express-validator

  getReqsApplied(req.query, redisGraph, function(result){
    console.log(result)
    res.json(JSON.stringify(result))
  })
});

router.post('/api/req/apply', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log(req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator

  applyForReq(req.body, redisGraph, function(result){
    console.log(result)
    res.json(result)
  })
});

router.post('/api/req/delete', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log(req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator

  deleteReq(req.body, redisGraph, function(result){
    console.log(result)
    res.json(result)
  })
});

router.post('/api/req/reject', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log(req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator

  rejectReq(req.body, redisGraph, function(result){
    console.log(result)
    res.json(result)
  })
});

router.post('/api/req/accept', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log(req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator

  acceptReq(req.body, redisGraph, function(result){
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