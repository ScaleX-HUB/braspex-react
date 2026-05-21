import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useSiteContent } from '../contexts/SiteContentContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartCount } = useCart();
  const cartCount = getCartCount();
  const { content } = useSiteContent();
  const cartContent = content.cartDrawer;

  const itemsLabel = cartCount === 1
    ? (cartContent?.itemSingular || 'item')
    : (cartContent?.itemPlural || 'itens');

  const requestQuoteText = (cartContent?.requestQuoteTemplate || 'Enviar Orçamento ({count} {items})')
    .replace('{count}', String(cartCount))
    .replace('{items}', itemsLabel);

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRequestQuote = () => {
    onClose();
    navigate('/orcamento');
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#005563] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart size={28} />
                <div>
                  <h2 className="text-xl font-bold">{cartContent?.title || 'Carrinho de Orçamento'}</h2>
                  <p className="text-sm text-white/80">{cartCount} {itemsLabel}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-[#FFD027] transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart size={80} className="text-slate-300 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {cartContent?.emptyTitle || 'Carrinho Vazio'}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {cartContent?.emptyDescription || 'Adicione produtos para solicitar um orçamento'}
                  </p>
                  <Link
                    to="/produtos"
                    onClick={onClose}
                    className="bg-[#005563] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#003d47] transition-colors"
                  >
                    {cartContent?.emptyButtonText || 'Ver Produtos'}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <Link
                          to={`/produtos/${item.id}`}
                          onClick={onClose}
                          className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-slate-200"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-2"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/produtos/${item.id}`}
                            onClick={onClose}
                            className="font-semibold text-slate-900 hover:text-[#005563] transition-colors line-clamp-2 text-sm"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-slate-500 mt-1">{item.price}</p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 mt-3">
                            <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-4 py-1 bg-white text-sm font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                              title={cartContent?.removeTitle || 'Remover'}
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {cartItems.length > 0 && (
              <div className="border-t border-slate-200 p-6 space-y-3">
                <button
                  onClick={handleRequestQuote}
                  className="flex w-full items-center justify-center gap-3 bg-[#005563] px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-[#003d47] hover:shadow-xl"
                >
                  <ShoppingCart size={22} aria-hidden="true" />
                  {requestQuoteText}
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-white border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  {cartContent?.clearCart || 'Limpar Carrinho'}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;
