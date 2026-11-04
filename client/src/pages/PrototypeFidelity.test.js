import { fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';

const setLocation = (path) => {
  window.history.pushState({}, '', path);
};

test('homepage preserves About Us immediately after the hero section', async () => {
  setLocation('/?lang=en');
  render(<App />);

  const main = await screen.findByRole('main');
  const hero = main.querySelector('#home');
  expect(hero.nextElementSibling.querySelector('h2')).toHaveTextContent('About Us');
  expect(within(hero.nextElementSibling).getByRole('heading', { name: 'About Us' })).toBeVisible();

  const headings = [...main.querySelectorAll('h2')]
    .map((heading) => [...heading.childNodes]
      .map((node) => node.nodeName === 'BR' ? ' ' : node.textContent)
      .join('')
      .replace(/\s+/g, ' ')
      .trim());

  expect(headings).toEqual([
    'About Us',
    'Why Choose Us',
    'Success Cases',
    "LET'S WORK TOGETHER!",
  ]);
  expect(screen.getByText('The Top Choice for Global Influencer Marketing')).toHaveClass('font-inter');
});

test('About Us cards use the prototype icon system instead of emoji glyphs', async () => {
  setLocation('/?lang=en');
  render(<App />);

  const about = await screen.findByRole('heading', { name: 'About Us' });
  const iconNames = [...about.closest('section').querySelectorAll('.material-symbols-outlined')]
    .map((icon) => icon.textContent.trim());

  expect(iconNames).toEqual(['track_changes', 'rocket_launch', 'lightbulb', 'celebration']);
  expect(about.closest('section')).not.toHaveTextContent('🎯');
  expect(about.closest('section')).not.toHaveTextContent('🚀');
  expect(about.closest('section')).not.toHaveTextContent('💡');
  expect(about.closest('section')).not.toHaveTextContent('🎉');
});

test('inquiry routing starts unselected and reveals partnership fields only after selection', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);

  const selector = await screen.findByLabelText(/^How can we best help you/);
  expect(selector).toHaveValue('');
  expect(selector).toBeRequired();
  expect(screen.queryByLabelText(/^Full Name/)).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument();

  fireEvent.change(selector, { target: { value: 'partner_inquiry' } });
  expect(screen.getByRole('heading', { name: 'Creator Partnership & Talent Dispatch' })).toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Talent / Creator Partnerships' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /submit collaboration inquiry/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/^Email Address/)).toHaveClass('font-inter', 'rounded-xl', 'h-[54px]');
  expect(screen.getByText(/To safeguard talent agencies/)).toHaveClass('font-inter');
});

test('talent inquiry hero uses the full agency-partnership introduction from the prototype', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);

  const heading = await screen.findByRole('heading', { level: 1 });
  expect(heading.nextElementSibling).toHaveTextContent(
    'Official agency portal for creator agencies, talent management firms, managers, and independent creators seeking roster expansion, verified agency representation, and high-impact brand partnerships.'
  );
  expect(heading.nextElementSibling).toBeVisible();
});

test('homepage and talent page use their matching prototype footer widths', async () => {
  setLocation('/?lang=en');
  const { unmount } = render(<App />);

  expect(screen.getByRole('contentinfo').firstElementChild).toHaveClass('max-w-[1240px]');
  unmount();

  setLocation('/globaltalents-collab?lang=en');
  render(<App />);
  expect(screen.getByRole('contentinfo').firstElementChild).toHaveClass('max-w-[1200px]');
});

test('influencer contact page shows the prototype trust indicators', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);

  const trustIndicators = await screen.findByRole('list', { name: 'Partnership trust indicators' });
  const labels = within(trustIndicators).getAllByRole('listitem').map((item) =>
    [...item.querySelectorAll('span.block')].map((label) => label.textContent.trim())
  );

  expect(labels).toEqual([
    ['Verified Representation', 'Direct Agency Access'],
    ['< 24-48hr Review', 'Talent Manager SLA'],
    ['Creator Roster', '2026 Campaign Network'],
    ['Global Reach', 'Cross-Border Deals'],
  ]);
});

