// MegaMenuManual.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/MegaMenu.css";


// Electronics & Smart Devices
import MobilePhones from '../../assets/images/megamenu/Sub catogory Webp/Mobile Phones copy.webp';
import PhoneAccessories from '../../assets/images/megamenu/Sub catogory Webp//Phone Accessories copy.webp';
import PhonePartsRepair from '../../assets/images/megamenu/Sub catogory Webp//Phone Parts & Repair copy.webp';
import SmartHome from '../../assets/images/megamenu/Sub catogory Webp/Smart Electronics & Smart Home copy.webp';
import HomeAudioVideo from '../../assets/images/megamenu/Sub catogory Webp//Home Audio & Video copy.webp';
import PortableAudioVideo from '../../assets/images/megamenu/Sub catogory Webp/Portable Audio & Video copy.webp';
import CamerasPhotography from '../../assets/images/megamenu/Sub catogory Webp/Cameras & Photography copy.webp';
import GamesGaming from '../../assets/images/megamenu/Sub catogory Webp/Games & Gaming Accessories copy.webp';
import ComputerComponents from '../../assets/images/megamenu/Sub catogory Webp/Computer Components & Desktops copy.webp';
import LaptopsTablets from '../../assets/images/megamenu/Sub catogory Webp/Laptops & Tablets copy.webp';
import Networking from '../../assets/images/megamenu/Sub catogory Webp/Networking & Communication copy.webp';
import WearableTech from '../../assets/images/megamenu/Sub catogory Webp/Wearable Tech copy.webp';

// Home Appliances
import KitchenAppliances from '../../assets/images/megamenu/Sub catogory Webp/Kitchen Appliances copy.webp';
import CleaningAppliances from '../../assets/images/megamenu/Sub catogory Webp//Cleaning Appliances copy.webp';
import LaundryAppliances from '../../assets/images/megamenu/Sub catogory Webp/Laundry Appliances copy.webp';
import HeatingCooling from '../../assets/images/megamenu/Sub catogory Webp/Heating & Cooling Appliances copy.webp';
import AirPurifiers from '../../assets/images/megamenu/Sub catogory Webp/Air Quality & Purifiers copy.webp';
import PersonalCareAppliances from '../../assets/images/megamenu/Sub catogory Webp/Personal Care Appliances copy.webp';
import HouseholdAppliances from '../../assets/images/megamenu/Sub catogory Webp/Household Appliances copy.webp';

// Furniture & Home Living
import BedroomFurniture from '../../assets/images/megamenu/Sub catogory Webp/Bedroom Furniture copy.webp';
import LivingRoomFurniture from '../../assets/images/megamenu/Sub catogory Webp/Living Room Furniture copy.webp';
import DiningRoomFurniture from '../../assets/images/megamenu/Sub catogory Webp/Dining Room Furniture copy.webp';
import OfficeFurniture from '../../assets/images/megamenu/Sub catogory Webp/Office Furniture copy.webp';
import OutdoorFurniture from '../../assets/images/megamenu/Sub catogory Webp/Outdoor Furniture copy.webp';
import BeddingLinens from '../../assets/images/megamenu/Sub catogory Webp/Bedding & Linens copy.webp';
import HomeOfficeEssentials from '../../assets/images/megamenu/Sub catogory Webp/Home Office Essentials copy.webp';
import KitchenDiningFurniture from '../../assets/images/megamenu/Sub catogory Webp/Kitchen & Dining Furniture copy.webp';
import StorageOrganization from '../../assets/images/megamenu/Sub catogory Webp/Storage & Organization copy.webp';


// ------------------ Home Improvement & Tools ------------------
import PlumbingSupplies from '../../assets/images/megamenu/Sub catogory Webp/Plumbing Supplies copy.webp';
import ElectricalSupplies from '../../assets/images/megamenu/Sub catogory Webp/Electrical Equipment & Supplies copy.webp';
import HardwareTools from '../../assets/images/megamenu/Sub catogory Webp/Hardware Tools & Fasteners copy.webp';
import PaintingSupplies from '../../assets/images/megamenu/Sub catogory Webp/Painting Supplies & Wall Treatments copy.webp';
import BathroomFixtures from '../../assets/images/megamenu/Sub catogory Webp/Bathroom Fixtures & Accessories copy.webp';
import Lighting from '../../assets/images/megamenu/Sub catogory Webp/Lighting & Light Bulbs copy.webp';
import SmartHomeDevices from '../../assets/images/megamenu/Sub catogory Webp/Smart Home Devices copy.webp';
import HandPowerTools from '../../assets/images/megamenu/Sub catogory Webp/Hand Tools & Power Tools copy.webp';
import MeasurementTools from '../../assets/images/megamenu/Sub catogory Webp/Measurement & Analysis Tools copy.webp';
import WeldingIndustrial from '../../assets/images/megamenu/Sub catogory Webp/Welding & Industrial Equipment copy.webp';
import GardeningTools from '../../assets/images/megamenu/Sub catogory Webp/Gardening Tools & Supplies copy.webp';

// ------------------ Men’s Clothing ------------------
import MensTShirtsShirts from '../../assets/images/megamenu/Sub catogory Webp/T-Shirts & Shirts copy.webp';
import MensPantsJeans from '../../assets/images/megamenu/Sub catogory Webp/Pants & Jeans copy.webp';
import MensJacketsOuterwear from '../../assets/images/megamenu/Sub catogory Webp/Jackets & Outerwear copy.webp';
import MensSweatersHoodies from '../../assets/images/megamenu/Sub catogory Webp/Sweaters & Hoodies copy.webp';
import MensBlazersSuits from '../../assets/images/megamenu/Sub catogory Webp/Blazers & Suits copy.webp';
import MensShorts from '../../assets/images/megamenu/Sub catogory Webp/Shorts-1 copy.webp';
// import MensWinterWear from '../../assets/images/megamenu/Sub catogory Webp/'; 
import MensClothingSets from '../../assets/images/megamenu/Sub catogory Webp/Clothing Sets copy.webp';
import MensNewArrivals from '../../assets/images/megamenu/Sub catogory Webp/New Arrivals copy.webp';

