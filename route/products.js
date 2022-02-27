const { response } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../db");

const auth  = require("../middleware/auth.js")
const authadmin  = require("../middleware/authadmin.js")
var admin = require('firebase-admin');
//Get all San Pham


router.get("/", (req, res) => {
    (async () => {
      try {
        let query = db.collection("products");
        let response = [];
        await query.get().then((querySnapShot) => {
          let docs = querySnapShot.docs;
          for (let doc of docs) {
            const selectedItem = {
              id: doc.id,
              name: doc.data().name,
              price: doc.data().price,
              pricebuy: doc.data().pricebuy,
              jump : doc.data().jump,
              datecreated: doc.data().datecreate,
              dateend: doc.data().dateend,
              category_id: doc.data().category_id,
              image:doc.data().image,
              description:doc.data().description,
              sellerId : doc.data().sellerId,
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
//Get san pham theo id seller
router.get("/seller/:id", (req, res) => {
  (async () => {
    try {
      let query = db.collection("products").where("sellerId","==",req.params.id);
      let response = [];
      await query.get().then((querySnapShot) => {
        let docs = querySnapShot.docs;
        for (let doc of docs) {
          const selectedItem = {
            id: doc.id,
            name: doc.data().name,
            price: doc.data().price,
            pricebuy: doc.data().pricebuy,
            jump : doc.data().jump,
            datecreated: doc.data().datecreate,
            dateend: doc.data().dateend,
            category_id: doc.data().category_id,
            image:doc.data().image,
            description:doc.data().description,
            sellerId : doc.data().sellerId,
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
//Get san phan theo ID
router.get("/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.id);
      let product = await document.get();
      let response = product.data();

      return res.status(200).send(response);

    } catch (error) {
      console.log(error); 
      
    }
  })();
});

//Them San Pham
router.post("/add", (req, res) => {
  (async () => {
    try {
      const document = await db.collection("products").add({
        name: req.body.name,
        price: req.body.price,
        pricebuy: req.body.pricebuy,
        category_id: req.body.category_id,
        description : req.body.description,
        sellerId : req.body.sellerId,
        jump : req.body.jump,
        datecreate : req.body.datecreate,
        dateend :req.body.dateend,
        image:req.body.picture
        
      });

      return res.status(200).send("Add successful");
    } catch (error) {
      
    }
  })();
});
router.put("/updatedescription/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.id);

      await document.update({
        
        description :admin.firestore.FieldValue.arrayUnion(req.body.description)
        
      });

      return res.status(200).send("Success");
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});
//update
router.put("/update/:id",authadmin, (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.id);

      await document.update({
        name: req.body.name,
        price: req.body.price,
        pricebuy: req.body.pricebuy,
        category_id: req.body.category_id,
        description : req.body.description,
        sellerId : req.body.sellerId,
        jump : req.body.jump,
        datecreate : req.body.datecreate,
        dateend :req.body.dateend
      });

      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});

//Delete
router.delete("/delete/:id",authadmin, (req, res) => {
  (async () => {
    try {
      const document = db.collection("products").doc(req.params.id);
      await document.delete();
      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});

module.exports = router;