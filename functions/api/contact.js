const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PARTNER_ROLES = new Set([
  'Talent Agency',
  'Management Company',
  'Creator / Influencer',
  'Other',
]);
const CREATOR_PLATFORMS = new Set([
  'Instagram',
  'TikTok',
  'YouTube',
  'Twitter / X',
  'Twitch',
  'Other',
]);
const CREATOR_FIELDS = new Set([
  'inquiryType',
  'name',
  'email',
  'country',
  'representationStatus',
  'agencyName',
  'platforms',
  'primaryContent',
  'referralSource',
  'referralOther',
  'message',
]);
const PLATFORM_FIELDS = new Set(['name', 'platformName', 'profileUrl', 'audienceSize']);
const CONTENT_CATEGORIES = new Set([
  'Beauty & Fashion',
  'Entertainment',
  'Food',
  'Gaming',
  'Lifestyle',
  'Technology',
  'Travel',
  'Other',
]);
const REFERRAL_SOURCES = new Set(['Social media', 'Online search', 'Referral', 'Other']);
const PARTNER_FIELDS = new Set([
  'inquiryType',
  'name',
  'email',
  'organization',
  'role',
  'talentNameOrProfile',
  'phone',
  'message',
]);
const BRAND_FIELDS = new Set([
  'inquiryType',
  'name',
  'email',
  'company',
  'phone',
  'message',
]);

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
});

const text = (value) => typeof value === 'string' ? value.trim() : '';
const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');
const safeSubjectValue = (value) => text(value)
  .replace(/[\r\n\0-\x1f\x7f]+/g, ' ')
  .slice(0, 120);

const isHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const validateCommon = (data) => {
  const name = text(data.name);
  const email = text(data.email);
  if (!name || name.length > 200 || !EMAIL_PATTERN.test(email) || email.length > 254) {
    return 'Please provide your name and a valid email address.';
  }
  return null;
};

const validatePartner = (data) => {
  if (Object.keys(data).some((field) => !PARTNER_FIELDS.has(field))) {
    return 'Please submit only the requested collaboration details.';
  }

  if (
    !text(data.organization)
    || text(data.organization).length > 200
    || !PARTNER_ROLES.has(text(data.role))
    || !text(data.message)
    || text(data.message).length > 5000
  ) {
    return 'Please complete the required collaboration fields.';
  }
  if (text(data.talentNameOrProfile).length > 500 || text(data.phone).length > 80) {
    return 'Please review the optional contact details.';
  }
  return null;
};

const validateBrand = (data) => {
  if (
    Object.keys(data).some((field) => !BRAND_FIELDS.has(field))
    || !text(data.message)
    || text(data.message).length > 5000
    || text(data.company).length > 200
    || text(data.phone).length > 80
  ) {
    return 'Please complete the required brand contact fields.';
  }
  return null;
};

const validateCreator = (data) => {
  if (
    Object.keys(data).some((field) => !CREATOR_FIELDS.has(field))
    || !text(data.country)
    || !['yes', 'no'].includes(text(data.representationStatus))
    || !CONTENT_CATEGORIES.has(text(data.primaryContent))
    || (text(data.representationStatus) === 'yes' && !text(data.agencyName))
    || (text(data.representationStatus) !== 'yes' && Object.hasOwn(data, 'agencyName'))
    || text(data.agencyName).length > 200
    || (data.message != null && text(data.message).length > 5000)
  ) {
    return 'Please complete the required creator profile fields.';
  }

  if (!Array.isArray(data.platforms) || data.platforms.length < 1 || data.platforms.length > 6) {
    return 'Please add at least one platform profile.';
  }

  const seenPlatforms = new Set();
  for (const platform of data.platforms) {
    if (
      !platform
      || typeof platform !== 'object'
      || Array.isArray(platform)
      || Object.keys(platform).some((field) => !PLATFORM_FIELDS.has(field))
    ) {
      return 'Please provide a valid URL and audience size for each selected platform.';
    }
    const name = text(platform?.name);
    const profileUrl = text(platform?.profileUrl);
    const audienceSize = text(platform?.audienceSize);
    if (
      !CREATOR_PLATFORMS.has(name)
      || seenPlatforms.has(name)
      || !isHttpUrl(profileUrl)
      || profileUrl.length > 2048
      || !audienceSize
      || audienceSize.length > 80
      || (name === 'Other' && !text(platform?.platformName))
      || (name !== 'Other' && Object.hasOwn(platform, 'platformName'))
      || text(platform?.platformName).length > 80
    ) {
      return 'Please provide a valid URL and audience size for each selected platform.';
    }
    seenPlatforms.add(name);
  }

  if (
    (text(data.referralSource) && !REFERRAL_SOURCES.has(text(data.referralSource)))
    || (text(data.referralSource) === 'Other' && !text(data.referralOther))
    || (text(data.referralSource) !== 'Other' && Object.hasOwn(data, 'referralOther'))
    || text(data.referralOther).length > 200
  ) {
    return 'Please complete the referral source details.';
  }

  return null;
};

const emailRows = (fields) => fields
  .filter(([, value]) => value !== '' && value != null)
  .map(([label, value]) => (
    `<tr><th style="padding:10px;text-align:left;border-bottom:1px solid #eaeaea">${escapeHtml(label)}</th>`
    + `<td style="padding:10px;border-bottom:1px solid #eaeaea;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`
  ))
  .join('');

