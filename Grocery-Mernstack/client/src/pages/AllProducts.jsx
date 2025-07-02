import React, { useEffect, useState } from 'react'
import { UseAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard';

const AllProducts = () => {

    const {products,searchQuery} = UseAppContext();
    const[filteredProducts,setFilteredProducts] = useState([])
    
    useEffect(()=>{
        if(searchQuery.length > 0) {
            setFilteredProducts(products.filter((product)=>product.name.toLowerCase().includes(searchQuery.toLowerCase())))
        }
        else{
            setFilteredProducts(products)
        }
    },[products,searchQuery])
    return (
    <div> 
        <div className='mt-16 flex flex-col'>
            <div className='flex flex-col items-end w-max'>
                <p className='text-2xl font-medium uppercase'>All Products</p>
                <div className='w-16 h-0.5 bg-[#4fbf8b] rounded-full'> </div>
            </div>
        </div>
      <div className=' grid grid-cols-2 sm:grid-col-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6'>
            {
                filteredProducts.filter((product)=>{
                   return product.inStock
                }).map((product,index)=>{
                    return(
                        <ProductCard key={index} product={product}/>
                    )
                })
            }
      </div>
    </div>
  )
}

export default AllProducts
