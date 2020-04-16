const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connect = require('../blobconnection/connect');
const functions = require('../blobconnection/functions');
 
async function deserializeUserHelper() {
  const containerClient =  await functions.getcontainer(connect.blobServiceClient, "demo");
  const blockBlobClient =  await functions.getblob(containerClient, "users.json");

  const data = await functions.downloadcontent(blockBlobClient, connect.aborter);
  return data;
}

passport.serializeUser((user, done) => {
    console.log('Serializing User');
    done(null, user.email);
});

passport.deserializeUser((id, done) => {
  console.log('Deserialization User');
  deserializeUserHelper().then((data) => {
    data = JSON.parse(data);
    for(var x in data){
      if(data[x].email == id) {
        done(null, data[x]);
      }
    }
  }).catch((e) => console.log(e));

});

passport.use(new LocalStrategy(
  function(username, password, done) {
    deserializeUserHelper().then((data) => {
      data = JSON.parse(data);
      //console.log(data);
      for(var x in data){
        
        if(data[x].email == username && data[x].password == password) {
          done(null, data[x]);
          return;
        }
      }
      done(null,false);
    }).catch((e) => console.log(e));
  }
));
