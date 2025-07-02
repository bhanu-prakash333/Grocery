const jwt = require("jsonwebtoken");
// Seller login : api/seller/login

async function sellerLogin(req, res) {
  try{
        const { email, password } = req.body;

    if (
        password === process.env.SELLER_PASSWORD &&
        email === process.env.SELLER_EMAIL
    ) {
        const payload = {
        email: email,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "7d",
        });

        res.cookie("sellerToken", token, {
        httpOnly: true, //prevent javascript to acess cookie
        secure: process.env.NODE_ENV === "production", //Use secure cookie in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CRSF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
        });
        return res.json({success : true, message : "Seller Login successful",email : email})
    }
    else{
        return res.json({success :false, message : "Unauthorized" })
    }
    
  }
  catch(error){
    console.log(error);
    res.json({success : false, message : error.message})
  }
}

// Check Auth : api/seller/is-auth

async function isSellerAuth(req, res) {
  try {
    return res.json({ success: true});
  } catch (error) {
    res.json({ success: false, message: error.message });
    console.log(error);
  }
}

//Logout : api/seller/logout

async function sellerLogout(req, res) {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //Use secure cookie in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CRSF protection
      
    });
    return res.json({success : true, message : " Seller Logged out"})
  }
   catch (error) {
     res.json({ success: false, message: error.message });
    console.log(error);
  }
}


module.exports = {sellerLogin,sellerLogout,isSellerAuth}