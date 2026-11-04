import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';

const setLocation = (path) => {
  window.history.pushState({}, '', path);
};

const chooseInquiryType = async (value) => {
  const selector = await screen.findByLabelText(/^How can we best help you/);
  fireEvent.change(selector, { target: { value } });
};

test('homepage routes brand and creator visitors to their matching forms', async () => {
  setLocation('/?lang=en');
  render(<App />);

  expect(await screen.findByRole('link', { name: /get started/i })).toHaveAttribute(
    'href',
    '/contact?lang=en'
  );
  expect(screen.getByRole('link', { name: 'FOR INFLUENCERS' })).toHaveAttribute(
    'href',
    '/globaltalents-collab?lang=en'
  );
});

test('footer matches the prototype brand, contact, link, and copyright content', async () => {
  setLocation('/?lang=en');
  render(<App />);

  const footer = screen.getByRole('contentinfo');
  expect(within(footer).getByText('The Jasper Hub', { exact: true })).toBeInTheDocument();
  expect(within(footer).getByText('Agency', { exact: true })).toBeInTheDocument();
  expect(within(footer).getByText(
    'Global Influencer Marketing Partner. Fueling viral brand expansion, performance talent acquisition, and precision influencer campaigns across global territories.'
  )).toBeInTheDocument();
  expect(within(footer).getByText('Cross-Border Campaigns Active')).toBeInTheDocument();
  expect(within(footer).getByText('Business Enquiries')).toBeInTheDocument();
  expect(within(footer).getByRole('link', { name: 'business@thejasperhub.com' })).toHaveAttribute(
    'href',
    'mailto:business@thejasperhub.com'
  );
  expect(within(footer).getByText('Influencer Queries')).toBeInTheDocument();
  expect(within(footer).getByRole('link', { name: 'info@thejasperhub.com' })).toHaveAttribute(
    'href',
    'mailto:info@thejasperhub.com'
  );
  expect(within(footer).getByText('Headquarters')).toBeInTheDocument();

  const footerNavigation = within(footer).getByRole('navigation', { name: 'Footer links' });
  expect(within(footerNavigation).getAllByRole('link').map((link) => link.textContent)).toEqual([
    'Home',
    'Services',
    'For Influencers',
    'Contact',
  ]);
  expect(within(footerNavigation).getByRole('link', { name: 'For Influencers' })).toHaveAttribute(
    'href',
    '/globaltalents-collab?lang=en'
  );
  expect(within(footer).getByText('© 2026 The Jasper Hub Agency. All rights reserved.')).toBeInTheDocument();
  expect(within(footer).getByRole('link', { name: 'thejasperhub.com' })).toHaveAttribute(
    'href',
    'https://thejasperhub.com'
  );
});

test('Chinese homepage localizes both audience links and keeps the selected language in their routes', async () => {
  setLocation('/?lang=zh');
  render(<App />);

  expect(await screen.findByRole('link', { name: '开始合作' })).toHaveAttribute(
    'href',
    '/contact?lang=zh'
  );

  const creatorLinks = await screen.findAllByRole('link', { name: '创作者合作' });
  expect(creatorLinks.some((link) => link.getAttribute('href') === '/globaltalents-collab?lang=zh'))
    .toBe(true);
  const footer = screen.getByRole('contentinfo');
  expect(within(footer).getByRole('link', { name: '首页' })).toHaveAttribute('href', '/?lang=zh');
  expect(within(footer).getByRole('link', { name: '服务' })).toHaveAttribute(
    'href',
    '/services?lang=zh'
  );
  expect(within(footer).getByRole('link', { name: '联系我们' })).toHaveAttribute(
    'href',
    '/contact?lang=zh'
  );
});

test('creator inquiry route renders on a mobile user agent', async () => {
  const originalUserAgent = navigator.userAgent;
  Object.defineProperty(navigator, 'userAgent', {
    configurable: true,
    value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
  });
  setLocation('/globaltalents-collab?lang=en');

  try {
    render(<App />);
    expect(
      await screen.findByRole('heading', {
        name: 'Collaborate With The Jasper Hub Agency: Talent & Agency Inquiries',
      })
    ).toBeInTheDocument();
    expect(screen.queryByText(/access not supported/i)).not.toBeInTheDocument();
  } finally {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: originalUserAgent,
    });
  }
});

