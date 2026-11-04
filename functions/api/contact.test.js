import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequestPost } from './contact.js';

const bindings = {
  RESEND_API_KEY: 'test-resend-key',
  SEND_EMAIL: 'sender@example.com',
  INFO_EMAIL: 'info@example.com',
  BUSINESS_EMAIL: 'business@example.com',
  RECEIVE_EMAIL: 'fallback@example.com',
  RECIEVE_EMAIL: 'recipient@example.com',
};

const requestContext = (data) => ({
  request: new Request('https://example.com/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  env: bindings,
});

const responseJson = async (response) => ({
  status: response.status,
  body: await response.json(),
});

const partnerInquiry = () => ({
  inquiryType: 'partner_inquiry',
  name: 'Taylor Reed',
  email: 'taylor@example.com',
  organization: 'North Star Talent',
  role: 'Talent Agency',
  message: 'Partnership opportunity',
});

const creatorInquiry = () => ({
  inquiryType: 'creator_representation',
  name: 'Taylor Reed',
  email: 'taylor@example.com',
  country: 'United States',
  representationStatus: 'no',
  platforms: [{
    name: 'Instagram',
    profileUrl: 'https://instagram.com/taylor',
    audienceSize: '10000',
  }],
  primaryContent: 'Technology',
});

test('rejects unsupported inquiry types including the legacy press value before sending email', async (t) => {
  let fetchCalls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    fetchCalls += 1;
    return new Response('{}', { status: 200 });
  });

  for (const inquiryType of ['media', 'press', 'news']) {
    const result = await responseJson(await onRequestPost(requestContext({
      inquiryType,
      name: 'Taylor Reed',
      email: 'taylor@example.com',
      message: 'A request',
    })));

    assert.equal(result.status, 400, `expected ${inquiryType} to be rejected`);
  }
  assert.equal(fetchCalls, 0);
});

test('preserves the existing brand contact flow through the shared endpoint', async (t) => {
  let sentMessage;
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    sentMessage = JSON.parse(options.body);
    return new Response('{"id":"brand-email-1"}', { status: 200 });
  });

  const result = await responseJson(await onRequestPost(requestContext({
    inquiryType: 'brand_contact',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    company: 'North Star Apps',
    phone: '',
    message: 'We are planning a global launch.',
  })));

  assert.equal(result.status, 200);
  assert.equal(sentMessage.subject, 'New Brand / Company Contact Inquiry');
  assert.equal(sentMessage.to, 'business@example.com');
  assert.equal(sentMessage.reply_to, 'jordan@example.com');
  assert.match(sentMessage.html, /North Star Apps/);
  assert.match(sentMessage.html, /We are planning a global launch\./);
  assert.equal(result.body.message, 'Your message has been sent successfully.');
});

test('sends partner inquiries with collaboration wording and escaped values', async (t) => {
  let sentMessage;
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    sentMessage = JSON.parse(options.body);
    return new Response('{"id":"email-1"}', { status: 200 });
  });

  const result = await responseJson(await onRequestPost(requestContext({
    inquiryType: 'partner_inquiry',
    name: 'Taylor <Reed>',
    email: 'taylor@example.com',
    organization: 'North Star & Co.',
    role: 'Talent Agency',
    talentNameOrProfile: 'https://example.com/talent',
    phone: '+1 555 010 1234',
    message: 'We would like to discuss a collaboration.',
  })));

  assert.equal(result.status, 200);
  assert.equal(sentMessage.subject, 'Creator Partnership / Talent Collaboration Inquiry');
  assert.equal(sentMessage.to, 'info@example.com');
  assert.equal(sentMessage.reply_to, 'taylor@example.com');
  assert.match(sentMessage.html, /North Star &amp; Co\./);
  assert.match(sentMessage.html, /Taylor &lt;Reed&gt;/);
  assert.doesNotMatch(sentMessage.html, /<Reed>/);
});

test('rejects media-only fields instead of forwarding them', async (t) => {
  let fetchCalls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    fetchCalls += 1;
    return new Response('{}', { status: 200 });
  });

  const result = await responseJson(await onRequestPost(requestContext({
    inquiryType: 'partner_inquiry',
    name: 'Taylor Reed',
    email: 'taylor@example.com',
    organization: 'North Star Talent',
    role: 'Talent Agency',
    message: 'Partnership opportunity',
    publication: 'Example Daily',
  })));

  assert.equal(result.status, 400);
  assert.equal(fetchCalls, 0);
});

