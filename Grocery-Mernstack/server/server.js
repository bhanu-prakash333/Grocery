const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const connectDB = require("../server/configs/db");
require("dotenv").config()
const userRouter = require("../server/routes/userRoute")
const sellerRouter = require("../server/routes/sellerRoutes");
const productRouter = require("../server/routes/productRoutes")
const cartRouter = require("../server/routes/cartRoutes");
const orderRouter = require("../server/routes/orderRoutes")
const addressRouter = require("../server/routes/addressRoutes")
const  stripewebhooks = require("../server/controllers/orderController")
const {connectCloudinary} = require("../server/configs/cloudinary")
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary()


const allowedOrigins = ["https://grocery-frontend-phi.vercel.app"];
app.post("/stripe",express.raw({type : "application/json", stripewebhooks}))
//Middleware configuration
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(cookieParser());
app.use(cors({
    origin : allowedOrigins,
    credentials : true
}))

app.get("/",(req,res)=>{
    res.send("API is working")
})
app.use("/api/user",userRouter);
app.use("/api/seller",sellerRouter);
app.use("/api/product",productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/address",addressRouter);
app.use("/api/order",orderRouter)

app.listen(port,()=>{
    console.log(`Server is running on Port : ${port}`)
})
