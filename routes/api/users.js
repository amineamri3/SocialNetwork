const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
// models
const User = require('../../models/User');

//validators
const register_validator = require('../../validation/register');
const login_validator = require('../../validation/login');
router.get('/test',(req,res)=>
    res.json({msg: 'users api is working'})
);

router.post('/register',(req,res)=>{
    const {errors,isValid} = register_validator(req.body);
    if(!isValid){
            return res.status(400).json(errors);
    }


User.findOne({email: req.body.email})
    .then(user => {
        if(user){
            return res.status(400).json({email: 'Email already in use'})
        }else{
            
    
            const avatar = gravatar.url(req.body.email, {s:'200',r:'pg',d:'mm'})
            const u = new User({
                name: req.body.name,
                email: req.body.email,
                avatar
            })


            bcrypt.genSalt(10,(err,salt)=>{
                if(err) throw err;
                bcrypt.hash(req.body.password, salt, (err, hash)  =>{
                    if(err) throw err;
                    u.password = hash;
                    u.save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                })

            })


        }
    })

})


router.post('/login',(req,res)=>{
    const email = req.body.email;
    const pass = req.body.password;

    const {errors,isValid} = login_validator(req.body);
    if(!isValid){
            return res.status(400).json(errors);
    }

    User.findOne({email})
        .then(user => {
            if(!user){
                return res.status(404).json({email: 'Email not found!'})
            }
            //crypt
            bcrypt.compare(pass, user.password)
                  .then(matches =>{
                      if(matches){
                         // res.json({msg: 'Success'})
                         const payload = {id: user.id,name: user.name, avatar: user.avatar}
                         jwt.sign(
                             payload,
                             keys.secret,
                            {expiresIn:86000},
                            (err,token)=>{
                                res.json({
                                    success: true,
                                    token: 'Bearer '+ token
                                })

                         });
                      }else{
                          return res.status(400).json({password: 'incorrect password'})
                      }
                  })
        })
})

router.get('/current',passport.authenticate('jwt',{session: false}), (req,res)=>{
  res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
  });
})


module.exports = router;