'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QrCode, Github, Linkedin, Mail } from 'lucide-react';
import { toast } from '@/src/components/ui/use-toast';

const Footer = () => {
  const pathname = usePathname();

  const handleSocialClick = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const navLinkStyle = (path) => `block text-gray-400 hover:text-white transition-colors ${pathname === path ? 'text-white font-semibold' : ''}`;

  return (
    <footer className="relative py-12 px-6 mt-20 border-t border-white/10">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">QR Attendance</span>
            </Link>
            <p className="text-gray-400 max-w-md">
              Revolutionary role-based attendance system designed to eliminate proxy attendance with secure QR code technology.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/features" className={navLinkStyle('/features')}>Features</Link>
              <Link href="/how-it-works" className={navLinkStyle('/how-it-works')}>How It Works</Link>
              <Link href="/about" className={navLinkStyle('/about')}>About</Link>
              <Link href="/contact" className={navLinkStyle('/contact')}>Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Connect</h4>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.1, y: -5 }}
                onClick={handleSocialClick}
                className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Github className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, y: -5 }}
                onClick={handleSocialClick}
                className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, y: -5 }}
                onClick={handleSocialClick}
                className="w-10 h-10 rounded-lg glass-effect flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-gray-400">
          <p>© 2025 QR Attendance System. Built by Mahnoor & Muhammad Haris Khan</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;