test('rejects unsupported media-service keys and creator-only fields on partner inquiries', async (t) => {
  let fetchCalls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    fetchCalls += 1;
    return new Response('{}', { status: 200 });
  });

  const baseInquiry = {
    inquiryType: 'partner_inquiry',
    name: 'Taylor Reed',
    email: 'taylor@example.com',
    organization: 'North Star Talent',
    role: 'Talent Agency',
    message: 'Partnership opportunity',
  };

  for (const field of ['outlet', 'publication', 'media', 'news', 'journalist', 'pressRelease']) {
    const result = await responseJson(await onRequestPost(requestContext({
      ...baseInquiry,
      [field]: 'unsupported value',
    })));
    assert.equal(result.status, 400, `expected ${field} to be rejected`);
  }

  const creatorFieldsResult = await responseJson(await onRequestPost(requestContext({
    ...baseInquiry,
    country: 'United States',
    representationStatus: 'no',
    platforms: [],
    primaryContent: 'Technology',
  })));

  assert.equal(creatorFieldsResult.status, 400);
  assert.equal(fetchCalls, 0);
});

test('requires creator profile details and a primary content category', async (t) => {
  let fetchCalls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    fetchCalls += 1;
    return new Response('{}', { status: 200 });
  });

  const result = await responseJson(await onRequestPost(requestContext({
    inquiryType: 'creator_representation',
    name: 'Taylor Reed',
    email: 'taylor@example.com',
    country: 'United States',
    representationStatus: 'no',
    platforms: [],
    primaryContent: '',
    message: 'My creator profile is ready.',
  })));

  assert.equal(result.status, 400);
  assert.equal(fetchCalls, 0);
});

test('sends a valid creator inquiry without partner-only fields', async (t) => {
  let sentMessage;
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    sentMessage = JSON.parse(options.body);
    return new Response('{"id":"email-2"}', { status: 200 });
  });

  const result = await responseJson(await onRequestPost(requestContext({
    inquiryType: 'creator_representation',
    name: 'Taylor Reed',
    email: 'taylor@example.com',
    country: 'United States',
    representationStatus: 'no',
    platforms: [{
      name: 'Instagram',
      profileUrl: 'https://instagram.com/taylor',
      audienceSize: '10000',
    }],
    primaryContent: 'Technology',
    message: 'I create technology videos.',
  })));

  assert.equal(result.status, 200);
  assert.match(sentMessage.subject, /Creator representation inquiry/);
  assert.equal(sentMessage.to, 'info@example.com');
  assert.equal(sentMessage.reply_to, 'taylor@example.com');
  assert.match(sentMessage.html, /Instagram/);
  assert.match(sentMessage.html, /Technology/);
  assert.doesNotMatch(sentMessage.html, /Agency \/ Management Company/);
});

test('rejects unsupported fields in creator representation requests', async (t) => {
  let fetchCalls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    fetchCalls += 1;
    return new Response('{}', { status: 200 });
  });

  const creatorInquiry = {
    inquiryType: 'creator_representation',
    name: 'Taylor Reed',
    email: 'taylor@example.com',
    country: 'United States',
    representationStatus: 'no',
    platforms: [{
      name: 'Instagram',
      profileUrl: 'https://instagram.com/taylor',
      audienceSize: '10000',
    }],
    primaryContent: 'Technology',
  };

  for (const field of ['company', 'organization', 'role', 'outlet', 'publication']) {
    const result = await responseJson(await onRequestPost(requestContext({
      ...creatorInquiry,
      [field]: 'unsupported value',
    })));
    assert.equal(result.status, 400, `expected ${field} to be rejected`);
  }

  const unexpectedPlatformField = await responseJson(await onRequestPost(requestContext({
    ...creatorInquiry,
    platforms: [{
      ...creatorInquiry.platforms[0],
      journalist: 'unsupported value',
    }],
  })));

  assert.equal(unexpectedPlatformField.status, 400);
  assert.equal(fetchCalls, 0);
});

test('requires an agency name only when creator representation status is yes', async (t) => {
  let fetchCalls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    fetchCalls += 1;
    return new Response('{}', { status: 200 });
  });

  const result = await responseJson(await onRequestPost(requestContext({
    inquiryType: 'creator_representation',
    name: 'Taylor Reed',
    email: 'taylor@example.com',
    country: 'United States',
    representationStatus: 'yes',
    platforms: [{
      name: 'TikTok',
      profileUrl: 'https://tiktok.com/@taylor',
      audienceSize: '20000',
    }],
    primaryContent: 'Lifestyle',
    message: 'I am represented by an agency.',
  })));

  assert.equal(result.status, 400);
  assert.equal(fetchCalls, 0);
});

