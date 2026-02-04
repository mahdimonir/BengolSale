'use client';

import CoFounderBranding from '@/components/CoFounderBranding';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, Package, Ruler, ShoppingCart, Star, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { COMBOS, FAQS, SIZES } from './constants';
import { Combo, FAQItem, ProductSize } from './types';

// Components
const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-brand-dark rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">B</span>
        </div>
        <span className="text-brand-dark font-bold text-xl tracking-tight">Bengol<span className="text-brand-primary">Sale</span></span>
      </div>
      <a href="#checkout" className="bg-brand-primary text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20">
        অর্ডার করুন
      </a>
    </div>
  </nav>
);

const FAQAccordion: React.FC<{ item: FAQItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white mb-3 rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:border-brand-primary/20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-bold text-brand-dark text-sm leading-relaxed">{item.question}</span>
        <div className={`p-1.5 rounded-full transition-transform duration-300 ${isOpen ? 'bg-brand-primary/10 text-brand-primary rotate-180' : 'bg-gray-50 text-gray-400'}`}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductFeatures = () => {
    const features = [
       "ট্রেন্ডি ড্রপ শোল্ডার ফিট",
       "প্রিমিয়াম কোয়ালিটি ফেব্রিক",
       "পারফেক্ট স্টিচিং ও ফিনিশিং",
       "কালার ও প্রিন্ট লং-লাস্টিং",
       "ক্যাজুয়াল + আউটিং—দুইটার জন্যই সেরা",
       "দাম অনুযায়ী সেরা ভ্যালু",
       "ছবির মতোই প্রোডাক্ট পাবেন",
       "নেক, স্লিভ আর বডি ফিট একদম ক্লিন ও স্মার্ট লুক দেয়"
    ];

    return (
        <section id="features" className="py-12 bg-white border-b border-gray-100">
             <div className="max-w-7xl mx-auto px-6">
                 <div className="text-center mb-10">
                     <span className="text-brand-primary font-bold text-[10px] uppercase tracking-widest mb-2 block">Premium Quality</span>
                     <h2 className="text-2xl font-black text-brand-dark">আমাদের বৈশিষ্ট্যসমূহ</h2>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6">
                     {features.map((feature, idx) => (
                         <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 group hover:border-brand-primary/20 transition-colors"
                         >
                            <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-sm group-hover:scale-110 transition-transform">
                                <Check className="w-4 h-4" />
                            </div>
                            <p className="font-bold text-gray-600 text-[11px] leading-tight pt-1">{feature}</p>
                         </motion.div>
                     ))}
                 </div>
             </div>
        </section>
    )
}

export default function Home() {
  // Store selected items as a map of ID -> details
  const [selectedItems, setSelectedItems] = useState<Record<string, { size: ProductSize, quantity: number }>>({
    'pack-6': { size: 'M', quantity: 1 } // Default selection
  });
  
  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside'>('inside');
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const checkoutRef = useRef<HTMLDivElement>(null);
  const scrollToCheckout = () => checkoutRef.current?.scrollIntoView({ behavior: 'smooth' });

  // Compute derived values
  const selectedIds = Object.keys(selectedItems);
  const activeProducts = COMBOS.filter(c => selectedIds.includes(c.id));
  
  const subtotal = activeProducts.reduce((acc, curr) => acc + (curr.price * selectedItems[curr.id].quantity), 0);
  
  // Logic: If user selects pack-6, pack-3, or any combination resulting in 3+ pieces, delivery is free.
  const hasPack = activeProducts.some(item => item.isPack);
  // Count total quantity of single items
  const singleItemCount = activeProducts
    .filter(item => !item.isPack)
    .reduce((acc, curr) => acc + selectedItems[curr.id].quantity, 0);

  const isFreeDelivery = hasPack || singleItemCount >= 3;
  
  const deliveryCharge = isFreeDelivery ? 0 : (deliveryArea === 'inside' ? 80 : 130);
  const total = subtotal + deliveryCharge;

  const handleSelect = (comboId: string, size: ProductSize) => {
      setSelectedItems(prev => ({
          ...prev,
          [comboId]: { ...prev[comboId], size, quantity: prev[comboId]?.quantity || 1 }
      }));
  };

  const handleQuantity = (comboId: string, delta: number) => {
      setSelectedItems(prev => {
          const item = prev[comboId];
          if (!item) return prev;
          const newQty = Math.max(1, item.quantity + delta);
          return {
              ...prev,
              [comboId]: { ...item, quantity: newQty }
          };
      });
  };

  const handleRemove = (comboId: string) => {
      setSelectedItems(prev => {
          const newItems = { ...prev };
          delete newItems[comboId];
          return newItems;
      });
  };

  const toggleSelection = (combo: Combo) => {
      if (selectedItems[combo.id]) {
          handleRemove(combo.id);
      } else {
          // Default to M if just toggling the card
          handleSelect(combo.id, 'M');
      }
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Please fill in all fields');
      return;
    }
    if (activeProducts.length === 0) {
      toast.error('Please select at least one item');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            ...formData,
            area: deliveryArea
          },
          items: activeProducts.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: selectedItems[item.id].quantity, 
            selectedSize: selectedItems[item.id].size, // Per-item size
            selectedColor: item.color,
            imageUrl: item.image
          })),
          deliveryCharge,
          total
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Order placed successfully! Order ID: ${data.orderId}`);
        // Reset
        setSelectedItems({});
        setFormData({ name: '', phone: '', address: '' });
      } else {
        toast.error('Failed to place order: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-muted text-brand-text selection:bg-brand-primary selection:text-white pb-20 md:pb-0">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 z-10"
          >
            {/* ... Hero Content ... */}
            <div className="inline-block px-4 py-1.5 bg-brand-primary/5 text-brand-primary rounded-full mb-8 font-bold text-[10px] uppercase tracking-widest">
              Limited Edition Combo Offers
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-brand-dark leading-[1.1] mb-6">
              পছন্দের কম্বো <br /><span className="text-brand-primary italic">বেছে নিন</span>
            </h1>
            <p className="text-base text-gray-500 mb-10 leading-relaxed max-w-md">
              ৩ পিস বা তার বেশি অর্ডার করলেই সারা বাংলাদেশে একদম <span className="text-brand-primary font-bold">ফ্রি হোম ডেলিভারি!</span> আজই আপনার স্টাইলিশ প্যাকটি বেছে নিন।
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
              <p className="text-sm font-semibold text-brand-accent flex items-center gap-2">
                <Package className="w-4 h-4" />
                ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা)
              </p>
            </div>

            <button 
              onClick={scrollToCheckout}
              className="group w-full md:w-auto bg-brand-primary text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-2xl shadow-brand-primary/30 hover:bg-brand-dark transition-all duration-300 flex items-center justify-center gap-4"
            >
              নিচ থেকে কম্বো বাছাই করুন
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <div className="lg:col-span-7 relative">
              <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100">
               <img src="/products/hero.png" alt="Hero Product" className="w-full h-full object-contain" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 hidden md:block">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-brand-accent/10 rounded-full flex items-center justify-center text-brand-accent">
                    <Star className="w-5 h-5 fill-brand-accent" />
                 </div>
                 <div>
                    <p className="text-xs font-black text-brand-dark">4.9/5 Rating</p>
                    <p className="text-[10px] text-gray-400">Trusted by 10k+ Customers</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <ProductFeatures />

      {/* Dynamic Selection Section */}
      <section id="checkout" ref={checkoutRef} className="py-24 bg-brand-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-brand-dark mb-4">আপনার প্যাকটি বাছাই করুন</h2>
            <p className="text-gray-500 text-sm">প্যাক বা সিঙ্গেল টি-শার্ট সিলেক্ট করুন এবং নিজের সাইজ বেছে নিন</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            
            {/* Selection Grid */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Value Packs */}
              <div>
                <h3 className="text-xs font-black text-brand-primary uppercase tracking-[0.2em] mb-6 ml-2">Value Packs (সেরা অফার)</h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {COMBOS.filter(c => c.isPack).map((combo) => (
                    <div
                      key={combo.id}
                      className={`group relative text-left p-6 rounded-[2.5rem] border-2 transition-all duration-300 ${
                        selectedItems[combo.id]
                        ? 'bg-white border-brand-primary shadow-xl scale-[1.02] z-10' 
                        : 'bg-white/50 border-white hover:border-brand-primary/30'
                      }`}
                    >
                      {/* Clickable Area for Image/Title */}
                      <div onClick={() => toggleSelection(combo)} className="cursor-pointer">
                          <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-6 bg-gray-200">
                            <img src={combo.image} alt={combo.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-black text-brand-dark">{combo.name}</h4>
                            <span className="font-black text-brand-primary">৳{combo.price}</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-6">{combo.description}</p>
                      </div>
                      
                      {/* Inline Size Selection */}
                      <div className="bg-brand-muted/50 p-3 rounded-2xl flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-gray-500 uppercase">Size:</span>
                          <div className="flex gap-2">
                              {SIZES.map(size => (
                                  <button
                                    key={size}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelect(combo.id, size as ProductSize);
                                    }}
                                    className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${
                                        selectedItems[combo.id]?.size === size
                                        ? 'bg-brand-primary text-white shadow-lg scale-110'
                                        : 'bg-white text-gray-500 hover:bg-gray-200'
                                    }`}
                                  >
                                      {size}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {combo.id === 'pack-6' && (
                        <div className="absolute -top-3 -right-3 bg-brand-dark text-white text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                          Best Value
                        </div>
                      )}
                      
                      {selectedItems[combo.id] && (
                          <div className="absolute top-4 left-4 bg-brand-primary text-white p-1 rounded-full shadow-lg">
                              <Check className="w-4 h-4" />
                          </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Builder */}
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-2">Build Your Own (সিঙ্গেল পিস)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {COMBOS.filter(c => !c.isPack).map((combo) => (
                    <div
                      key={combo.id}
                      className={`group relative text-left p-4 rounded-3xl border-2 transition-all duration-300 ${
                        selectedItems[combo.id]
                        ? 'bg-white border-brand-primary shadow-lg' 
                        : 'bg-white/50 border-white hover:border-brand-primary/20'
                      }`}
                    >
                      <div onClick={() => toggleSelection(combo)} className="cursor-pointer">
                          <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-200">
                            <img src={combo.image} alt={combo.name} className="w-full h-full object-cover" />
                          </div>
                          <h4 className="text-[11px] font-black text-brand-dark mb-1 truncate">{combo.name}</h4>
                          <p className="text-[10px] font-black text-brand-primary mb-3">৳{combo.price}</p>
                      </div>
                      
                      {/* Compact Size Selection */}
                      <div className="grid grid-cols-3 gap-1">
                          {SIZES.map(size => (
                              <button
                                key={size}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelect(combo.id, size as ProductSize);
                                }}
                                className={`h-6 rounded-md text-[8px] font-bold transition-all ${
                                    selectedItems[combo.id]?.size === size
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-brand-muted text-gray-400 hover:bg-gray-200'
                                }`}
                              >
                                  {size}
                              </button>
                          ))}
                      </div>

                      {selectedItems[combo.id] && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Checkout Panel */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-gray-100">
                <h2 className="text-2xl font-black text-brand-dark mb-8">চেকআউট</h2>
                
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="text" 
                    placeholder="আপনার নাম" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-brand-muted/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" 
                  />
                  <input 
                    type="tel" 
                    placeholder="মোবাইল নাম্বার" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-brand-muted/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" 
                  />
                  <textarea 
                    rows={2} 
                    placeholder="পূর্ণ ঠিকানা" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-brand-muted/50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all" 
                  />

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button type="button" onClick={() => setDeliveryArea('inside')} className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${deliveryArea === 'inside' ? 'bg-brand-dark text-white' : 'bg-brand-muted text-gray-400'}`}>ঢাকা (৳৮০)</button>
                    <button type="button" onClick={() => setDeliveryArea('outside')} className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${deliveryArea === 'outside' ? 'bg-brand-dark text-white' : 'bg-brand-muted text-gray-400'}`}>বাহিরে (৳১৩০)</button>
                  </div>

                  {/* Bill Summary */}
                  <div className="bg-brand-dark rounded-3xl p-6 mt-8 text-white">
                    <div className="space-y-3 mb-4 max-h-48 overflow-y-auto no-scrollbar border-b border-white/5 pb-4">
                       {activeProducts.map(item => (
                         <div key={item.id} className="flex justify-between items-center text-[10px]">
                           <div className="flex flex-col opacity-80">
                               <span className="font-bold">{item.name}</span>
                               <span className="text-[9px] text-brand-primary">Size: {selectedItems[item.id].size}</span>
                           </div>
                           
                           <div className="flex items-center gap-3">
                               {/* Quantity Controls */}
                               <div className="flex items-center gap-2 bg-white/10 rounded-lg px-1.5 py-0.5">
                                   <button 
                                     onClick={() => handleQuantity(item.id, -1)}
                                     className="text-white hover:text-brand-primary px-1 font-bold text-xs"
                                   >
                                     -
                                   </button>
                                   <span className="font-bold text-white w-3 text-center text-xs">{selectedItems[item.id].quantity}</span>
                                   <button 
                                     onClick={() => handleQuantity(item.id, 1)}
                                     className="text-white hover:text-brand-primary px-1 font-bold text-xs"
                                   >
                                     +
                                   </button>
                               </div>

                               <span className="opacity-80">৳{item.price * selectedItems[item.id].quantity}</span>
                               
                               <button 
                                onClick={() => handleRemove(item.id)}
                                className="hover:text-red-400 transition ml-1"
                               >
                                <X className="w-3 h-3" />
                               </button>
                           </div>
                         </div>
                       ))}
                       {activeProducts.length === 0 && <p className="text-[10px] text-brand-primary italic">পণ্য সিলেক্ট করুন...</p>}
                    </div>

                    <div className="flex justify-between text-xs mb-2">
                      <span className="opacity-60">ডেলিভারি চার্জ</span>
                      <span className={isFreeDelivery ? 'text-brand-accent' : ''}>{isFreeDelivery ? 'FREE' : `৳${deliveryCharge}`}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-bold uppercase tracking-widest">Total Bill</span>
                      <span className="text-2xl font-black text-brand-primary">৳{total}</span>
                    </div>

                    <button 
                      type="button"
                      onClick={handleSubmit}
                      disabled={activeProducts.length === 0 || isSubmitting}
                      className="w-full bg-brand-primary text-white py-4 rounded-2xl text-md font-bold mt-6 shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      {isSubmitting ? 'Processing...' : 'অর্ডার কনফার্ম করুন'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Re-use Size Chart, FAQ, and Footer from previous version */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-black text-brand-dark mb-2">সাইজ মেজারমেন্ট</h2>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
              <Ruler className="w-4 h-4" /> ইঞ্চি (Inches)
            </div>
          </div>
          <div className="bg-brand-muted rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Size</th>
                  <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Length</th>
                  <th className="p-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Chest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {['M - 28" - 40"', 'L - 29" - 42"', 'XL - 31" - 44"'].map((row, idx) => {
                  const [s, l, c] = row.split(' - ');
                  return (
                    <tr key={idx} className="hover:bg-white transition">
                      <td className="p-6 font-bold text-brand-dark">{s}</td>
                      <td className="p-6 text-gray-500 text-sm">{l}</td>
                      <td className="p-6 text-gray-500 text-sm">{c}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="faq" className="py-24 bg-brand-muted">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-center text-3xl font-black text-brand-dark mb-16">সাধারণ কিছু প্রশ্ন</h2>
          <div className="space-y-4">
            {FAQS.map((item, idx) => (
              <FAQAccordion key={idx} item={item} />
            ))}
          </div>
        </div>
      </section>

       <footer className="bg-white text-gray-600 py-10 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-2 text-center">
            <p className="font-bold text-lg text-brand-dark">Bengol<span className="text-brand-primary">Sale</span></p>
            <p className="text-xs">Order Hotline: <span className="font-bold">+৮৮০ ১৮০৫-৫৩০২৮২</span></p>
            <CoFounderBranding text = {`© ${new Date().getFullYear()} All rights reserved • Co-Founder BD`}/>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-brand-dark rounded-t-[1.5rem] border-t border-white/10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] md:hidden z-50 flex items-center justify-between gap-6 backdrop-blur-md bg-opacity-95 pb-safe">
        <div>
          <span className="block text-[8px] text-gray-400 uppercase font-black tracking-widest mb-1">Total Bill</span>
          <span className="text-xl font-black text-white">৳{total}</span>
        </div>
        <button 
          onClick={scrollToCheckout}
          className="flex-1 bg-brand-primary text-white py-3.5 rounded-xl font-black text-sm shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <ShoppingCart className="w-4 h-4" />
          অর্ডার করুন
        </button>
      </div>
    </div>
  );
}


