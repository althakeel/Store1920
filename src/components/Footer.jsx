import React from "react";
import "../assets/styles/Footer.css";
import { FaInstagram, FaFacebookF, FaXTwitter, FaTiktok, FaYoutube, FaPinterest } from "react-icons/fa6";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import Image1 from '../assets/images/Footer icons/1.webp'
import Image2 from '../assets/images/Footer icons/4.webp'
import Image3 from '../assets/images/Footer icons/7.webp'
import Image4 from '../assets/images/Footer icons/8.webp'
import Image5 from '../assets/images/Footer icons/9.webp'
import Image6 from '../assets/images/Footer icons/10.webp'
import Image7 from '../assets/images/Footer icons/21.webp'
import Image8 from '../assets/images/Footer icons/2.webp'
import Image9 from '../assets/images/Footer icons/3.webp'
import Image10 from '../assets/images/Footer icons/6.webp'
import Image11 from '../assets/images/Footer icons/11.webp'
import Image12 from '../assets/images/Footer icons/12.webp'
import Image13 from '../assets/images/Footer icons/13.webp'
import Image14 from '../assets/images/Footer icons/16.webp'
import Image15 from '../assets/images/Footer icons/17.webp'
import Image16 from '../assets/images/Footer icons/18.webp'
import Image17 from '../assets/images/Footer icons/19.webp'
import Image18 from '../assets/images/Footer icons/20.webp'
import Image19 from '../assets/images/Footer icons/21.webp'