test('does not expose email provider failures to the form submitter', async (t) => {
  const errorLog = [];
  t.mock.method(console, 'error', (...args) => errorLog.push(args));
  t.mock.method(globalThis, 'fetch', async () => (
    new Response('{"message":"private provider detail"}', { status: 429 })
  ));

  const result = await responseJson(await onRequestPost(requestContext({
    inquiryType: 'partner_inquiry',
    name: 'Taylor Reed',
    email: 'taylor@example.com',
    organization: 'North Star Talent',
    role: 'Talent Agency',
    message: 'Partnership opportunity',
  })));

  assert.equal(result.status, 502);
  assert.equal(result.body.message, 'Unable to send your inquiry. Please try again later.');
  assert.doesNotMatch(JSON.stringify(result.body), /private provider detail/);
  assert.deepEqual(errorLog, [['Resend email delivery failed', 429]]);
});

test('rejects malformed JSON and non-object bodies without delivering email', async (t) => {
  const delivery = t.mock.method(globalThis, 'fetch', async () => new Response('{}'));
  for (const body of ['{', '', 'null', '[]', '"inquiry"', '42', 'true']) {
    const result = await responseJson(await onRequestPost({
      ...requestContext({}),
      request: new Request('https://example.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      }),
    }));
    assert.equal(result.status, 400, `must reject body ${JSON.stringify(body)}`);
    assert.equal(result.body.success, false);
  }
  assert.equal(delivery.mock.callCount(), 0);
});

test('requires a bounded name and valid email for every inquiry type', async (t) => {
  const delivery = t.mock.method(globalThis, 'fetch', async () => new Response('{}'));
  const invalidCommonFields = [
    { name: undefined },
    { name: '   ' },
    { name: 'n'.repeat(201) },
    { name: { value: 'Taylor' } },
    { email: undefined },
    { email: 'taylor' },
    { email: 'taylor@example' },
    { email: 'taylor @example.com' },
    { email: 'taylor@example.com\r\nBcc: other@example.com' },
    { email: `${'a'.repeat(243)}@example.com` },
  ];
  for (const base of [
    partnerInquiry(),
    creatorInquiry(),
    { inquiryType: 'brand_contact', name: 'Taylor', email: 'taylor@example.com', message: 'Launch' },
  ]) {
    for (const fields of invalidCommonFields) {
      const result = await responseJson(await onRequestPost(requestContext({ ...base, ...fields })));
      assert.equal(result.status, 400, `${base.inquiryType}: ${JSON.stringify(fields)}`);
    }
  }
  assert.equal(delivery.mock.callCount(), 0);
});

test('rejects missing or oversized required partnership details', async (t) => {
  const delivery = t.mock.method(globalThis, 'fetch', async () => new Response('{}'));
  for (const fields of [
    { organization: undefined }, { organization: ' ' }, { organization: 'a'.repeat(201) },
    { role: undefined }, { role: 'Journalist' },
    { message: undefined }, { message: ' ' }, { message: 'm'.repeat(5001) },
    { talentNameOrProfile: 'p'.repeat(501) }, { phone: '1'.repeat(81) },
  ]) {
    const result = await responseJson(await onRequestPost(requestContext({
      ...partnerInquiry(), ...fields,
    })));
    assert.equal(result.status, 400, `must reject ${Object.keys(fields)[0]}`);
  }
  assert.equal(delivery.mock.callCount(), 0);
});

test('accepts partnership boundary lengths and all approved collaboration roles', async (t) => {
  const sentMessages = [];
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    sentMessages.push(JSON.parse(options.body));
    return new Response('{"id":"boundary-email"}', { status: 200 });
  });
  for (const role of ['Talent Agency', 'Management Company', 'Creator / Influencer', 'Other']) {
    const result = await responseJson(await onRequestPost(requestContext({
      ...partnerInquiry(),
      name: 'n'.repeat(200),
      email: `${'a'.repeat(242)}@example.com`,
      organization: 'a'.repeat(200),
      role,
      talentNameOrProfile: 'p'.repeat(500),
      phone: '1'.repeat(80),
      message: 'm'.repeat(5000),
    })));
    assert.equal(result.status, 200, role);
    assert.match(sentMessages.at(-1).html, new RegExp(role));
    assert.match(sentMessages.at(-1).html, /m{5000}/);
  }
  assert.equal(sentMessages.length, 4);
});

