import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useCart } from '../../../../../contexts/CartContext';
import 'react-toastify/dist/ReactToastify.css';
import '../../../../../assets/styles/myaccount/AllOrders.css';
import axios from 'axios';
import AddressForm from '../../../../checkoutleft/AddressForm'; 
import OrderTracking from './OrderTracking';
import OrderDetailsInline from './OrderDetailsInline';
import { generateInvoicePDF } from '../../../../../utils/generateInvoice'

const AllOrders = ({
  orders,
  cancellingOrderId,
  cancelOrder,
  handleProductClick,
  slugify,
  isCancelable,
  onOrdersUpdated, // optional callback to refresh orders after address update
}) => {
  const [buyingAgainOrderId, setBuyingAgainOrderId] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null); // store order being edited
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [detailedOrder, setDetailedOrder] = useState(null); // NEW: full order detail view

  const { addToCart } = useCart();

  const getExpectedDeliveryDate = (order) => {
    try {
      const date = new Date(order.date_created);
      date.setDate(date.getDate() + 7);
      return date.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };


const downloadInvoice = async (orderId) => {
  try {
    const res = await axios.get(`/wp-json/custom/v1/download-invoice/${orderId}`);
    if (res.data.url) {
      const link = document.createElement('a');
      link.href = res.data.url;
      link.download = `Invoice_PO-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Invoice downloaded!');
    } else {
      toast.error('Invoice not found');
    }
  } catch (err) {
    console.error(err);
    toast.error('Failed to download invoice');
  }
};


  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const orderStatusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    completed: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
    failed: 'Failed',
  };

  const orderStatusColors = {
    pending: '#ff4800ff',     // orange
    confirmed: '#28a745',     // green
    processing: '#007bff',    // blue
    completed: '#007bff',     // blue
    cancelled: '#6c757d',     // gray
    refunded: '#17a2b8',      // teal
    failed: '#dc3545',        // red
  };

  const handleBuyAgain = async (lineItems, orderId) => {
    try {
      setBuyingAgainOrderId(orderId);
      for (const item of lineItems) {
        addToCart({
          id: item.product_id,
          name: item.name,
          quantity: item.quantity,
          variation: item.variation || [],
          price: item.price,
          image: item.image?.src,
        }, false);
      }
      toast.success('Items added to cart!');
    } catch (err) {
      console.error('Error adding items:', err);
      toast.error('Failed to add items to cart');
    } finally {
      setBuyingAgainOrderId(null);
    }
  };

  // Prepare initial form data for AddressForm based on order
  const prepareFormData = (order) => ({
    shipping: {
      fullName: `${order.shipping.first_name} ${order.shipping.last_name}`.trim(),
      address1: order.shipping.address_1 || '',
      address2: order.shipping.address_2 || '',
      city: order.shipping.city || '',
      postalCode: order.shipping.postcode || '',
      phone: order.shipping.phone || '',
      state: order.shipping.state || '',
      country: order.shipping.country || '',
    },
    billing: {
      fullName: `${order.billing.first_name} ${order.billing.last_name}`.trim(),
      address1: order.billing.address_1 || '',
      address2: order.billing.address_2 || '',
      city: order.billing.city || '',
      postalCode: order.billing.postcode || '',
      phone: order.billing.phone || '',
      state: order.billing.state || '',
      country: order.billing.country || '',
    },
    billingSameAsShipping: false,
  });

  // On clicking Change Address
  const openEditAddress = (order) => {
    setEditingOrder({
      order,
      formData: prepareFormData(order),
    });
    setAddressError('');
  };

  // Handle changes inside the AddressForm
  const handleAddressChange = (e, section) => {
    const { name, value, checked, type } = e.target;
    setEditingOrder((prev) => {
      if (!prev) return prev;
      if (section === 'checkbox') {
        return {
          ...prev,
          formData: {
            ...prev.formData,
            billingSameAsShipping: checked,
          },
        };
      }
      return {
        ...prev,
        formData: {
          ...prev.formData,
          [section]: {
            ...prev.formData[section],
            [name]: value,
          },
        },
      };
    });
  };

  // Show order tracking view if trackingOrder set
  if (trackingOrder) {
    return (
      <OrderTracking 
        order={trackingOrder} 
        onBack={() => setTrackingOrder(null)} 
      />
    );
  }

  // Show full order details only when detailedOrder is set
  if (detailedOrder) {
    return (
      <div className="order-details-full-view">
        <button 
          className="btn-outline back-to-list-btn"
          onClick={() => setDetailedOrder(null)}
        >
          ← Back to all orders
        </button>
        <OrderDetailsInline order={detailedOrder} />
      </div>
    );
  }

  // Submit updated address to backend
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;
    setSavingAddress(true);
    setAddressError('');

    // Split fullName into first and last names helper
    const splitName = (fullName) => {
      const parts = fullName.trim().split(' ');
      return {
        first_name: parts[0] || '',
        last_name: parts.slice(1).join(' ') || '',
      };
    };

    const { order, formData } = editingOrder;
    const billingAddress = formData.billingSameAsShipping ? formData.shipping : formData.billing;

    const shippingName = splitName(formData.shipping.fullName);
    const billingName = splitName(billingAddress.fullName);

    const payload = {
      order_id: order.id,
      shipping: {
        first_name: shippingName.first_name,
        last_name: shippingName.last_name,
        address_1: formData.shipping.address1,
        address_2: formData.shipping.address2,
        city: formData.shipping.city,
        postcode: formData.shipping.postalCode,
        phone: formData.shipping.phone,
        state: formData.shipping.state,
        country: formData.shipping.country,
      },
      billing: {
        first_name: billingName.first_name,
        last_name: billingName.last_name,
        address_1: billingAddress.address1,
        address_2: billingAddress.address2,
        city: billingAddress.city,
        postcode: billingAddress.postalCode,
        phone: billingAddress.phone,
        state: billingAddress.state,
        country: billingAddress.country,
      },
    };

    try {
      const res = await axios.post('/wp-json/custom/v1/update-order-address/', payload);
      if (res.data.success) {
        toast.success('Address updated successfully!');
        setEditingOrder(null);
        onOrdersUpdated && onOrdersUpdated(); // refresh orders
      } else {
        setAddressError('Failed to update address.');
      }
    } catch (err) {
      setAddressError('Error updating address.');
      console.error(err);
    } finally {
      setSavingAddress(false);
    }
  };

  return (
    <div className="order-list">
      <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar />

      {editingOrder && (
        <AddressForm
          formData={editingOrder.formData}
          shippingStates={[]} // pass your states data if any
          billingStates={[]}  // same here
          countries={{ AE: { name: 'United Arab Emirates' } }} // your countries list
          onChange={handleAddressChange}
          onSubmit={handleAddressSubmit}
          onClose={() => setEditingOrder(null)}
          saving={savingAddress}
          error={addressError}
        />
      )}

      {orders.map((order) => (
        <div key={order.id} className="order-card-simple">
          {/* Header */}
          <div className="order-header-simple">
            <div>
              <strong style={{ color: orderStatusColors[order.status] || '#000' }}>
                Order {orderStatusLabels[order.status] || order.status}
              </strong> | Email sent to{' '}
              <span>{order.billing.email}</span> on{' '}
              {new Date(order.date_created).toLocaleDateString()}
            </div>
            <button
              onClick={() => setDetailedOrder(order)}
              aria-expanded={false}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                color: '#FF8C00',
                cursor: 'pointer',
                textDecoration: 'none',
                fontSize: 'inherit',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              View order details &nbsp;<span style={{ fontWeight: 'bold', color: '#FF8C00' }}>→</span>
            </button>
          </div>

          {/* Delivery */}
          <div className="order-delivery-simple">
            <div>
              <span className="fastest-arrival">Fastest arrival within 4 business days.</span>
              &nbsp;Delivery: {getExpectedDeliveryDate(order)}
            </div>
            <div className="credit-badge">AED20 credit if delay</div>
          </div>

          {/* Products */}
          <div className="order-items-grid-simple">
            {order.line_items.map((item) => (
              <div
                key={item.id}
                className="order-product-simple"
                onClick={() => handleProductClick(slugify(item.name))}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleProductClick(slugify(item.name));
                }}
              >
                <img src={item.image?.src || 'https://via.placeholder.com/100'} alt={item.name} />
                <div className="product-price">
                  {order.currency} {item.price}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="order-summary-simple">
            <div>
              {order.line_items.length} item{order.line_items.length > 1 ? 's' : ''}
            </div>
            <div>
              <del>{order.currency} {order.total}</del>&nbsp;
              <strong>{order.currency} {order.total}</strong>
            </div>
            <div>
              Order Time:{' '}
              {new Intl.DateTimeFormat('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: 'Asia/Dubai',
              }).format(new Date(order.date_created))}
            </div>
            <div>Order ID: PO-{order.id}</div>
            <div>Payment method: {order.payment_method_title || order.payment_method}</div>
          </div>

          {/* Actions */}
          <div className="order-actions-simple">
            <button className="btn-outline" onClick={() => openEditAddress(order)}>
              Change address
            </button>
            <button
              className="btn-secondary"
              onClick={() => handleBuyAgain(order.line_items, order.id)}
              disabled={buyingAgainOrderId === order.id}
            >
              {buyingAgainOrderId === order.id ? 'Adding...' : 'Buy this again'}
            </button>
            <button className="btn-secondary" onClick={() => setTrackingOrder(order)}>
              Track
            </button>
            {isCancelable(order.status) && (
              <button
                className="btn-secondary"
                onClick={() => cancelOrder(order.id)}
                disabled={cancellingOrderId === order.id}
              >
                {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel items'}
              </button>
            )}

   {/* Show only if order is completed */}
{order.status === 'completed' && (
<button
  className="btn-outline"
  onClick={() => generateInvoicePDF(order)}
>
  Download Invoice
</button>
)}

          </div>
        </div>
      ))}
    </div>
  );
};

export default AllOrders;
