const jwt = require("jsonwebtoken");
require('dotenv').config();
module.exports = async(req,res,next)=>{
    try {
        const jwtToken = req.header("token");
        if(!jwtToken){
            
            return res.status(403).json("Not Authorized");
        }
        const jwtSecret = '$2a$06$6vnjQjCk98M5/hC1Zr9V8eU6dV8MQrZhugB7sRKByxWw7oGvc/MBC';
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);
        
        req.user = payload.user;
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(403).json("Not Authorized");
    }
}