// ------------------ Women’s Clothing ------------------
import WomensDressesGowns from '../../assets/images/megamenu/Sub catogory Webp/Dresses & Gowns copy.webp';
import WomensTopsBlouses from '../../assets/images/megamenu/Sub catogory Webp/Tops & Blouses copy.webp';
import WomensBottoms from '../../assets/images/megamenu/Sub catogory Webp/Bottoms (Skirts, Pants) copy.webp';
import WomensOuterwearJackets from '../../assets/images/megamenu/Sub catogory Webp/Outerwear & Jackets copy.webp';
import WomensCurvePlus from '../../assets/images/megamenu/Sub catogory Webp/Curve & Plus Size Clothing copy.webp';
import WomensSwimwear from '../../assets/images/megamenu/Sub catogory Webp/Swimwear copy.webp';
import WomensWeddingDresses from '../../assets/images/megamenu/Sub catogory Webp/Wedding Dresses copy.webp';
import WomensSpecialOccasion from '../../assets/images/megamenu/Sub catogory Webp/Special Occasion Dresses copy.webp';
import WomensMatchingSets from '../../assets/images/megamenu/Sub catogory Webp/Matching Sets copy.webp';
import WomensNewArrivals from '../../assets/images/megamenu/Sub catogory Webp/New Arrivals-2 copy.webp';

// ------------------ Lingerie & Loungewear ------------------
import BrasPanties from '../../assets/images/megamenu/Sub catogory Webp/Bras & Panties copy.webp';
import Shapewear from '../../assets/images/megamenu/Sub catogory Webp/Shapewear copy.webp';
import SleepLounge from '../../assets/images/megamenu/Sub catogory Webp/Sleep & Lounge copy.webp';
import SocksHosiery from '../../assets/images/megamenu/Sub catogory Webp/Socks & Hosiery copy.webp';
import MensUnderwear from '../../assets/images/megamenu/Sub catogory Webp/MenUnderwear copy.webp';
import LingerieNewArrivals from '../../assets/images/megamenu/Sub catogory Webp/New Arrivals-1 copy.webp';

// ------------------ Accessories ------------------
import Bags from '../../assets/images/megamenu/Sub catogory Webp/Bags (Handbags, Shoulder Bags, Travel Bags, Wallets, Backpacks, Multi-purpose Bags) copy.webp';
import Belts from '../../assets/images/megamenu/Sub catogory Webp/Belts copy.webp';
import SunglassesEyewear from '../../assets/images/megamenu/Sub catogory Webp/Sunglasses & Eyewear copy.webp';
import ScarvesGloves from '../../assets/images/megamenu/Sub catogory Webp/Scarves & Gloves copy.webp';
import HatsHeadwear from '../../assets/images/megamenu/Sub catogory Webp/Hats & Headwear copy.webp';
import JewelryWatches from '../../assets/images/megamenu/Sub catogory Webp/Jewelry & Watches copy.webp';
import Necklaces from '../../assets/images/megamenu/Sub catogory Webp/Necklaces copy.webp';
import Earrings from '../../assets/images/megamenu/Sub catogory Webp/Earrings copy.webp';
import BraceletsBangles from '../../assets/images/megamenu/Sub catogory Webp/Bracelets & Bangles copy.webp';
import MensWatches from '../../assets/images/megamenu/Sub catogory Webp/MenWatches copy.webp';
import WomensWatches from '../../assets/images/megamenu/Sub catogory Webp/WomenWatches copy.webp';
import BodyJewelry from '../../assets/images/megamenu/Sub catogory Webp/Body Jewelry copy.webp';

// ------------------ Beauty & Personal Care ------------------
import MakeupCosmetics from '../../assets/images/megamenu/Sub catogory Webp/Makeup & Cosmetics copy.webp';
import SkincareHaircare from '../../assets/images/megamenu/Sub catogory Webp/Skincare & Haircare copy.webp';
import HairExtensionsWigs from '../../assets/images/megamenu/Sub catogory Webp/Hair Extensions & Wigs copy.webp';
import HairToolsAccessories from '../../assets/images/megamenu/Sub catogory Webp/Hair Tools & Accessories copy.webp';
import MassageRelaxation from '../../assets/images/megamenu/Sub catogory Webp/Massage & Relaxation copy.webp';
import DentalCareSupplies from '../../assets/images/megamenu/Sub catogory Webp/Dental Care Supplies copy.webp';
import TattooBodyArt from '../../assets/images/megamenu/Sub catogory Webp/Tattoo & Body Art copy.webp';

// ------------------ Shoes & Footwear ------------------
import WomensBoots from '../../assets/images/megamenu/Sub catogory Webp/WomenBoots copy.webp';
import WomensSandalsSlippers from '../../assets/images/megamenu/Sub catogory Webp/Women Sandals & Slippers copy.webp';
import PumpsHeels from '../../assets/images/megamenu/Sub catogory Webp/Pumps & Heels copy.webp';
import WomensCasualShoes from '../../assets/images/megamenu/Sub catogory Webp/Womenasual Shoes copy.webp';
import MensCasualShoes from '../../assets/images/megamenu/Sub catogory Webp/MenCasual Shoes copy.webp';
import MensSandalsSlippers from '../../assets/images/megamenu/Sub catogory Webp/MenSandals & Slippers copy.webp';
import MensBoots from '../../assets/images/megamenu/Sub catogory Webp/MenBoots copy.webp';
import BusinessShoes from '../../assets/images/megamenu/Sub catogory Webp/Business Shoes copy.webp';
import ShoeAccessories from '../../assets/images/megamenu/Sub catogory Webp/Shoe Accessories copy.webp';

