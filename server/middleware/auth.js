import jwt from 'jsonwebtoken'
import {config} from '../config.js'

async function isAuthorized(req, res, next) {
    try {
        const {authorization} = req.headers;
        console.log('auth:', authorization)
        const token = authorization?.replace('Bearer ','');
        if (!token) {
            //todo: find status code for forbidden
            res.status(400).json({error: 'Unauthorized access!'})
        }
        jwt.verify(token, config.JWT_SECRET_KEY)
        //jwt.verify(token, config.SALT)
        next();
    } catch(error) {
        console.log(`Authorization error - ${error}`)
        next(error);
    }
}

export {isAuthorized}