test('creator inquiry page leads with the talent partnership identity and routing context', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);

  expect(
    await screen.findByRole('heading', {
      name: 'Collaborate With The Jasper Hub Agency: Talent & Agency Inquiries',
    })
  ).toBeInTheDocument();
  expect(screen.getByText(/Global Talent Relations & Partnerships/i)).toBeInTheDocument();

  const identityNotice = screen.getByRole('heading', { name: 'Official Domain Authenticity Notice' });
  const inquiryForm = screen.getByRole('region', { name: 'Creator and talent inquiry form' });
  expect(identityNotice.compareDocumentPosition(inquiryForm) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test('mobile navigation expands and keeps the existing contact route reachable', async () => {
  setLocation('/?lang=en');
  render(<App />);

  await screen.findByRole('navigation', { name: 'Main navigation' });
  const toggle = document.querySelector('.mobile-menu-toggle');
  expect(toggle).toHaveAttribute('aria-label', 'Open navigation menu');
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');

  const contactLink = document.querySelector('#primary-navigation a[href="/contact?lang=en"]');
  fireEvent.click(contactLink);

  expect(await screen.findByRole('heading', { name: 'CONTACT US' })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/contact');
});

test('language switching preserves the creator inquiry path', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);

  await screen.findByRole('heading', {
    name: 'Collaborate With The Jasper Hub Agency: Talent & Agency Inquiries',
  });
  fireEvent.click(screen.getByRole('button', { name: '中文' }));

  await waitFor(() => {
    expect(window.location.pathname).toBe('/globaltalents-collab');
    expect(new URLSearchParams(window.location.search).get('lang')).toBe('zh');
  });
});

test('brand contact form identifies its request type for the shared contact endpoint', async () => {
  const originalFetch = global.fetch;
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, message: 'Your message has been sent successfully.' }),
  });
  global.fetch = fetchMock;
  setLocation('/contact?lang=en');

  try {
    render(<App />);
    fireEvent.change(await screen.findByPlaceholderText('Your full name'), {
      target: { value: 'Jordan Lee' },
    });
    fireEvent.change(screen.getByPlaceholderText('your@email.com'), {
      target: { value: 'jordan@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Your company name'), {
      target: { value: 'North Star Apps' },
    });
    fireEvent.change(screen.getByPlaceholderText('Tell us about your project...'), {
      target: { value: 'We are planning a global launch.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /contact us/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const request = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(request).toEqual({
      inquiryType: 'brand_contact',
      name: 'Jordan Lee',
      email: 'jordan@example.com',
      company: 'North Star Apps',
      phone: '',
      message: 'We are planning a global launch.',
    });
  } finally {
    global.fetch = originalFetch;
  }
});

test('creator branch reveals only its conditional fields and clears removed platform values', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);
  await chooseInquiryType('creator_representation');

  expect(screen.getByRole('radio', { name: 'Yes' })).toBeInTheDocument();
  expect(screen.getByRole('radio', { name: 'No' })).toBeInTheDocument();
  expect(screen.queryByLabelText('Agency Name')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('radio', { name: 'Yes' }));
  expect(screen.getByLabelText(/^Agency Name/)).toBeRequired();

  fireEvent.click(screen.getByRole('checkbox', { name: 'Other' }));
  const platformName = screen.getByLabelText(/^Platform Name/);
  fireEvent.change(platformName, { target: { value: 'Lemon8' } });
  fireEvent.click(screen.getByRole('checkbox', { name: 'Other' }));
  fireEvent.click(screen.getByRole('checkbox', { name: 'Other' }));

  expect(screen.getByLabelText(/^Platform Name/)).toHaveValue('');

  await chooseInquiryType('partner_inquiry');
  await chooseInquiryType('creator_representation');
  expect(screen.getByLabelText(/^Full Name/)).toHaveValue('');
});

test('Press Inquiries branch asks for agency collaboration details, not media details', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);
  await chooseInquiryType('partner_inquiry');

  const inquiryTypeSelect = screen.getByLabelText(/^How can we best help you/);
  expect(inquiryTypeSelect).toHaveAttribute('aria-describedby', 'inquiry-type-help');
  expect(document.getElementById('inquiry-type-help')).toHaveTextContent(
    /for talent agencies, management companies, creator managers, and collaborative talent rosters/i
  );
  expect(screen.getByLabelText(/^Agency \/ Management Company \/ Organization/)).toBeRequired();
  expect(screen.getByLabelText(/^Your Role/)).toBeRequired();
  expect(screen.getByLabelText(/^Talent \/ Creator Name or Profile/)).not.toBeRequired();
  expect(screen.getByLabelText(/^Phone/)).not.toBeRequired();
  expect(screen.getByRole('region', { name: 'Talent / Creator Partnerships' })).toBeInTheDocument();
  expect(screen.queryByLabelText(/outlet|publication|media|news/i)).not.toBeInTheDocument();
});

