const express = require('express');
const router = express.Router();
const cors = require('cors');
const db = require('../models');
const { Op } = require("sequelize");

router.use(cors());

//searching using pagination:

router.post('/', (req, res) => {
  
  var totalRec = 0,
  pageSize  = 10,
  pageCount = 0;
  var start = 0;
  var currentPage = 1;

  db.Post.count({ 
  }).then(result => {
       
       totalRec  = result;
       pageCount =  Math.ceil(totalRec /  pageSize);
  
      if (typeof req.query.page !== 'undefined') {
            currentPage = req.query.page;
   }
    
     if(currentPage >1){
     
       start = (currentPage - 1) * pageSize;
    }
    console.log(start)
    db.Post.findAll({
        
      where: {
          [Op.or]: [
            { title: {
              [Op.substring]: req.body.title}
            },
            { desc: {
              [Op.substring]: req.body.desc}
            }                 

          ]
        },
      limit: pageSize, offset: start
    }).then(post => {

     if(post) {
       
          res.status(200).send({ post: post, pageSize: pageSize, pageCount: pageCount,currentPage: currentPage, success: true, message: 'list of posts based on tittle & desc'})
        
      } 
      else {
          res.status(400).send({ success: false, error: true })
        }  
   }).catch(err => {
    res.status(500).send('Error -> ' + err);
  })
  }); 
   
 });
  
module.exports = router;
