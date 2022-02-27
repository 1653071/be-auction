const { response } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../db");


//Get auction by id product
router.get("/product/:productID", (req, res) => {
    const productID = req.params.productID;
    (async () => {
      try {
        let query = db.collection("auction").where("productId","==",productID);
       
        let response = [];
        await query.get().then((querySnapShot) => {
          let docs = querySnapShot.docs;
          for (let doc of docs) {
            const selectedItem = {
              id:doc.id,
              productId:doc.data().productId,
              sellerId: doc.data().sellerId,
              userId: doc.data().userId,
              price : doc.data().price,
              datecreate : doc.data().datecreate,
              name:doc.data().name
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

//add auction
router.post("/add", (req, res) => {
    (async () => {
        try {
          const productID = req.body.productId;
          
       
          const document = db.collection("products").doc(productID);
          let product = await document.get();
          let price_tmp = req.body.price;
     
          let price_aution = product.data().price;
          let timeEnd = Date.parse(product.data().dateend);
          let timeCur = Date.parse(req.body.datecreate);
          let tmp = timeEnd - timeCur;
          let query = await db.collection("auction").where("productId","==",productID).where("price",">",price_tmp);
          if(query.exists){
            
              return res.status(404).send("Add fail");
        
          }
          else{
            if (price_tmp > price_aution && tmp >=0 ) {
              const document = await db.collection("auction").add({
                datecreate: req.body.datecreate,
                price : req.body.price,
                productId : req.body.productId,
                sellerId : req.body.sellerId,
                userId : req.body.userId,
                name:req.body.name
            });
              return res.status(200).send("Add successful");
            } else {
              return res.status(404).send("Add fail");
            }
          }
          //let tmp = (price_tmp - price_aution) / jump;
          
        } catch (error) {
         
          
            
        } 
    })();
});

//Get auction by id user
router.get("/user/:ID", (req, res) => {
  const UserID = req.params.ID;
  (async () => {
    try {
      let query = db.collection("auction").where("userId","==",UserID);
      let response = [];
      await query.get().then((querySnapShot) => {
        let docs = querySnapShot.docs;
        for (let doc of docs) {
          const selectedItem = {
            productId:doc.data().productId,
            sellerId: doc.data().sellerId,
            userId: doc.data().userId,
            price : doc.data().price,
            datecreate : doc.data().datecreate
          };
          response.push(selectedItem);
        }
        return res.status(200).send(response);
      });
      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});
router.delete("/delete/:id", (req, res) => {
  (async () => {
    try {
      const document = db.collection("auction").doc(req.params.id);
      await document.delete();
      return res.status(200).send();
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
});
function removeDuplicates(originalArray, prop) {
  var newArray = [];
  var lookupObject  = {};

  for(var i in originalArray) {
     lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for(i in lookupObject) {
      newArray.push(lookupObject[i]);
  }
   return newArray;
}
// get san pham winner 
router.get("/winner/:ID", (req, res) => {
  const UserID1 = req.params.ID;
  (async () => {
    try {
      let query = db.collection("auction").where("userId","==",UserID1);
      let response = [];
      
      await query.get().then((querySnapShot) => {
        let docs = querySnapShot.docs;
        for (let doc of docs) {
          const selectedItem = {
            productId:doc.data().productId,
            
          };
          response.push(selectedItem);
          
        }
        
        var uniqueArray = removeDuplicates(response, "productId");
        let winner = [];
        for(let i = 0; i < uniqueArray.length; i++){
          
          let response1 = [];
         
          let query1 = db.collection("auction").where("productId","==",uniqueArray[i].productId);
          (async ()=>{
            try {
              await query1.get().then((querySnapShot) => {
                let docs = querySnapShot.docs;
                for (let doc of docs) {
                  const selectedItem = {
                    productId:doc.data().productId,
                    sellerId: doc.data().sellerId,
                    userId: doc.data().userId,
                    price : doc.data().price,
                    datecreate : doc.data().datecreate
                    
                  };
                  response1.push(selectedItem);
                  
                }
                
                
                const tmp= response1.sort((first, second) => {
                  return first.price < second.price ? 1 : -1;
                })
                .slice(0,1)
                .filter((item) => {
                  return item.userId = UserID1;
                })
                
               
                winner.push(tmp[0])
                console.log(winner)
                
              })
            }catch(error){
              return res.status(500).send(error);
            }
          })();
        }
        setTimeout(() => {
          console.log(winner)
          return res.status(200).send(winner);
        }, 5000);
        
        
        
      });
      
    } catch (error) {
      console.log(error);
    }
  })();
});
module.exports = router;