import Logo1 from '../assets/images/theme/Yellow@6x.png';
import Logo2 from '../assets//images/theme/Purple@6x.png';
import Logo3 from '../assets/images//theme/Orange@6x.png';
import Logo4 from '../assets/images/theme/Purple 2@6x.png';
import banner1 from '../assets/images/theme/banner/Banners Yellow.webp';
import banner2 from '../assets/images/theme/banner/Banners-Sky-blue.webp';
import banner3 from '../assets/images/theme/banner/Banners-orange-2.webp';
import banner4 from '../assets/images/theme/banner/Banners-purple-2.webp';

export const themes = {
  1: {
    logo: Logo1,
    navbarBg: '#000000ff',
    bannerKey: banner1,
    bannerBg: '#FDE91D', // single background color
    lightningBanner: {
      backgroundColor: '#ff3300ff',
      textColor: '#000000'
    }
  },
  2: {
    logo: Logo2,
    navbarBg: '#37AADA',
    bannerKey: banner2,
    bannerBg: '#37AADA',
    lightningBanner: {
      backgroundColor: '#1c921c',
      textColor: '#ffffff'
    }
  },
  3: {
    logo: Logo3,
    navbarBg: '#E46000',
    bannerKey: banner3,
    bannerBg: '#FD6D05',
    lightningBanner: {
      backgroundColor: '#FF8A36',
      textColor: '#ffffff'
    }
  },
  4: {
    logo: Logo4,
    navbarBg: '#B743C2',
    bannerKey: banner4,
    bannerBg: '#9f1dab',
    lightningBanner: {
      backgroundColor: '#6C3BFF',
      textColor: '#ffffff'
    }
  },
};
