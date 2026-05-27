'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Users, Award, MapPin, Phone } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header / Nav */}
      <nav className="fixed top-0 w-full bg-cream/95 backdrop-blur z-50 border-b-2 border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-serif text-3xl text-maroon tracking-wide">Marda & Sons</h1>
              <p className="text-xs text-maroon/70 mt-1">विश्वास की परंपरा, वर्षों का साथ</p>
            </div>
            <div className="hidden md:flex gap-8 text-sm font-medium">
              <a href="#shop" className="hover:text-maroon transition">Shop</a>
              <a href="#weddings" className="hover:text-maroon transition">Weddings</a>
              <a href="#wholesale" className="hover:text-maroon transition">Wholesale</a>
              <a href="#story" className="hover:text-maroon transition">Story</a>
              <a href="#contact" className="hover:text-maroon transition">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cream to-sand/30">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-5xl md:text-7xl text-maroon mb-6 leading-tight">
              विश्वास की परंपरा,<br />
              <span className="text-gold">वर्षों का साथ</span>
            </h2>
            <p className="text-xl md:text-2xl text-indigo/80 mb-4 max-w-3xl mx-auto">
              Premium Solapuri textiles for every ritual – from first towel to wedding trousseau
            </p>
            <p className="text-sm text-indigo/60 mb-10">Serving families since 1970 from the heart of Solapur</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-maroon text-cream font-medium rounded-none hover:bg-maroon-dark transition-all border-2 border-maroon hover:scale-105">
                Shop for Home
              </button>
              <button className="px-8 py-4 bg-transparent text-maroon font-medium rounded-none border-2 border-maroon hover:bg-maroon hover:text-cream transition-all">
                Weddings & Hotels
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Shop by Ritual */}
      <section id="shop" className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <h3 className="font-serif text-4xl text-center text-maroon mb-12">Shop by Ritual</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Morning Rituals', desc: 'Premium towels & bath essentials', icon: '🌅' },
              { title: 'Guest Ready Home', desc: 'Bedsheets, cushions & table linens', icon: '🏠' },
              { title: 'Wedding Gifts', desc: 'Trousseau sets & return gifts', icon: '💝' },
              { title: 'Hotel & Homestay', desc: 'Bulk orders with custom weaves', icon: '🏨' },
              { title: 'Winter Comfort', desc: 'Blankets, shawls & warm layers', icon: '❄️' },
              { title: 'Festival Specials', desc: 'Curated gift bundles', icon: '🪔' },
            ].map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-sand/20 p-8 border-2 border-gold/30 hover:border-gold hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="text-5xl mb-4">{cat.icon}</div>
                <h4 className="font-serif text-2xl text-maroon mb-2 group-hover:text-gold transition">{cat.title}</h4>
                <p className="text-indigo/70 text-sm">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Band */}
      <section className="py-16 bg-indigo text-cream">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <Award className="w-12 h-12 mx-auto mb-3 text-gold" />
            <p className="font-serif text-xl mb-1">Since 1970</p>
            <p className="text-xs text-cream/70">Serving families for 50+ years</p>
          </div>
          <div>
            <Heart className="w-12 h-12 mx-auto mb-3 text-gold" />
            <p className="font-serif text-xl mb-1">100% Genuine</p>
            <p className="text-xs text-cream/70">Solapuri handloom textiles</p>
          </div>
          <div>
            <Users className="w-12 h-12 mx-auto mb-3 text-gold" />
            <p className="font-serif text-xl mb-1">Trusted by thousands</p>
            <p className="text-xs text-cream/70">Retail & wholesale clients</p>
          </div>
          <div>
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gold" />
            <p className="font-serif text-xl mb-1">Fair Pricing</p>
            <p className="text-xs text-cream/70">Direct from the source</p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="font-serif text-4xl text-maroon mb-6">Our Story</h3>
          <p className="text-lg text-indigo/80 leading-relaxed mb-4">
            Since 1970, Marda & Sons has been Solapur's trusted textile house, serving families with genuine Solapuri handloom products.
            What started as a wholesale business has evolved into a premium retail and B2B platform, bringing the heritage of Solapur weaves to homes, hotels, and weddings across India.
          </p>
          <p className="text-lg text-indigo/80 leading-relaxed">
            <strong className="text-maroon">विश्वास की परंपरा, वर्षों का साथ</strong> — Trust built over generations, relationships nurtured with care, and fair pricing that reflects our values.
          </p>
        </div>
      </section>

      {/* Contact / Visit */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-sand/20">
        <div className="max-w-6xl mx-auto">
          <h3 className="font-serif text-4xl text-center text-maroon mb-12">Visit Our Store</h3>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h4 className="font-serif text-2xl text-maroon mb-4">Marda & Sons</h4>
              <p className="flex items-start gap-2 mb-3">
                <MapPin className="w-5 h-5 text-gold mt-1" />
                <span>430/416 Chati Galli, Mangalvar Peth & Navi Peth, Solapur, Maharashtra</span>
              </p>
              <p className="flex items-center gap-2 mb-4">
                <Phone className="w-5 h-5 text-gold" />
                <span>Contact us for details</span>
              </p>
              <p className="text-sm text-indigo/70 mb-4">Open Monday – Saturday, 10 AM – 8 PM</p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-maroon text-cream font-medium hover:bg-maroon-dark transition">WhatsApp</button>
                <button className="px-6 py-3 bg-transparent text-maroon font-medium border-2 border-maroon hover:bg-maroon hover:text-cream transition">Get Directions</button>
              </div>
            </div>
            <div className="bg-sand/30 h-64 flex items-center justify-center border-2 border-gold/30">
              <p className="text-indigo/50 font-serif text-lg">[Google Maps Embed]</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo text-cream py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-serif text-3xl mb-2">Marda & Sons</h2>
          <p className="text-sm text-cream/70 mb-6">विश्वास की परंपरा, वर्षों का साथ</p>
          <p className="text-xs text-cream/50">&copy; {new Date().getFullYear()} Marda & Sons. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
