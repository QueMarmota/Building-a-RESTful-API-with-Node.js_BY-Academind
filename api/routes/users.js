const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res, next) => {
    //codigo para aseurarnos de que no agrege un usuario que ya existe
    User.find({
        email: req.body.email
    }).exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'El mail ya existe'
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'Usuario creado'
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            });
                    }
                })
            }
        })
});

router.delete('/:userId',(req,res,next)=>{
    User.remove({_id: req.params.userId}).exec()
    .then(result => {
        res.status(200).json({
            message: 'Usuario borrado'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;