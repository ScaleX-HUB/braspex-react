import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SiteContentProvider } from './contexts/SiteContentContext';
import { CartProvider } from './contexts/CartContext';
import { SectionOrderProvider } from './contexts/SectionOrderContext';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import QuoteCheckout from './pages/QuoteCheckout';
import AdminLogin from './pages/AdminLogin';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import CatalogsPage from './pages/CatalogsPage';
import './App.css';

function App() {
  return (
    <SiteContentProvider>
      <SectionOrderProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/produtos" element={<ProductsPage />} />
                <Route path="/produtos/:id" element={<ProductDetailPage />} />
                <Route path="/orcamento" element={<QuoteCheckout />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/catalogo-virtual" element={<CatalogsPage />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </SectionOrderProvider>
    </SiteContentProvider>
  );
}

export default App;