import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { UseAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

//Input Field Component
function InputField({ type, placeholder, name, handleChange, adress }) {
  return (
    <input
      className="w-full px-2 py-2.5 border border-grey-500/30 rounded outline-none text-grey-500 focus:border-[#44ae7c] transition"
      type={type}
      placeholder={placeholder}
      name={name}
      value={adress[name]}
      onChange={handleChange}
      required
    />
  );
}


const AddAddress = () => {

  const {axios, user , navigate,setShowUserLogin} = UseAppContext()
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  }

  async function onSubmitHandler(e) {
    e.preventDefault();
    const token = localStorage.getItem("token"); // adjust if you're using cookies or context
    try {
      const {data} = await axios.post("/api/address/add",{address},{withCredentials:true})
      if(data.success){
        toast.success(data.message);
        navigate("/cart")
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
 
  }

  useEffect(()=>{
    if(!user){
      setShowUserLogin(true); // show the login modal
    navigate("/");          // optionally navigate somewhere safe (like home)
    }
  },[])

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-grey-500">
        Add Shipping{" "}
        <span className="font-semibold text-[#4fbf8b]">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
           
            <div className="grid grid-cols-2 gap-4" >
                <InputField
                    handleChange={handleChange}
                    adress={address}
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                />
                <InputField
                    handleChange={handleChange}
                    adress={address}
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                />
            </div>
            <InputField
                handleChange={handleChange}
                adress={address}
                name="email"
                type="email"
                placeholder="E-mail address"
              />
              <InputField
                handleChange={handleChange}
                adress={address}
                name="street"
                type="text"
                placeholder="Street"
              />
              <div className="grid grid-cols-2 gap-4">
                    <InputField
                    handleChange={handleChange}
                    adress={address}
                    name="city"
                    type="text"
                    placeholder="City"
                />
                <InputField
                    handleChange={handleChange}
                    adress={address}
                    name="state"
                    type="text"
                    placeholder="State"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                    <InputField
                    handleChange={handleChange}
                    adress={address}
                    name="zipcode"
                    type="number"
                    placeholder="Zipcode"
                />
                <InputField
                    handleChange={handleChange}
                    adress={address}
                    name="country"
                    type="text"
                    placeholder="Country"
                />
              </div>
               <InputField
                    handleChange={handleChange}
                    adress={address}
                    name="phone"
                    type="text"
                    placeholder="Phone"
                />
                <button className="w-full mt-4 bg-[#4fbf8b] text-white py-3 hover:bg-[#44ae7c] transition cursor-pointer uppercase">
                    Save address
                </button>
          </form>
        </div>
        <img
          className="md:mr-16 mb-16 md:mt-0"
          src={assets.add_address_iamge}
          alt="add Adress"
        />
      </div>
    </div>
  );
};

export default AddAddress;
