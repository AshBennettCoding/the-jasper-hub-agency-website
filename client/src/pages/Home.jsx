// src/pages/Home.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // 添加导航钩子导入

import Navbar from '../components/Navbar'; // 导入共享导航栏
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';

// 导入背景图（替换为你的路径）
import HeroBg from '../assets/hero-bg.jpg';
// 导入卡片图（替换为你的路径）
import ChooseCard01 from '../assets/choose_card_01.jpg'
import ChooseCard02 from '../assets/choose_card_02.jpg'
import ChooseCard03 from '../assets/choose_card_03.avif'
// 合作伙伴品牌LOGO
import CapCutLogo from '../assets/capcut-logo.png';
import DolaLogo from '../assets/dola-logo.png';
import FacemojiLogo from '../assets/facemoji-logo.png';
import HailuoAILogo from '../assets/hailuoai-logo.png';
import CanvaLogo from '../assets/canvas-logo.png';
import DreaminaLogo from '../assets/Dreamina-logo.png';
import Lemon8Logo from '../assets/Lemon8-logo.png';
import HypicLogo from '../assets/Hypic-logo.png';
import klingAILogo from '../assets/klingAI-logo.png';
import selfyzAILogo from '../assets/selfyzAI-logo.png';
import AirBrushLogo from '../assets/airbrush-logo.png';
import QuestionAILogo from '../assets/QuestionAI-logo.png';
// 导入logo图标
import LogoIcon from '../assets/Agency-LOGO.png';



