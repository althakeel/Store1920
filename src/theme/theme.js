import Logo1 from '../assets/images/Logo/8.webp'
import Logo2 from '../assets/images/Logo/4.webp'
import Logo3 from '../assets/images/Logo/3.webp'
import banner1 from '../assets/images/tempbanner/Banners Yellow.webp'
import banner2 from '../assets/images/tempbanner/Banners-Sky-blue.webp'
import banner3 from '../assets/images/tempbanner/Banners-Teal.webp'


export const themes = {
  1: {
    logo: Logo1,      // static logo
    navbarBg: '#ffae00ff',            // static navbar color
    bannerKey: banner1,       // key to fetch dynamic banners from WordPress
  },
  2: {
    logo:  Logo2,
    navbarBg: '#1c921cff',
    bannerKey: banner2,
  },
  3: {
    logo:  Logo3,
    navbarBg: '#FF8A36',
    bannerKey:banner3,
  },
};
