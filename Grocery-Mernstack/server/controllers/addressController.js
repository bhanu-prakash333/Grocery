
// Add Address : api/address/add
const Address = require("../models/Address")

async function addAddress(req,res){
    try{
        const userId = req.userId;
        const {address} = req.body;
        await Address.create({...address,userId});
        res.json({success : true, message : "Address added successfully"})

    }
    catch(error){
         console.log(error.message);
        res.json({success : false, message : error.message})
    }
}

// Get address : /api/address/get

async function getAddress(req,res){
    try{
        const userId = req.userId;
        const addresses = await Address.find({userId})
        res.json({success : true ,message : "Adresses fetched",addresses})
    }
     catch(error){
         console.log(error.message);
        res.json({success : false, message : error.message})
    }
    
}

module.exports = {getAddress,addAddress}