test('rejects invalid creator profile values and stale agency details', async (t) => {
  const delivery = t.mock.method(globalThis, 'fetch', async () => new Response('{}'));
  for (const fields of [
    { country: '' }, { representationStatus: '' }, { representationStatus: 'maybe' },
    { primaryContent: 'Unapproved category' },
    { agencyName: '' }, { agencyName: 'Hidden old agency' },
    { representationStatus: 'yes', agencyName: 'a'.repeat(201) },
    { message: 'm'.repeat(5001) },
  ]) {
    const result = await responseJson(await onRequestPost(requestContext({
      ...creatorInquiry(), ...fields,
    })));
    assert.equal(result.status, 400, JSON.stringify(fields).slice(0, 160));
  }
  assert.equal(delivery.mock.callCount(), 0);
});

test('rejects duplicate, unsupported, and malformed platform collections', async (t) => {
  const delivery = t.mock.method(globalThis, 'fetch', async () => new Response('{}'));
  const platform = creatorInquiry().platforms[0];
  for (const platforms of [
    undefined, {}, [], [null], [[]], ['Instagram'],
    [platform, platform],
    Array.from({ length: 7 }, () => platform),
    [{ ...platform, name: 'Unsupported' }],
    [{ ...platform, audienceSize: '' }],
    [{ ...platform, audienceSize: 'a'.repeat(81) }],
    [{ ...platform, platformName: 'Stale Other name' }],
    [{ ...platform, name: 'Other' }],
    [{ ...platform, name: 'Other', platformName: 'a'.repeat(81) }],
  ]) {
    const result = await responseJson(await onRequestPost(requestContext({
      ...creatorInquiry(), platforms,
    })));
    assert.equal(result.status, 400, JSON.stringify(platforms));
  }
  assert.equal(delivery.mock.callCount(), 0);
});

test('rejects unsafe, incomplete, and oversized creator profile URLs', async (t) => {
  const delivery = t.mock.method(globalThis, 'fetch', async () => new Response('{}'));
  for (const profileUrl of [
    'javascript:alert(1)', 'data:text/html,example', 'file:///tmp/example',
    'ftp://example.com/profile', '/relative-profile', 'https://', 'not-a-url',
    `https://example.com/${'a'.repeat(2029)}`,
  ]) {
    const result = await responseJson(await onRequestPost(requestContext({
      ...creatorInquiry(),
      platforms: [{ ...creatorInquiry().platforms[0], profileUrl }],
    })));
    assert.equal(result.status, 400, profileUrl.slice(0, 100));
  }
  assert.equal(delivery.mock.callCount(), 0);
});

test('rejects unsupported referral sources and hidden referral details', async (t) => {
  const delivery = t.mock.method(globalThis, 'fetch', async () => new Response('{}'));
  for (const fields of [
    { referralSource: 'Unapproved source' },
    { referralSource: 'Other' },
    { referralSource: 'Other', referralOther: '   ' },
    { referralSource: 'Other', referralOther: 'r'.repeat(201) },
    { referralSource: 'Referral', referralOther: 'Hidden old referral' },
    { referralOther: '' },
  ]) {
    const result = await responseJson(await onRequestPost(requestContext({
      ...creatorInquiry(), ...fields,
    })));
    assert.equal(result.status, 400, JSON.stringify(fields).slice(0, 160));
  }
  assert.equal(delivery.mock.callCount(), 0);
});

test('delivers represented creators with Other platform and referral details escaped', async (t) => {
  let sentMessage;
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    sentMessage = JSON.parse(options.body);
    return new Response('{"id":"other-platform-email"}', { status: 200 });
  });
  const result = await responseJson(await onRequestPost(requestContext({
    ...creatorInquiry(),
    representationStatus: 'yes',
    agencyName: 'Agency & Partners',
    platforms: [{
      name: 'Other',
      platformName: 'Creator <Network>',
      profileUrl: 'https://example.com/profile',
      audienceSize: '10000',
    }],
    referralSource: 'Other',
    referralOther: 'Meetup & event',
    message: '<script>alert("test")</script>',
  })));
  assert.equal(result.status, 200);
  assert.match(sentMessage.html, /Agency &amp; Partners/);
  assert.match(sentMessage.html, /Creator &lt;Network&gt;/);
  assert.match(sentMessage.html, /Meetup &amp; event/);
  assert.match(sentMessage.html, /&lt;script&gt;alert\(&quot;test&quot;\)&lt;\/script&gt;/);
  assert.doesNotMatch(sentMessage.html, /<script>|<Network>/);
});

