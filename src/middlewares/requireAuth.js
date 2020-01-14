const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const config = require('../../config');

const AUTH_ERROR_DEFAULT = 'You must be logged in.';

const User = mongoose.model('User');

module.exports = (req, res, next) => {
    const {authorization} = req.headers;

    if (!authorization) {
        res.status(401).send({error: AUTH_ERROR_DEFAULT});
    }

    const token = authorization.replace('Bearer ', '');

    jwt.verify(token, config.JWT_SECRET_KEY, async (err, payload) => {
        if(err) {
            return res.status(401).send({error: AUTH_ERROR_DEFAULT});   
        }

        const {userId} = payload;

        const user = await User.findById(userId);
        req.user = user;

        next();
    });
};