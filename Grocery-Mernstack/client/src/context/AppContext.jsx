import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios"

axios.defaults.withCredentials = true
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

export const AppContext = createContext();

export function AppContextProvider({children}){
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate()
    const [user,setUser] = useState(null)
    const[isSeller,setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const[products, setProducts] = useState([])
    const [cartItems,setCartItems] = useState({})
    const [searchQuery,setSearchQuery] = useState({})

    // fetch seller status
    async function fetchSeller(){
        try{
            const {data} = await axios.get("/api/seller/is-auth")
            if(data.success){
                setIsSeller(true)
            }
            else{
                setIsSeller(false)
            }
        }
        catch(error){
            setIsSeller(false)
        }
    }

    //fetch uset auth status, userdata and cart items

    async function fetchUser(){
  try{
    const { data } = await axios.get("/api/user/is-auth");
    if (data.success) {
      setUser(data.user);
      setCartItems(data.user.cartItems || {});
    } else {
      setUser(null);
      console.log("Auth check failed:", data.message);
    }
  } catch (error) {
    setUser(null);
    console.log("Fetch user error:", error.message);
    toast.error("Session expired. Please log in again.");
  }
    }
    

    //fetch all products
    async function fetchProducts(){
       try{
        const {data} = await axios.get("/api/product/list");
        if(data.success){
            setProducts(data.products)
        }
        else{
            toast.error(error)
        }
       }
       catch(error){
        toast.error(error.message)
       }
    }

    //add product to cart
    function addToCart(itemId){
        let cartData = structuredClone(cartItems)

        if(cartData[itemId]){
            cartData[itemId]+=1;
        }
        else{
            cartData[itemId] = 1
        }
        setCartItems(cartData);
        toast.success("Added To Cart")
    }
//Update Cart Item quantity
    function updateCartItem(itemId,quantity){
        let cartData = structuredClone(cartItems)
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart Updated")
    }

    //remove product from the cart
    function removeFromCart(itemId){
          let cartData = structuredClone(cartItems)

          if(cartData[itemId]){
            cartData[itemId] = cartData[itemId] - 1 ;

            if(cartData[itemId] === 0){
                delete cartData[itemId];
            }
          }
          toast.success("Removed from cart")
          setCartItems(cartData)
    }

    //Get cart Item Count

    function getCartCount(){
        let totalCount = 0;
        for(const item in cartItems){
            totalCount += cartItems[item];
        }
        return totalCount
    }

    //Get cart Total Amount

    function getCartAmount(){
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=>product._id === items)
            if(cartItems[items] > 0){
                totalAmount += itemInfo.offerPrice * cartItems[items]
            }
        }
        return Math.floor(totalAmount*100)/100 ;
    }

    useEffect(()=>{
        fetchSeller()
        fetchProducts()
        fetchUser()
    },[])

    //Update cart Items Database
    useEffect(()=>{
        async function updateCart(){
            try {
                const {data} = await axios.post("/api/cart/update",{cartItems});
                if(!data.success){
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        if(user){
            updateCart()
        }
    },[cartItems])

    // Load from localStorage on mount if user is not logged in
useEffect(() => {
  if (!user) {
    const localCart = localStorage.getItem("cartItems");
    if (localCart) {
      setCartItems(JSON.parse(localCart));
    }
  }
}, [user]);

// Save to localStorage whenever cartItems change, only if no user logged in
useEffect(() => {
  if (!user) {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
}, [cartItems, user]);

    const value = {fetchProducts,axios,getCartAmount,getCartCount,searchQuery,setSearchQuery,removeFromCart,updateCartItem,navigate,user,setUser,isSeller,setIsSeller,showUserLogin,setShowUserLogin,products,currency,addToCart,cartItems,setCartItems}
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}

export function UseAppContext(){
    return useContext(AppContext)
}
