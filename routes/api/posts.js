const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

const validatePostInput = require('../../validation/post')



router.get('/test',(req,res)=>
    res.json({msg: 'posts api is working'})
);

router.post('/', passport.authenticate('jwt',{session:false}),(req,res)=>{
    const { errors, isValid } = validatePostInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    const tempPost = new Post({
        text: req.body.text,
        user: req.user.id
    });

    tempPost.save().then(post=>res.json(post)).catch(err=>res.status(400).json(err));
})

router.delete('/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
    Profile.findOne({ user: req.user.id})
           .then(post => {
             if(post.user.toString() !== req.user.id){
                 return res.status(401).json({ notauthorized: 'User not authorized'});
             }

             post.remove().then(() => res.json());
           })
})



router.post('/like/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
    Profile.findOne({ user: req.user.id}).then(profile => {
        Post.findById(req.params.id).then(post => {
             if(post.likes.filter(like => like.user.toString()  === req.user.id).length > 0 ){
                 return res.status(400).json({alreadyexists:'User already liked this post'});
             }

             post.likes.unshift({user: req.user.id});
           })
        })
})


router.post('/unlike/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
    Profile.findOne({ user: req.user.id}).then(profile => {
        Post.findById(req.params.id).then(post => {
             if(post.likes.filter(like => like.user.toString()  === req.user.id).length === 0 ){
                 return res.status(400).json({notexist:'User have not liked the post'});
             }
             const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
             post.likes.splice(removeIndex,1);
             post.save().then(post=>res.json(post));
             
           })
        })
})


router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req,res) => {

    const { errors, isValid } = validatePostInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }


    Post.findById(req.params.id).then(post => {
        
        const com = {
            text: req.body.text,
            name: req.user.name,
            avater: req.user.avatar,
            user: req.user.id
        }

        post.comments.unshift(com);

        post.save().then(post => res.json(post));

 
    });
});

router.delete('/comment/:id/:commentid', passport.authenticate('jwt', {session: false}), (req,res) => {


    Post.findById(req.params.id).then(post => {
        
    if(post.comments.filter(comment=> comment._id.toString() === req.params.commentid).lenghth === 0){
        return res.status(404).json({notfound: 'Comment was not found'});
    }

    const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.commentid);

    post.comments.splice(removeIndex,1);

    post.save().then(res.json(post));

 
    }).catch(err=> res.status(400).json(err));
});
module.exports = router;