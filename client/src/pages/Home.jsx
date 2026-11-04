import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import HeroBg from '../assets/hero-bg.webp';
import ChooseCard01 from '../assets/choose_card_01.webp';
import ChooseCard02 from '../assets/choose_card_02.webp';
import ChooseCard03 from '../assets/choose_card_03.webp';
import CapCutLogo from '../assets/capcut-logo.webp';
import DolaLogo from '../assets/dola-logo.webp';
import FacemojiLogo from '../assets/facemoji-logo.webp';
import HailuoAILogo from '../assets/hailuoai-logo.webp';
import CanvaLogo from '../assets/canvas-logo.webp';
import DreaminaLogo from '../assets/Dreamina-logo.webp';
import Lemon8Logo from '../assets/Lemon8-logo.webp';
import HypicLogo from '../assets/Hypic-logo.webp';
import KlingAILogo from '../assets/klingAI-logo.webp';
import SelfyzAILogo from '../assets/selfyzAI-logo.webp';
import AirBrushLogo from '../assets/airbrush-logo.webp';
import QuestionAILogo from '../assets/QuestionAI-logo.webp';

const brandLogos = [
    { name: 'CapCut', image: CapCutLogo },
    { name: 'Dola', image: DolaLogo },
    { name: 'Facemoji', image: FacemojiLogo },
    { name: 'Hailuo AI', image: HailuoAILogo },
    { name: 'Canva', image: CanvaLogo },
    { name: 'Dreamina', image: DreaminaLogo },
    { name: 'Lemon8', image: Lemon8Logo },
    { name: 'Hypic', image: HypicLogo },
    { name: 'Kling AI', image: KlingAILogo },
    { name: 'Selfyz AI', image: SelfyzAILogo },
    { name: 'AirBrush', image: AirBrushLogo },
    { name: 'Question AI', image: QuestionAILogo },
];

const featureCards = [
    {
        titleKey: 'reason1',
        descriptionKey: 'reason1Desc',
        tag: 'Successful Cases',
        tagClass: 'bg-[#E9F2FE] text-[#1A73E8]',
        image: ChooseCard01,
        alt: 'Business partners discussing a campaign',
    },
    {
        titleKey: 'reason2',
        descriptionKey: 'reason2Desc',
        tag: 'Data-Driven',
        tagClass: 'bg-[#E6F8F0] text-[#0FB97F]',
        image: ChooseCard02,
        alt: 'Marketing analytics and growth metrics',
    },
    {
        titleKey: 'reason3',
        descriptionKey: 'reason3Desc',
        tag: 'Asset accumulation',
        tagClass: 'bg-[#F5EDFD] text-[#8430D9]',
        image: ChooseCard03,
        alt: 'Creative team planning a campaign',
    },
];

