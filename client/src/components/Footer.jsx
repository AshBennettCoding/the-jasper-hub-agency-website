import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Footer = ({ wide = false, variant = 'default' }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const requestedLanguage = new URLSearchParams(location.search).get('lang');
    const language = ['en', 'zh'].includes(requestedLanguage) ? requestedLanguage : 'en';
    const isInquiry = variant === 'creator' || variant === 'talent';

    const links = [
        { label: t('home'), to: `/?lang=${language}` },
        { label: t('services'), to: `/services?lang=${language}` },
        { label: t('footerForInfluencers'), to: `/globaltalents-collab?lang=${language}` },
        { label: t('contact'), to: `/contact?lang=${language}` },
    ];

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full bg-brand-dark text-white"
        >
            <div className={`${wide ? 'max-w-[1240px]' : 'max-w-[1200px]'} mx-auto px-6 pt-16 pb-12`}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
                    <div className="md:col-span-5 flex flex-col items-start">
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`font-montserrat font-bold tracking-tight ${isInquiry ? 'text-[28px] leading-9' : 'text-2xl'}`}>
                                {t('footerBrand')}
                            </span>
                            <span className={`bg-brand-green text-white px-2.5 py-0.5 rounded-full font-montserrat text-[10px] font-bold tracking-wider uppercase ${isInquiry ? 'leading-6' : ''}`}>
                                {t('footerAgencyBadge')}
                            </span>
                        </div>
                        <p className={`font-inter text-[#8A8A8A] max-w-sm leading-relaxed mb-6 ${isInquiry ? 'text-[15px]' : 'text-sm'}`}>
                            {t('footerDescription')}
                        </p>
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-brand-green text-xs ${isInquiry ? 'bg-white/10 font-montserrat font-semibold leading-4' : 'bg-white/5 border border-white/10 font-inter'}`}>
                            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" aria-hidden="true" />
                            {t('footerActivity')}
                        </div>
                    </div>

                    <div className="md:col-span-4 flex flex-col">
                        <h3 className={`font-montserrat font-bold text-white mb-4 ${isInquiry ? 'text-xl leading-7' : 'text-base'}`}>
                            {t('footerContact')}
                        </h3>
                        <div className={`space-y-4 font-inter text-[#8A8A8A] ${isInquiry ? 'text-[13px] leading-5' : 'text-sm'}`}>
                            <div className="flex flex-col">
                                <span className="font-montserrat text-xs text-white mb-1 uppercase tracking-wider font-semibold">
                                    {t('footerBusinessEnquiries')}
                                </span>
                                <a className="hover:text-brand-green transition-colors" href="mailto:business@thejasperhub.com">
                                    business@thejasperhub.com
                                </a>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-montserrat text-xs text-white mb-1 uppercase tracking-wider font-semibold">
                                    {t('footerInfluencerQueries')}
                                </span>
                                <a className="hover:text-brand-green transition-colors" href="mailto:info@thejasperhub.com">
                                    info@thejasperhub.com
                                </a>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-montserrat text-xs text-white mb-1 uppercase tracking-wider font-semibold">
                                    {t('footerHeadquarters')}
                                </span>
                                <p className="leading-relaxed">
                                    {isInquiry ? t('address').split(/(36-40)/).map((part, index) => (
                                        part === '36-40' ? <span key={index} className="whitespace-nowrap">{part}</span> : part
                                    )) : t('address')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-3 flex flex-col">
                        <h3 className={`font-montserrat font-bold text-white mb-4 ${isInquiry ? 'text-xl leading-7' : 'text-base'}`}>
                            {t('footerLinks')}
                        </h3>
                        <nav
                            aria-label={t('footerNavigation')}
                            className={`flex flex-col space-y-3 font-inter text-[#8A8A8A] ${isInquiry ? 'text-[15px] leading-6' : 'text-sm'}`}
                        >
                            {links.map(({ label, to }) => (
                                <Link key={to} to={to} className="hover:text-brand-green transition-colors">
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className={`pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 font-inter text-[#8A8A8A] ${isInquiry ? 'text-[13px] leading-5' : 'text-xs'}`}>
                    <p>{t('copyright')}</p>
                    <a
                        className="hover:text-white transition-colors font-montserrat text-xs"
                        href="https://thejasperhub.com"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        thejasperhub.com
                    </a>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;
