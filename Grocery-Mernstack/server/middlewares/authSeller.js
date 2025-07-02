const jwt = require("jsonwebtoken");

async function authSeller(req,res,next){
    const {sellerToken} = req.cookies;

    if(!sellerToken){
        return res.json({success : false, message : "Not Authorized"})
    }
    try{
        const tokenDecode = jwt.verify(sellerToken,process.env.SECRET_KEY);
        if(!tokenDecode){
            return res.json({success : false, message : "Not Autorized"})
        }
        if(tokenDecode.email === process.env.SELLER_EMAIL){
            console.log("[AUTH] Seller authenticated");
             next()
        }else{
            return res.json({success : false, message : "Not authorized"})
        }
       
    }
    catch(error){
        console.log(error);
        res.json({success : false, message: error.message})
    }
}

module.exports = authSeller