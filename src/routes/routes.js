const express = require('express');
const router = express.Router();
const { body,validationResult} = require('express-validator');
const { json } = require('body-parser');
const register = require('../models/register.js');
const login = require('../models/login.js');
const createNodes = require('../models/createNodes.js');
const createReq = require('../models/createReq.js');
const getEmployeeId = require('../models/getEmployeeId.js');
const getEmployee = require('../models/getEmployee.js');
const checkSession = require('../models/checkSession.js');
const Redis = require('ioredis');
const createEmployee = require('../models/createEmployee.js');
const getTeamReqs = require('../models/getTeamReqs.js');
const getTeamMembers = require('../models/getTeamMembers.js');
const getTeamManager = require('../models/getTeamManager.js');
const getReqs = require('../models/getReqs.js');
const getRecommendedReqs = require('../models/getRecommendedReqs.js');
const getReqsApplied = require('../models/getReqsApplied.js');
const applyForReq = require('../models/applyForReq.js');
const rejectReq = require('../models/rejectReq.js');
const acceptReq = require('../models/acceptReq.js');
const deleteReq = require('../models/deleteReq.js');
const cancelReq = require('../models/cancelReq.js');
const getTeamReqApplications = require('../models/getTeamReqApplications.js');
const path = require('path');

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

  console.log('/api/register', req.body)

  const id = Math.floor(Math.random() * 1000 + 1000);
  // console.log(id)
    
  register(id, req.body, redisSearch, function(result){
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

router.get('/api/logout', (req, res) => {
  //console.log(req.query)
  req.session.user = null
  res.json('Logged Out')
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

  console.log('/api/login', req.body)  

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
router.get('/api/email', (req, res) => {
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
  
  console.log('/api/profile', req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator
  //Get user's username/ID from session and include in JSON when creating graph node
  if(checkSession(req)){
    getEmployeeId(req, redisGraph, function(result){
      if(result === "Error Retrieving Profile"){
        res.json(result)
      }
      req.body['id'] = parseInt(result)
      createEmployee(req.body, redisGraph, function(result){
        console.log(result)
        res.json(result)
      })
    })
  }
  else{
    res.redirect('/login');
  }
    
});

router.get('/api/profile', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log('/api/profile', req.query)
  //TODO
  //Add validation for JSON fields, possibly using express-validator
  //Get user's username/ID from session and include in JSON when creating graph node
  if(checkSession(req)){
    getEmployeeId(req, redisGraph, function(result){
      if(result === "Error Retrieving Profile"){
        res.json(result)
      }
      else{
        console.log(result)
        getEmployee(result, redisGraph, function(result){
          console.log(result)
          res.json(result)
        })
      }
    })
  }
  else{
    res.redirect('/login');
  }
    
});

//  TODO: Update Team Route
//
// router.post('/api/team', [
//   body().isObject()
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
  
//   console.log('/api/team', req.body)

//   //TODO
//   //Add validation for JSON fields, possibly using express-validator
//   if(checkSession(req)){
//     updateTeam(req.body, redisGraph, function(result){
//       console.log(result)
//       res.json(result)
//     })
//   }
//   else{
//     res.redirect('/login');
//   }
// });

router.get('/api/team/members', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log('/api/team/members', req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator
  if(checkSession(req)){
    getEmployeeId(req, redisGraph, function(result){
      if(result === "Error Retrieving Profile"){
        res.json(result)
      }
      getTeamMembers(result, req.query, redisGraph, function(result){
        console.log(result)
        res.json(JSON.stringify(result))
      })
    })
  }
  else{
    res.redirect('/login');
  }
});

router.get('/api/team/manager', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log('/api/team/manager', req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator
  if(checkSession(req)){
    getEmployeeId(req, redisGraph, function(result){
      if(result === "Error Retrieving Profile"){
        res.json(result)
      }
      getTeamManager(result, req.query, redisGraph, function(result){
        console.log(result)
        res.json(JSON.stringify(result))
      })
    })
  }
  else{
    res.redirect('/login');
  }
});

router.post('/api/team/req', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log('/api/team/req', req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator
  if(checkSession(req)){
    getEmployeeId(req, redisGraph, function(result){
      if(result === "Error Retrieving Profile"){
        res.json(result)
      }
      createReq(result, req.body, redisGraph, function(result){
        console.log(result)
        res.json(JSON.stringify(result))
      })
    })
  }
  else{
    res.redirect('/login');
  }
});

router.get('/api/team/reqs', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log('/api/team/reqs', req.query)

  //TODO
  //Add validation for JSON fields, possibly using express-validator
  if(checkSession(req)){
    getEmployeeId(req, redisGraph, function(result){
      if(result === "Error Retrieving Profile"){
        res.json(result)
      }
      getTeamReqs(result, req.query, redisGraph, function(result){
        console.log(result)
        res.json(JSON.stringify(result))
      })
    })
  }
  else{
    res.redirect('/login');
  }
});

router.get('/api/team/applications', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log('/api/team/applications', req.query)

  //TODO
  //Add validation for JSON fields, possibly using express-validator
  if(checkSession(req)){
    getEmployeeId(req, redisGraph, function(result){
      if(result === "Error Retrieving Profile"){
        res.json(result)
      }
      getTeamReqApplications(result, redisGraph, function(result){
        console.log(result)
        res.json(JSON.stringify(result))
      })
    })
  }
  else{
    res.redirect('/login');
  }
});

router.get('/api/reqs', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log('/api/reqs', req.query)

  //TODO
  //Add validation for JSON fields, possibly using express-validator
  if(checkSession(req)){
    getEmployeeId(req, redisGraph, function(result){
      if(result === "Error Retrieving Profile"){
        res.json(result)
      }
      getReqs(result, req.query, redisGraph, function(result){
        console.log(result)
        res.json(JSON.stringify(result))
      })
    })
  }
  else{
    res.redirect('/login');
  }
});

router.get('/api/reqs/recommended', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log('/api/reqs/recommended', req.query)

  //TODO
  //Add validation for JSON fields, possibly using express-validator
  if(checkSession(req)){
    getEmployeeId(req, redisGraph, function(result){
      if(result === "Error Retrieving Profile"){
        res.json(result)
      }
      getRecommendedReqs(result, req.query, redisGraph, function(result){
        console.log(result)
        res.json(JSON.stringify(result))
      })
    })
  }
  else{
    res.redirect('/login');
  }
});