test('accepts six distinct platforms and optional creator boundary lengths', async (t) => {
  let sentMessage;
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    sentMessage = JSON.parse(options.body);
    return new Response('{"id":"six-platforms"}', { status: 200 });
  });
  const result = await responseJson(await onRequestPost(requestContext({
    ...creatorInquiry(),
    representationStatus: 'yes',
    agencyName: 'a'.repeat(200),
    platforms: ['TikTok', 'YouTube', 'Instagram', 'Twitter / X', 'Twitch', 'Other'].map((name) => ({
      name,
      ...(name === 'Other' ? { platformName: 'p'.repeat(80) } : {}),
      profileUrl: `https://example.com/${'a'.repeat(2028)}`,
      audienceSize: 's'.repeat(80),
    })),
    referralSource: 'Other',
    referralOther: 'r'.repeat(200),
    message: 'm'.repeat(5000),
  })));
  assert.equal(result.status, 200);
  assert.match(sentMessage.html, /Twitter \/ X:/);
  assert.match(sentMessage.html, /p{80}:/);
  assert.match(sentMessage.html, /r{200}/);
  assert.match(sentMessage.html, /m{5000}/);
});

test('normalizes surrounding whitespace and strips controls from creator subjects', async (t) => {
  let sentMessage;
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    sentMessage = JSON.parse(options.body);
    return new Response('{"id":"sanitized-subject"}', { status: 200 });
  });
  const result = await responseJson(await onRequestPost(requestContext({
    ...creatorInquiry(),
    name: '  Taylor\r\nBcc:\0\x1f\x7f other@example.com  ',
    email: '  taylor@example.com  ',
  })));
  assert.equal(result.status, 200);
  assert.equal(sentMessage.subject, 'Creator representation inquiry from Taylor Bcc:  other@example.com');
  assert.doesNotMatch(sentMessage.subject, /[\r\n\0-\x1f\x7f]/);
  assert.match(sentMessage.html, />taylor@example\.com<\/td>/);
});

test('fails safely before delivery when required server bindings are absent', async (t) => {
  const delivery = t.mock.method(globalThis, 'fetch', async () => new Response('{}'));
  t.mock.method(console, 'error', () => {});
  for (const missing of ['RESEND_API_KEY', 'SEND_EMAIL', 'INFO_EMAIL', 'BUSINESS_EMAIL', 'all']) {
    const env = missing === 'all'
      ? undefined
      : {
        ...bindings,
        [missing]: '',
        ...(missing === 'INFO_EMAIL' ? { RECEIVE_EMAIL: '', RECIEVE_EMAIL: '' } : {}),
        ...(missing === 'BUSINESS_EMAIL' ? { RECEIVE_EMAIL: '', RECIEVE_EMAIL: '' } : {}),
      };
    const inquiry = missing === 'BUSINESS_EMAIL'
      ? {
        inquiryType: 'brand_contact',
        name: 'Jordan Lee',
        email: 'jordan@example.com',
        company: 'North Star Apps',
        message: 'Launch',
      }
      : partnerInquiry();
    const result = await responseJson(await onRequestPost({
      ...requestContext(inquiry), env,
    }));
    assert.equal(result.status, 500, missing);
    assert.deepEqual(result.body, {
      success: false,
      message: 'Unable to send your inquiry. Please try again later.',
    });
    assert.doesNotMatch(JSON.stringify(result.body), /test-resend-key|sender@example|recipient@example/);
  }
  assert.equal(delivery.mock.callCount(), 0);
});

test('keeps the legacy recipient variable as a deployment compatibility fallback', async (t) => {
  let sentMessage;
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    sentMessage = JSON.parse(options.body);
    return new Response('{"id":"legacy-recipient"}', { status: 200 });
  });

  const legacyOnlyEnv = {
    RESEND_API_KEY: bindings.RESEND_API_KEY,
    SEND_EMAIL: bindings.SEND_EMAIL,
    RECIEVE_EMAIL: bindings.RECIEVE_EMAIL,
  };
  const result = await responseJson(await onRequestPost({
    ...requestContext(partnerInquiry()),
    env: legacyOnlyEnv,
  }));

  assert.equal(result.status, 200);
  assert.equal(sentMessage.to, 'recipient@example.com');
});

test('does not expose transport exceptions to the form submitter', async (t) => {
  t.mock.method(console, 'error', () => {});
  t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('Private connection detail: test-resend-key');
  });
  const result = await responseJson(await onRequestPost(requestContext(partnerInquiry())));
  assert.equal(result.status, 502);
  assert.deepEqual(result.body, {
    success: false,
    message: 'Unable to send your inquiry. Please try again later.',
  });
  assert.doesNotMatch(JSON.stringify(result.body), /Private connection|test-resend-key/);
});
