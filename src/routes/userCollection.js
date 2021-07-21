const route = require('express').Router();
const md5 = require("md5");
const model = require('../models/userCollection');
//const isAuthenticated = require('../middlewares/isAuthenticated');
const UserCollection = require('../models/userCollection');
const cryptoRandomString = require('crypto-random-string');
const jwt = require('jsonwebtoken'); //HMAC SHA256

// Simulación de acceso a la aplicación

route.post('/:email', async (req, res) => {
  const email = req.params.email;
  const secret = cryptoRandomString({length: 10, type: 'base64'});

  const payload = {
    "user": email,
    //"exp": Math.floor(Date.now() / 1000) + (60 * 60),
    }
    
  const token = jwt.sign(payload, secret);

  try {
    const userCollection = await UserCollection.find({email:email});       
    const pass = md5(req.body.pass);
    
     if (userCollection.length == 0){   //Si no existe el usuario, lo da de alta
      
       try{
      
        const Newuser = new model({email, pass, secret});
        const userCollection = await Newuser.save();

        return res.status(200).json({
           Message: "Creación de usuario correcta",
           Resultado: userCollection.email,
           Token: token,
         });

        }
        catch(err) {
          console.log(err);
          return res.status(400).json({
            data: err,
            ok: false,
          });
        }
     }
    
    res.status(200).json({
      Message: "Se ha generado un token",
      Token: token,
      OK: true,
    });
  }
    catch (err) {
      console.log(err);
      res.status(400).json({
        data: err,
        ok: false,
    });
  }



});

//Simulación de acceso a Profile

route.get('/', async (req, res) => {
  try {
    if (req.headers.authorization.length > 0){
      const headerAuthorization = req.headers.authorization;
      const newToken = headerAuthorization.split(" ");
      const tokenDecoded = jwt.decode(newToken[1]); //  { user: 'usuario33', exp: 1616514528, iat: 1616510928 }

      const userCollection = await UserCollection.findOne({email:tokenDecoded.user});
      const tokenVerified = JSON.stringify (jwt.verify(newToken[1], userCollection.secret));

    res.status(200).json({
      Data: userCollection,
      OK: true,
      Token: req.headers.authorization,
    });
  };

  } catch (err) {
    console.log(err);
    res.status(400).json({
      Message: "Usuario no reconocido",
      Ok: false,
    });
    //res.redirect(300,"/login");
  }
});

// Simulacion de logout

route.get('/INACTIVE', async (req, res) => {
  const newSecret = cryptoRandomString({length: 10, type: 'base64'});
  try {
    if (req.headers.authorization.length > 0){
      const headerAuthorization = req.headers.authorization;
      const newToken = headerAuthorization.split(" ");
      const tokenDecoded = jwt.decode(newToken[1]); //  { user: 'usuario33', exp: 1616514528, iat: 1616510928 }

      const userCollection = await UserCollection.findOneAndUpdate({email:tokenDecoded.user},{$set:{"secret":newSecret}});

    res.status(200).json({
      Message: "Secreto modificado",
      User: userCollection,
      NewUser: newSecret,
      Ok: true,
    });
  };

  } catch (err) {
    console.log(err);
    res.status(400).json({
      Message: "Token desconocido o inválido",
      Ok: false,
    });
  }
});

module.exports = route;




