const jwtVariable = require('../variables/jwt');
const jwt = require('jsonwebtoken');
const helper = require('../_helpers/jwt.helper');
const userService = require('../users/user.service');

exports.isAuth = async (req, res, next) => {
    const accessTokenFromHeader = req.headers.x_authorization;
    if (!accessTokenFromHeader) {
        return res.status(401).send({message: 'Token not found'});
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
    const verified = await helper.verifyToken(
        accessTokenFromHeader,
        accessTokenSecret,
    );

    if (!verified) {
        return res
            .status(401)
            .send({message: 'Token is invalid'});
    }

    const user = await helper.decodeToken(
        accessTokenFromHeader, 
        accessTokenSecret
    );

    req.user = user;

    console.log("DECODE USER", user);

    return next();
};