test('influencer contact page groups verified domains and the email hotline together', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);

  const authenticityHeading = await screen.findByRole('heading', { name: 'Official Domain Authenticity Notice' });
  const authenticityCard = authenticityHeading.closest('.rounded-xl');

  expect(authenticityCard).toHaveClass('bg-white', 'p-6', 'rounded-xl');
  expect(screen.getByText('Verified Protocols')).toBeInTheDocument();
  expect(screen.getByText(/To safeguard talent agencies, creator managers/)).not.toHaveClass('max-w-xl');

  const domains = screen.getByRole('list', { name: 'Verified email domains' });
  expect(within(domains).getAllByRole('listitem')).toHaveLength(3);
  expect(within(domains).getByText('@thejasperhub.com')).toBeInTheDocument();
  expect(within(domains).getByText('Corporate / Internal')).toBeInTheDocument();
  expect(within(domains).getByText('@thejasperhub.org')).toBeInTheDocument();
  expect(within(domains).getByText('Talent Ops')).toBeInTheDocument();
  expect(within(domains).getByText('@collabjasperglobal.com')).toBeInTheDocument();
  expect(within(domains).getByText('Campaign Collabs')).toBeInTheDocument();
  expect(within(domains).queryByRole('link', { name: 'Hotline: info@thejasperhub.com' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Hotline: info@thejasperhub.com' })).toHaveAttribute(
    'href',
    'mailto:info@thejasperhub.com'
  );
});

test('partnership support provides the prototype review desk and direct manager contacts', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);

  const sidebar = await screen.findByRole('complementary', { name: 'Partnership support' });
  expect(within(sidebar).getByRole('heading', { name: 'Talent Partnership Desk' })).toBeVisible();
  expect(within(sidebar).getByText('24-48h Review SLA')).toBeVisible();
  expect(within(sidebar).getByText('Within 24 Hours')).toBeVisible();
  expect(within(sidebar).getByText('24–48 Hours')).toBeVisible();
  expect(within(sidebar).getByText('Direct Talent Manager Sync')).toBeVisible();
  expect(within(sidebar).getByRole('heading', { name: 'Direct Talent Manager' })).toBeVisible();
  expect(within(sidebar).getByRole('heading', { name: 'Marcus Vance' })).toBeVisible();
  expect(within(sidebar).getByRole('img', { name: 'Marcus Vance, Director of Talent Partnerships' })).toBeVisible();
  expect(within(sidebar).getByRole('link', { name: 'talent@thejasperhub.com' })).toHaveAttribute(
    'href',
    'mailto:talent@thejasperhub.com'
  );
  expect(within(sidebar).getByRole('link', { name: '+852 3905 8120 (Ext. 402)' })).toHaveAttribute(
    'href',
    'tel:+85239058120;ext=402'
  );
  expect(within(sidebar).getByText('Mon – Fri, 08:00 – 20:00 HKT / GMT+8')).toBeVisible();
});

test('partnership form has one visible dispatch heading and the urgent desk reminder', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);
  fireEvent.change(await screen.findByLabelText(/^How can we best help you/), {
    target: { value: 'partner_inquiry' },
  });

  const form = await screen.findByRole('region', { name: 'Creator and talent inquiry form' });
  expect(within(form).getAllByRole('heading', { level: 2 })).toHaveLength(1);
  expect(within(form).getByText('Urgent partnership? Direct talent desk available')).toBeVisible();
});

test.each([
  ['Talent / Creator Name or Profile', /^Talent \/ Creator Name or Profile \(optional\)$/],
  ['Phone', /^Phone \(optional\)$/],
])('partnership form visibly identifies %s as optional without requiring it', async (_, label) => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);
  fireEvent.change(await screen.findByLabelText(/^How can we best help you/), {
    target: { value: 'partner_inquiry' },
  });

  const input = screen.getByRole('textbox', { name: label });
  expect(input).not.toBeRequired();
  expect(within(input.labels[0]).getByText('(optional)')).toBeVisible();
});

