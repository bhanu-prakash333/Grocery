import React, { useEffect, useState } from 'react'
import { UseAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const SellerLogin = () => {
    const {isSeller,setIsSeller, navigate, axios} = UseAppContext();
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    async function onSubmitHandler(e){
        try{
            e.preventDefault();
            const {data} = await axios.post("/api/seller/login",{email, password})
            if(data.success){
                setIsSeller(true);
                navigate("/seller")
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
        

    }

    useEffect(()=>{
        if(isSeller){
            navigate("/seller")
        }
    },[isSeller])

  return !isSeller && (

    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-grey-600'>
       <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-grey-200'>
        <p className='text-2xl font-medium m-auto'><span className='text-[#4fbf8b]'>Seller</span>Login</p>
        <div className='w-full'>
            <p>Email</p>
            <input onChange={(e)=>setEmail(e.target.value)} value={email} type='email' placeholder='Enter your email' className='border border-grey-200 w-full p-2 mt-1 outline-[#4fbf8b]' required/>
        </div>
        <div className='w-full'>
            <p>Password</p>
            <input onChange={(e)=>setPassword(e.target.value)} value={password} type='password' placeholder='Enter your password' className='border border-grey-200 w-full p-2 mt-1 outline-[#4fbf8b]' required/>
        </div>
        <button className='bg-[#4fbf8b] text-white w-full py-2 rounded-md cursor-pointer'>Login</button>
       </div>
    </form>
  )
}

export default SellerLogin
