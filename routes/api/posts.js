const express = require('express');
const router = express.Router();



router.get('/test',(req,res)=>
    res.json({msg: 'posts api is working'})
);


module.exports = router;