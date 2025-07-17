import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/styles/breadcrumb.css'

const routeNameMap = {
  '': 'Home',
  products: 'Products',
  product: 'Product Details',
  cart: 'Cart',
  checkout: 'Checkout',
  customerprofile: 'Profile',
  wishlist: 'Wishlist',
  lightningdeal: 'Lightning Deal',
  compare: 'Compare',
  categories: 'Categories',
  category: 'Category',
  recommended: 'Recommended',
  // Add more route names as needed
};

const Breadcrumbs = () => {
  const location = useLocation();
  const { pathname } = location;

  // Split pathname and filter out empty strings
  const pathnames = pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="breadcrumb" className="breadcrumbs-nav">
      <ol>
        {/* Always show Home */}
        <li>
          <Link to="/">Home</Link>
        </li>

        {pathnames.map((segment, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          // Map known routes or prettify slug
          let name = routeNameMap[segment.toLowerCase()] || segment;
          if (!routeNameMap[segment.toLowerCase()]) {
            name = decodeURIComponent(segment).replace(/-/g, ' ');
            name = name.charAt(0).toUpperCase() + name.slice(1);
          }

          return (
            <li key={to} aria-current={isLast ? 'page' : undefined}>
              {isLast ? (
                <span>{name}</span>
              ) : (
                <Link to={to}>{name}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
