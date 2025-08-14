import React from 'react'
import BannerSale from '../components/festsale/banner'
import Festsaleproducts from '../components/festsale/festsaleproducts'

const festsale = () => {
  return (
    <div>

      <BannerSale/>
   <Festsaleproducts isFestSale={true} festSaleTagId={302} />
    </div>
  )
}

export default festsale