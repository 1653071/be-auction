const express = require("express");
const router = express.Router();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const db = require("../db");
const randomstring =  require("randomstring");
router.post("/login",function (req, res) {
  (async () => {
    try {
      let username = req.body.username;
      let password = req.body.password;

      let query = db.collection("admin").where("username", "==", username);

      let response = {};
      
      await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs;
        if (docs.length == 0) {
          const selectedItem = {
            statusLogin: false,
          };
          response = selectedItem;

          return res.send(response);
        }
        for (let doc of docs) {
          if (bcrypt.compareSync(password, doc.data().password) == false) {
            return res.status(401).json({ authetication: false });
          }
          const response = {
            userId: doc.id,
            username: doc.username,

            statusLogin: true,
          };

          const opt = {
            expiresIn: 10 * 6,
          };
          const payload = {
            userId: response.userId,
          };
          const accessToken = jwt.sign(payload, "SECRET_KEY_ADMIN");
          const refreshToken = randomstring.generate(80);
          let query1 = db.collection("admin").where("username", "==", username);
          res.status(200).send({
            userID:doc.id,
            name:doc.data().name,
         
         
            username:doc.data().username,
            authetication: true,
          
            accessToken,
            refreshToken
          });

        }

        return response;
      });

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      
    }
  })();
});
router.post('/register',function(req, res) {
  let user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  (async () => {
    try {
      const document = await db.collection("admin").add({
        username: user.username,
        password: user.password,
        name: user.name,
        accessToken:"",
        requestToken:""
      }).then(()=>{
        delete user.password;
        return res.status(200).send(user);
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});

module.exports = router;