const e = require('express');
const jwt = require('jsonwebtoken');

class authToken{
    constructor(){
        if(this.instance){
            console.log("authInstance already created");
            return this.instance;
        }
        else{
            this.seceteKey="AnyRandomString";
            this.instance=this;
        }
    }
    generateToken(data){
        return jwt.sign(data, this.seceteKey);
    }

    verifyToken(token){
        return jwt.verify(token, this.seceteKey);
    }

    getTokenData(token){
        return jwt.decode(token);
    }

    verifyGetToken(token){
        if (this.verifyToken(token)){
            return this.getTokenData(token);
        }
        else{
            console.log("Token not verified");   
            return false;
        }
    }

}

const authTokenInstance=new authToken();

module.exports=authTokenInstance;