const createEmail = (data) => {
  const isPartner = data.inquiryType === 'partner_inquiry';
  const isBrand = data.inquiryType === 'brand_contact';
  const subjectPrefix = isPartner
    ? 'Creator Partnership / Talent Collaboration Inquiry'
    : isBrand
      ? 'New Brand / Company Contact Inquiry'
      : 'Creator representation inquiry';
  const fields = isPartner
    ? [
      ['Full Name', text(data.name)],
      ['Email Address', text(data.email)],
      ['Agency / Management Company / Organization', text(data.organization)],
      ['Your Role', text(data.role)],
      ['Talent / Creator Name or Profile', text(data.talentNameOrProfile)],
      ['Phone', text(data.phone)],
      ['How can we help with this collaboration?', text(data.message)],
    ]
    : isBrand
      ? [
        ['Name', text(data.name)],
        ['Email', text(data.email)],
        ['Brand / Company', text(data.company)],
        ['Phone', text(data.phone)],
        ['Message', text(data.message)],
      ]
    : [
      ['Full Name', text(data.name)],
      ['Email Address', text(data.email)],
      ['Country / Region', text(data.country)],
      ['Currently represented', text(data.representationStatus)],
      ['Agency Name', text(data.agencyName)],
      ['Platforms', data.platforms.map((platform) => (
        `${text(platform.name) === 'Other' ? text(platform.platformName) : text(platform.name)}`
        + `: ${text(platform.profileUrl)} (${text(platform.audienceSize)})`
      )).join('\n')],
      ['Primary Content Category', text(data.primaryContent)],
      ['Referral Source', text(data.referralSource) === 'Other'
        ? text(data.referralOther)
        : text(data.referralSource)],
      ['Additional Message', text(data.message)],
    ];

  return {
    subject: isPartner || isBrand
      ? subjectPrefix
      : `${subjectPrefix} from ${safeSubjectValue(data.name)}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#161d19">`
      + `<h2 style="border-bottom:2px solid #0FB97F;padding-bottom:12px">${subjectPrefix}</h2>`
      + `<table style="width:100%;border-collapse:collapse">${emailRows(fields)}</table>`
      + `<p style="color:#6b7280;font-size:12px;margin-top:24px">The Jasper Hub Agency website inquiry.</p>`
      + `</div>`,
  };
};

export async function onRequestPost(context) {
  let data;
  try {
    data = await context.request.json();
  } catch {
    return json({ success: false, message: 'Please submit a valid inquiry.' }, 400);
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return json({ success: false, message: 'Please submit a valid inquiry.' }, 400);
  }

  const commonError = validateCommon(data);
  if (commonError) {
    return json({ success: false, message: commonError }, 400);
  }

  if (!['creator_representation', 'partner_inquiry', 'brand_contact'].includes(data.inquiryType)) {
    return json({ success: false, message: 'Please select a valid inquiry type.' }, 400);
  }

  const validationError = data.inquiryType === 'partner_inquiry'
    ? validatePartner(data)
    : data.inquiryType === 'brand_contact'
      ? validateBrand(data)
      : validateCreator(data);
  if (validationError) {
    return json({ success: false, message: validationError }, 400);
  }

  const {
    RESEND_API_KEY,
    SEND_EMAIL,
    INFO_EMAIL,
    BUSINESS_EMAIL,
    RECEIVE_EMAIL,
    RECIEVE_EMAIL,
  } = context.env || {};
  const fallbackRecipient = text(RECEIVE_EMAIL) || text(RECIEVE_EMAIL);
  const recipientEmail = data.inquiryType === 'brand_contact'
    ? text(BUSINESS_EMAIL) || fallbackRecipient
    : text(INFO_EMAIL) || fallbackRecipient;
  if (!RESEND_API_KEY || !SEND_EMAIL || !recipientEmail) {
    console.error('Email delivery is not configured', {
      hasApiKey: Boolean(RESEND_API_KEY),
      hasSender: Boolean(SEND_EMAIL),
      hasRecipient: Boolean(recipientEmail),
      recipientType: data.inquiryType === 'brand_contact' ? 'business' : 'info',
    });
    return json({ success: false, message: 'Unable to send your inquiry. Please try again later.' }, 500);
  }

  const email = createEmail(data);
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: SEND_EMAIL,
        to: recipientEmail,
        reply_to: text(data.email),
        ...email,
      }),
    });

    if (!response.ok) {
      console.error('Resend email delivery failed', response.status);
      return json({
        success: false,
        message: 'Unable to send your inquiry. Please try again later.',
      }, 502);
    }
  } catch (error) {
    console.error(
      'Resend request failed',
      error instanceof Error ? error.message : 'Unknown error'
    );
    return json({
      success: false,
      message: 'Unable to send your inquiry. Please try again later.',
    }, 502);
  }

  return json({
    success: true,
    message: data.inquiryType === 'partner_inquiry'
      ? 'Creator Partnership / Talent Collaboration Inquiry sent successfully.'
      : data.inquiryType === 'brand_contact'
        ? 'Your message has been sent successfully.'
        : 'Your inquiry has been sent successfully.',
  });
}