test('partnership form shows the prototype secure-routing assurance before submission', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);
  fireEvent.change(await screen.findByLabelText(/^How can we best help you/), {
    target: { value: 'partner_inquiry' },
  });

  const assurance = await screen.findByText(
    'All communications received via this portal trigger secure PGP-validated routing directly to The Jasper Hub Talent Management Secretariat.'
  );
  expect(assurance).toBeVisible();
  expect(assurance.closest('div')).toHaveClass('bg-[#EEF6EE]', 'rounded-xl', 'p-4');
});

test('shared header uses the prototype navigation and portal action', async () => {
  setLocation('/?lang=en');
  render(<App />);

  const header = await screen.findByRole('banner');
  const navigation = within(header).getByRole('navigation', { name: 'Main navigation' });

  expect(within(navigation).getAllByRole('link').map((link) => link.textContent.trim())).toEqual([
    'Home',
    'Services',
    'For Influencers',
    'Contact',
  ]);
  expect(within(header).getByRole('link', { name: 'Portal' })).toHaveAttribute(
    'href',
    '/contact?lang=en'
  );
});

test('Press Inquiries remains a selector label and is not repeated as the partnership branch name', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);

  const inquiryType = await screen.findByLabelText(/^How can we best help you/);
  expect(within(inquiryType).getByRole('option', { name: 'Press Inquiries' })).toBeInTheDocument();
  expect(document.getElementById('inquiry-type-help')).not.toHaveTextContent('Press Inquiries');
});

test('creator representation uses the prototype country selector and segmented representation choices', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);

  fireEvent.change(await screen.findByLabelText(/^How can we best help you/), {
    target: { value: 'creator_representation' },
  });

  const country = screen.getByLabelText(/^Country \/ Region/);
  expect(within(country).getByRole('option', { name: 'United States' })).toBeInTheDocument();
  expect(screen.getByRole('radio', { name: 'Yes' })).toBeInTheDocument();
  expect(screen.getByRole('radio', { name: 'No' })).toBeInTheDocument();
});

test('creator selection switches the whole page to its single-column prototype', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);
  fireEvent.change(await screen.findByLabelText(/^How can we best help you/), {
    target: { value: 'creator_representation' },
  });

  expect(screen.getByRole('heading', {
    name: 'Collaborate With The Jasper Hub Agency: Global Talents & Creators',
  })).toBeVisible();
  expect(screen.getByText('Global Creator Program')).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Official Verification & Security Advisory' })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Creator Representation Application' })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Direct Creator Liaison Support' })).toBeVisible();
  expect(screen.queryByRole('complementary', { name: 'Partnership support' })).not.toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: "LET'S WORK TOGETHER!" })).not.toBeInTheDocument();
  expect(screen.queryByText('Accepting Q2 Cohorts')).not.toBeInTheDocument();
});

test('switching whole-page layouts clears the previous inquiry and selected channel metrics', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);
  const selector = await screen.findByLabelText(/^How can we best help you/);
  fireEvent.change(selector, { target: { value: 'creator_representation' } });
  fireEvent.change(screen.getByLabelText(/^Full Name/), { target: { value: 'Previous Creator' } });
  fireEvent.click(screen.getByRole('checkbox', { name: 'Instagram' }));
  fireEvent.click(screen.getByRole('checkbox', { name: 'YouTube' }));

  const metrics = screen.getByRole('group', { name: 'Selected Channel Metrics' });
  expect(within(metrics).getAllByRole('textbox')).toHaveLength(4);
  fireEvent.change(screen.getByLabelText('Instagram Profile URL *'), {
    target: { value: 'https://instagram.com/previous' },
  });
  fireEvent.change(selector, { target: { value: 'partner_inquiry' } });
  expect(screen.getByRole('complementary', { name: 'Partnership support' })).toBeVisible();
  expect(screen.getByLabelText(/^Full Name/)).toHaveValue('');
  expect(screen.queryByRole('group', { name: 'Selected Channel Metrics' })).not.toBeInTheDocument();

  fireEvent.change(selector, { target: { value: 'creator_representation' } });
  expect(screen.getByLabelText(/^Full Name/)).toHaveValue('');
  expect(screen.getByRole('checkbox', { name: 'Instagram' })).not.toBeChecked();
  expect(screen.queryByLabelText('Instagram Profile URL *')).not.toBeInTheDocument();
});

