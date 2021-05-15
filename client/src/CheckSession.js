const checkSession = (callback) => {
  //console.log('checking session')
  fetch('/api/checkSession')
  .then(this.handleErrors)
  .then(response => response.json())
  .then(data=>{
      if(data != 'Active'){
        callback(false)
      }
      else{
        callback(true)
      }
  })
}

module.exports = checkSession;