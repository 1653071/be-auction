const { response } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../db");
const events =  require("events")
const auth  = require("../middleware/auth.js")
const authadmin  = require("../middleware/authadmin.js")
router.post("/add", (req, res) => {
    (async () => {
      try {
        const document = await db.collection("comment").add({
          productId: req.body.productId,
          sellerId: req.body.sellerId,
          userId:req.body.userId,
          comment :req.body.comment
          
        });
  
        return res.status(200).send("Add successful");
      } catch (error) {
        
      }
    })();
  });
module.exports = router;