// ------------------ Baby, Kids & Maternity ------------------
import BabyClothing from '../../assets/images/megamenu/Sub catogory Webp/Baby Clothing copy.webp';
import KidsClothing from '../../assets/images/megamenu/Sub catogory Webp/KidsClothing copy.webp';
import FeedingNursing from '../../assets/images/megamenu/Sub catogory Webp/Feeding & Nursing copy.webp';
import BabyKidsShoes from '../../assets/images/megamenu/Sub catogory Webp/Baby Shoes Shoes copy.webp';
import NurseryFurniture from '../../assets/images/megamenu/Sub catogory Webp/Nursery & Baby Furniture copy.webp';
import BabyCareHygiene from '../../assets/images/megamenu/Sub catogory Webp/Baby Care & Hygiene copy.webp';
import ActivityGear from '../../assets/images/megamenu/Sub catogory Webp/Activity Gear & Baby Carriers copy.webp';
import KidsAccessories from '../../assets/images/megamenu/Sub catogory Webp/KidsΓÇÖ Accessories copy.webp';
import BedLinens from '../../assets/images/megamenu/Sub catogory Webp/Bed Linens copy.webp';



// ------------------ Toys, Games & Entertainment ------------------
import EducationalToys from '../../assets/images/megamenu/Sub catogory Webp/Learning & Educational Toys copy.webp';
import DollsAccessories from '../../assets/images/megamenu/Sub catogory Webp/Dolls & Accessories copy.webp';
import RemoteControlToys from '../../assets/images/megamenu/Sub catogory Webp/Remote Control Toys copy.webp';
import BuildingSets from '../../assets/images/megamenu/Sub catogory Webp/Building & Construction Sets copy.webp';
import ActionFigures from '../../assets/images/megamenu/Sub catogory Webp/Action Figures & Collectibles copy.webp';
import SportsOutdoorToys from '../../assets/images/megamenu/Sub catogory Webp/Sports & Outdoor Toys copy.webp';
import PoolsWater from '../../assets/images/megamenu/Sub catogory Webp/Pools & Water Activities copy.webp';
import ElectronicToys from '../../assets/images/megamenu/Sub catogory Webp/Electronic Toys copy.webp';
import KidsGifts from '../../assets/images/megamenu/Sub catogory Webp/KidsΓÇÖ Gifts copy.webp';

// ------------------ Sports, Outdoors & Hobbies ------------------
import HikingCamping from '../../assets/images/megamenu/Sub catogory Webp/Hiking & Camping copy.webp';
import FishingKayaking from '../../assets/images/megamenu/Sub catogory Webp/Fishing & Kayaking copy.webp';
import CyclingBiking from '../../assets/images/megamenu/Sub catogory Webp/Cycling & Biking copy.webp';
import RacquetSports from '../../assets/images/megamenu/Sub catogory Webp/Racquet Sports copy.webp';
import StrengthTraining from '../../assets/images/megamenu/Sub catogory Webp/Strength Training & Gym Equipment copy.webp';
import CardioTraining from '../../assets/images/megamenu/Sub catogory Webp/Cardio Training Equipment copy.webp';
import MusicalInstruments from '../../assets/images/megamenu/Sub catogory Webp/Musical Instruments copy.webp';
import HobbyCollectibles from '../../assets/images/megamenu/Sub catogory Webp/Hobby & Collectibles copy.webp';

// ------------------ Automotive & Motorcycle ------------------
import CarWashMaintenance from '../../assets/images/megamenu/Sub catogory Webp/Car Wash & Maintenance copy.webp';
import CarElectronics from '../../assets/images/megamenu/Sub catogory Webp/Car Electronics & Lights copy.webp';
import CarInterior from '../../assets/images/megamenu/Sub catogory Webp/Car Interior Accessories copy.webp';
import CarExterior from '../../assets/images/megamenu/Sub catogory Webp/Car Exterior Accessories copy.webp';
import CarRepairTools from '../../assets/images/megamenu/Sub catogory Webp/Car Repair Tools copy.webp';
import MotorcycleGearHelmets from '../../assets/images/megamenu/Sub catogory Webp/Motorcycle Parts & Accessories copy.webp';
import MotorcycleParts from '../../assets/images/megamenu/Sub catogory Webp/Motorcycle Parts & Accessories copy.webp';
import ATVOffroad from '../../assets/images/megamenu/Sub catogory Webp/ATV & Off-road Accessories copy.webp';

// ------------------ Security & Safety ------------------
import VideoSurveillance from '../../assets/images/megamenu/Sub catogory Webp/Video Surveillance Systems copy.webp';
import AccessControl from '../../assets/images/megamenu/Sub catogory Webp/Access Control Systems copy.webp';
import WorkplaceSafety from '../../assets/images/megamenu/Sub catogory Webp/Workplace Safety Supplies copy.webp';
import HomeSafes from '../../assets/images/megamenu/Sub catogory Webp/Home Safes & Security Accessories copy.webp';
import EmergencySelfDefense from '../../assets/images/megamenu/Sub catogory Webp/Emergency Kits & Self-Defense copy.webp';
import AlarmSensors from '../../assets/images/megamenu/Sub catogory Webp/Alarm Sensors copy.webp';
import IntercomSystems from '../../assets/images/megamenu/Sub catogory Webp/Intercom Systems copy.webp';

