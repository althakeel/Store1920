import React from "react";
import "../assets/styles/Footer.css";
import { FaInstagram, FaFacebookF, FaXTwitter, FaTiktok, FaYoutube, FaPinterest } from "react-icons/fa6";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">

        <div className="footer-top">
          <div className="footer-section">
            <h4>Company Info</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/billionaire-style">Shop Like a Billionaire</a></li>
              <li><a href="/affiliate">Affiliate & Influencer</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/press">Press</a></li>
              <li><a href="/tree-program">Tree Planting Program</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="/returns">Return & Refund Policy</a></li>
              <li><a href="/shipping">Shipping Info</a></li>
              <li><a href="/intellectual-property">Intellectual Property</a></li>
              <li><a href="/report-abuse">Report Abuse</a></li>
              <li><a href="/terms-of-sale">Terms of Sale</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Help</h4>
            <ul>
              <li><a href="/support">Support & FAQ</a></li>
              <li><a href="/safety">Safety Center</a></li>
              <li><a href="/protection">Purchase Protection</a></li>
              <li><a href="/track-order">Track Order</a></li>
              <li><a href="/sitemap">Sitemap</a></li>
              <li><a href="/partner">Partner With Us</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Download the App</h4>
            <ul className="app-links">
              <li><FaApple /> <a href="#">App Store</a></li>
              <li><FaGooglePlay /> <a href="#">Google Play</a></li>
            </ul>
            <ul className="app-alerts">
              <li>✔ Price-drop alerts</li>
              <li>✔ Low stock alerts</li>
              <li>✔ Faster checkout</li>
              <li>✔ Exclusive offers</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="#"><FaInstagram /></a>
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
              <img src="https://store1920.com/wp-content/uploads/2025/07/219cc18d-0462-47ae-bf84-128d38206065.png.slim_.webp" alt="SSL" />
              <img src="https://store1920.com/wp-content/uploads/2025/07/96e8ab9b-d0dc-40ac-ad88-5513379c5ab3.png.slim_.webp" alt="ID Check" />
              <img src="https://store1920.com/wp-content/uploads/2025/07/80d57653-6e89-4bd5-82c4-ac1e8e2489fd.png.slim_.webp" alt="SafeKey" />
              <img src="https://store1920.com/wp-content/uploads/2025/07/65e96f45-9ff5-435a-afbf-0785934809ef.png.slim-1.webp" alt="PCI" />
              <img src="https://store1920.com/wp-content/uploads/2025/07/058c1e09-2f89-4769-9fd9-a3cac76e13e5-1.webp" alt="APWG" />
              <img src="https://store1920.com/wp-content/uploads/2025/07/28a227c9-37e6-4a82-b23b-0ad7814feed1.png.slim_.webp" alt="PCI" />
              <img src="https://store1920.com/wp-content/uploads/2025/07/1f29a857-fe21-444e-8617-f57f5aa064f4.png.slim_.webp" alt="APWG" />
            </div>
          </div>

          <div className="payments">
            <h5>We Accept</h5>
            <div className="methods">
              <img src="https://store1920.com/wp-content/uploads/2025/07/058c1e09-2f89-4769-9fd9-a3cac76e13e5-1.webp" alt="Visa" />
              <img src="https://store1920.com/wp-content/uploads/2025/07/6fad9cde-cc9c-4364-8583-74bb32612cea.webp" alt="MasterCard" />
              <img src="https://store1920.com/wp-content/uploads/2025/07/3a626fff-bbf7-4a26-899a-92c42eef809a.png.slim_.webp" alt="AmEx" />
              <img src="https://store1920.com/wp-content/uploads/2025/07/ec0c5d69-1717-4571-a193-9950ec73c8af.png.slim_.webp" alt="PayPal" />
              <img src="https://store1920.com/wp-content/uploads/2025/07/da7f463a-916f-4d91-bcbb-047317a1c35e.png.slim_.webp" alt="Cash" />
              <img src="https://store1920.com/wp-content/uploads/2025/07/c3e5eb19-1b60-4c2b-87e1-4528fb390cbf.png.slim_.webp" alt="Apple Pay" />
              <img src="https://store1920.com/wp-content/uploads/2025/07/bcb8bf23-78c9-45ab-b480-f7020d1a5f66.png.slim_.webp" alt="Apple Pay" />   
              <img src="https://store1920.com/wp-content/uploads/2025/07/b79a2dc3-b089-4cf8-a907-015a25ca12f2.png.slim_.webp" alt="Apple Pay" />   
              <img src="https://store1920.com/wp-content/uploads/2025/07/ae5e15c1-ffe8-42c4-9ddb-bb9ed1fdcf6a.png.slim_.webp" alt="Apple Pay" />   
              <img src="https://store1920.com/wp-content/uploads/2025/07/936bf9dc-9bb2-4935-9c5a-a70b800d4cf1.png.slim_.webp" alt="Apple Pay" />   
              <img src="https://store1920.com/wp-content/uploads/2025/07/ac293ffc-9957-4588-a4df-f3397b4a54e0.png.slim_.webp" alt="Apple Pay" />   



            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2022 – 2025 Al Thakeel Group. All rights reserved.</p>
          <ul className="legal-links">
            <li><a href="/terms">Terms of Use</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/cookies">Cookie Settings</a></li>
            <li><a href="/ads">Ad Choices</a></li>
          </ul>
          <button className="scroll-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <IoIosArrowUp /> Top
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