const Footer = () => {
   const { isCartOpen } = useCart();

   
  return (
    <footer className="main-footer"
    
     style={{
        width: window.innerWidth >= 768 && isCartOpen ? 'calc(100% - 250px)' : '100%',
        transition: 'width 0.3s ease',
      }}>
      <div className="footer-container">

        <div className="footer-top">
     <div className="footer-section">
  <h4>Men</h4>
  <ul>
    <li><Link to="/categorypage/men-tshirts">T-Shirts</Link></li>
    <li><Link to="/categorypage/men-hoodies">Hoodies & Sweatshirts</Link></li>
    <li><Link to="/categorypage/men-jeans">Jeans</Link></li>
    <li><Link to="/categorypage/men-trousers">Trousers</Link></li>
    <li><Link to="/categorypage/men-shoes">Shoes</Link></li>
    <li><Link to="/categorypage/men-sandals">Sandals & Slippers</Link></li>
    <li><Link to="/categorypage/men-accessories">Accessories</Link></li>
    <li><Link to="/categorypage/men-belts">Belts</Link></li>
    <li><Link to="/categorypage/men-wallets">Wallets</Link></li>
    <li><Link to="/categorypage/men-watches">Watches</Link></li>
  </ul>
</div>


          <div className="footer-section">
            <h4>Women</h4>
            <ul>
              <li><a href="/">Dresses</a></li>
             <li><a href="/">Tops & Blouses</a></li>
              <li><a href="/">Abayas & Kaftans</a></li>
              <li><a href="/">Handbags</a></li>
              <li><a href="/">Shoes</a></li>
              <li><a href="/">Heels & Flats</a></li>
              <li><a href="/">Jewelry</a></li>
             <li><a href="/">Earrings</a></li>
             <li><a href="/">Necklaces</a></li>
              <li><a href="/">Makeup & Beauty</a></li>
              {/* <li><a href="/terms-of-sale">Terms of Sale</a></li> */}
            </ul>
          </div>

          <div className="footer-section">
  <h4>Kids</h4>
  <ul>
    <li><Link to="/categorypage/kids-clothing">Clothing</Link></li>
    <li><Link to="/categorypage/kids-tshirts">T-Shirts & Shorts</Link></li>
    <li><Link to="/categorypage/kids-dresses">Dresses</Link></li>
    <li><Link to="/categorypage/kids-shoes">Shoes</Link></li>
    <li><Link to="/categorypage/kids-schoolbags">School Bags</Link></li>
    <li><Link to="/categorypage/kids-toys">Toys</Link></li>
    <li><Link to="/categorypage/kids-babycare">Baby Care</Link></li>
  </ul>
</div> 


<div className="footer-section">
  <h4>Home</h4>
  <ul>
    <li><Link to="/categorypage/home-furniture">Furniture</Link></li>
    <li><Link to="/categorypage/home-sofas">Sofas & Chairs</Link></li>
    <li><Link to="/categorypage/home-tables">Tables & Storage</Link></li>
    <li><Link to="/categorypage/home-kitchen">Kitchen & Dining</Link></li>
    <li><Link to="/categorypage/home-cookware">Cookware</Link></li>
    <li><Link to="/categorypage/home-appliances">Appliances</Link></li>
    <li><Link to="/categorypage/home-decor">Home Decor</Link></li>
    <li><Link to="/categorypage/home-bedding">Bedding</Link></li>
    <li><Link to="/categorypage/home-lighting">Lighting</Link></li>
  </ul>
</div>

                    <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
            
              <li><a href="/about" target="blank">About Us</a></li>
              {/* <li><a href="/safety" target="blank">Contact Us</a></li> */}
              <li><a href="/purchaseprotection">Purchase Protection</a></li>
              <li><a href="/safetycenter" target="blank">Safety Center</a></li>
           
            </ul>
              <h4>Support</h4>
              <ul>
                 <li><a href="/track-order" target="blank">Track order</a></li>
               <li><a href="/shippinginfo" target="blank">Shipping Info</a></li>
              {/* <li><a href="/help">help</a></li> */}
              {/* <li><a href="/track-order">Track order</a></li> */}
            </ul>
          </div>


          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://www.instagram.com/store1920.ae?igsh=MTExZHl2b2QwZDg1aQ==" target="blank"><FaInstagram /></a>
              <a href="https://www.facebook.com/thestore1920" target="blank"><FaFacebookF /></a>
              {/* <a href="#"><FaXTwitter /></a>
              <a href="#"><FaTiktok /></a>
              <a href="#"><FaYoutube /></a>
              <a href="#"><FaPinterest /></a> */}
            </div>
          </div>
        </div>

        <div className="footer-middle">
          <div className="security">
            <h5>Security Certifications</h5>
            <div className="certs">
              <img src={Image1} alt="SSL" />
              <img src={Image2} alt="ID Check" />
              <img src={Image3} alt="SafeKey" />
              <img src={Image4} alt="PCI" />
              <img src={Image5} alt="APWG" />
              <img src={Image6} alt="PCI" />
              <img src={Image7} alt="APWG" />
            </div>
          </div>

          <div className="payments">
            <h5>We Accept</h5>
            <div className="methods">
              <img src={Image8} alt="Visa" />
              <img src={Image9} alt="MasterCard" />
              <img src={Image10} alt="AmEx" />
              <img src={Image11} alt="PayPal" />
              <img src={Image12} alt="Cash" />
              <img src={Image13} alt="Apple Pay" />
              <img src={Image14} alt="Apple Pay" />   
              <img src={Image15} alt="Apple Pay" />   
              <img src={Image16} alt="Apple Pay" />   
              <img src={Image17} alt="Apple Pay" />   
              <img src={Image18} alt="Apple Pay" />    



            </div>
          </div>
        </div>

        <div className="footer-bottom"
        
     style={{
        width: window.innerWidth >= 768 && isCartOpen ? 'calc(100% - 250px)' : '100%',
        transition: 'width 0.3s ease',
      }}>
          <p>&copy; 2022 – 2025 Al Thakeel Group. All rights reserved.</p>
          <ul className="legal-links">
            <li><a href="/Terms-0f-use">Terms of Use</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/cookies-settings">Cookie Settings</a></li>
            {/* <li><a href="/ads">Ad Choices</a></li> */}
          </ul>
          {/* <button className="scroll-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <IoIosArrowUp /> Top
          </button> */}
        </div>

      </div>
    </footer>
  );
};

export default Footer;
