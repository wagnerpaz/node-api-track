const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const config = require('../../config');
const User = mongoose.model('User');

const router = express.Router();

const SIGNIN_ERROR_DEFAULT = 'Invalid password or email.';
const SIGNIN_ERROR_REQUIRED = 'Must provide email and password.';

router.post('/signup', async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = new User({email, password});
        await user.save();

        const token = jwt.sign({userId: user._id}, config.JWT_SECRET_KEY);
        res.send({token});
    }
    catch(err) {
        return res.status(422).send(err.message);
    }
});

router.post('/signin', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        res.status(422).send({error: SIGNIN_ERROR_REQUIRED});
    }

    const user = await User.findOne({email});

    if (!user) {
        return res.status(422).send({error: SIGNIN_ERROR_DEFAULT});
    }

    try {
        await user.comparePassword(password);
        const token = jwt.sign({userId: user._id}, config.JWT_SECRET_KEY);
        res.send({token});
    } catch(err) {
        res.status(422).send({error: SIGNIN_ERROR_DEFAULT});
    }
});

module.exports = router;