const jwt = require("jsonwebtoken")

async function authUser(req,res,next) {
    const {token} = req.cookies;

    if(!token){
        return res.json({success : false, message : "Not Authorized"})
    }

    try{
        const tokenDecode = jwt.verify(token,process.env.SECRET_KEY);
        if(tokenDecode){
            req.userId = tokenDecode.id
        }
        else{
            return res.json({success : false, message : "Not authorized"})
        }
        next()
    }
    catch(error){
        res.json({success: false , message : error.message})
    }
}

module.exports = authUser;