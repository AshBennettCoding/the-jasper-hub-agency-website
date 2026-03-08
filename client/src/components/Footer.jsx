import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-brand-dark text-white py-16 px-8 md:px-16 font-montserrat" // 应用指定字体
        >
            <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-3 gap-10 mb-10">
                    <div>
                        <h3 className="text-2xl font-bold text-brand-green mb-4 font-montserrat">{t('agencyName')}</h3>
                        <p className="text-brand-gray font-montserrat">{t('intro')}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4 font-montserrat">Contact</h3>
                        <p className="text-brand-gray mb-2 font-montserrat">{t('emailAddress')}</p>
                        <p className="text-brand-gray font-montserrat mt-auto">{t('address')}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4 font-montserrat">Links</h3>
                        <ul className="space-y-2 font-montserrat">
                            <li><a href="/" className="text-brand-gray hover:text-brand-green transition-colors font-montserrat">Home</a></li>
                            <li><a href="/services" className="text-brand-gray hover:text-brand-green transition-colors font-montserrat">Services</a></li>
                            <li><a href="/contact" className="text-brand-gray hover:text-brand-green transition-colors font-montserrat">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <hr className="border-gray-800 mb-6" />
                <p className="text-center text-brand-gray font-montserrat">{t('copyright')}</p>
            </div>
        </motion.footer>
    );
};

export default Footer;