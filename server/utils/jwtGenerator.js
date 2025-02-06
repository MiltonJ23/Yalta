const jwtToken = require('../node_modules/jsonwebtoken');
require('../node_modules/dotenv').config();



function jwtGenerator(user_id){
    const payload = {
        user : user_id
    };
    const jwtSecret = '$2a$06$6vnjQjCk98M5/hC1Zr9V8eU6dV8MQrZhugB7sRKByxWw7oGvc/MBC';

    return jwtToken.sign(payload, process.env.jwtSecret, {expiresIn: "1hr"});
}



module.exports = jwtGenerator;
 