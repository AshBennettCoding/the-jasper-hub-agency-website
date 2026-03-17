// src/App.jsx
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import i18n from './i18n'; // 导入真实的i18n实例

// 懒加载页面组件
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));

// 加载状态组件
const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
    <div className="text-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-4 text-gray-700">Loading...</p>
    </div>
  </div>
);

const AppContent = () => {
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
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
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
