import React from 'react'
import ProductCard from './ProductCard'
import { UseAppContext } from '../context/AppContext'

const BestSeller = () => {
  const { products } = UseAppContext()

  return (
    <div className='mt-10'>
      <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-center sm:text-left">
        Best Sellers
      </p>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 sm:gap-5 md:gap-6 mt-6 '>

        {
          products
            .filter((product) => product.inStock)
            .slice(0, 5)
            .map((product, index) => (
              <ProductCard key={index} product={product} />
            ))
        }

        <ProductCard product={products[0]} />
      </div>
    </div>
  )
}

export default BestSeller
