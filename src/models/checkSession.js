const checkSession = async (req, callback) => {
  //console.log('checking session')
  try{
    if(req.session.user){
      callback(true)
    }
    else{
      callback(false)
    }
  }
  catch(err){
    console.log(err.message);
  }
}

module.exports = checkSession;