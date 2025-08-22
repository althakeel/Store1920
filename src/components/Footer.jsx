import React from "react";
import "../assets/styles/Footer.css";
import { FaInstagram, FaFacebookF, FaXTwitter, FaTiktok, FaYoutube, FaPinterest } from "react-icons/fa6";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";
import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";

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
              <a href="instagram.com/the_store1920" target="blank"><FaInstagram /></a>
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaXTwitter /></a>
              <a href="#"><FaTiktok /></a>
              <a href="#"><FaYoutube /></a>
              <a href="#"><FaPinterest /></a>
            </div>
          </div>
        </div>

        <div className="footer-middle">
          <div className="security">
            <h5>Security Certifications</h5>
            <div className="certs">
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/219cc18d-0462-47ae-bf84-128d38206065.png.slim_.webp" alt="SSL" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/96e8ab9b-d0dc-40ac-ad88-5513379c5ab3.png.slim_.webp" alt="ID Check" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/80d57653-6e89-4bd5-82c4-ac1e8e2489fd.png.slim_.webp" alt="SafeKey" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/65e96f45-9ff5-435a-afbf-0785934809ef.png.slim-1.webp" alt="PCI" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/058c1e09-2f89-4769-9fd9-a3cac76e13e5-1.webp" alt="APWG" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/28a227c9-37e6-4a82-b23b-0ad7814feed1.png.slim_.webp" alt="PCI" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/1f29a857-fe21-444e-8617-f57f5aa064f4.png.slim_.webp" alt="APWG" />
            </div>
          </div>

          <div className="payments">
            <h5>We Accept</h5>
            <div className="methods">
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/058c1e09-2f89-4769-9fd9-a3cac76e13e5-1.webp" alt="Visa" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/6fad9cde-cc9c-4364-8583-74bb32612cea.webp" alt="MasterCard" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/3a626fff-bbf7-4a26-899a-92c42eef809a.png.slim_.webp" alt="AmEx" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/ec0c5d69-1717-4571-a193-9950ec73c8af.png.slim_.webp" alt="PayPal" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/da7f463a-916f-4d91-bcbb-047317a1c35e.png.slim_.webp" alt="Cash" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/c3e5eb19-1b60-4c2b-87e1-4528fb390cbf.png.slim_.webp" alt="Apple Pay" />
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/bcb8bf23-78c9-45ab-b480-f7020d1a5f66.png.slim_.webp" alt="Apple Pay" />   
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/b79a2dc3-b089-4cf8-a907-015a25ca12f2.png.slim_.webp" alt="Apple Pay" />   
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/ae5e15c1-ffe8-42c4-9ddb-bb9ed1fdcf6a.png.slim_.webp" alt="Apple Pay" />   
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/936bf9dc-9bb2-4935-9c5a-a70b800d4cf1.png.slim_.webp" alt="Apple Pay" />   
              <img src="https://db.store1920.com/wp-content/uploads/2025/07/ac293ffc-9957-4588-a4df-f3397b4a54e0.png.slim_.webp" alt="Apple Pay" />   



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
