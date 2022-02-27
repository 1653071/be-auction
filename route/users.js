const express = require("express");
const res = require("express/lib/response");
const router = express.Router();

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');



const db = require("../db");
router.post('/register',function(req, res) {
  let user = req.body;
  user.password = bcrypt.hashSync(user.password, 10);
  (async () => {
    try {
      const document = await db.collection("users").add({
        username: user.username,
        password: user.password,
        name: user.name,
        birthdate: user.birthdate,
        mail:user.mail,
        isRequest:false,
        isSeller:false,
        refreshToken:""
      }).then(()=>{
        delete user.password;
        return res.status(200).send(user);
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});
router.get("/", (req, res) => {
    (async () => {
      try {
        let query = db.collection("users");
        let response = [];
        await query.get().then((querySnapShot) => {
          let docs = querySnapShot.docs;
          for (let doc of docs) {
            const selectedItem = {
              id: doc.id,
              name: doc.data().name,
              birthdate: doc.data().birthdate,
              isSeller:doc.data().isSeller,
              isRequest: doc.data().isRequest,
              mail : doc.data().mail
            };
            response.push(selectedItem);
          }
          return response;
        });
        return res.status(200).send(response);
      } catch (error) {
        return res.status(500).send(error);
      }
    })();
});
router.post("/add", (req, res) => {
    (async () => {
      try {
        const document = await db.collection("users").add({
          name: req.body.name,
          password: req.body.password,
          username: req.body.username,
          birthdate: req.body.datecreate,
          mail : req.body.mail,
          isSeller:false,
          isRequest:false
        });
  
        return res.status(200).send("Add successful");
      } catch (error) {
        return res.status(500).send(error);
      }
    })();
  });

// Get user by id
router.get("/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("users").doc(req.params.id);
      let user = await document.get();
      let response = {
        id : user.data().id,
        name: user.data().name,
        birthdate: user.data().birthdate,
        isSaler: user.data().isSaler,
        mail : user.data().mail
      } 

      return res.status(200).send(response);
      } catch (error) {
      console.log(error); 
      return res.status(500).send(error);
    }
  })();
});
router.put("/changepassword/:id", (req, res) => {
  (async () => {
    try {
        const document = db.collection("users").doc(req.params.id);
        let user = await document.get().then(async (res1)=>{
        console.log(res1.data().password);
        let password = res1.data().password;
        const check =bcrypt.compareSync(req.body.currentpassword, password); 
        console.log(check);
        if(check === true){
          let changepassword = req.body.changepassword;
          const hashchangepass = bcrypt.hashSync(changepassword, 10);
          const document1 = db.collection("users").doc(req.params.id);
          await document1.update({
            password: hashchangepass,
          });
          return res.status(200).send({"message":"Thanh cong"})
        }
        else{
          return res.status(400).send({"message":"That bai"})
        }
      });
      return res.status(200).send({message:"Thanh cong"})
     
    } catch (error) {
      
    }
  })();
});
//Update User by id
router.put("/update/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("users").doc(req.params.id);
      await document.update({
        name: req.body.name,
        
      });
      return res.status(200).send({"message":"Thanh cong"});
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});

router.put("/acceptseller/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("users").doc(req.params.id);

      await document.update({
        isSeller: true
      });
      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});

//request seller
router.put("/request/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("users").doc(req.params.id);
      await document.update({
        isRequest : true
      });

      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});

module.exports = router;