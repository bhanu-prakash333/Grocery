import React, { useEffect, useState } from "react";
import { UseAppContext } from "../context/AppContext";
import { dummyOrders } from "../assets/assets";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency ,axios, user} = UseAppContext();

  async function fetchMyOrders() {
    try {
      const {data} = await axios.get("/api/order/user");
      if(data.success){
        setMyOrders(data.orders)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(user){
      fetchMyOrders()
    };
  }, [user]);
  return (
    <div className="mt-16 pb-16">
      <div className="flex flex-col items-center w-max mb-8">
        <p className="text-2xl font-medium uppercase">My orders</p>
        <div className="w-16 h-0.5 bg-[#4fbf8b] rounded-full"></div>
      </div>
      {myOrders.map((order, index) => {
        return (
          <div
            key={index}
            className="border border-grey-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
          >
            <p className="flex justify-between md:items-center text-grey-400 md:font-medium max-md:flex-col">
              <span>OrderId : {order._id}</span>
              <span>Payment : {order.paymentType}</span>
              <span>
                Total Payment : {currency}
                {order.amount}
              </span>
            </p>
            {order.items.map((item, index) => {
              return (
                <div key={index} className={`relative bg-white text-grey-500/70 ${
                    order.items.length !== index+1 && "border-b"} border-grey-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl
                }`}>

                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-[#4fbf8b]/10 p-4 rounded-lg">
                      <img
                        className="w-16 h-16"
                        src={item.product?.image?.[index] || "/placeholder.png"}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                        <h2 className="text-xl font-medium text-grey-800">{item.product.name}</h2>
                        <p>{item.product.category}</p>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center md:ml-8 mb_4 md:mb-0">
                    <p>Quantity : {item.quantity || "1"}</p>
                    <p>Status : {order.status || "1"}</p>
                    <p>Date : {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-[#4fbf8b] text-lg font-medium">
                    Amount : {currency}{item.product.offerPrice * item.quantity}
                  </p>
                  
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;