// ------------------ Pet Supplies ------------------
import Dogs from '../../assets/images/megamenu/Sub catogory Webp/Dogs copy.webp';
import Cats from '../../assets/images/megamenu/Sub catogory Webp/Cats copy.webp';
import FishAquatic from '../../assets/images/megamenu/Sub catogory Webp/Fish & Aquatic Pets copy.webp';
import Birds from '../../assets/images/megamenu/Sub catogory Webp/Birds copy.webp';
import SmallAnimals from '../../assets/images/megamenu/Sub catogory Webp/Small Animals copy.webp';
import ReptilesAmphibians from '../../assets/images/megamenu/Sub catogory Webp/Reptiles & Amphibians copy.webp';
import FarmAnimals from '../../assets/images/megamenu/Sub catogory Webp/Farm Animals copy.webp';

// ------------------ Special Occasion & Costumes ------------------
import CosplayCostumes from '../../assets/images/megamenu/Sub catogory Webp/Cosplay Costumes copy.webp';
import DancewearStage from '../../assets/images/megamenu/Sub catogory Webp/Dancewear & Stage Outfits copy.webp';
import CulturalTraditional from '../../assets/images/megamenu/Sub catogory Webp/Cultural & Traditional Clothing copy.webp';
import WorkwearUniforms from '../../assets/images/megamenu/Sub catogory Webp/Workwear & Uniforms copy.webp';





