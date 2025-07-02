//update user cartData : /api/cart/update

const User = require("../models/User")

async function updateCart(req,res){
    try{
        const {userId}  = req;
        const {cartItems} = req.body
        await User.findByIdAndUpdate(userId,{cartItems})
        res.json({success : true, message : "cart updated"})
    }
    catch(error){
        console.log(error.message);
        res.json({succes : false, message : error.message})
    }
}
module.exports = updateCart;