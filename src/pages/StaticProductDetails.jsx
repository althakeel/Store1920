import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import staticProducts from "../data/staticProducts";
import { useCart } from "../contexts/CartContext"; 

import ProductImages from "../components/StaticProduct/ProductImages";
import ProductInfo from "../components/StaticProduct/ProductInfo";
import ProductFeatures from "../components/StaticProduct/ProductFeatures";
import ProductGuarantee from "../components/StaticProduct/ProductGuarantee";
import ProductFAQ from "../components/StaticProduct/ProductFAQ";
import DeliveryInfo from "../components/StaticProduct/delivery";
import Bundle from "../components/StaticProduct/bundle";
import Desciption from "../components/StaticProduct/descrption";
import Slider from "../components/StaticProduct/slider";
import Section2 from "../components/StaticProduct/section2";
import Section3 from "../components/StaticProduct/section3";
import Section4 from "../components/StaticProduct/section4";
import Slider2 from "../components/StaticProduct/slider2";
import Review from "../components/StaticProduct/review";
import Comparison from "../components/StaticProduct/comparison";
import ProgressBarSection from "../components/StaticProduct/progressbarsection";
import Section5 from '../components/StaticProduct/section5'

const CustomProductDetails = () => {
  const { slug } = useParams();
  const product = staticProducts.find((p) => p.slug === slug);
  const [selectedBundleIndex, setSelectedBundleIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const { addToCart } = useCart(); // Get addToCart function from your cart context

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!product) {
    return (
      <div style={{ padding: "10px", textAlign: "center", fontSize: "18px" }}>
        Product not found.
      </div>
    );
  }

  // ✅ Add to cart handler
const handleAddToCart = (bundleWithVariants) => {
  const cartItem = {
    productId: product.id,
    name: product.name, // explicitly pass the product name
    price: bundleWithVariants.price,
    originalPrice: bundleWithVariants.originalPrice,
    discount: bundleWithVariants.discount,
bundleType: `${bundleWithVariants.type} - ${product.name}`,
    quantity: 1,
  };
  addToCart(cartItem);
  alert("Product added to cart!");
};

  return (
    <>
      <div
        style={{
          padding: "20px 0px",
          maxWidth: "1400px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "14px",
          }}
        >
          {/* Left Column: Product Images */}
          <div
            style={{
              flexBasis: isMobile ? "100%" : "48%",
              minWidth: "300px",
              width: "100%",
            }}
          >
            <ProductImages product={product} isMobile={isMobile} />
          </div>

          {/* Right Column: Product Info & Details */}
          <div
            style={{
              flexBasis: isMobile ? "100%" : "48%",
              minWidth: "300px",
                  padding: isMobile ? "0 5px" : "0", 
    boxSizing: "border-box",
            }}
          >
            <ProductInfo
              product={{
                ...product,
                salePrice:
                  product.bundles[selectedBundleIndex]?.price ??
                  product.salePrice,
                regularPrice:
                  product.bundles[selectedBundleIndex]?.originalPrice ??
                  product.regularPrice,
              }}
            />
            <Bundle
              bundles={product.bundles}
              selected={selectedBundleIndex}
              setSelected={setSelectedBundleIndex}
              onAddToCart={handleAddToCart} 
            />
            <DeliveryInfo />
            <Desciption product={product} />
          </div>
        </div>
      </div>

      {/* Sections & Sliders */}
      <Slider product={product} />
      <Section2  product={product}/>
      <Section4  product={product}/>
      <Review  product={product}/>
      <ProgressBarSection product={product}/>
      <Comparison product={product}/>
      <Slider2  product={product}/>
      <Section3  product={product}/>
      <ProductGuarantee product={product} />
      <Section5  product={product}/>
      <ProductFAQ product={product} />
      {/* <ProductFeatures product={product} /> */}
    </>
  );
};

export default CustomProductDetails;