// MANUAL DATA
const categories = [

  {
    id: 1,
    name: "Electronics & Smart Devices",
    subCategories: [
      { id: 101, name: "Mobile Phones", image: MobilePhones, path: "/electronics/mobiles", metaTitle: "Buy Electronics & Smart Devices Online | Store1920", metaDescription: "Shop the latest smartphones, laptops, cameras, and smart home devices at Store1920. Great prices, fast delivery, and trusted quality." },
      { id: 102, name: "Phone Accessories", image: PhoneAccessories, path: "/electronics/phone-accessories" },
      { id: 103, name: "Phone Parts & Repair", image: PhonePartsRepair, path: "/electronics/phone-parts-repair" },
      { id: 104, name: "Smart Electronics & Smart Home", image: SmartHome, path: "/electronics/smart-home" },
      { id: 105, name: "Home Audio & Video", image: HomeAudioVideo, path: "/electronics/home-audio-video" },
      { id: 106, name: "Portable Audio & Video", image: PortableAudioVideo, path: "/electronics/portable-audio-video" },
      { id: 107, name: "Cameras & Photography", image: CamerasPhotography, path: "/electronics/cameras" },
      { id: 108, name: "Games & Gaming Accessories", image: GamesGaming, path: "/electronics/gaming" },
      { id: 109, name: "Computer Components & Desktops", image: ComputerComponents, path: "/electronics/computer-components" },
      { id: 110, name: "Laptops & Tablets", image: LaptopsTablets, path: "/electronics/laptops" },
      { id: 111, name: "Networking & Communication", image: Networking, path: "/electronics/networking" },
      { id: 112, name: "Wearable Tech", image: WearableTech, path: "/electronics/wearables" }
    ]
  },
  
  
    // Home Appliances
    {
      id: 2,
      name: "Home Appliances",
      subCategories: [
        { id: 201, name: "Kitchen Appliances", image: KitchenAppliances, path: "/home-appliances/kitchen", metaTitle: "Home Appliances Online – Kitchen, Cleaning & More | Store1920", metaDescription: "Find kitchen, laundry, and cleaning appliances at Store1920. Premium brands, affordable prices, and fast UAE delivery." },
        { id: 202, name: "Cleaning Appliances", image: CleaningAppliances, path: "/home-appliances/cleaning" },
        { id: 203, name: "Laundry Appliances", image: LaundryAppliances, path: "/home-appliances/laundry" },
        { id: 204, name: "Heating & Cooling Appliances", image: HeatingCooling, path: "/home-appliances/heating-cooling" },
        { id: 205, name: "Air Quality & Purifiers", image: AirPurifiers, path: "/home-appliances/air-quality" },
        { id: 206, name: "Personal Care Appliances", image: PersonalCareAppliances, path: "/home-appliances/personal-care" },
        { id: 207, name: "Household Appliances", image: HouseholdAppliances, path: "/home-appliances/household" }
      ]
    },
    
    // Home Improvement
    {
      id: 3,
      name: "Home Improvement & Tools",
      subCategories: [
        { id: 301, name: "Plumbing Supplies", image: PlumbingSupplies, path: "/home-improvement/plumbing", metaTitle: "Buy Home Improvement Tools & Hardware Online | Store1920", metaDescription: "Discover power tools, plumbing, electrical supplies, and hardware at Store1920. Shop durable home improvement products with quick delivery." },
        { id: 302, name: "Electrical Equipment & Supplies", image: ElectricalSupplies, path: "/home-improvement/electrical" },
        { id: 303, name: "Hardware Tools & Fasteners", image: HardwareTools, path: "/home-improvement/hardware" },
        { id: 304, name: "Painting Supplies & Wall Treatments", image: PaintingSupplies, path: "/home-improvement/painting" },
        { id: 305, name: "Bathroom Fixtures & Accessories", image: BathroomFixtures, path: "/home-improvement/bathroom" },
        { id: 306, name: "Lighting & Light Bulbs", image: Lighting, path: "/home-improvement/lighting" },
        { id: 307, name: "Smart Home Devices", image: SmartHomeDevices, path: "/home-improvement/smart-home" },
        { id: 308, name: "Hand Tools & Power Tools", image: HandPowerTools, path: "/home-improvement/tools" },
        { id: 309, name: "Measurement & Analysis Tools", image: MeasurementTools, path: "/home-improvement/measurement" },
        { id: 310, name: "Welding & Industrial Equipment", image: WeldingIndustrial, path: "/home-improvement/welding" },
        { id: 311, name: "Gardening Tools & Supplies", image: GardeningTools, path: "/home-improvement/gardening" }
      ]
    },
    
  
    // Furniture
    {
      id: 4,
      name: "Furniture & Home Living",
      subCategories: [
        { id: 401, name: "Bedroom Furniture", image: BedroomFurniture, path: "/furniture/bedroom", metaTitle: "Furniture & Home Living Online – Stylish & Affordable | Store1920", metaDescription: "Explore bedroom, living room, and office furniture at Store1920. Quality designs for every home with fast shipping." },
        { id: 402, name: "Living Room Furniture", image: LivingRoomFurniture, path: "/furniture/living-room" },
        { id: 403, name: "Dining Room Furniture", image: DiningRoomFurniture, path: "/furniture/dining-room" },
        { id: 404, name: "Office Furniture", image: OfficeFurniture, path: "/furniture/office" },
        { id: 405, name: "Outdoor Furniture", image: OutdoorFurniture, path: "/furniture/outdoor" },
        { id: 406, name: "Bedding & Linens", image: BeddingLinens, path: "/furniture/bedding" },
        { id: 407, name: "Home Office Essentials", image: HomeOfficeEssentials, path: "/furniture/home-office" },
        { id: 408, name: "Kitchen & Dining Furniture", image: KitchenDiningFurniture, path: "/furniture/kitchen-dining" },
        { id: 409, name: "Storage & Organization", image: StorageOrganization, path: "/furniture/storage" }
      ]
    },
    
  
    // Men’s Clothing
    {
      id: 5,
      name: "Men’s Clothing",
      subCategories: [
        { id: 501, name: "T-Shirts & Shirts", image: MensTShirtsShirts, path: "/mens-clothing/t-shirts", metaTitle: "Men’s Clothing Online – Shirts, Jackets & Suits | Store1920", metaDescription: "Upgrade your wardrobe with men’s fashion at Store1920. Shop shirts, jeans, jackets, suits, and more at great prices." },
        { id: 502, name: "Pants & Jeans", image: MensPantsJeans, path: "/mens-clothing/pants" },
        { id: 503, name: "Jackets & Outerwear", image: MensJacketsOuterwear, path: "/mens-clothing/jackets" },
        { id: 504, name: "Sweaters & Hoodies", image: MensSweatersHoodies, path: "/mens-clothing/sweaters" },
        { id: 505, name: "Blazers & Suits", image: MensBlazersSuits, path: "/mens-clothing/blazers" },
        { id: 506, name: "Shorts", image: MensShorts, path: "/mens-clothing/shorts" },
        // { id: 507, name: "Winter Wear & Down Jackets", image: MensWinterWear, path: "/mens-clothing/winter" },
        { id: 508, name: "Clothing Sets", image: MensClothingSets, path: "/mens-clothing/sets" },
        { id: 509, name: "New Arrivals", image: MensNewArrivals, path: "/mens-clothing/new-arrivals" }
      ]
    },
    
  
    // Women’s Clothing
    {
      id: 6,
      name: "Women’s Clothing",
      subCategories: [
        { id: 601, name: "Dresses & Gowns", image: WomensDressesGowns, path: "/womens-clothing/dresses", metaTitle: "Women’s Clothing Online – Dresses, Tops & Outerwear | Store1920", metaDescription: "Discover stylish women’s fashion at Store1920. Shop dresses, blouses, skirts, and outerwear with trendy new arrivals." },
        { id: 602, name: "Tops & Blouses", image: WomensTopsBlouses, path: "/womens-clothing/tops" },
        { id: 603, name: "Bottoms (Skirts, Pants)", image: WomensBottoms, path: "/womens-clothing/bottoms" },
        { id: 604, name: "Outerwear & Jackets", image: WomensOuterwearJackets, path: "/womens-clothing/outerwear" },
        { id: 605, name: "Curve & Plus Size Clothing", image: WomensCurvePlus, path: "/womens-clothing/curve-plus" },
        { id: 606, name: "Swimwear", image: WomensSwimwear, path: "/womens-clothing/swimwear" },
        { id: 607, name: "Wedding Dresses", image: WomensWeddingDresses, path: "/womens-clothing/wedding-dresses" },
        { id: 608, name: "Special Occasion Dresses", image: WomensSpecialOccasion, path: "/womens-clothing/special-occasion" },
        { id: 609, name: "Matching Sets", image: WomensMatchingSets, path: "/womens-clothing/matching-sets" },
        { id: 610, name: "New Arrivals", image: WomensNewArrivals, path: "/womens-clothing/new-arrivals" }
      ]
    },
    
    {
      id: 7,
      name: "Lingerie & Loungewear",
      subCategories: [
        { id: 701, name: "Bras & Panties", image: BrasPanties, path: "/lingerie/bras-panties", metaTitle: "Lingerie & Loungewear Online – Bras, Sleepwear | Store1920", metaDescription: "Shop lingerie, bras, panties, shapewear, and nightwear at Store1920. Comfortable, stylish, and affordable." },
        { id: 702, name: "Shapewear", image: Shapewear, path: "/lingerie/shapewear" },
        { id: 703, name: "Sleep & Lounge", image: SleepLounge, path: "/lingerie/sleep-lounge" },
        { id: 704, name: "Socks & Hosiery", image: SocksHosiery, path: "/lingerie/socks-hosiery" },
        { id: 705, name: "Men’s Underwear", image: MensUnderwear, path: "/lingerie/mens-underwear" },
        { id: 706, name: "New Arrivals", image: LingerieNewArrivals, path: "/lingerie/new-arrivals" }
      ]
    },
    
    {
      id: 8,
      name: "Accessories",
      subCategories: [
        { id: 801, name: "Bags", image: Bags, path: "/accessories/bags", metaTitle: "Fashion Accessories – Bags, Watches & Jewelry | Store1920", metaDescription: "Complete your look with stylish bags, watches, sunglasses, and jewelry. Shop premium accessories online at Store1920." },
        { id: 802, name: "Belts", image: Belts, path: "/accessories/belts" },
        { id: 803, name: "Sunglasses & Eyewear", image: SunglassesEyewear, path: "/accessories/sunglasses" },
        { id: 804, name: "Scarves & Gloves", image: ScarvesGloves, path: "/accessories/scarves-gloves" },
        { id: 805, name: "Hats & Headwear", image: HatsHeadwear, path: "/accessories/hats-headwear" },
        { id: 806, name: "Jewelry & Watches", image: JewelryWatches, path: "/accessories/jewelry-watches" },
        { id: 807, name: "Necklaces", image: Necklaces, path: "/accessories/necklaces" },
        { id: 808, name: "Earrings", image: Earrings, path: "/accessories/earrings" },
        { id: 809, name: "Bracelets & Bangles", image: BraceletsBangles, path: "/accessories/bracelets-bangles" },
        { id: 810, name: "Men’s Watches", image: MensWatches, path: "/accessories/mens-watches" },
        { id: 811, name: "Women’s Watches", image: WomensWatches, path: "/accessories/womens-watches" },
        { id: 812, name: "Body Jewelry", image: BodyJewelry, path: "/accessories/body-jewelry" }
      ]
    },
    
  
    {
      id: 9,
      name: "Beauty & Personal Care",
      subCategories: [
        { id: 901, name: "Makeup & Cosmetics", image: MakeupCosmetics, path: "/beauty/makeup", metaTitle: "Beauty & Personal Care Products Online | Store1920", metaDescription: "Explore skincare, makeup, haircare, and grooming products at Store1920. Shop trusted brands with fast shipping." },
        { id: 902, name: "Skincare & Haircare", image: SkincareHaircare, path: "/beauty/skincare-haircare" },
        { id: 903, name: "Hair Extensions & Wigs", image: HairExtensionsWigs, path: "/beauty/hair-extensions-wigs" },
        { id: 904, name: "Hair Tools & Accessories", image: HairToolsAccessories, path: "/beauty/hair-tools" },
        { id: 905, name: "Massage & Relaxation", image: MassageRelaxation, path: "/beauty/massage-relaxation" },
        { id: 906, name: "Dental Care Supplies", image: DentalCareSupplies, path: "/beauty/dental-care" },
        { id: 907, name: "Tattoo & Body Art", image: TattooBodyArt, path: "/beauty/tattoo-body-art" }
      ]
    },
    
  
    {
      id: 10,
      name: "Shoes & Footwear",
      subCategories: [
        { id: 1001, name: "Women’s Boots", image: WomensBoots, path: "/shoes/womens-boots", metaTitle: "Shoes & Footwear – Men’s & Women’s Styles | Store1920", metaDescription: "Find sneakers, heels, boots, and sandals for men and women at Store1920. Shop trendy footwear with comfort and style." },
        { id: 1002, name: "Women’s Sandals & Slippers", image: WomensSandalsSlippers, path: "/shoes/womens-sandals" },
        { id: 1003, name: "Pumps & Heels", image: PumpsHeels, path: "/shoes/pumps-heels" },
        { id: 1004, name: "Women’s Casual Shoes", image: WomensCasualShoes, path: "/shoes/womens-casual" },
        { id: 1005, name: "Men’s Casual Shoes", image: MensCasualShoes, path: "/shoes/mens-casual" },
        { id: 1006, name: "Men’s Sandals & Slippers", image: MensSandalsSlippers, path: "/shoes/mens-sandals" },
        { id: 1007, name: "Men’s Boots", image: MensBoots, path: "/shoes/mens-boots" },
        { id: 1008, name: "Business Shoes", image: BusinessShoes, path: "/shoes/business-shoes" },
        { id: 1009, name: "Shoe Accessories", image: ShoeAccessories, path: "/shoes/accessories" }
      ]
    },
    
    {
      id: 11,
      name: "Baby, Kids & Maternity",
      subCategories: [
        { id: 1101, name: "Baby Clothing", image: BabyClothing, path: "/baby-kids/baby-clothing", metaTitle: "Baby, Kids & Maternity Products Online | Store1920", metaDescription: "Shop baby clothing, kids’ shoes, maternity wear, and nursery essentials at Store1920. Quality products for every stage." },
        { id: 1102, name: "Kids’ Clothing", image: KidsClothing, path: "/baby-kids/kids-clothing" },
        { id: 1103, name: "Feeding & Nursing", image: FeedingNursing, path: "/baby-kids/feeding-nursing" },
        { id: 1104, name: "Baby Shoes & Kids’ Shoes", image: BabyKidsShoes, path: "/baby-kids/shoes" },
        { id: 1105, name: "Nursery & Baby Furniture", image: NurseryFurniture, path: "/baby-kids/nursery-furniture" },
        { id: 1106, name: "Baby Care & Hygiene", image: BabyCareHygiene, path: "/baby-kids/care-hygiene" },
        { id: 1107, name: "Activity Gear & Baby Carriers", image: ActivityGear, path: "/baby-kids/activity-gear" },
        { id: 1108, name: "Kids’ Accessories", image: KidsAccessories, path: "/baby-kids/accessories" },
        { id: 1109, name: "Bed Linens", image: BedLinens, path: "/baby-kids/bed-linens" }
      ]
    },
    
    {
      id: 12,
      name: "Toys, Games & Entertainment",
      subCategories: [
        { id: 1201, name: "Learning & Educational Toys", image: EducationalToys, path: "/toys/learning-educational", metaTitle: "Toys, Games & Entertainment for Kids Online | Store1920", metaDescription: "Buy educational toys, dolls, remote control cars, and games at Store1920. Perfect for kids of all ages." },
        { id: 1202, name: "Dolls & Accessories", image: DollsAccessories, path: "/toys/dolls-accessories" },
        { id: 1203, name: "Remote Control Toys", image: RemoteControlToys, path: "/toys/remote-control" },
        { id: 1204, name: "Building & Construction Sets", image: BuildingSets, path: "/toys/building-sets" },
        { id: 1205, name: "Action Figures & Collectibles", image: ActionFigures, path: "/toys/action-figures" },
        { id: 1206, name: "Sports & Outdoor Toys", image: SportsOutdoorToys, path: "/toys/sports-outdoor" },
        { id: 1207, name: "Pools & Water Activities", image: PoolsWater, path: "/toys/pools-water" },
        { id: 1208, name: "Electronic Toys", image: ElectronicToys, path: "/toys/electronic" },
        { id: 1209, name: "Kids’ Gifts", image: KidsGifts, path: "/toys/kids-gifts" }
      ]
    },
    
    {
      id: 13,
      name: "Sports, Outdoors & Hobbies",
      subCategories: [
        { id: 1301, name: "Hiking & Camping", image: HikingCamping, path: "/sports/hiking-camping", metaTitle: "Sports & Outdoor Gear – Fitness & Hobbies | Store1920", metaDescription: "Discover camping, cycling, gym, and sports equipment at Store1920. Quality gear for outdoor and indoor activities." },
        { id: 1302, name: "Fishing & Kayaking", image: FishingKayaking, path: "/sports/fishing-kayaking" },
        { id: 1303, name: "Cycling & Biking", image: CyclingBiking, path: "/sports/cycling-biking" },
        { id: 1304, name: "Racquet Sports", image: RacquetSports, path: "/sports/racquet" },
        { id: 1305, name: "Strength Training & Gym Equipment", image: StrengthTraining, path: "/sports/strength-training" },
        { id: 1306, name: "Cardio Training Equipment", image: CardioTraining, path: "/sports/cardio-training" },
        { id: 1307, name: "Musical Instruments", image: MusicalInstruments, path: "/sports/musical-instruments" },
        { id: 1308, name: "Hobby & Collectibles", image: HobbyCollectibles, path: "/sports/hobby-collectibles" }
      ]
    },
    
    {
      id: 14,
      name: "Automotive & Motorcycle",
      subCategories: [
        { id: 1401, name: "Car Wash & Maintenance", image: CarWashMaintenance, path: "/automotive/car-wash", metaTitle: "Automotive & Motorcycle Accessories Online | Store1920", metaDescription: "Shop car electronics, motorcycle gear, and repair tools at Store1920. Everything you need for vehicle care." },
        { id: 1402, name: "Car Electronics & Lights", image: CarElectronics, path: "/automotive/car-electronics" },
        { id: 1403, name: "Car Interior Accessories", image: CarInterior, path: "/automotive/interior-accessories" },
        { id: 1404, name: "Car Exterior Accessories", image: CarExterior, path: "/automotive/exterior-accessories" },
        { id: 1405, name: "Car Repair Tools", image: CarRepairTools, path: "/automotive/repair-tools" },
        { id: 1406, name: "Motorcycle Gear & Helmets", image: MotorcycleGearHelmets, path: "/motorcycle/gear-helmets" },
        { id: 1407, name: "Motorcycle Parts & Accessories", image: MotorcycleParts, path: "/motorcycle/parts-accessories" },
        { id: 1408, name: "ATV & Off-road Accessories", image: ATVOffroad, path: "/motorcycle/atv-offroad" }
      ]
    },
    
    {
      id: 15,
      name: "Security & Safety",
      subCategories: [
        { id: 1501, name: "Video Surveillance Systems", image: VideoSurveillance, path: "/security/video-surveillance", metaTitle: "Security & Safety Products – Home & Workplace | Store1920", metaDescription: "Protect your home and business with CCTV, alarms, and safety gear from Store1920. Affordable and reliable security solutions." },
        { id: 1502, name: "Access Control Systems", image: AccessControl, path: "/security/access-control" },
        { id: 1503, name: "Workplace Safety Supplies", image: WorkplaceSafety, path: "/security/workplace-safety" },
        { id: 1504, name: "Home Safes & Security Accessories", image: HomeSafes, path: "/security/home-safes" },
        { id: 1505, name: "Emergency Kits & Self-Defense", image: EmergencySelfDefense, path: "/security/emergency-selfdefense" },
        { id: 1506, name: "Alarm Sensors", image: AlarmSensors, path: "/security/alarm-sensors" },
        { id: 1507, name: "Intercom Systems", image: IntercomSystems, path: "/security/intercom-systems" }
      ]
    },
    
  
    {
      id: 16,
      name: "Pet Supplies",
      subCategories: [
        { id: 1601, name: "Dogs", image: Dogs, path: "/pets/dogs", metaTitle: "Pet Supplies Online – Food, Toys & Accessories | Store1920", metaDescription: "Shop food, toys, and accessories for dogs, cats, birds, and more. Store1920 brings quality pet care essentials to your home." },
        { id: 1602, name: "Cats", image: Cats, path: "/pets/cats" },
        { id: 1603, name: "Fish & Aquatic Pets", image: FishAquatic, path: "/pets/fish" },
        { id: 1604, name: "Birds", image: Birds, path: "/pets/birds" },
        { id: 1605, name: "Small Animals", image: SmallAnimals, path: "/pets/small-animals" },
        { id: 1606, name: "Reptiles & Amphibians", image: ReptilesAmphibians, path: "/pets/reptiles-amphibians" },
        { id: 1607, name: "Farm Animals", image: FarmAnimals, path: "/pets/farm-animals" }
      ]
    },
    
    {
      id: 17,
      name: "Special Occasion & Costumes",
      subCategories: [
        { id: 1701, name: "Cosplay Costumes", image: CosplayCostumes, path: "/special/cosplay", metaTitle: "Find cosplay costumes, cultural outfits, dancewear, and uniforms at Store1920", metaDescription: "Perfect for every special event." },
        { id: 1702, name: "Dancewear & Stage Outfits", image: DancewearStage, path: "/special/dancewear-stage" },
        { id: 1703, name: "Cultural & Traditional Clothing", image: CulturalTraditional, path: "/special/cultural-traditional" },
        { id: 1704, name: "Workwear & Uniforms", image: WorkwearUniforms, path: "/special/workwear-uniforms" }
      ]
    }
    

  ];

  const defaultRightCategories = [
    { id: "d1", name: "Best Sellers", image:SunglassesEyewear, path: "/special/best-sellers" },
    { id: "d2", name: "Clearance Sale", image: CosplayCostumes, path: "/special/clearance-sale" },
    { id: "d3", name: "New Arrivals", image: VideoSurveillance, path: "/special/new-arrivals" },
    { id: "d4", name: "Trending Now", image:HikingCamping, path: "/special/trending" }
  ];

  const MegaMenuManual = ({ onClose }) => {
    const [activeCategory, setActiveCategory] = useState(null);
    const navigate = useNavigate();
  
    const rightCategories = activeCategory ? activeCategory.subCategories : defaultRightCategories;
  
    const styles = {
      container: {
        display: "flex",
        width: "100%",
        maxWidth: "1200px",
        borderRadius: "12px",
        background: "#fff",
        margin: "0px auto",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        overflow: "hidden",
        height: "600px",
        fontFamily: "Poppins, sans-serif"
      },
      left: {
        width: "300px",
        background: "#f5f5f5",
        borderRight: "1px solid #eee",
        padding: "20px 0",
        display: "flex",
        flexDirection: "column",
        color: "#555",
        overflowY: "auto",
        flexShrink: 0
      },
      leftItem: (isActive) => ({
        padding: "14px 18px",
        cursor: "pointer",
        margin: "5px 15px",
        borderRadius: "6px",
        whiteSpace: "nowrap",
        transition: "all 0.3s ease",
        background: isActive ? "linear-gradient(90deg, #ff6a00, #ff8c42)" : "transparent",
        color: isActive ? "#fff" : "#555",
        fontWeight: isActive ? 600 : 500
      }),
      right: {
        flex: 1,
        padding: "20px",
        overflowY: "auto",
        minWidth: 0
      },
      title: {
        fontSize: "22px",
        fontWeight: 600,
        marginBottom: "20px",
        color: "#333",
        cursor: "pointer"
      },
      grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        gap: "20px"
      },
      item: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        cursor: "pointer",
        transition: "transform 0.3s ease, boxShadow 0.3s ease",
        marginBottom: "10px"
      },
      imgBox: {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fafafa",
        border: "1px solid #eee",
        marginBottom: "10px",
        transition: "all 0.3s ease"
      },
      img: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        borderRadius: "50%"
      },
      itemName: {
        fontSize: "14px",
        fontWeight: 500,
        color: "#333",
        marginTop: "5px",
        textAlign: "center",
        display: "block"
      },
      empty: {
        color: "#999",
        fontSize: "14px",
        textAlign: "center",
        marginTop: "50px"
      }
    };
  
    return (
      <div style={styles.container}>
        {/* LEFT SIDE */}
        <div style={styles.left}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={styles.leftItem(activeCategory?.id === cat.id)}
              onMouseEnter={() => setActiveCategory(cat)}
            >
              {cat.name}
            </div>
          ))}
        </div>
  
        {/* RIGHT SIDE */}
        <div style={styles.right}>
          {rightCategories.length > 0 ? (
            <>
              {activeCategory && (
                <h2
                  style={styles.title}
                  onClick={() => {
                    navigate(`/category/${activeCategory.id}`);
                    if (onClose) onClose();
                  }}
                >
                  All {activeCategory.name} →
                </h2>
              )}
  
              <div style={styles.grid}>
                {rightCategories.map((sub) => (
                  <div
                    key={sub.id}
                    style={styles.item}
                    onClick={() => {
                      navigate(sub.path || `/category/${sub.id}`);
                      if (onClose) onClose();
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <div style={styles.imgBox}>
                      <img
                        style={styles.img}
                        src={sub.image || "https://via.placeholder.com/140?text=No+Image"}
                        alt={sub.name}
                      />
                    </div>
                    <span style={styles.itemName}>{sub.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={styles.empty}>No subcategories found</p>
          )}
        </div>
      </div>
    );
  };
  
  export default MegaMenuManual;
  