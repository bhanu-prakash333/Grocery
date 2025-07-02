// Add Product : api/product/add
const {cloudinary} = require("../configs/cloudinary")
const Product = require("../models/Product")

async function addProduct(req,res){
    try{
        let productData = JSON.parse(req.body.productData)
        const images = req.files;
        let  imagesUrl = await Promise.all(
            images.map(async(item)=>{
                let result = await cloudinary.uploader.upload(item.path,{
                    resource_type : "image"
                });
                return result.secure_url
            })
        )
        await Product.create({...productData, image : imagesUrl})
        res.json({success : true, message : "product added"})
    }   
    catch(error){
        console.log(error);
        res.json({success : false , message : error.message})
    }
}

//Get : Products : api/producut/add

async function productList(req,res) {
    try{
        const products = await Product.find({})
        res.json({success : true , products})
    }
    catch(error){
         console.log(error);
        res.json({success : false , message : error.message})
    }
}

//Get single : Products : api/producut/list

async function productById(req,res) {
    try{
        const {id} = req.body;
        const product = await Product.findOne({_id : id})
        res.json({success : true , product})
    }
    catch(error){
         console.log(error);
        res.json({success : false , message : error.message})
    }
}

//Get single : Products : api/producut/stock

async function changeStock(req,res) {
    try{
        const {id,inStock} = req.body;
        await Product.findByIdAndUpdate(id,{inStock})
        res.json({success : true, message : "Stock Updated"})
    }
    catch(error){
         console.log(error);
        res.json({success : false , message : error.message})
    }

}

module.exports = {changeStock,productById,productList,addProduct}