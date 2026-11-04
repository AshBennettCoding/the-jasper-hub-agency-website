import React from 'react';

const questions = [
    {
        question: 'What is the contact email address of the Jasper Hub Agency?',
        answer: 'Our main email domain is @thejasperhub.com, which is for internal team communication and business consultation for brand partnerships.',
    },
    {
        question: 'Which are the email addresses of The Jasper Hub Agency for collaborating with influencers?',
        answer: '@thejasperhub.org and @collabjasperglobal.com are the main email addresses we use for collaborating with creators. However, in some cases, due to departmental reorganization or organizational structure optimization, we may need to add or optimize some email domain names in order to better maintain our connection with creators.',
    },
    {
        question: 'How can I determine whether other email addresses belong to The Jasper Hub Agency?',
        answer: (
            <>
                If you receive any business inquiries from other email addresses claiming to be from our team, we suggest forwarding the email to our official email address (
                <a className="font-semibold text-[#0FB97F] hover:underline" href="mailto:info@thejasperhub.com">
                    info@thejasperhub.com
                </a>
                ) for confirmation. We will respond promptly to let you know whether it is genuine or not, in order to protect your cooperation rights.
            </>
        ),
    },
];

const InfluencerFAQ = ({ variant = 'creator' }) => (
    <section aria-labelledby="influencer-faq-heading" className={variant === 'creator' ? 'mx-auto w-full max-w-[880px] px-6 pb-28' : 'w-full bg-[#F4FBF4] py-20'}>
        <div className={variant === 'creator' ? '' : 'mx-auto max-w-[860px] px-6'}>
            <div className="mb-12 flex flex-col items-center text-center">
                <h2 id="influencer-faq-heading" className={`${variant === 'creator' ? 'mb-3 ' : ''}text-3xl font-bold text-[#0A0A0A] sm:text-[40px] sm:leading-[48px]`}>
                    Questions? We&apos;ve got answers
                </h2>
                <p className={variant === 'creator' ? 'font-inter text-[15px] leading-6 text-[#4A4A4A]' : 'mt-2 font-inter text-lg leading-7 text-[#4A4A4A]'}>
                    {variant === 'creator'
                        ? 'Quick answers to common questions.'
                        : 'Quick answers to common questions about communication authenticity, agency verification, and influencer protocols.'}
                </p>
                {variant === 'creator' && <div className="mt-4 h-1 w-8 rounded-full bg-[#0FB97F]" aria-hidden="true" />}
            </div>

            <div className="flex flex-col gap-4">
                {questions.map(({ question, answer }, index) => (
                    <details
                        key={question}
                        open={index === 0}
                        className="group overflow-hidden rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-shadow open:shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
                    >
                        <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 px-7 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0FB97F] [&::-webkit-details-marker]:hidden">
                            <span className="text-lg font-bold text-[#161D19]">{question}</span>
                            <span
                                className="faq-symbol flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEF6EE] text-xl text-[#161D19]"
                                aria-hidden="true"
                            >
                                <span className="material-symbols-outlined group-open:hidden">add</span>
                                <span className="material-symbols-outlined hidden group-open:inline">remove</span>
                            </span>
                        </summary>
                        <div className="px-7 pb-6 font-inter text-[15px] leading-relaxed text-[#4A4A4A]">
                            <div className="pt-2">{answer}</div>
                        </div>
                    </details>
                ))}
            </div>
            {variant === 'creator' && (
                <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-xl border border-[#BBCABF]/30 bg-[#EEF6EE]/60 p-8 sm:flex-row">
                    <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E6F8F0] text-[#0FB97F]">
                            <span className="material-symbols-outlined text-[26px]" aria-hidden="true">handshake</span>
                        </span>
                        <div>
                            <h3 className="text-[17px] font-bold leading-7 text-[#0A0A0A]">Direct Creator Liaison Support</h3>
                            <p className="font-inter text-[13px] leading-5 text-[#4A4A4A]">Have an urgent campaign query or need immediate contract review?</p>
                        </div>
                    </div>
                    <a className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0A0A0A] shadow-sm hover:bg-[#DDE4DD]/40" href="mailto:info@thejasperhub.com">
                        Email Talent Desk
                        <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>
                    </a>
                </div>
            )}
            {variant === 'talent' && (
                <div role="region" aria-label="Talent verification support" className="mt-12 rounded-2xl bg-[#EEF6EE] p-6 text-center">
                    <p className="font-inter text-[15px] leading-6 text-[#4A4A4A]">
                        Still have unresolved questions or need urgent collaboration details?
                    </p>
                    <div className="mt-3 flex min-h-6 flex-wrap items-center justify-center gap-x-4 gap-y-3 text-sm font-bold leading-5">
                        <a className="inline-flex items-center gap-1.5 text-[#006C48] hover:text-[#0CA06E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#006C48]" href="mailto:info@thejasperhub.com">
                            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">outgoing_mail</span>
                            Contact Verification Desk
                        </a>
                        <span className="hidden text-[#8A8A8A] sm:inline" aria-hidden="true">&bull;</span>
                        <a className="inline-flex items-center gap-1.5 text-[#0A0A0A] hover:text-[#006C48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#006C48]" href="mailto:business@thejasperhub.com">
                            Executive Inquiries
                            <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_forward</span>
                        </a>
                    </div>
                </div>
            )}
        </div>
    </section>
);

export default InfluencerFAQ;
