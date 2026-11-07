import { company } from '../data/companyContent.js';

export function formatInquiry(payload) {
  const lines = [
    `Inquiry type: ${payload.typeLabel}`,
    payload.topic ? `Regarding: ${payload.topic}` : null,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || 'Not provided'}`,
    payload.company ? `Company: ${payload.company}` : null,
    payload.hiringNeed ? `Hiring requirement: ${payload.hiringNeed}` : null,
    payload.roleSkills ? `Role / skill requirements: ${payload.roleSkills}` : null,
    payload.careerInterest ? `Career interest: ${payload.careerInterest}` : null,
    payload.skills ? `Skills / experience: ${payload.skills}` : null,
    payload.goals ? `Career goals: ${payload.goals}` : null,
    '',
    'Message:',
    payload.message,
  ].filter((line) => line !== null);

  return lines.join('\n');
}

/**
 * Opens an email draft. This website does not store inquiries.
 * Replace this function with a fetch() call when a backend exists.
 */
export function deliverInquiry(payload) {
  const body = formatInquiry(payload);
  const subject = `${payload.typeLabel} - Alpha Talent Technology`;
  const href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (href.length > 1800) {
    const error = new Error('Inquiry is too long for an email draft.');
    error.code = 'too-long';
    throw error;
  }

  const link = document.createElement('a');
  link.href = href;
  document.body.appendChild(link);
  link.click();
  link.remove();

  return {
    method: 'mailto',
    href,
    body,
    stored: false,
  };
}
