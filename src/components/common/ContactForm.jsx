import { useEffect, useState } from 'react';
import { company, inquiryTypes } from '../../data/companyContent.js';
import { deliverInquiry } from '../../lib/deliverInquiry.js';
import Button from '../common/Button.jsx';
import styles from './ContactForm.module.css';

const empty = {
  name: '',
  email: '',
  phone: '',
  message: '',
  company: '',
  hiringNeed: '',
  roleSkills: '',
  careerInterest: '',
  skills: '',
  goals: '',
};

function validate(values, type) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (values.phone.trim()) {
    const digits = values.phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
      errors.phone = 'Enter a phone number with 7 to 15 digits, or leave this blank.';
    }
  }
  if (values.message.trim().length < 12) errors.message = 'Add a short message so we know how to help.';
  if (values.message.trim().length > 2000) errors.message = 'Please keep the message under 2000 characters.';
  if (type === 'employer') {
    if (!values.company.trim()) errors.company = 'Enter your company name.';
    if (!values.hiringNeed.trim()) errors.hiringNeed = 'Describe the hiring requirement.';
    if (!values.roleSkills.trim()) errors.roleSkills = 'Share the role or skills you need.';
  }
  if (type === 'candidate') {
    if (!values.careerInterest.trim()) errors.careerInterest = 'Share your career interest.';
    if (!values.skills.trim()) errors.skills = 'Summarize your skills or experience.';
    if (!values.goals.trim()) errors.goals = 'Tell us about your career goals.';
  }
  return errors;
}

function Field({ id, label, hint, error, children }) {
  return (
    <div className={error ? `${styles.field} ${styles.invalid}` : styles.field}>
      <label htmlFor={id}>
        {label}
        {hint ? <span>{hint}</span> : null}
      </label>
      {children}
      {error ? <p id={`${id}-error`}>{error}</p> : null}
    </div>
  );
}

