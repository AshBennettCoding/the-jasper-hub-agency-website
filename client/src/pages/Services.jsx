// src/pages/Services.jsx
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// 导入服务页横幅图片
import ServiceBanner from '../assets/serviceBanner.webp';
// 导入服务页插图
import StrategyPlan from '../assets/service-strategy.webp'
import ContentCreate from '../assets/service-content.webp'
import Influencer from '../assets/service-influencer.webp'

// 引入 Google Fonts
// const link = document.createElement('link');
// link.href = 'https://fonts.googleapis.com/css2?family=Sour+Gummy:ital,wght@0,100..900;1,100..900&display=swap';
// link.rel = 'stylesheet';
// document.head.appendChild(link);


const Services = ({ changeLanguage, i18n, t }) => {
    const { t: translate } = useTranslation();
    const trans = typeof translate === 'function' ? translate : t;

    // 为每个部分创建ref
    const heroRef = useRef(null);
    const advantagesRef = useRef(null);
    const operationsRef = useRef(null);

    const isHeroInView = useInView(heroRef, { once: false, amount: 0.3 });
    const isAdvantagesInView = useInView(advantagesRef, { once: false, amount: 0.3 });
    const isOperationsInView = useInView(operationsRef, { once: false, amount: 0.3 });


    return (
        <div className="min-h-screen font-montserrat">
            {/* 导航栏 + 英雄区域：融合在同一个全屏section */}
            <section ref={heroRef} 
            className="relative w-full flex flex-col justify-center overflow-hidden" 
            style={{ minHeight: '100vh' }}>
                {/* 服务页横幅背景 */}
                <div className="absolute inset-0 z-0" style={{ minHeight: '100vh', width: '100vw', top: 0, left: 0 }}>
                    <img
                        src={ServiceBanner}
                        alt={trans('servicesBannerAlt')}
                        className="w-full h-full object-cover"
                        style={{ objectFit: 'cover', backgroundPosition: 'center' }}
                        loading='eager'
                    />
                    <div className="absolute inset-0 bg-white/80"></div>
                </div>

                {/* 导入共享导航栏：isHome=false → 透明背景，融入布局 */}
                <Navbar
                    isHome={true}
                    changeLanguage={changeLanguage}
                    i18n={i18n}
                    t={trans}
                />

                {/* 英雄区域内容 */}
                <div className="relative z-20 max-w-7xl mx-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-10xl lg:text-7xl font-bold text-gray-1000 mb-6 leading-tight" style={{ lineHeight: '1.35' }}>
                            {trans('servicesHeroLine1')}<br />
                            {trans('servicesHeroLine2')}<br />
                            {trans('servicesHeroLine3')}
                        </h1>
                    </motion.div>
                </div>
            </section>


            {/* 第二部分：服务优势 */}
            <section ref={advantagesRef} className="overflow-x-clip py-24 px-4 md:px-8 lg:px-16 bg-[#F8F7F4]">
                <div className="max-w-7xl mx-auto">
                    {/* 两列全宽度布局 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* 左侧：视觉故事拼贴画 */}
                        <div className="relative mb-[90px] h-[600px] lg:mb-0 lg:h-[700px]">
                            {/* 重叠的图片卡片1 */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={isAdvantagesInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="absolute top-0 left-0 w-[70%] h-[60%] z-10"
                                whileHover={{ scale: 1.05, y: -10 }}
                            >
                                <img
                                    src={StrategyPlan}
                                    loading='lazy'
                                    alt={trans('servicesStrategyImageAlt')}
                                    className="w-full h-full object-cover rounded-2xl shadow-2xl"
                                />
                                {/* 浮动UI元素 */}
                                <div className="absolute top-4 right-4 bg-white rounded-full shadow-lg p-2">
                                    <span className="text-xl">📊</span>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-[#F5D76E] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                    {trans('servicesStrategy')}
                                </div>
                            </motion.div>

                            {/* 重叠的图片卡片2 */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={isAdvantagesInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                className="absolute top-[23%] right-0 w-[65%] h-[53%] z-20"
                                whileHover={{ scale: 1.05, y: -10 }}
                            >
                                <img
                                    src={ContentCreate}
                                    loading='lazy'
                                    alt={trans('servicesContentImageAlt')}
                                    className="w-full h-full object-cover rounded-2xl shadow-2xl"
                                />
                                {/* 浮动UI元素 */}
                                <div className="absolute top-4 left-4 bg-white rounded-full shadow-lg p-2">
                                    <span className="text-xl">📱</span>
                                </div>
                                <div className="absolute bottom-4 right-4 bg-[#0FB97F] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                    {trans('servicesContent')}
                                </div>
                            </motion.div>

                            {/* 重叠的图片卡片3 */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={isAdvantagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                                className="absolute top-[60%] left-[5%] w-[65%] h-[55%] z-30"
                                whileHover={{ scale: 1.05, y: -10 }}
                            >
                                <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl">
                                    <img
                                        src={Influencer}
                                        loading='lazy'
                                        alt={trans('servicesInfluencerImageAlt')}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* 浮动UI元素 */}
                                    <div className="absolute top-8 right-8 bg-white rounded-full shadow-lg p-3">
                                        <span className="text-2xl">🤝</span>
                                    </div>
                                    <div className="absolute bottom-8 left-8 bg-[#8B5CF6] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                        {trans('servicesInfluencer')}
                                    </div>
                                </div>
                            </motion.div>


                        </div>

                        {/* 右侧：结构化内容面板 */}
                        <div className="bg-[#ffd6d6f5] rounded-3xl p-8 md:p-10 shadow-xl">
                            {/* 大标题 */}
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={isAdvantagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="text-5xl md:text-4xl lg:text-5xl font-bold text-gray-700 mb-2 font-sans"
                                style={{ fontFamily: "'Sour Gummy', sans-serif" }}
                            >
                                {trans('servicesStrategyTitle')}
                            </motion.h2>

                            {/* 小写大写副标题 */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={isAdvantagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                                className="text-xs md:text-sm uppercase tracking-widest text-gray-600 mb-4"
                            >
                                {trans('servicesStrategySubtitle')}
                            </motion.p>

                            {/* 三个内容块 */}
                            <div className="space-y-4">
                                {[
                                    {
                                        label: trans('servicesStrategy'),
                                        labelColor: '#F5D76E',
                                        desc: trans('servicesStrategyDesc'),
                                    },
                                    {
                                        label: trans('servicesContent'),
                                        labelColor: '#0FB97F',
                                        desc: trans('servicesContentDesc'),
                                    },
                                    {
                                        label: trans('servicesInfluencer'),
                                        labelColor: '#8B5CF6',
                                        desc: trans('servicesInfluencerDesc'),
                                    }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isAdvantagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                        transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                                        className="group"
                                    >
                                        {/* 药丸形状标签 */}
                                        <div className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold mb-2`} style={{ backgroundColor: item.labelColor, color: 'white' }}>
                                            {item.label}
                                        </div>
                                        {/* 短描述段落 */}
                                        <p className="text-gray-700 leading-relaxed text-sm">
                                            {item.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                        </div>

                    </div>
                </div>
            </section>


            {/* 第三部分：协作服务 */}
            <section ref={operationsRef} className="py-24 px-4 md:px-8 lg:px-16 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    {/* 居中对齐的标题 */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isOperationsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-center font-sans"
                    >
                        {trans('servicesCooperation')}
                    </motion.h2>

                    {/* 小写大写副标题 */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isOperationsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        className="text-sm md:text-base uppercase tracking-widest text-gray-600 max-w-4xl mx-auto mb-16 text-center"
                    >
                        {trans('servicesCooperationSubtitle')}
                    </motion.p>

                    {/* 五项执行节点 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                        {[
                            {
                                icon: 'investigate',
                                title: trans('servicesStepAnalysis'),
                                desc: trans('servicesStepAnalysisDesc'),
                            },
                            {
                                icon: 'analysis',
                                title: trans('servicesStepStrategy'),
                                desc: trans('servicesStepStrategyDesc'),
                            },
                            {
                                icon: 'execute',
                                title: trans('servicesStepExecution'),
                                desc: trans('servicesStepExecutionDesc'),
                            },
                            {
                                icon: 'reanalyze',
                                title: trans('servicesStepReview'),
                                desc: trans('servicesStepReviewDesc'),
                            },
                            {
                                icon: 'discussion',
                                title: trans('servicesStepAlignment'),
                                desc: trans('servicesStepAlignmentDesc'),
                            }
                        ].map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isOperationsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                                className="group"
                            >
                                {/* 极简图标盒子：无背景，预留矢量图标位置 */}
                                <div className="flex items-center justify-center w-16 h-16 mb-4 mx-auto">
                                    {/* 这里可以替换为矢量图标 */}
                                    <img
                                        src={require(`../assets/icons/${service.icon}.png`)}
                                        loading='eager'
                                        alt={service.title}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* 粗体服务标题 */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{service.title}</h3>

                                {/* 短描述段落 */}
                                <p className="text-gray-600 leading-relaxed text-center">{service.desc}</p>
                            </motion.div>
                        ))}
                    </div>


                    {/* 连接元素 */}
                    <div className="relative mt-8 mb-12">
                        {/* 细水平线 */}
                        <div className="h-px bg-gray-300 w-full"></div>

                        {/* 五个圆形节点 */}
                        <div className="absolute top-0 left-[10%] transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#F5D76E]"></div>
                        <div className="absolute top-0 left-[30%] transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0FB97F]"></div>
                        <div className="absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#8B5CF6]"></div>
                        <div className="absolute top-0 left-[70%] transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#F5D76E]"></div>
                        <div className="absolute top-0 right-[10%] transform translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#0FB97F]"></div>
                    </div>

                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Services;
