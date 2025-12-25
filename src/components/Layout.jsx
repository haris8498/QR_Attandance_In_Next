import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a0e27] via-[#16213e] to-[#1a1a2e]">
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;