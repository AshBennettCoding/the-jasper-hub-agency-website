// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import i18n from './i18n'; // 导入真实的i18n实例

const AppContent = () => {
  // const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // 从URL参数中获取语言，如果没有则默认为'en'
  const langFromUrl = searchParams.get('lang') || 'en';

  // 当URL中的语言参数变化时，更新i18n的语言设置
  useEffect(() => {
    if (langFromUrl && langFromUrl !== i18n.language) {
      i18n.changeLanguage(langFromUrl);
    }
  }, [langFromUrl]);

  // 切换语言并更新URL
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setSearchParams({ lang });
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Home changeLanguage={changeLanguage} i18n={i18n} />}
      />
      <Route
        path="/services"
        element={<Services changeLanguage={changeLanguage} i18n={i18n} />}
      />
      <Route
        path="/contact"
        element={<Contact changeLanguage={changeLanguage} i18n={i18n} />}
      />
    </Routes>
  );
};

const App = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|ipad|iphone|ipod|windows phone|iemobile|blackberry|kindle|silk/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);


  return (
    <Router>
      {isMobile ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Not Supported
            </h1>
            <p className="text-lg text-gray-700">
              We apologize, but this website is currently only accessible on desktop devices. Please visit us from a PC for the best experience.
            </p>
          </div>
        </div>
      ) : (
        <AppContent />
      )}
    </Router>
  );
};

export default App;
