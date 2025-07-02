//Place order COD : /api/order/cod

const Product = require("../models/Product");
const Order = require("../models/Order")
const User = require("../models/User")
const stripe = require("stripe")

async function placeOrderCod(req, res) {
  try {
    const userId = req.userId;
    const { items, address } = req.body;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }
      //calculate amount using Items

      let amount = await items.reduce(async (acc, item) => {
        const product = await Product.findById(item.product);
        return (await acc) + product.offerPrice * item.quantity
      },0);

      // Add Tex charge 2%

      amount += Math.floor(amount * 0.02);
      await Order.create({
        userId,
        items,
        amount,
        address,
        paymentType : "COD"

      });

      return res.json({success : true, message : "Order Placed Successfully"})
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


//Get orders by userUd : api/order/user

async function getUserOrders(req,res){
    try{
        const userId = req.userId;
        const orders = await Order.find({userId, $or : [{paymentType : "COD"}, {isPaid : true }]}).populate('items.product address').sort({createdAt : -1})
        res.json({success : true,orders })
    }
    catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// Get al orders (for seller /admin) api/order/seller

async function getAllOrders(req,res){
    try{
        const userId = req.userId;
        const orders = await Order.find({ $or : [{paymentType : "COD"}, {isPaid : true }]}).populate('items.product address').sort({createdAt : -1})
        res.json({success : true,orders })
    }
    catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

//place order stripe : /api/order/stripe

async function placeOrderStripe(req, res) {
  try {
    const userId = req.userId;
    const { items, address } = req.body;
    const {origin} = req.headers
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let productData = []
      //calculate amount using Items

      let amount = await items.reduce(async (acc, item) => {
        const product = await Product.findById(item.product);
        productData.push({
          name :product.name,
          price : product.offerPrice,
          quantity : item.quantity
        })
        return (await acc) + product.offerPrice * item.quantity
      },0);

      // Add Tex charge 2%

      amount += Math.floor(amount * 0.02);
      const order =  await Order.create({
        userId,
        items,
        amount,
        address,
        paymentType : "Online"

      });

      //Stripe gateway initilize

      const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

      //create line item for stripe
      const line_items = productData.map((item)=>{
        return {
          price_data : {
            currency : "inr",
            product_data : {
              name : item.name
            },
            unit_amount : Math.floor(item.price * 100)
          },
          quantity : item.quantity,
        }
      })

      //create session
      const session = await stripeInstance.checkout.sessions.create({
        line_items,
        mode : "payment",
        success_url : `${origin}/loader?next=my-orders`,
        cancel_url : `${origin}/cart`,
        metadata : {
          orderId : order.id.toString(),
          userId,
        }
      })
      return res.json({success : true,url : session.url})
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// STRIPE webhooks to verify payments action : /stripe
async function stripeWebhooks(request,response){
  //stripe gateway initializee
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.headers["stripe-signature"];
  let event ;
   try {
    event = stripeInstance.stripeWebHooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    response.status(400).send("Webhook Error" ,error.message)
  }

  //Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":{
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      //getting session metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent : paymentIntentId
      });
      const {orderId, userId} = session.data[0].metadata;

      //Mark payment as paid

      await Order.findByIdAndUpdate(orderId, {isPaid :true})

      // clear user cart

      await User.findByIdAndUpdate(userId, {cartItems : {}})
      break;
    }
      
      case "payment_intent.failed":{
        const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      //getting session metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent : paymentIntentId
      });
      const {orderId, userId} = session.data[0].metadata;
      await Order.findByIdAndDelete(orderId);
      break;
      }
  
    default:
      console.error(`Unhandled Event type ${event.type}`)
      break;
  }
  response.json({recieve : true})

}

module.exports = {stripeWebhooks,placeOrderStripe,getAllOrders,getUserOrders,placeOrderCod}