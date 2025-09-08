import React from "react";
import "../assets/styles/Footer.css";
import { FaInstagram, FaFacebookF } from "react-icons/fa6";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";

// Footer icons
import Image1 from '../assets/images/Footer icons/1.webp';
import Image2 from '../assets/images/Footer icons/4.webp';
import Image3 from '../assets/images/Footer icons/7.webp';
import Image4 from '../assets/images/Footer icons/8.webp';
import Image5 from '../assets/images/Footer icons/9.webp';
import Image6 from '../assets/images/Footer icons/10.webp';
import Image7 from '../assets/images/Footer icons/21.webp';
import Image8 from '../assets/images/Footer icons/2.webp';
import Image9 from '../assets/images/Footer icons/3.webp';
import Image10 from '../assets/images/Footer icons/6.webp';
import Image11 from '../assets/images/Footer icons/11.webp';
import Image12 from '../assets/images/Footer icons/12.webp';
import Image13 from '../assets/images/Footer icons/13.webp';
import Image14 from '../assets/images/Footer icons/16.webp';
import Image15 from '../assets/images/Footer icons/17.webp';
import Image16 from '../assets/images/Footer icons/18.webp';
import Image17 from '../assets/images/Footer icons/19.webp';
import Image18 from '../assets/images/Footer icons/20.webp';

const categoryData = [
  {
    id: 1,
    title: "Men's Clothing",
    items: [
      { id: 6522, name: "T-Shirts & Shirts", path: "/category/6522" },
      { id: 6523, name: "Pants & Jeans", path: "/category/6523" },
      { id: 6524, name: "Jackets & Outerwear", path: "/category/6524" },
      { id: 6525, name: "Sweaters & Hoodies", path: "/category/6525" },
      { id: 6526, name: "Blazers & Suits", path: "/category/6526" },
      { id: 6527, name: "Shorts", path: "/category/6527" },
      { id: 6528, name: "Winter Wear & Down Jackets", path: "/category/6528" },
      { id: 6529, name: "Clothing Sets", path: "/category/6529" },
      { id: 6530, name: "New Arrivals", path: "/category/6530" },
    ],
  },
  {
    id: 2,
    title: "Women's Clothing",
    items: [
      { id: 6531, name: "Dresses & Gowns", path: "/category/6531" },
      { id: 6532, name: "Tops & Blouses", path: "/category/6532" },
      { id: 6533, name: "Bottoms (Skirts, Pants)", path: "/category/6533" },
      { id: 6534, name: "Outerwear & Jackets", path: "/category/6534" },
      { id: 6535, name: "Curve & Plus Size Clothing", path: "/category/6535" },
      { id: 6536, name: "Swimwear", path: "/category/6536" },
      { id: 6537, name: "Wedding Dresses", path: "/category/6537" },
      { id: 6538, name: "Special Occasion Dresses", path: "/category/6538" },
      { id: 6539, name: "Matching Sets", path: "/category/6539" },
    ],
  },
  {
    id: 3,
    title: "Accessories",
    items: [
      { id: 6540, name: "Sunglasses & Eyewear", path: "/category/6540" },
      { id: 6541, name: "Scarves & Gloves", path: "/category/6541" },
      { id: 6542, name: "Hats & Headwear", path: "/category/6542" },
      { id: 6543, name: "Jewelry & Watches", path: "/category/6543" },
      { id: 6544, name: "Necklaces", path: "/category/6544" },
      { id: 6545, name: "Earrings", path: "/category/6545" },
      { id: 6546, name: "Bracelets & Bangles", path: "/category/6546" },
      { id: 6547, name: "Men’s Watches", path: "/category/6547" },
      { id: 6548, name: "Women’s Watches", path: "/category/6548" },
    ],
  },
  {
    id: 4,
    title: "Home",
    items: [
      { id: 6549, name: "Furniture", path: "/category/6549" },
      { id: 6550, name: "Sofas & Chairs", path: "/category/6550" },
      { id: 6551, name: "Tables & Storage", path: "/category/6551" },
      { id: 6552, name: "Kitchen & Dining", path: "/category/6552" },
      { id: 6553, name: "Cookware", path: "/category/6553" },
      { id: 6554, name: "Appliances", path: "/category/6554" },
      { id: 6555, name: "Home Decor", path: "/category/6555" },
      { id: 6556, name: "Bedding", path: "/category/6556" },
      { id: 6557, name: "Lighting", path: "/category/6557" },
    ],
  },
];

const Footer = () => {
  const { isCartOpen } = useCart();

  return (
    <footer
      className="main-footer"
      style={{
        width: window.innerWidth >= 768 && isCartOpen ? "calc(100% - 250px)" : "100%",
        transition: "width 0.3s ease",
      }}
    >
      <div className="footer-container">
        <div className="footer-top">
          {categoryData.map((category) => (
            <div className="footer-section" key={category.id}>
              <h4>{category.title}</h4>
              <ul>
                {category.items.map((item) => (
                  <li key={item.id}>
                    <Link to={item.path}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/purchaseprotection">Purchase Protection</Link></li>
              <li><Link to="/safetycenter">Safety Center</Link></li>
            </ul>
            <h4>Support</h4>
            <ul>
              <li><Link to="/track-order">Track Order</Link></li>
              <li><Link to="/shippinginfo">Shipping Info</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://www.instagram.com/store1920.ae" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://www.facebook.com/thestore1920" target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-middle">
          <div className="security">
            <h5>Security Certifications</h5>
            <div className="certs">
              {[Image1, Image2, Image3, Image4, Image5, Image6, Image7].map((img, index) => (
                <img key={index} src={img} alt={`Cert ${index + 1}`} />
              ))}
            </div>
          </div>

          <div className="payments">
            <h5>We Accept</h5>
            <div className="methods">
              {[Image8, Image9, Image10, Image11, Image12, Image13, Image14, Image15, Image16, Image17, Image18].map((img, index) => (
                <img key={index} src={img} alt={`Payment ${index + 1}`} />
              ))}
            </div>
          </div>
        </div>

        <div
          className="footer-bottom"
          style={{
            width: window.innerWidth >= 768 && isCartOpen ? "calc(100% - 250px)" : "100%",
            transition: "width 0.3s ease",
          }}
        >
          <p>&copy; 2022 – 2025 Al Thakeel Group. All rights reserved.</p>
          <ul className="legal-links">
            <li><Link to="/terms-of-use">Terms of Use</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/cookies-settings">Cookie Settings</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
