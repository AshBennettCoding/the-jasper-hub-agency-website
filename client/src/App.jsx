// src/App.jsx
import React, { useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import i18n from './i18n'; // 导入真实的i18n实例

// 懒加载页面组件
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const InfluencerContact = lazy(() => import('./pages/InfluencerContact'));

// 加载状态组件
const PageLoader = () => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-700">{t('loading')}</p>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // 从URL参数中获取语言，如果没有则默认为'en'
  const requestedLanguage = searchParams.get('lang');
  const langFromUrl = ['en', 'zh'].includes(requestedLanguage) ? requestedLanguage : 'en';

  // 当URL中的语言参数变化时，更新i18n的语言设置
  useEffect(() => {
    if (langFromUrl && langFromUrl !== i18n.language) {
      i18n.changeLanguage(langFromUrl);
    }
  }, [langFromUrl]);

  useEffect(() => {
    document.documentElement.lang = langFromUrl;
    document.title = t('siteTitle', { lng: langFromUrl });
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      t('siteDescription', { lng: langFromUrl })
    );
  }, [langFromUrl, t]);

  // 切换语言并更新URL
  const changeLanguage = (lang) => {
    if (!['en', 'zh'].includes(lang)) return;
    i18n.changeLanguage(lang);
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.set('lang', lang);
      return nextParams;
    });
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
        <Route
          path="/globaltalents-collab"
          element={<InfluencerContact changeLanguage={changeLanguage} i18n={i18n} />}
        />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