const Home = ({ changeLanguage, i18n }) => {

    const { t } = useTranslation();
    const navigate = useNavigate(); // 添加导航钩子初始化

    const [currentSubIndex, setCurrentSubIndex] = useState(0);
    const carouselTimerRef = useRef(null);

    // 添加跳转到服务页面的函数
    const handleContactNavigate = () => {
        const contactRoute = `/contact?lang=${i18n.language}`;
        navigate(contactRoute);
    };

    // 副标题配置
    const subTitleConfig = useMemo(() => ({
        en: [
            t('intro_sub'),
            "Professional full-case planning of marketing activities for APP/website products on social media platforms"
        ],
        zh: [
            t('intro_sub'),
            "专业服务APP/网站产品在社媒平台上的营销活动全案策划"
        ]
    }), [t]);

    const getSubTitleList = useCallback(() => {
        return subTitleConfig[i18n.language] || subTitleConfig.en;
    }, [i18n.language, subTitleConfig]);

    // 轮播启停函数
    const startCarousel = useCallback(() => {
        if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
        carouselTimerRef.current = setInterval(() => {
            setCurrentSubIndex(prev => (prev + 1) % getSubTitleList().length);
        }, 1100);
    }, [getSubTitleList]);

    const pauseCarousel = useCallback(() => {
        if (carouselTimerRef.current) {
            clearInterval(carouselTimerRef.current);
            carouselTimerRef.current = null;
        }
    }, []);

    // 初始化轮播
    useEffect(() => {
        setCurrentSubIndex(0);
        startCarousel();
        return () => pauseCarousel();
    }, [i18n.language, getSubTitleList, startCarousel, pauseCarousel]);

    // 文字动画
    const textAnimate = (delay) => ({
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.9, delay, ease: "easeOut" } }
    });

    // 副标题轮播动画
    const subTitleVariants = {
        enter: (direction) => ({ y: direction > 0 ? 50 : -50, opacity: 0 }),
        center: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
        exit: (direction) => ({ y: direction > 0 ? -50 : 50, opacity: 0, transition: { duration: 0.5, ease: "easeIn" } })
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    // 品牌LOGO数据（示例）
    const brandLogos = [
        { id: 1, name: 'CapCut', logo: CapCutLogo },
        { id: 2, name: 'Dola', logo: DolaLogo },
        { id: 3, name: 'Facemoji', logo: FacemojiLogo },
        { id: 4, name: 'HailuoAI', logo: HailuoAILogo },
        { id: 5, name: 'Canva', logo: CanvaLogo },
        { id: 6, name: 'Dreamina', logo: DreaminaLogo },
        { id: 7, name: 'Lemon8', logo: Lemon8Logo },
        { id: 8, name: 'Hypic', logo: HypicLogo },
        { id: 9, name: 'klingAI', logo: klingAILogo },
        { id: 10, name: 'selfyzAI', logo: selfyzAILogo },
        { id: 11, name: 'AirBrush', logo: AirBrushLogo },
        { id: 12, name: 'QuestionAI', logo: QuestionAILogo }
    ];

    return (
        <div className="min-h-screen font-montserrat">
            {/* 首页：导航栏 + 简介 融合在同一个全屏section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative w-full flex flex-col items-center justify-center px-8 md:px-12 overflow-hidden"
                style={{ minHeight: '100vh' }}
            >
                {/* 全屏背景 */}
                <div className="absolute inset-0 z-0" style={{ minHeight: '100vh', width: '100vw', top: 0, left: 0 }}>
                    <img
                        src={HeroBg}
                        alt="Hero Background"
                        className="w-full h-full object-cover blur-sm opacity-70"
                        style={{ objectFit: 'cover', backgroundPosition: 'center' }}
                    />
                    <div className="absolute inset-0 bg-white/60"></div>
                </div>

                {/* 导入共享导航栏：isHome=true → 透明背景，融入布局 */}
                <Navbar
                    isHome={true}
                    changeLanguage={changeLanguage}
                    i18n={i18n}
                    t={t}
                />

                {/* 简介文字区域 */}
                <div className="mt-16 z-10">
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={textAnimate(0.4)}
                        className="text-base md:text-lg uppercase tracking-widest text-gray-800 mb-6 md:mb-8 font-montserrat"
                    >
                        {t('intro_tag')}
                    </motion.p>

                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={textAnimate(0.9)}
                        className="text-5xl md:text-7xl font-bold leading-tight text-gray-900 mb-8 md:mb-10 text-center font-montserrat"
                    >
                        The Jasper Hub Agency
                    </motion.h1>

                    {/* 副标题轮播（悬浮暂停） */}
                    <div
                        className="h-24 md:h-32 flex items-center justify-center overflow-hidden"
                        onMouseEnter={pauseCarousel}
                        onMouseLeave={startCarousel}
                        style={{ cursor: 'default' }}
                    >
                        <motion.div
                            key={`${i18n.language}-${currentSubIndex}`}
                            custom={1}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            variants={subTitleVariants}
                            className="w-full text-center"
                        >
                            <p className="text-xl md:text-2xl leading-relaxed text-gray-800 max-w-2xl mx-auto font-montserrat">
                                {getSubTitleList()[currentSubIndex]}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* 关于我们（示例） */}
            <AboutSection i18n={i18n} t={t} />

            {/* 为什么选择我们 */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={sectionVariants}
                className="py-24 px-4 md:px-8 lg:px-16 bg-gray-50 font-montserrat"
            >
                <div className="max-w-7xl mx-auto">
                    {/* 顶部居中的logo */}
                    <div className="flex justify-center mb-8">
                        <img
                            src={LogoIcon}
                            alt="Logo Icon"
                            className="w-60 h-auto"
                        />
                    </div>


                    {/* 大标题 */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-montserrat">
                            {t('whyChooseUs')}
                        </h2>
                        <div className="w-20 h-1.5 bg-[#0FB97F] mx-auto mb-8 rounded-full"></div>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {i18n.language === 'zh'
                                ? '我们提供全面的解决方案，帮助您的品牌在数字领域中脱颖而出。'
                                : 'We provide comprehensive solutions to help your brand stand out in the digital landscape.'}
                        </p>
                    </div>

                    {/* 三个功能卡片 */}
                    <div className="grid md:grid-cols-3 gap-10">
                        {/* 卡片1 */}
                        <motion.div
                            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group"
                            whileHover={{ y: -12 }}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            {/* 药丸形状的标签 */}
                            <div className="inline-block px-4 py-1.5 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold mb-6">
                                Successful Cases
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">{t('reason1')}</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">{t('reason1Desc')}</p>
                            <div className="h-40 bg-blue-200/50 rounded-xl overflow-hidden">
                                <img
                                    src={ChooseCard01}
                                    alt="Global Network"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>

                        {/* 卡片2 */}
                        <motion.div
                            className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group"
                            whileHover={{ y: -12 }}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {/* 药丸形状的标签 */}
                            <div className="inline-block px-4 py-1.5 bg-green-200 text-green-800 rounded-full text-sm font-semibold mb-6">
                                Data-Driven
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">{t('reason2')}</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">{t('reason2Desc')}</p>
                            <div className="h-40 bg-green-200/50 rounded-xl overflow-hidden">
                                <img
                                    src={ChooseCard02}
                                    alt="Data-Driven"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>

                        {/* 卡片3 */}
                        <motion.div
                            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group"
                            whileHover={{ y: -12 }}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            {/* 药丸形状的标签 */}
                            <div className="inline-block px-4 py-1.5 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold mb-6">
                                Asset accumulation
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">{t('reason3')}</h3>
                            <p className="text-gray-600 leading-relaxed mb-6">{t('reason3Desc')}</p>
                            <div className="h-40 bg-purple-200/50 rounded-xl overflow-hidden">
                                <img
                                    src={ChooseCard03}
                                    alt="Full Service"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* 成功案例：合作品牌LOGO展示 */}
            {/* 成功案例：合作品牌LOGO展示 */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={sectionVariants}
                className="py-24 px-4 md:px-8 lg:px-16 bg-white font-montserrat"
            >
                <div className="max-w-7xl mx-auto">
                    {/* 1. 区域标题 */}
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-montserrat">
                            {t('successCases')}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            {t('brandsWeWorkedWith')}
                        </p>
                    </div>

                    {/* 2. 客户展示区域 */}
                    <div className="mb-24 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
                        {brandLogos.map(brand => (
                            <div
                                key={brand.id}
                                className="flex items-center justify-center p-8 transition-all duration-200 hover:scale-110 opacity-70 hover:opacity-100 rounded-full cursor-pointer"
                            >
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="max-w-full max-h-16 object-contain filter grayscale hover:grayscale-0 transition-all duration-200"
                                />
                            </div>
                        ))}
                    </div>


                    {/* 3. 过渡区域 */}
                    <div className="w-full h-px bg-gray-200 mb-24"></div>

                    {/* 4. CTA区块（集成式，非独立部分） */}
                    {/* 4. CTA区块（极简编辑风格） */}
                    <div className="text-left">
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-gray-900 mb-8 leading-tight">
                            {i18n.language === 'zh' ? (
                                <>
                                    让我们<br />
                                    开始<br />
                                    合作！
                                </>
                            ) : (
                                <>
                                    LET'S<br />
                                    WORK<br />
                                    TOGETHER!
                                </>
                            )}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mb-12 leading-relaxed">
                            {i18n.language === 'zh'
                                ? '准备好将您的品牌提升到新高度了吗？让我们一起创造卓越。'
                                : 'Ready to take your brand to the next level? Let\'s create something extraordinary together.'}
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleContactNavigate}
                            className="group relative inline-flex items-center justify-between bg-transparent text-gray-900 px-10 py-5 border-2 border-gray-900 font-medium text-lg transition-all duration-300 hover:bg-gray-900 hover:text-white"
                        >
                            <span>{i18n.language === 'zh' ? '联系我们' : 'Contact Us'}</span>
                            <svg
                                className="w-6 h-6 ml-6 transition-transform duration-300 group-hover:translate-x-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </motion.button>
                    </div>

                </div>
            </motion.section>

            {/* 页脚 */}
            <Footer />
        </div>
    );
};

export default Home;
