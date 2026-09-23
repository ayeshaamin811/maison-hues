import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ExchangePolicy from './pages/ExchangePolicy';
import About from './pages/Aboutpage/About';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import FaqPage from './pages/FaqPage';
import StoreLocator from './pages/StoreLocator/StoreLocator';
import ContactPage from './pages/Contactpage/Contactpage';
import ProductPage from "./pages/ProductPage/ProductPage";
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import WishlistPage from "./pages/WishlistPage/WishlistPage";
import AuthModal from './components/AuthModal/AuthModal';
import CollectionPage from "./pages/CollectionPage/CollectionPage";
import TrackOrder from "./pages/TrackOrder/TrackOrder";



function App() {
  return (
 
    <CartProvider>
      <AuthProvider>
        <WishlistProvider>
          <Router>
          <ScrollToTop />
          <WhatsAppButton phoneNumber="923001234567" message="Hello! I would like to know more." />
          <AuthModal/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/exchange-policy" element={<ExchangePolicy />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/faqs" element={<FaqPage/>} />
            <Route path="/store-locator" element={<StoreLocator/>} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/collection/:categoryName" element={<CollectionPage />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            {/* Main Menu collection URLs redirect to the shared /collection/:categoryName route
                so CollectionPage always receives categoryName via useParams() */}
            <Route path="/best-sellers" element={<Navigate to="/collection/best-sellers" replace />} />
            <Route path="/new-arrivals" element={<Navigate to="/collection/new-arrivals" replace />} />
            <Route path="/formal-edit" element={<Navigate to="/collection/formal-edit" replace />} />
            <Route path="/co-ordsets" element={<Navigate to="/collection/co-ordsets" replace />} />
            <Route path="/fusion-edit" element={<Navigate to="/collection/fusion-edit" replace />} />
          </Routes>
          </Router>
        </WishlistProvider>
      </AuthProvider>
 
    </CartProvider>
  );
}

export default App;