router.get('/api/reqs/applied', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log('/api/reqs/applied', req.query)

  //TODO
  //Add validation for JSON fields, possibly using express-validator
  if(checkSession(req)){
    getEmployeeId(req, redisGraph, function(result){
      if(result === "Error Retrieving Profile"){
        res.json(result)
      }
      getReqsApplied(result, redisGraph, function(result){
        console.log(result)
        res.json(JSON.stringify(result))
      })
    })
  }
  else{
    res.redirect('/login');
  }
});

router.post('/api/req/apply', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log('/api/req/apply', req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator
  if(checkSession(req)){
    getEmployeeId(req, redisGraph, function(result){
      if(result === "Error Retrieving Profile"){
        res.json(result)
      }
      applyForReq(result, req.body, redisGraph, function(result){
        console.log(result)
        res.json(result)
      })
    })
  }
  else{
    res.redirect('/login');
  }
});

router.post('/api/req/delete', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log('/api/req/delete', req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator
  if(checkSession(req)){
    deleteReq(req.body, redisGraph, function(result){
      console.log(result)
      res.json(result)
    })
  }
  else{
    res.redirect('/login');
  }
});

router.post('/api/req/cancel', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log('/api/req/cancel', req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator
  if(checkSession(req)){
    getEmployeeId(req, redisGraph, function(result){
      if(result === "Error Retrieving Profile"){
        res.json(result)
      }
      cancelReq(result, req.body, redisGraph, function(result){
        console.log(result)
        res.json(result)
      })
    })
  }
  else{
    res.redirect('/login');
  }
});

router.post('/api/req/reject', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log('/api/req/reject', req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator
  if(checkSession(req)){
    rejectReq(req.body, redisGraph, function(result){
      console.log(result)
      res.json(result)
    })
  }
  else{
    res.redirect('/login');
  }
});

router.post('/api/req/accept', [
  body().isObject()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  console.log('/api/req/accept', req.body)

  //TODO
  //Add validation for JSON fields, possibly using express-validator
  if(checkSession(req)){
    acceptReq(req.body, redisGraph, function(result){
      console.log(result)
      res.json(result)
    })
  }
  else{
    res.redirect('/login');
  }
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

//if production > serve static files
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  router.use(express.static(path.join(__dirname, '../../client/build')));
  // Handle React routing, return all requests to React app
  router.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});
};

module.exports = router;