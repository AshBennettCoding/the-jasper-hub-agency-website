import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AgencyLogo from '../assets/Agency-LOGO.png';

const navigationItems = [
    { key: 'home', path: '/' },
    { key: 'services', path: '/services' },
    { key: 'forInfluencers', path: '/globaltalents-collab' },
    { key: 'contact', path: '/contact' },
];

const Navbar = ({ isHome = false, changeLanguage, i18n, t }) => {
    const currentLang = i18n?.language || 'en';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const translate = (key) => (typeof t === 'function' ? t(key) : key);

    const handleLangChange = (language) => {
        setIsMobileMenuOpen(false);
        if (typeof changeLanguage === 'function') {
            changeLanguage(language);
            return;
        }

        navigate(`${location.pathname}?lang=${language}`);
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            <style>{`
                .mobile-menu-toggle { display: none; }
                @media (max-width: 767px) {
                    .mobile-menu-toggle {
                        display: inline-flex;
                        width: 40px;
                        height: 40px;
                        align-items: center;
                        justify-content: center;
                        border: 0;
                        border-radius: 9999px;
                        background: #f6faf6;
                        color: #161d19;
                    }
                    .primary-navigation {
                        display: none;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        padding: 12px 24px 20px;
                        background: rgba(255,255,255,.98);
                        box-shadow: 0 8px 20px rgba(0,0,0,.08);
                    }
                    .primary-navigation.is-open {
                        display: flex;
                        flex-direction: column;
                        align-items: stretch;
                        gap: 16px;
                    }
                    .primary-navigation nav {
                        display: flex;
                        flex-direction: column;
                        align-items: stretch;
                        gap: 4px;
                    }
                    .primary-navigation nav a {
                        min-height: 44px;
                        display: flex;
                        align-items: center;
                    }
                    .nav-actions { justify-content: space-between; }
                }
            `}</style>
            <header className={`site-header fixed inset-x-0 top-0 z-50 border-b border-black/[0.04] bg-white/90 backdrop-blur-md${isHome ? '' : ' shadow-[0_1px_8px_rgba(0,0,0,0.04)]'}`}>
                <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-6">
                    <Link
                        to={`/?lang=${currentLang}`}
                        className="flex h-12 w-[176px] items-center overflow-hidden"
                        aria-label="The Jasper Hub Home"
                        onClick={closeMobileMenu}
                    >
                        <img
                            src={AgencyLogo}
                            alt="The Jasper Hub"
                            className="h-auto w-[176px] max-w-none shrink-0"
                        />
                    </Link>

                    <button
                        type="button"
                        className="mobile-menu-toggle"
                        aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="primary-navigation"
                        onClick={() => setIsMobileMenuOpen((open) => !open)}
                    >
                        <span className="material-symbols-outlined" aria-hidden="true">
                            {isMobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>

                    <div
                        id="primary-navigation"
                        className={`primary-navigation flex items-center gap-8${isMobileMenuOpen ? ' is-open' : ''}`}
                    >
                        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
                            {navigationItems.map(({ key, path }) => {
                                const label = translate(key === 'forInfluencers' ? 'navForInfluencers' : key);
                                const isCurrent = location.pathname === path;
                                return (
                                    <Link
                                        key={key}
                                        to={`${path}?lang=${currentLang}`}
                                        aria-current={isCurrent ? 'page' : undefined}
                                        className={`font-montserrat text-[15px] transition-colors ${
                                            isCurrent
                                                ? 'border-b-2 border-[#0FB97F] pb-0.5 font-bold text-[#006C48]'
                                                : 'text-[#555555] hover:text-[#111111]'
                                        }`}
                                        onClick={closeMobileMenu}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="nav-actions flex items-center gap-4">
                            <div className="flex items-center rounded-full bg-gray-100 p-1 shadow-inner">
                                {[
                                    { language: 'en', label: 'EN' },
                                    { language: 'zh', label: '中文' },
                                ].map(({ language, label }) => (
                                    <button
                                        key={language}
                                        type="button"
                                        aria-pressed={currentLang === language}
                                        onClick={() => handleLangChange(language)}
                                        className={`rounded-full px-3.5 py-1 font-montserrat text-xs transition-colors ${
                                            currentLang === language
                                                ? 'bg-[#0FB97F] font-bold text-white shadow-sm'
                                                : 'text-[#555555] hover:text-[#111111]'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <Link
                                to={`/contact?lang=${currentLang}`}
                                aria-label="Portal"
                                title="Portal"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0FB97F]/10 text-[#0FB97F] transition-colors hover:bg-[#0FB97F]/20"
                                onClick={closeMobileMenu}
                            >
                                <span className="material-symbols-outlined text-[19px]" aria-hidden="true">person</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;
