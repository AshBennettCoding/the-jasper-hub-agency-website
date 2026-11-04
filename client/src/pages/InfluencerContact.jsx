import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CreatorInquiryForm from '../components/CreatorInquiryForm';
import InfluencerFAQ from '../components/InfluencerFAQ';
import ChooseCard01 from '../assets/choose_card_01.webp';
import ChooseCard02 from '../assets/choose_card_02.webp';
import ChooseCard03 from '../assets/choose_card_03.webp';
import AgencyLogo from '../assets/Agency-LOGO.png';

const trustItems = [
    ['verified_user', 'trustVerifiedTitle', 'trustVerifiedDesc'],
    ['timer', 'trustReviewTitle', 'trustReviewDesc'],
    ['group_work', 'trustRosterTitle', 'trustRosterDesc'],
    ['public', 'trustReachTitle', 'trustReachDesc'],
];

const contactDomains = [
    ['@thejasperhub.com', 'domainCorporate'],
    ['@thejasperhub.org', 'domainTalentOps'],
    ['@collabjasperglobal.com', 'domainCampaigns'],
];

const collaborationImages = [
    { src: ChooseCard02, alt: 'collaborationAltCreators', caption: 'collaborationCaptionCreators' },
    { src: ChooseCard01, alt: 'collaborationAltAgency', caption: 'collaborationCaptionAgency' },
    { src: ChooseCard03, alt: 'collaborationAltGlobal', caption: 'collaborationCaptionGlobal' },
];

