import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ToastProvider } from '../context/ToastContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  return null;
}

export const RootLayout: React.FC = () => {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-[#06152B] text-[#F5F7FC] selection:bg-[#168BFF]/30 selection:text-[#FFD83D]">
        <ScrollToTop />
        <Navbar />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>
    </ToastProvider>
  );
};
