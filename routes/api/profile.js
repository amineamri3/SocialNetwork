const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


const User = require('../../models/User');
const Profile = require('../../models/Profile');


const validateProfileInput = require('../../validation/profile')
const validateExperienceInput = require('../../validation/experience')
const validateEducationInput = require('../../validation/education')

router.get('/test', (req, res) =>
    res.json({ msg: 'profiles api is working' })
);

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
    .populate('user',['name','avatar'])
    .then(profile => {
        if (!profile) {
            errors.noprofile = 'There is no profile for this user';
            return res.status(404).json(errors);
        }
        res.json(profile);
    }).catch(err => res.status(404).json(err));
});

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const {errors, isValid} = validateProfileInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }
    const prof = {};
    prof.social = {};
    prof.user = req.user.id;
    if (req.body.handle) prof.handle = req.body.handle;
    if (req.body.company) prof.company = req.body.company;
    if (req.body.website) prof.website = req.body.website;
    if (req.body.location) prof.location = req.body.location;
    if (req.body.bio) prof.bio = req.body.bio;
    if (req.body.status) prof.status = req.body.status;
    if (req.body.github) prof.github = req.body.github;
    if (req.body.facebook) prof.social.facebook = req.body.facebook;
    if (req.body.twitter) prof.social.twitter = req.body.twitter;
    if (req.body.linkedin) prof.social.linkedin = req.body.linkedin;
    if (req.body.instagram) prof.social.instagram = req.body.instagram;


    if (typeof req.body.skills !== 'undefined') {
        prof.skills = req.body.skills.split(',');
    }

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (profile) { // UPDATE
                Profile.findOneAndUpdate({ user: req.user.id }, { $set: prof }, {new: true})
                .then(profile=> res.json(profile));// return updated profile
            } else { // CREATE
                Profile.findOne({handle: prof.handle}).then(profile=>{
                    if(profile){
                        errors.handle = 'handle already exists!';
                        res.status(400).json(errors);
                    }

                    new Profile(prof).save()
                    .then(profile => res.json(profile))
                    .catch(error=>res.status(400).json(error));
                })
            }
        })

});



router.get('/handle/:handle',(req,res)=>{
    const errors = {};
    Profile.findOne({handle: req.params.handle})
           .populate('user',['name','avatar'])
           .then(profile => {
               if(!profile){
                   errors.noprofile = 'No Profile found';
                   res.status(404).json(errors);
               }
               res.json(profile);
           })
           .catch(err=> res.status(400).json(err));
})

router.get('/user/:userid',(req,res)=>{
    const errors = {};
    Profile.findOne({user: req.params.userid})
           .populate('user',['name','avatar'])
           .then(profile => {
               if(!profile){
                   errors.noprofile = 'No Profile found';
                   res.status(404).json(errors);
               }
               res.json(profile);
           })
           .catch(err=> res.status(400).json(err));
})

router.get('/all',(req,res)=>{
    const errors ={};
    Profile.find()
           .populate('user', ['name','avatar'])
           .then(profiles => {
               if(!profiles){
                   errors.profiles = '0 profiles found';
                   return res.status(404).json(errors);
               }
               res.json(profiles);
           })
           .catch(err=> res.status(404).json(err));
})

router.post('/experience', passport.authenticate('jwt',{session: false}),(req,res)=>{

    const {errors,isValid} = validateExperienceInput(req.body);

    if(!isValid){
    return res.status(400).json(errors);
    }


    Profile.findOne({user: req.user.id})
       .then(profile=>{
           
           const exp = {
               title: req.body.title,
               company: req.body.company,
               location: req.body.location,
               from: req.body.from,
               to: req.body.to,
               iscurrent: req.body.current,
               description: req.body.description

           }
           
           //add it to the start of the array

           profile.experience.unshift(exp);

           profile.save().then(profile => res.json(profile));
       })
})

router.delete('/experience/:expid',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user: req.user.id}).then(profile=>{
        //find the experience index
        const index = profile.experience.map(item => item.id).indexOf(req.params.expid);
        //delete the item from the array based on the index
        profile.experience.splice(index,1);
        //save the profile
        profile.save().then(profile => res.json(profile)).catch(err => res.status(400).json(err));
    })
})



router.post('/education', passport.authenticate('jwt',{session: false}),(req,res)=>{

    const {errors,isValid} = validateEducationInput(req.body);

    if(!isValid){
    return res.status(400).json(errors);
    }


    Profile.findOne({user: req.user.id})
       .then(profile=>{
           
           const exp = {
               school: req.body.school,
               degree: req.body.degree,
               field: req.body.field,
               from: req.body.from,
               to: req.body.to,
               iscurrent: req.body.current,
               description: req.body.description

           }
           
           //add it to the start of the array

           profile.education.unshift(exp);

           profile.save().then(profile => res.json(profile));
       })
})

router.delete('/education/:eduid',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user: req.user.id}).then(profile=>{
        //find the education item index
        const index = profile.education.map(item => item.id).indexOf(req.params.eduid);
        //delete the item from the array based on the index
        profile.education.splice(index,1);
        //save the profile
        profile.save().then(profile => res.json(profile)).catch(err => res.status(400).json(err));
    })
})





router.delete('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOneAndRemove({user: req.user.id}).then(()=>res.json({success: "True"}))
})
module.exports = router;