test('partner submission sends only collaboration fields and reports success', async () => {
  const originalFetch = global.fetch;
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, message: 'Your inquiry has been sent successfully.' }),
  });
  global.fetch = fetchMock;
  setLocation('/globaltalents-collab?lang=en');

  try {
    render(<App />);
    await chooseInquiryType('partner_inquiry');
    fireEvent.change(screen.getByLabelText(/^Full Name/), { target: { value: 'Taylor Reed' } });
    fireEvent.change(screen.getByLabelText(/^Email Address/), { target: { value: 'taylor@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Agency \/ Management Company \/ Organization/), {
      target: { value: 'North Star Talent' },
    });
    fireEvent.change(screen.getByLabelText(/^Your Role/), { target: { value: 'Talent Agency' } });
    fireEvent.change(screen.getByLabelText(/^How can we help with this collaboration/), {
      target: { value: 'We would like to discuss a creator partnership.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit collaboration inquiry/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock.mock.calls[0][0]).toBe('/api/contact');
    const request = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(request).toEqual({
      inquiryType: 'partner_inquiry',
      name: 'Taylor Reed',
      email: 'taylor@example.com',
      organization: 'North Star Talent',
      role: 'Talent Agency',
      message: 'We would like to discuss a creator partnership.',
    });
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Creator Partnership / Talent Collaboration Inquiry'
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test('creator submission sends only the completed creator profile fields', async () => {
  const originalFetch = global.fetch;
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, message: 'Your inquiry has been sent successfully.' }),
  });
  global.fetch = fetchMock;
  setLocation('/globaltalents-collab?lang=en');

  try {
    render(<App />);
    await chooseInquiryType('creator_representation');
    fireEvent.change(screen.getByLabelText(/^Full Name/), { target: { value: 'Taylor Reed' } });
    fireEvent.change(screen.getByLabelText(/^Email Address/), { target: { value: 'taylor@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Country \/ Region/), { target: { value: 'United States' } });
    fireEvent.click(screen.getByRole('radio', { name: 'No' }));
    fireEvent.click(screen.getByLabelText('Instagram'));
    fireEvent.change(screen.getByLabelText('Instagram Profile URL *'), {
      target: { value: 'https://instagram.com/taylor' },
    });
    fireEvent.change(screen.getAllByLabelText(/^Audience Size/)[0], {
      target: { value: '10000' },
    });
    fireEvent.click(screen.getByLabelText('Other'));
    fireEvent.change(screen.getByLabelText(/^Platform Name/), { target: { value: 'Lemon8' } });
    fireEvent.change(screen.getByLabelText('Other Profile URL *'), {
      target: { value: 'https://lemon8-app.com/taylor' },
    });
    fireEvent.change(screen.getAllByLabelText(/^Audience Size/)[1], {
      target: { value: '5000' },
    });
    fireEvent.change(screen.getByLabelText(/Primary Content Category/), {
      target: { value: 'Technology' },
    });
    fireEvent.change(screen.getByLabelText(/How did you hear about us/), {
      target: { value: 'Other' },
    });
    fireEvent.change(screen.getByLabelText(/^Tell us where you heard about us/), {
      target: { value: 'Creator referral' },
    });
    fireEvent.change(screen.getByLabelText(/^Additional Message/), {
      target: { value: 'I create technology videos.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^submit application$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const request = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(request).toEqual({
      inquiryType: 'creator_representation',
      name: 'Taylor Reed',
      email: 'taylor@example.com',
      country: 'United States',
      representationStatus: 'no',
      platforms: [
        {
          name: 'Instagram',
          profileUrl: 'https://instagram.com/taylor',
          audienceSize: '10000',
        },
        {
          name: 'Other',
          platformName: 'Lemon8',
          profileUrl: 'https://lemon8-app.com/taylor',
          audienceSize: '5000',
        },
      ],
      primaryContent: 'Technology',
      referralSource: 'Other',
      referralOther: 'Creator referral',
      message: 'I create technology videos.',
    });
    expect(request).not.toHaveProperty('organization');
    expect(request).not.toHaveProperty('role');
    expect(request).not.toHaveProperty('talentNameOrProfile');
  } finally {
    global.fetch = originalFetch;
  }
});

test('malformed API errors show a generic message and preserve the entered partnership details', async () => {
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    json: async () => {
      throw new SyntaxError('Unexpected end of JSON input');
    },
  });
  setLocation('/globaltalents-collab?lang=en');

  try {
    render(<App />);
    await chooseInquiryType('partner_inquiry');
    fireEvent.change(screen.getByLabelText(/^Full Name/), { target: { value: 'Taylor Reed' } });
    fireEvent.change(screen.getByLabelText(/^Email Address/), { target: { value: 'taylor@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Agency \/ Management Company \/ Organization/), {
      target: { value: 'North Star Talent' },
    });
    fireEvent.change(screen.getByLabelText(/^Your Role/), { target: { value: 'Talent Agency' } });
    fireEvent.change(screen.getByLabelText(/^How can we help with this collaboration/), {
      target: { value: 'We would like to discuss a creator partnership.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit collaboration inquiry/i }));

    const error = await screen.findByRole('alert');
    expect(error).toHaveTextContent('Unable to send your inquiry. Please try again later.');
    expect(error).not.toHaveTextContent('Unexpected end of JSON input');
    expect(screen.getByLabelText(/^Full Name/)).toHaveValue('Taylor Reed');
    expect(screen.getByLabelText(/^Agency \/ Management Company \/ Organization/)).toHaveValue(
      'North Star Talent'
    );
    expect(screen.getByLabelText(/^Full Name/)).not.toBeDisabled();
    expect(screen.getByRole('button', { name: /submit collaboration inquiry/i })).not.toBeDisabled();
  } finally {
    global.fetch = originalFetch;
  }
});

test('partnership fields stay locked while sending and become editable after success', async () => {
  const originalFetch = global.fetch;
  let resolveRequest;
  const fetchMock = jest.fn(() => new Promise((resolve) => {
    resolveRequest = resolve;
  }));
  global.fetch = fetchMock;
  setLocation('/globaltalents-collab?lang=en');

  try {
    render(<App />);
    await chooseInquiryType('partner_inquiry');
    fireEvent.change(screen.getByLabelText(/^Full Name/), { target: { value: 'Taylor Reed' } });
    fireEvent.change(screen.getByLabelText(/^Email Address/), { target: { value: 'taylor@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Agency \/ Management Company \/ Organization/), {
      target: { value: 'North Star Talent' },
    });
    fireEvent.change(screen.getByLabelText(/^Your Role/), { target: { value: 'Talent Agency' } });
    fireEvent.change(screen.getByLabelText(/^How can we help with this collaboration/), {
      target: { value: 'We would like to discuss a creator partnership.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit collaboration inquiry/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(screen.getByLabelText(/^Full Name/)).toBeDisabled();
    expect(screen.getByLabelText(/^Email Address/)).toBeDisabled();
    expect(screen.getByLabelText(/^Agency \/ Management Company \/ Organization/)).toBeDisabled();
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();

    await act(async () => {
      resolveRequest({
        ok: true,
        json: async () => ({ success: true, message: 'Sent.' }),
      });
    });

    expect(await screen.findByRole('status')).toHaveTextContent('Creator Partnership / Talent Collaboration Inquiry');
    expect(screen.getByLabelText(/^Full Name/)).not.toBeDisabled();
  } finally {
    global.fetch = originalFetch;
  }
});

test('creator FAQ disclosures open independently', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);
  const firstQuestion = await screen.findByText(
    'What is the contact email address of the Jasper Hub Agency?'
  );
  const secondQuestion = screen.getByText(
    'Which are the email addresses of The Jasper Hub Agency for collaborating with influencers?'
  );

  expect(firstQuestion.closest('details')).toHaveAttribute('open');
  fireEvent.click(secondQuestion);
  expect(secondQuestion.closest('details')).toHaveAttribute('open');
  expect(firstQuestion.closest('details')).toHaveAttribute('open');
  fireEvent.click(firstQuestion);
  expect(firstQuestion.closest('details')).not.toHaveAttribute('open');
  expect(secondQuestion.closest('details')).toHaveAttribute('open');
});