test('creator FAQ keeps the prototype heading and question copy', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);
  fireEvent.change(await screen.findByLabelText(/^How can we best help you/), {
    target: { value: 'creator_representation' },
  });

  expect(await screen.findByRole('heading', { name: "Questions? We've got answers" })).toBeInTheDocument();
  expect(screen.getByText('Quick answers to common questions.')).toBeInTheDocument();
});

test('talent FAQ explains verification without leaking its subtitle into creator mode', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);

  const selector = await screen.findByLabelText(/^How can we best help you/);
  const subtitle = 'Quick answers to common questions about communication authenticity, agency verification, and influencer protocols.';
  expect(screen.getByText(subtitle)).toBeVisible();

  fireEvent.change(selector, { target: { value: 'creator_representation' } });
  expect(screen.queryByText(subtitle)).not.toBeInTheDocument();
  expect(screen.getByText('Quick answers to common questions.')).toBeVisible();
  expect(screen.getByText(/Our main email domain is @thejasperhub.com/)).toBeInTheDocument();
});

test('talent FAQ exposes verification and executive contacts without changing creator support', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);

  const support = await screen.findByRole('region', { name: 'Talent verification support' });
  expect(within(support).getByRole('link', { name: 'Contact Verification Desk' })).toHaveAttribute(
    'href', 'mailto:info@thejasperhub.com'
  );
  expect(within(support).getByRole('link', { name: 'Executive Inquiries' })).toHaveAttribute(
    'href', 'mailto:business@thejasperhub.com'
  );

  fireEvent.change(screen.getByLabelText(/^How can we best help you/), {
    target: { value: 'creator_representation' },
  });
  expect(screen.queryByRole('region', { name: 'Talent verification support' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Email Talent Desk' })).toHaveAttribute(
    'href', 'mailto:info@thejasperhub.com'
  );
});

test('creator form includes its prototype routing and channel selection hints', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);
  fireEvent.change(await screen.findByLabelText(/^How can we best help you/), {
    target: { value: 'creator_representation' },
  });

  expect(screen.getByText('Target Objective')).toBeVisible();
  expect(screen.getByText('Select all active channels')).toBeVisible();
  expect(screen.getAllByRole('checkbox').map((input) => input.closest('label').textContent.trim())).toEqual([
    'TikTok', 'YouTube', 'Instagram', 'Twitter / X', 'Twitch', 'Other',
  ]);
});

test('creator mode exposes the prototype Submit Application action', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);
  fireEvent.change(await screen.findByLabelText(/^How can we best help you/), {
    target: { value: 'creator_representation' },
  });

  expect(screen.getByRole('button', { name: 'Submit Application', exact: true })).toBeVisible();
});

test('talent and creator footers retain the inquiry prototype typography', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);
  const selector = await screen.findByLabelText(/^How can we best help you/);

  for (const value of ['partner_inquiry', 'creator_representation']) {
    fireEvent.change(selector, { target: { value } });
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByText('The Jasper Hub')).toHaveClass('text-[28px]', 'leading-9');
    expect(within(footer).getByRole('heading', { name: 'Contact', exact: true })).toHaveClass('text-xl', 'leading-7');
    expect(within(footer).getByRole('navigation')).toHaveClass('text-[15px]', 'leading-6');
  }
});

test('inquiry FAQ title preserves the prototype desktop line height', async () => {
  setLocation('/globaltalents-collab?lang=en');
  render(<App />);
  expect(await screen.findByRole('heading', { name: "Questions? We've got answers" })).toHaveClass('sm:leading-[48px]');
});