const Home = ({ changeLanguage, i18n }) => {
    const { t } = useTranslation();
    const language = i18n?.language || 'en';

    return (
        <div className="min-h-screen font-montserrat">
            <Navbar isHome changeLanguage={changeLanguage} i18n={i18n} t={t} />
            <main className="w-full bg-white pt-20">
                <section
                    id="home"
                    className="relative flex min-h-[580px] w-full items-center justify-center overflow-hidden pb-20 pt-16 md:min-h-[640px] md:pb-28 md:pt-24"
                >
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 scale-105 bg-cover bg-center opacity-40 mix-blend-multiply blur-[1.5px]"
                        style={{ backgroundImage: `url(${HeroBg})` }}
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/85 to-white"
                    />
                    <div className="relative z-10 mx-auto flex max-w-[1000px] flex-col items-center px-6 text-center">
                        <Link
                            to={`/globaltalents-collab?lang=${language}`}
                            className="group mb-8 inline-flex items-center gap-2 rounded-full border border-[#0FB97F]/40 bg-white/90 px-5 py-2 text-xs font-semibold uppercase text-[#006C48] shadow-sm transition hover:-translate-y-0.5 hover:border-[#0FB97F] hover:bg-[#E7F8F2]/70 hover:shadow-md sm:text-sm"
                        >
                            <span className="h-2 w-2 rounded-full bg-[#0FB97F]" aria-hidden="true" />
                            <span>{t('forInfluencers')}</span>
                            <span className="material-symbols-outlined text-base text-[#0FB97F]" aria-hidden="true">arrow_forward</span>
                        </Link>
                        <p className="mb-4 text-xs font-semibold uppercase text-[#555555] sm:text-[13px] sm:tracking-[0.24em]">
                            {t('intro_tag')}
                        </p>
                        <h1 className="mb-5 text-[40px] font-extrabold leading-[1.12] text-[#111111] sm:text-[54px] md:text-[64px]">
                            The Jasper Hub Agency
                        </h1>
                        <p className="font-inter mb-10 max-w-2xl text-base leading-relaxed text-[#555555] sm:text-lg md:text-[19px]">
                            {t('intro_sub')}
                        </p>
                        <Link
                            to={`/contact?lang=${language}`}
                            className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0FB97F] px-8 py-3.5 text-sm font-bold uppercase text-white shadow-[0_8px_20px_rgba(15,185,127,0.32)] transition hover:-translate-y-1 hover:scale-[1.02] hover:bg-[#0CA06E] hover:shadow-[0_12px_28px_rgba(15,185,127,0.45)] active:translate-y-0 md:text-base"
                        >
                            <span>{t('getStarted')}</span>
                            <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1" aria-hidden="true">
                                arrow_forward
                            </span>
                        </Link>
                    </div>
                </section>

                <AboutSection i18n={i18n} t={t} />

                <section id="why-choose-us" className="w-full bg-white py-24">
                    <div className="mx-auto max-w-[1240px] px-6">
                        <div className="mb-16 flex flex-col items-center text-center">
                            <div className="mb-4 flex items-center justify-center">
                                <img
                                    src={require('../assets/Agency-LOGO.png')}
                                    alt="The Jasper Hub"
                                    className="h-8 w-[120px] object-cover object-center"
                                />
                            </div>
                            <h2 className="text-3xl font-extrabold text-[#111111] sm:text-4xl">
                                {t('whyChooseUs')}
                            </h2>
                            <div className="mb-4 mt-3.5 h-1 w-12 rounded-full bg-[#0FB97F]" />
                            <p className="font-inter max-w-xl text-base leading-relaxed text-[#555555]">
                                {language === 'zh'
                                    ? '我们提供全面的解决方案，帮助您的品牌在数字领域中脱颖而出。'
                                    : 'We provide comprehensive solutions to help your brand stand out in the digital landscape.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
                            {featureCards.map((card, index) => (
                                <motion.article
                                    key={card.titleKey}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.35, delay: index * 0.08 }}
                                    className="group flex flex-col rounded-3xl border border-gray-100 bg-white p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]"
                                >
                                    <span className={`mb-5 inline-flex w-fit items-center rounded-full px-4 py-1.5 text-xs font-semibold ${card.tagClass}`}>
                                        {card.tag}
                                    </span>
                                    <h3 className="mb-3 text-xl font-bold text-[#111111] transition-colors group-hover:text-[#006C48]">
                                        {t(card.titleKey)}
                                    </h3>
                                    <p className="font-inter mb-6 flex-grow text-sm leading-relaxed text-[#555555]">
                                        {t(card.descriptionKey)}
                                    </p>
                                    <div className="h-52 w-full overflow-hidden rounded-2xl bg-gray-100">
                                        <img
                                            src={card.image}
                                            alt={card.alt}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="w-full border-t border-gray-100 bg-white py-20">
                    <div className="mx-auto max-w-[1240px] px-6">
                        <div className="mb-16 text-center">
                            <h2 className="mb-3 text-3xl font-extrabold text-[#111111] sm:text-4xl">
                                {t('successCases')}
                            </h2>
                            <p className="font-inter text-base text-[#555555]">{t('brandsWeWorkedWith')}</p>
                        </div>
                        <div className="grid grid-cols-2 items-center justify-items-center gap-8 sm:grid-cols-3 md:grid-cols-6">
                            {brandLogos.map(({ name, image }) => (
                                <div
                                    key={name}
                                    className="group flex h-24 w-24 items-center justify-center rounded-2xl p-4 opacity-70 transition hover:scale-105 hover:bg-gray-50 hover:opacity-100"
                                >
                                    <img
                                        src={image}
                                        alt={name}
                                        loading="lazy"
                                        className="max-h-full max-w-full object-contain grayscale transition group-hover:grayscale-0"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="contact" className="w-full bg-white py-24">
                    <div className="mx-auto max-w-[1240px] px-6">
                        <div className="flex max-w-3xl flex-col items-start">
                            <h2 className="mb-6 text-5xl font-extrabold uppercase leading-[1.05] text-[#111111] sm:text-6xl md:text-7xl">
                                {language === 'zh' ? (
                                    <>让我们<br />开始<br />合作！</>
                                ) : (
                                    <>LET&apos;S<br />WORK<br />TOGETHER!</>
                                )}
                            </h2>
                            <p className="font-inter mb-8 max-w-2xl text-base leading-relaxed text-[#555555] sm:text-lg">
                                {language === 'zh'
                                    ? '准备好将您的品牌提升到新高度了吗？让我们一起创造卓越。'
                                    : "Ready to take your brand to the next level? Let's create something extraordinary together."}
                            </p>
                            <Link
                                to={`/contact?lang=${language}`}
                                className="group inline-flex items-center gap-3 rounded-lg border border-black/80 bg-white px-7 py-3 text-sm font-bold text-[#111111] shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-md"
                            >
                                <span>{language === 'zh' ? '联系我们' : 'Contact Us'}</span>
                                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1" aria-hidden="true">
                                    arrow_forward
                                </span>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer wide />
        </div>
    );
};

export default Home;
