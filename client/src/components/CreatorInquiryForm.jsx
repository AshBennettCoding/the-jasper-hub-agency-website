import React, { useRef, useState } from 'react';
import { sendEmail } from '../utils/api';

const platforms = ['TikTok', 'YouTube', 'Instagram', 'Twitter / X', 'Twitch', 'Other'];
const roles = ['Talent Agency', 'Management Company', 'Creator / Influencer', 'Other'];
const contentCategories = [
    'Beauty & Fashion',
    'Entertainment',
    'Food',
    'Gaming',
    'Lifestyle',
    'Technology',
    'Travel',
    'Other',
];
const referralSources = ['Social media', 'Online search', 'Referral', 'Other'];
const fieldIcons = {
    name: 'badge',
    email: 'mail',
    agencyName: 'corporate_fare',
    organization: 'corporate_fare',
    talentNameOrProfile: 'account_box',
    phone: 'call',
};
const inputClass = 'mt-2 h-[54px] w-full rounded-xl border border-[#6B7280] bg-[#EEF6EE] px-4 font-inter text-[15px] leading-6 text-[#161D19] outline-none transition-colors placeholder:text-[#8A8A8A] focus:bg-white focus:ring-2 focus:ring-[#0FB97F]';
const creatorInputClass = 'mt-2 h-12 w-full rounded-lg bg-[#EEF6EE] px-4 font-inter text-[15px] leading-6 text-[#161D19] outline-none ring-1 ring-[#BBCABF]/30 transition-colors placeholder:text-[#8A8A8A] focus:bg-white focus:ring-2 focus:ring-[#0FB97F]';
const channelColors = {
    Instagram: 'bg-[#8430D9]',
    TikTok: 'bg-[#0A0A0A]',
    YouTube: 'bg-[#BA1A1A]',
    'Twitter / X': 'bg-[#0A0A0A]',
    Twitch: 'bg-[#8430D9]',
    Other: 'bg-[#5F5E5E]',
};

const emptyValues = () => ({
    name: '',
    email: '',
    country: '',
    representationStatus: '',
    agencyName: '',
    selectedPlatforms: [],
    platformDetails: {},
    primaryContent: '',
    referralSource: '',
    referralOther: '',
    organization: '',
    role: '',
    talentNameOrProfile: '',
    phone: '',
    message: '',
});