export default function ContactForm({ inquiryType, topic, onTypeChange }) {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [delivery, setDelivery] = useState(null);
  const [copyNote, setCopyNote] = useState('');

  useEffect(() => {
    if (status === 'ready') document.getElementById('inquiry-ready')?.focus();
  }, [status]);

  const set = (key) => (event) => {
    setValues((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const described = (id) => (errors[id] ? `${id}-error` : undefined);

  const onSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(values, inquiryType);
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) {
      setStatus('idle');
      document.getElementById(first)?.focus();
      return;
    }

    const typeLabel = inquiryTypes.find((item) => item.id === inquiryType)?.label || 'General Inquiry';
    const payload = {
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      message: values.message.trim(),
      company: values.company.trim(),
      hiringNeed: values.hiringNeed.trim(),
      roleSkills: values.roleSkills.trim(),
      careerInterest: values.careerInterest.trim(),
      skills: values.skills.trim(),
      goals: values.goals.trim(),
      topic,
      typeLabel,
    };

    try {
      const result = deliverInquiry(payload);
      setDelivery(result);
      setStatus('ready');
      setCopyNote('');
    } catch (error) {
      setStatus('error');
      setDelivery(null);
      setCopyNote(error.code === 'too-long'
        ? 'This inquiry is too long to open in an email draft. Shorten the message and try again.'
        : 'We could not open an email draft. You can still write to us at the address on this page.');
    }
  };

  const copyMessage = async () => {
    if (!delivery?.body) return;
    try {
      await navigator.clipboard.writeText(`To: ${company.email}\n\n${delivery.body}`);
      setCopyNote('Inquiry copied. Paste it into an email to our team.');
    } catch {
      setCopyNote('Copy was blocked by the browser. Select the inquiry text below instead.');
    }
  };

  const reset = () => {
    setValues(empty);
    setErrors({});
    setStatus('idle');
    setDelivery(null);
    setCopyNote('');
  };

  if (status === 'ready' && delivery) {
    return (
      <div className={styles.ready}>
        <h3 id="inquiry-ready" tabIndex={-1}>Your inquiry is ready to email</h3>
        <p>
          An email draft addressed to <a href={`mailto:${company.email}`}>{company.email}</a> should open on your device.
          This website does not store inquiries. If the draft did not open, send the message below yourself.
        </p>
        <pre>{delivery.body}</pre>
        <div className={styles.readyActions}>
          <a className={styles.mail} href={delivery.href}>Open email draft again</a>
          <Button type="button" variant="ink" onClick={copyMessage}>Copy inquiry</Button>
          <button type="button" className={styles.textButton} onClick={reset}>Start another inquiry</button>
        </div>
        {copyNote ? <p role="status">{copyNote}</p> : null}
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {topic ? <p className={styles.topic}>Regarding: {topic}</p> : null}
      {status === 'error' ? <p className={styles.alert} role="alert">{copyNote}</p> : null}
      {Object.keys(errors).length > 0 ? (
        <p className={styles.alert} role="alert">Please correct the highlighted fields.</p>
      ) : null}

      <fieldset className={styles.types}>
        <legend>Inquiry type</legend>
        <div className={styles.typeGrid}>
          {inquiryTypes.map((type) => (
            <label key={type.id} className={inquiryType === type.id ? `${styles.type} ${styles.typeOn}` : styles.type}>
              <input
                type="radio"
                name="inquiry-type"
                value={type.id}
                checked={inquiryType === type.id}
                onChange={() => onTypeChange(type.id)}
              />
              {type.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.grid}>
        <Field id="name" label="Full name" hint="Required" error={errors.name}>
          <input id="name" name="name" autoComplete="name" value={values.name} onChange={set('name')} aria-invalid={Boolean(errors.name)} aria-describedby={described('name')} />
        </Field>
        <Field id="email" label="Email address" hint="Required" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={set('email')} aria-invalid={Boolean(errors.email)} aria-describedby={described('email')} />
        </Field>
        <Field id="phone" label="Phone number" hint="Optional" error={errors.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={values.phone} onChange={set('phone')} aria-invalid={Boolean(errors.phone)} aria-describedby={described('phone')} />
        </Field>

        {inquiryType === 'employer' ? (
          <>
            <Field id="company" label="Company name" hint="Required" error={errors.company}>
              <input id="company" name="company" autoComplete="organization" value={values.company} onChange={set('company')} aria-invalid={Boolean(errors.company)} aria-describedby={described('company')} />
            </Field>
            <Field id="hiringNeed" label="Hiring requirement" hint="Required" error={errors.hiringNeed}>
              <input id="hiringNeed" name="hiringNeed" value={values.hiringNeed} onChange={set('hiringNeed')} aria-invalid={Boolean(errors.hiringNeed)} aria-describedby={described('hiringNeed')} />
            </Field>
            <Field id="roleSkills" label="Role / skill requirements" hint="Required" error={errors.roleSkills}>
              <input id="roleSkills" name="roleSkills" value={values.roleSkills} onChange={set('roleSkills')} aria-invalid={Boolean(errors.roleSkills)} aria-describedby={described('roleSkills')} />
            </Field>
          </>
        ) : null}

        {inquiryType === 'candidate' ? (
          <>
            <Field id="careerInterest" label="Career interest" hint="Required" error={errors.careerInterest}>
              <input id="careerInterest" name="careerInterest" value={values.careerInterest} onChange={set('careerInterest')} aria-invalid={Boolean(errors.careerInterest)} aria-describedby={described('careerInterest')} />
            </Field>
            <Field id="skills" label="Skills / experience" hint="Required" error={errors.skills}>
              <input id="skills" name="skills" value={values.skills} onChange={set('skills')} aria-invalid={Boolean(errors.skills)} aria-describedby={described('skills')} />
            </Field>
            <Field id="goals" label="Career goals" hint="Required" error={errors.goals}>
              <textarea id="goals" name="goals" rows="3" value={values.goals} onChange={set('goals')} aria-invalid={Boolean(errors.goals)} aria-describedby={described('goals')} />
            </Field>
          </>
        ) : null}

        <Field id="message" label="Message" hint="Required" error={errors.message}>
          <textarea id="message" name="message" rows="5" value={values.message} onChange={set('message')} aria-invalid={Boolean(errors.message)} aria-describedby={described('message')} />
        </Field>
      </div>

      <div className={styles.submitRow}>
        <Button type="submit" variant="ink">Prepare email inquiry</Button>
        <p>Submitting opens your email app. Nothing is saved on this website.</p>
      </div>
    </form>
  );
}