const InfluencerContact = ({ changeLanguage, i18n }) => {
    const { t } = useTranslation();
    const language = i18n?.language || 'en';
    const [inquiryType, setInquiryType] = useState('');
    const isCreator = inquiryType === 'creator_representation';

    return (
        <div className="min-h-screen bg-[#F4FBF4] font-montserrat text-[#161D19]">
            <Navbar changeLanguage={changeLanguage} i18n={i18n} t={t} />
            <main className="w-full bg-[#F4FBF4] pt-20">
                {isCreator ? (
                    <section className="mx-auto flex max-w-[1200px] flex-col items-center px-6 pb-12 pt-16 text-center">
                        <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#E6F8F0] px-4 py-1.5 text-[13px] font-semibold uppercase leading-5 tracking-[0.12em] text-[#0FB97F] shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-[#0FB97F]" aria-hidden="true" />
                            {t('creatorEyebrow')}
                        </p>
                        <h1 className="mb-6 max-w-4xl text-[32px] font-bold leading-[1.18] text-[#0A0A0A] sm:text-[40px]">
                            {t('creatorTitle')}
                        </h1>
                        <p className="max-w-xl font-inter text-lg leading-relaxed text-[#4A4A4A]">
                            {t('creatorDescription')}
                        </p>
                        <div className="mt-8 h-1 w-12 rounded-full bg-[#0FB97F]" aria-hidden="true" />
                    </section>
                ) : (
                <section className="relative overflow-hidden bg-white pb-16 pt-10">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-40"
                        style={{
                            backgroundImage: 'radial-gradient(#0fb97f 1px, transparent 1px)',
                            backgroundSize: '24px 24px',
                        }}
                    />
                    <div className="relative mx-auto max-w-[1200px] px-6">
                        <nav aria-label={t('breadcrumb')} className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#3C4A42]">
                            <a className="hover:text-[#006C48]" href={`/?lang=${language}`}>{t('talentBreadcrumbHome')}</a>
                            <span className="material-symbols-outlined text-[14px]" aria-hidden="true">chevron_right</span>
                            <span>{t('talentBreadcrumbAudience')}</span>
                            <span className="material-symbols-outlined text-[14px]" aria-hidden="true">chevron_right</span>
                            <span className="font-bold text-[#006C48]" aria-current="page">{t('talentBreadcrumbCurrent')}</span>
                        </nav>

                        <div className="max-w-3xl">
                            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#E6F8F0] px-3.5 py-1 text-[13px] font-semibold uppercase leading-5 tracking-[0.1em] text-[#0FB97F] shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-[#0FB97F]" aria-hidden="true" />
                                {t('talentEyebrow')}
                            </p>
                            <h1 className="mb-4 text-[32px] font-bold leading-[1.2] text-[#0A0A0A] sm:text-[40px]">
                                {t('talentTitle')}
                            </h1>
                            <p className="font-inter text-lg leading-relaxed text-[#4A4A4A]">
                                {t('talentDescription')}
                            </p>
                        </div>

                        <ul aria-label={t('trustIndicatorsAria')} className="mt-10 grid grid-cols-2 gap-4 border-t border-[#EAEAEA] pt-6 sm:grid-cols-4">
                            {trustItems.map(([icon, title, description]) => (
                                <li key={title} className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-2xl text-[#0FB97F]" aria-hidden="true">
                                        {icon}
                                    </span>
                                    <span>
                                        <span className="block text-sm font-bold text-[#111111]">{t(title)}</span>
                                        <span className="font-inter block text-[13px] leading-5 text-[#8A8A8A]">{t(description)}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
                )}

                <section className={isCreator ? 'mx-auto max-w-[880px] px-6 pb-10' : 'w-full bg-[#E7F8F2]/70 py-6'}>
                    <div className={isCreator ? '' : 'mx-auto max-w-[1200px] px-6'}>
                        {isCreator ? (
                            <div className="overflow-hidden rounded-xl border-l-[6px] border-[#0FB97F] bg-white py-6 pl-[18px] pr-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:py-7 sm:pl-[22px] sm:pr-7">
                                <div className="flex items-start gap-4">
                                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E7F8F2] text-[#0FB97F]">
                                        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 0" }} aria-hidden="true">verified_user</span>
                                    </span>
                                    <div className="flex min-w-0 flex-col gap-1.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-xl font-bold leading-snug text-[#0A0A0A]">{t('creatorAuthTitle')}</h2>
                                            <span className="rounded bg-[#E6F8F0] px-2 py-0.5 text-[11px] font-bold uppercase leading-6 text-[#0FB97F]">{t('creatorAuthBadge')}</span>
                                        </div>
                                        <p className="font-inter text-[15px] leading-relaxed text-[#4A4A4A]">
                                            {t('creatorAuthDescription')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                        <div className="grid gap-6 rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:items-center">
                            <div className="flex items-start gap-4">
                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E6F8F0] text-[#0FB97F]">
                                    <span className="material-symbols-outlined text-2xl" aria-hidden="true">security</span>
                                </span>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-base font-semibold text-[#111111]">{t('authTitle')}</h2>
                                        <span className="rounded-full bg-[#0FB97F] px-2 py-0.5 text-[10px] font-semibold leading-6 uppercase text-white">
                                            {t('authBadge')}
                                        </span>
                                    </div>
                                    <p className="font-inter mt-1 text-[13px] leading-5 text-[#4A4A4A]">
                                        {t('authDescription')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex min-w-0 flex-col items-start gap-2.5">
                                <ul aria-label={t('verifiedDomainsAria')} className="flex w-full min-w-0 flex-col items-start gap-2.5">
                                    {contactDomains.map(([domain, purpose]) => (
                                        <li key={domain} className="flex max-w-full flex-wrap items-center gap-x-2 rounded-lg bg-[#EEF6EE] px-3.5 py-2">
                                            <span className="h-2 w-2 shrink-0 rounded-full bg-[#0FB97F]" aria-hidden="true" />
                                            <span className="whitespace-nowrap font-['Courier_New',monospace] text-xs font-semibold leading-4 text-[#0A0A0A]">{domain}</span>
                                            <span className="font-inter pl-1 text-[11px] leading-6 text-[#8A8A8A]">{t(purpose)}</span>
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    className="inline-flex max-w-full items-center gap-1.5 pl-2 text-xs font-semibold leading-4 text-[#006C48] hover:text-[#0CA06E]"
                                    href="mailto:info@thejasperhub.com"
                                >
                                    <span className="material-symbols-outlined text-[16px] leading-4" aria-hidden="true">contact_support</span>
                                    {t('hotline')}
                                </a>
                            </div>
                        </div>
                        )}
                    </div>
                </section>

                <section aria-label={t('inquiryFormAria')} className={isCreator ? 'w-full pb-24' : 'w-full bg-[#F4FBF4] py-16'}>
                    <div className={isCreator ? 'mx-auto max-w-[880px] px-6' : 'mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-8 px-6 lg:grid-cols-12'}>
                        <div className={isCreator ? 'rounded-xl bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.05)] sm:p-12' : 'rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:p-10 lg:col-span-8'}>
                            <CreatorInquiryForm inquiryType={inquiryType} onInquiryTypeChange={setInquiryType} />
                        </div>
                        {!isCreator && <aside aria-label={t('partnershipSupportAria')} className="flex min-w-0 flex-col gap-6 lg:col-span-4">
                            <section className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                                <div className="mb-4 flex items-center gap-3">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E6F8F0] text-[#0FB97F]">
                                        <span className="material-symbols-outlined text-xl" aria-hidden="true">handshake</span>
                                    </span>
                                    <div>
                                        <h3 className="text-base font-semibold leading-6 text-[#0A0A0A]">{t('talentDeskTitle')}</h3>
                                        <span className="text-xs font-bold leading-5 text-[#0FB97F]">{t('talentDeskSla')}</span>
                                    </div>
                                </div>
                                <p className="font-inter mb-6 text-[13px] leading-relaxed text-[#4A4A4A]">
                                    {t('talentDeskDescription')}
                                </p>
                                <dl className="space-y-2 rounded-xl bg-[#EEF6EE] p-4 font-inter text-xs leading-4 text-[#4A4A4A]">
                                    <div className="flex items-center justify-between">
                                        <dt className="font-montserrat font-semibold text-[#8A8A8A]">{t('talentAgencyInquiries')}</dt>
                                        <dd className="font-medium text-[#0A0A0A]">{t('within24Hours')}</dd>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-[#E8F0E8] pt-1">
                                        <dt className="font-montserrat font-semibold text-[#8A8A8A]">{t('rosterReview')}</dt>
                                        <dd className="font-medium text-[#006C48]">{t('hours24to48')}</dd>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-[#E8F0E8] pt-1">
                                        <dt className="font-montserrat font-semibold text-[#8A8A8A]">{t('campaignCollab')}</dt>
                                        <dd className="font-medium text-[#0A0A0A]">{t('directManagerSync')}</dd>
                                    </div>
                                </dl>
                            </section>
                            <section className="rounded-2xl bg-[#0A0A0A] p-8 text-white shadow-lg">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="text-[11px] font-bold uppercase leading-6 tracking-[0.1em] text-[#6FFCBC]">{t('contactCardLabel')}</h3>
                                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#DDE4DD]/10 px-2 py-0.5 text-[11px] font-semibold leading-6 text-[#0FB97F]">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#0FB97F]" aria-hidden="true" />
                                        {t('contactCardStatus')}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center gap-4 font-inter text-[15px]">
                                    <div className="h-14 w-14 shrink-0 rounded-full bg-white p-1">
                                        <img
                                            src={AgencyLogo}
                                            alt={t('contactCardAlt')}
                                            className="h-full w-full rounded-full object-contain"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-montserrat text-base font-semibold leading-6">{t('contactCardName')}</h4>
                                    </div>
                                </div>
                                <div className="font-inter mt-6 space-y-2.5 border-t border-white/10 pt-5 text-xs leading-4 text-[#8A8A8A]">
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-base text-[#6FFCBC]" aria-hidden="true">mail</span>
                                        <a className="break-all transition-colors hover:text-[#6FFCBC] focus:text-[#6FFCBC]" href="mailto:talents@collabjasperglobal.com">
                                            talents@collabjasperglobal.com
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-base text-[#6FFCBC]" aria-hidden="true">schedule</span>
                                        <span>{t('contactCardHours')}</span>
                                    </div>
                                </div>
                            </section>
                        </aside>}
                    </div>
                </section>

                {!isCreator && (
                    <section aria-labelledby="industry-citations-heading" className="bg-white py-16">
                        <div className="mx-auto max-w-[1200px] px-6">
                            <div className="mx-auto mb-12 max-w-xl text-center">
                                <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#006C48]">{t('industryCitations')}</p>
                                <h2 id="industry-citations-heading" className="text-[28px] font-bold leading-9 text-[#0A0A0A]">{t('industryTitle')}</h2>
                                <p className="mt-3 font-inter text-[15px] leading-6 text-[#4A4A4A]">{t('industryDescription')}</p>
                            </div>
                            <div className="grid gap-6 md:grid-cols-3">
                                {[
                                    ['industryBadgeBrands', 'industryValueBrands', 'industryTitleBrands', 'industryDescBrands', 'text-[#0FB97F] bg-[#E6F8F0]', 'monitoring'],
                                    ['industryBadgeGlobal', 'industryValueGlobal', 'industryTitleGlobal', 'industryDescGlobal', 'text-[#1A73E8] bg-[#E8F0FE]', 'public'],
                                    ['industryBadgeVerified', 'industryValueVerified', 'industryTitleVerified', 'industryDescVerified', 'text-[#8430D9] bg-[#F3E8FD]', 'verified'],
                                ].map(([badge, value, title, description, color, icon]) => (
                                    <article key={title} className="rounded-2xl bg-[#F4FBF4] p-6">
                                        <div className="mb-4 flex items-center justify-between gap-2">
                                            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${color}`}>{t(badge)}</span>
                                            <span className={`material-symbols-outlined text-2xl ${color.split(' ')[0]}`} aria-hidden="true">{icon}</span>
                                        </div>
                                        <p className="text-[32px] font-extrabold leading-10 text-[#0A0A0A]">{t(value)}</p>
                                        <h3 className="mt-1 text-sm font-bold">{t(title)}</h3>
                                        <p className="mt-1 font-inter text-xs leading-5 text-[#8A8A8A]">{t(description)}</p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <InfluencerFAQ variant={isCreator ? 'creator' : 'talent'} />

                {!isCreator && <section className="w-full border-t border-[#E8F0E8] bg-white py-16">
                    <div className="mx-auto max-w-[1200px] px-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {collaborationImages.map(({ src, alt, caption }) => (
                                <figure key={src} className="group relative overflow-hidden rounded-2xl shadow-sm">
                                    <img
                                        src={src}
                                        alt={t(alt)}
                                        loading="lazy"
                                        className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A0A0A]/80 to-transparent p-5 pt-12 text-xs font-semibold text-white">
                                        {t(caption)}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    </div>
                </section>}

                {!isCreator && <section className="w-full bg-white py-20">
                    <div className="mx-auto max-w-[1200px] px-6">
                        <div className="max-w-2xl">
                            <h2 className="text-5xl font-extrabold uppercase leading-none text-[#0A0A0A] sm:text-6xl">
                                {t('homeCtaLine1')}<br />
                                {t('homeCtaLine2')}<br />
                                {t('homeCtaLine3')}
                            </h2>
                            <p className="font-inter mt-6 max-w-lg text-base leading-7 text-[#4A4A4A] sm:text-lg">
                                {t('talentCtaDescription')}
                            </p>
                            <div className="mt-8 flex flex-wrap items-center gap-4">
                            <a
                                className="group inline-flex min-h-12 items-center gap-3 rounded-full border-2 border-[#111111] px-8 py-3 text-sm font-semibold text-[#111111] transition-colors hover:bg-[#111111] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#0FB97F] focus:ring-offset-2"
                                href="#inquiry-type"
                            >
                                <span>{t('talentCtaContact')}</span>
                                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1" aria-hidden="true">
                                    arrow_forward
                                </span>
                            </a>
                            <a className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#E7F8F2] px-6 py-3 text-sm font-semibold text-[#006C48] hover:bg-[#D2F3E5]" href="mailto:info@thejasperhub.com">
                                <span className="material-symbols-outlined text-lg" aria-hidden="true">mail</span>
                                {t('talentCtaEmail')}
                            </a>
                            </div>
                        </div>
                    </div>
                </section>}
            </main>
            <Footer variant={isCreator ? 'creator' : 'talent'} />
        </div>
    );
};

export default InfluencerContact;