const textField = (name, label, value, onChange, options = {}) => {
    const icon = options.icon === undefined ? fieldIcons[name] : options.icon;
    const fieldClass = options.inputClassName || inputClass;

    return (
        <div className={options.className || ''}>
            <label htmlFor={name} className="flex flex-wrap items-center justify-between gap-x-3 text-sm font-semibold leading-5 text-[#0A0A0A]">
                <span>
                    {label}
                    {options.required && <span aria-hidden="true" className="text-[#BA1A1A]"> *</span>}
                    {options.inlineOptional && <span className="text-xs font-normal text-[#8A8A8A]"> (optional)</span>}
                </span>
                {options.optional && <span aria-hidden="true" className="font-inter text-[13px] font-normal text-[#8A8A8A]">Optional</span>}
            </label>
            {options.textarea ? (
                <textarea
                    id={name}
                    name={name}
                    rows={4}
                    value={value}
                    onChange={onChange}
                    required={options.required}
                    maxLength={options.maxLength}
                    placeholder={options.placeholder}
                    className={`${fieldClass} ${options.textareaClassName || 'min-h-28'} resize-y py-4`}
                />
            ) : (
                <div className="relative">
                    <input
                        id={name}
                        name={name}
                        type={options.type || 'text'}
                        value={value}
                        onChange={onChange}
                        required={options.required}
                        maxLength={options.maxLength}
                        autoComplete={options.autoComplete}
                        placeholder={options.placeholder}
                        className={`${fieldClass} ${icon ? 'pr-12' : ''}`}
                    />
                    {icon && (
                        <span
                            className="material-symbols-outlined pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#8A8A8A]"
                            aria-hidden="true"
                        >
                            {icon}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

const buildInquiryPayload = (inquiryType, values) => {
    if (inquiryType === 'partner_inquiry') {
        return {
            inquiryType,
            name: values.name.trim(),
            email: values.email.trim(),
            organization: values.organization.trim(),
            role: values.role,
            ...(values.talentNameOrProfile.trim()
                ? { talentNameOrProfile: values.talentNameOrProfile.trim() }
                : {}),
            ...(values.phone.trim() ? { phone: values.phone.trim() } : {}),
            message: values.message.trim(),
        };
    }

    return {
        inquiryType: 'creator_representation',
        name: values.name.trim(),
        email: values.email.trim(),
        country: values.country.trim(),
        representationStatus: values.representationStatus,
        ...(values.representationStatus === 'yes'
            ? { agencyName: values.agencyName.trim() }
            : {}),
        platforms: values.selectedPlatforms.map((name) => ({
            name,
            ...(name === 'Other'
                ? { platformName: values.platformDetails[name]?.platformName?.trim() || '' }
                : {}),
            profileUrl: values.platformDetails[name]?.profileUrl?.trim() || '',
            audienceSize: values.platformDetails[name]?.audienceSize?.trim() || '',
        })),
        primaryContent: values.primaryContent,
        ...(values.referralSource ? { referralSource: values.referralSource } : {}),
        ...(values.referralSource === 'Other'
            ? { referralOther: values.referralOther.trim() }
            : {}),
        ...(values.message.trim() ? { message: values.message.trim() } : {}),
    };
};

const CreatorInquiryForm = ({ inquiryType, onInquiryTypeChange }) => {
    const isCreator = inquiryType === 'creator_representation';
    const [values, setValues] = useState(emptyValues);
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [platformError, setPlatformError] = useState('');
    const platformsRef = useRef(null);

    const updateValue = (event) => {
        const { name, value } = event.target;
        setValues((current) => ({ ...current, [name]: value }));
        setStatus(null);
    };

    const updateInquiryType = (event) => {
        onInquiryTypeChange(event.target.value);
        setValues(emptyValues());
        setPlatformError('');
        setStatus(null);
    };

    const togglePlatform = (platform) => {
        setValues((current) => {
            const selected = current.selectedPlatforms.includes(platform);
            const nextDetails = { ...current.platformDetails };
            if (selected) {
                nextDetails[platform] = { platformName: '', profileUrl: '', audienceSize: '' };
            }
            return {
                ...current,
                selectedPlatforms: selected
                    ? current.selectedPlatforms.filter((name) => name !== platform)
                    : [...current.selectedPlatforms, platform],
                platformDetails: nextDetails,
            };
        });
        setPlatformError('');
        setStatus(null);
    };

    const updatePlatformDetail = (platform, field, value) => {
        setValues((current) => ({
            ...current,
            platformDetails: {
                ...current.platformDetails,
                [platform]: {
                    ...current.platformDetails[platform],
                    [field]: value,
                },
            },
        }));
        setStatus(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!inquiryType) return;
        if (inquiryType === 'creator_representation' && values.selectedPlatforms.length === 0) {
            setPlatformError('Select at least one platform to continue.');
            platformsRef.current?.focus();
            return;
        }

        setPlatformError('');
        setIsSubmitting(true);
        setStatus(null);
        try {
            const result = await sendEmail(buildInquiryPayload(inquiryType, values));
            const successMessage = inquiryType === 'partner_inquiry'
                ? 'Creator Partnership / Talent Collaboration Inquiry sent successfully.'
                : result.message || 'Your inquiry has been sent successfully.';
            setStatus({ success: true, message: successMessage });
            setValues(emptyValues());
        } catch (error) {
            setStatus({
                success: false,
                message: error.message || 'Unable to send your inquiry. Please try again later.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="w-full" onSubmit={handleSubmit}>
            <fieldset
                disabled={isSubmitting}
                className={`m-0 min-w-0 w-full border-0 p-0 ${isCreator ? 'space-y-8' : 'space-y-6'}`}
            >
            <div className={isCreator
                ? '-mx-8 -mt-8 rounded-t-xl bg-[#EEF6EE]/40 p-8 sm:-mx-12 sm:-mt-12 sm:p-10'
                : 'flex flex-col gap-4 border-b border-[#E8F0E8] pb-6 sm:flex-row sm:items-center sm:justify-between'}>
                <div>
                    <p className={`text-[13px] font-bold uppercase tracking-[0.12em] ${isCreator ? 'leading-5 text-[#0FB97F]' : 'leading-6 text-[#006C48]'}`}>
                        {isCreator ? 'Step 1 of 1' : 'Inquiry Routing'}
                    </p>
                    <h2 className="mt-1 text-[28px] font-bold leading-9 text-[#0A0A0A]">
                        {isCreator ? 'Creator Representation Application' : 'Creator Partnership & Talent Dispatch'}
                    </h2>
                </div>
                {!isCreator && <span className="hidden w-fit items-center gap-2 rounded-full bg-[#E6F8F0] px-3 py-1.5 text-xs font-semibold text-[#0FB97F] sm:inline-flex">
                    <span className="material-symbols-outlined text-base" aria-hidden="true">hub</span>
                    Talent Partnership Desk Active
                </span>}
            </div>
            <div className={isCreator ? undefined : '!mt-8'}>
                <label htmlFor="inquiry-type" className="flex flex-wrap items-center justify-between gap-x-3 text-sm font-semibold leading-5 text-[#0A0A0A]">
                    <span>How can we best help you? <span aria-hidden="true" className="text-[#BA1A1A]">*</span></span>
                    {isCreator && <span aria-hidden="true" className="font-inter text-[13px] font-normal text-[#8A8A8A]">Target Objective</span>}
                </label>
                <div className="relative mt-2">
                    <select
                        id="inquiry-type"
                        value={inquiryType}
                        onChange={updateInquiryType}
                        required
                        aria-describedby="inquiry-type-help"
                        className={`${isCreator ? `${creatorInputClass} !h-[52px]` : inputClass} !mt-0 cursor-pointer appearance-none pr-12`}
                    >
                        <option value="">Select an inquiry type</option>
                        <option value="creator_representation">I am a creator looking for representation</option>
                        <option value="partner_inquiry">Press Inquiries</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#3C4A42]" aria-hidden="true">
                        expand_more
                    </span>
                </div>
                <p id="inquiry-type-help" className={isCreator ? 'sr-only' : 'font-inter mt-2 text-xs leading-4 text-[#8A8A8A]'}>
                    For talent agencies, management companies, creator managers, and collaborative talent rosters.
                </p>
            </div>

            {inquiryType === 'creator_representation' && (
                <section aria-label="Creator representation details" className="space-y-8">
                    <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
                        {textField('name', 'Full Name', values.name, updateValue, {
                            required: true,
                            autoComplete: 'name',
                            icon: null,
                            inputClassName: creatorInputClass,
                        })}
                        {textField('email', 'Email Address', values.email, updateValue, {
                            required: true,
                            type: 'email',
                            autoComplete: 'email',
                            icon: null,
                            inputClassName: creatorInputClass,
                        })}
                        <div>
                            <label htmlFor="country" className="block text-sm font-semibold leading-5 text-[#0A0A0A]">
                                Country / Region <span aria-hidden="true" className="text-[#BA1A1A]">*</span>
                            </label>
                            <div className="relative mt-2">
                                <select
                                    id="country"
                                    name="country"
                                    value={values.country}
                                    onChange={updateValue}
                                    required
                                    className={`${creatorInputClass} !mt-0 cursor-pointer appearance-none pr-12`}
                                >
                                    <option value="">Select a country or region</option>
                                    {[
                                        'United States',
                                        'United Kingdom',
                                        'Canada',
                                        'Australia',
                                        'Germany',
                                        'Singapore',
                                        'Japan',
                                        'Other',
                                    ].map((country) => <option key={country}>{country}</option>)}
                                </select>
                                <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#3C4A42]" aria-hidden="true">
                                    expand_more
                                </span>
                            </div>
                        </div>
                        <fieldset aria-labelledby="representation-status-label" className="min-w-0">
                            <legend id="representation-status-label" className="text-sm font-semibold leading-5 text-[#0A0A0A]">
                                Are you currently represented? <span aria-hidden="true" className="text-[#BA1A1A]">*</span>
                            </legend>
                            <div className="mt-2 flex h-12 items-center gap-1 rounded-lg bg-[#EEF6EE] p-1 ring-1 ring-[#BBCABF]/30">
                                {[
                                    { value: 'yes', label: 'Yes' },
                                    { value: 'no', label: 'No' },
                                ].map(({ value, label }) => (
                                    <label
                                        key={value}
                                        className={`flex h-full flex-1 cursor-pointer items-center justify-center gap-1.5 rounded text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-[#0FB97F] ${
                                            values.representationStatus === value
                                                ? 'bg-[#0FB97F] text-white shadow-sm'
                                                : 'text-[#4A4A4A] hover:text-[#111111]'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="representationStatus"
                                            value={value}
                                            checked={values.representationStatus === value}
                                            onChange={updateValue}
                                            required
                                            className="sr-only"
                                        />
                                        {values.representationStatus === value && (
                                            <span className="material-symbols-outlined text-base" aria-hidden="true">check</span>
                                        )}
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    </div>

                    {values.representationStatus === 'yes' && (
                        textField('agencyName', 'Agency Name', values.agencyName, updateValue, {
                            required: true,
                            icon: null,
                            inputClassName: creatorInputClass,
                            placeholder: 'Name of your management agency or representative',
                        })
                    )}

                    <fieldset
                        ref={platformsRef}
                        tabIndex="-1"
                        aria-describedby={platformError ? 'platform-error' : undefined}
                        className="space-y-3 outline-none"
                    >
                        <legend className="flex w-full flex-wrap items-center justify-between gap-x-3 text-sm font-semibold leading-5 text-[#0A0A0A]">
                            <span>Where&apos;s your audience? <span aria-hidden="true" className="text-[#BA1A1A]">*</span></span>
                            <span aria-hidden="true" className="font-inter text-[13px] font-normal text-[#8A8A8A]">Select all active channels</span>
                        </legend>
                        <div className="flex flex-wrap gap-2.5">
                            {platforms.map((platform) => (
                                    <label
                                        key={platform}
                                        className={`flex h-9 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold leading-5 transition-colors focus-within:ring-2 focus-within:ring-[#0FB97F] ${
                                            values.selectedPlatforms.includes(platform)
                                                ? 'bg-[#0FB97F] font-semibold text-white shadow-sm'
                                                : 'bg-[#EEF6EE] text-[#4A4A4A] hover:bg-[#E8F0E8]'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={values.selectedPlatforms.includes(platform)}
                                            onChange={() => togglePlatform(platform)}
                                            className="sr-only"
                                        />
                                        {values.selectedPlatforms.includes(platform) && (
                                            <span className="material-symbols-outlined text-base leading-5" aria-hidden="true">check</span>
                                        )}
                                        {platform}
                                    </label>
                            ))}
                        </div>
                        {platformError && (
                            <p id="platform-error" role="alert" className="text-sm text-red-700">
                                {platformError}
                            </p>
                        )}
                    </fieldset>

                    {values.selectedPlatforms.length > 0 && (
                        <fieldset className="min-w-0 rounded-xl bg-[#EEF6EE]/70 p-6 sm:p-7">
                            <legend className="sr-only">Selected Channel Metrics</legend>
                            <p aria-hidden="true" className="mb-6 flex items-center gap-2 text-sm font-bold text-[#0A0A0A]">
                                <span className="material-symbols-outlined text-xl leading-5 text-[#0FB97F]">insights</span>
                                Selected Channel Metrics
                            </p>
                            <div className="space-y-6">
                    {values.selectedPlatforms.map((platform) => {
                        const detail = values.platformDetails[platform] || {};
                        const prefix = platform === 'Other' ? 'other' : platform.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        return (
                            <div key={platform} className="space-y-4">
                                {platform === 'Other' && (
                                    <label htmlFor="other-platform-name" className="block text-sm font-semibold leading-5 text-[#0A0A0A]">
                                        Platform Name <span aria-hidden="true" className="text-[#BA1A1A]">*</span>
                                        <input
                                            id="other-platform-name"
                                            value={detail.platformName || ''}
                                            onChange={(event) => updatePlatformDetail('Other', 'platformName', event.target.value)}
                                            required
                                            className={`${creatorInputClass} bg-white`}
                                        />
                                    </label>
                                )}
                                <div className="grid gap-4 sm:grid-cols-12 sm:items-center">
                                    <div className="flex items-center gap-2 sm:col-span-3">
                                        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${channelColors[platform]}`} aria-hidden="true" />
                                        <span className="text-xl font-bold leading-7 text-[#0A0A0A]">{platform === 'Other' ? 'Other Channel' : platform}</span>
                                    </div>
                                    <label htmlFor={`${prefix}-profile-url`} className="block min-w-0 sm:col-span-5">
                                        <span className="sr-only">{platform} Profile URL *</span>
                                        <input
                                            id={`${prefix}-profile-url`}
                                            type="url"
                                            value={detail.profileUrl || ''}
                                            onChange={(event) => updatePlatformDetail(platform, 'profileUrl', event.target.value)}
                                            required
                                            placeholder={platform === 'Instagram' ? 'Instagram Profile URL' : 'Channel URL'}
                                            className="h-11 w-full rounded-lg bg-white px-3.5 font-inter text-[13px] text-[#0A0A0A] shadow-sm outline-none ring-1 ring-[#BBCABF]/30 focus:ring-2 focus:ring-[#0FB97F]"
                                        />
                                    </label>
                                    <label htmlFor={`${prefix}-audience-size`} className="block min-w-0 sm:col-span-4">
                                        <span className="sr-only">Audience Size *</span>
                                        <input
                                            id={`${prefix}-audience-size`}
                                            value={detail.audienceSize || ''}
                                            onChange={(event) => updatePlatformDetail(platform, 'audienceSize', event.target.value)}
                                            required
                                            placeholder="Audience Size"
                                            className="h-11 w-full rounded-lg bg-white px-3.5 font-inter text-[13px] text-[#0A0A0A] shadow-sm outline-none ring-1 ring-[#BBCABF]/30 focus:ring-2 focus:ring-[#0FB97F]"
                                        />
                                    </label>
                                </div>
                            </div>
                        );
                    })}
                            </div>
                        </fieldset>
                    )}

                    <div className="space-y-8">
                        <div>
                            <label htmlFor="primaryContent" className="block text-sm font-semibold leading-5 text-[#0A0A0A]">
                                Primary Content Category <span aria-hidden="true" className="text-[#BA1A1A]">*</span>
                            </label>
                            <div className="relative mt-2">
                                <select
                                    id="primaryContent"
                                    name="primaryContent"
                                    value={values.primaryContent}
                                    onChange={updateValue}
                                    required
                                    className={`${creatorInputClass} !mt-0 cursor-pointer appearance-none pr-12`}
                                >
                                    <option value="">Select a category</option>
                                    {contentCategories.map((category) => <option key={category}>{category}</option>)}
                                </select>
                                <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#3C4A42]" aria-hidden="true">
                                    expand_more
                                </span>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="referralSource" className="block text-sm font-semibold leading-5 text-[#0A0A0A]">
                                How did you hear about us?
                            </label>
                            <div className="relative mt-2">
                                <select
                                    id="referralSource"
                                    name="referralSource"
                                    value={values.referralSource}
                                    onChange={updateValue}
                                    className={`${creatorInputClass} !mt-0 cursor-pointer appearance-none pr-12`}
                                >
                                    <option value="">Select an option</option>
                                    {referralSources.map((source) => <option key={source}>{source}</option>)}
                                </select>
                                <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#3C4A42]" aria-hidden="true">
                                    expand_more
                                </span>
                            </div>
                        </div>
                    </div>
                    {values.referralSource === 'Other' && textField(
                        'referralOther',
                        'Tell us where you heard about us',
                        values.referralOther,
                        updateValue,
                        { required: true, inputClassName: creatorInputClass }
                    )}
                    {textField('message', 'Additional Message', values.message, updateValue, {
                        textarea: true,
                        maxLength: 5000,
                        inputClassName: creatorInputClass,
                        textareaClassName: 'block !h-[104px] min-h-[104px]',
                        optional: true,
                        placeholder: 'Tell us about your upcoming plans or partnership preferences...',
                    })}
                </section>
            )}

            {inquiryType === 'partner_inquiry' && (
                <section aria-label="Talent / Creator Partnerships" className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        {textField('name', 'Full Name', values.name, updateValue, {
                            required: true,
                            autoComplete: 'name',
                            placeholder: 'Your full name',
                        })}
                        {textField('email', 'Email Address', values.email, updateValue, {
                            required: true,
                            type: 'email',
                            autoComplete: 'email',
                            placeholder: 'your.name@agency.com',
                        })}
                        {textField(
                            'organization',
                            'Agency / Management Company / Organization',
                            values.organization,
                            updateValue,
                            { required: true, placeholder: 'Agency or Organization name' }
                        )}
                        <div>
                            <label htmlFor="role" className="block text-sm font-semibold leading-5 text-[#0A0A0A]">
                                Your Role <span aria-hidden="true" className="text-[#BA1A1A]">*</span>
                            </label>
                            <div className="relative mt-2">
                                <select
                                    id="role"
                                    name="role"
                                    value={values.role}
                                    onChange={updateValue}
                                    required
                                    className={`${inputClass} !mt-0 cursor-pointer appearance-none pr-12`}
                                >
                                    <option value="">Select your role</option>
                                    {roles.map((role) => <option key={role}>{role}</option>)}
                                </select>
                                <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#3C4A42]" aria-hidden="true">
                                    expand_more
                                </span>
                            </div>
                        </div>
                        {textField(
                            'talentNameOrProfile',
                            'Talent / Creator Name or Profile',
                            values.talentNameOrProfile,
                            updateValue,
                            { inlineOptional: true, placeholder: 'e.g. @creatorhandle or profile link' }
                        )}
                        {textField('phone', 'Phone', values.phone, updateValue, {
                            inlineOptional: true,
                            type: 'tel',
                            autoComplete: 'tel',
                            placeholder: '+1 (555) 000-0000',
                        })}
                    </div>
                    <div>
                        {textField(
                            'message',
                            'How can we help with this collaboration?',
                            values.message,
                            updateValue,
                            {
                                textarea: true,
                                required: true,
                                maxLength: 1000,
                                textareaClassName: '!h-[126px] min-h-[126px] !py-3.5',
                            }
                        )}
                        <div className="font-inter mt-2 flex items-center justify-between gap-4 pt-1 text-xs leading-6 text-[#8A8A8A]">
                            <span>Detail talent roster sizes, genres, or target brand campaign categories.</span>
                            <span className="shrink-0">{values.message.length} / 1000 characters</span>
                        </div>
                    </div>
                </section>
            )}

            {inquiryType === 'partner_inquiry' && (
                <div
                    role="note"
                    className="flex items-start gap-3 rounded-xl bg-[#EEF6EE] p-4 font-inter text-[13px] leading-5 text-[#4A4A4A]"
                >
                    <span className="material-symbols-outlined mt-0.5 shrink-0 text-[#0FB97F]" aria-hidden="true">
                        verified
                    </span>
                    <p>
                        All communications received via this portal trigger secure PGP-validated routing directly to The Jasper Hub Talent Management Secretariat.
                    </p>
                </div>
            )}

            {inquiryType && (
                <div className={`flex flex-col items-center gap-4 ${isCreator ? 'pt-4' : 'pt-2 sm:flex-row sm:justify-between'}`}>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`inline-flex w-full items-center justify-center rounded-full bg-[#0FB97F] py-4 text-sm uppercase text-white shadow-md transition-colors hover:bg-[#0CA06E] focus:outline-none focus:ring-2 focus:ring-[#0FB97F] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${isCreator ? 'min-h-[52px] gap-2 px-10 font-bold tracking-wide sm:min-w-[280px]' : 'min-h-[52px] gap-3 px-8 font-semibold tracking-wider'}`}
                    >
                        {isSubmitting
                            ? 'Sending...'
                            : inquiryType === 'partner_inquiry'
                                ? 'Submit Collaboration Inquiry'
                                : 'Submit Application'}
                        <span className="material-symbols-outlined text-lg leading-5" aria-hidden="true">arrow_forward</span>
                    </button>
                    {inquiryType === 'partner_inquiry' && (
                        <p className="font-inter text-[13px] leading-5 text-[#8A8A8A]">
                            Urgent partnership? Direct talent desk available
                        </p>
                    )}
                    {inquiryType === 'creator_representation' && (
                        <p className="max-w-md text-center font-inter text-[13px] leading-5 text-[#8A8A8A]">
                            Prefer direct correspondence? Forward media kits to{' '}
                            <a className="font-semibold text-[#111111] hover:text-[#0FB97F]" href="mailto:info@thejasperhub.com">
                                info@thejasperhub.com
                            </a>.
                        </p>
                    )}
                </div>
            )}
            </fieldset>
            {status && (
                <p
                    role={status.success ? 'status' : 'alert'}
                    aria-live={status.success ? 'polite' : 'assertive'}
                    className={`mt-6 border-l-4 px-4 py-3 text-sm ${
                        status.success
                            ? 'border-[#0FB97F] bg-[#E7F8F2] text-gray-900'
                            : 'border-red-600 bg-red-50 text-red-800'
                    }`}
                >
                    {status.message}
                </p>
            )}
        </form>
    );
};

export default CreatorInquiryForm;
