import jwt from 'jsonwebtoken'
import {config} from '../config.js'

async function isAuthorized(req, res, next) {
    try {
        const {authorization} = req.headers;
        const token = authorization?.replace('Bearer ','');
        if (!token) {
            res.status(401).json({error: 'Unauthorized access!'})
        }
        jwt.verify(token, config.JWT_SECRET_KEY)
        next();
    } catch(error) {
        console.log(`Authorization error - ${error}`)
        next(error);
    }
}

export {isAuthorized}