const express = require("express");
const authUser = require("../middlewares/authUser");
const authSeller = require("../middlewares/authSeller")
const { placeOrderCod, getUserOrders ,getAllOrders, placeOrderStripe} = require("../controllers/orderController")

const orderRouter = express.Router();

orderRouter.post("/cod",authUser,placeOrderCod);
orderRouter.get("/user",authUser,getUserOrders);
orderRouter.get("/seller",authSeller,getAllOrders);
orderRouter.post("/stripe",authUser,placeOrderStripe);

module.exports = orderRouter;