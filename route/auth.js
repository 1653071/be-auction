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

      let query = db.collection("users").where("username", "==", username);

      let response = {};
      
      await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs;
        if (docs.length == 0) {
          const selectedItem = {
            statusLogin: false,
          };
          response = selectedItem;

          return res.status(401).send(response);
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
          const accessToken = jwt.sign(payload, "SECRET_KEY", opt);
          const refreshToken = randomstring.generate(80);
          let query1 = db.collection("users").where("username", "==", username);
          res.status(201).json({
            userID:doc.id,
            name:doc.data().name,
            birthdate:doc.data().birthdate,
            mail:doc.data().mail,
            username:doc.data().username,
            authetication: true,
            isSeller: doc.data().isSeller,
            accessToken,
            refreshToken
          });

        }

        return res.status(200).send(response);
      });

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
     
    }
  })();
});

module.exports = router;