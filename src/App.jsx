import { useCallback, useState } from 'react';
import useReducedMotion from './hooks/useReducedMotion.js';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import HeroSection from './components/hero/HeroSection.jsx';
import AudiencePaths from './components/sections/AudiencePaths.jsx';
import RecruitmentServices from './components/sections/RecruitmentServices.jsx';
import RecruitmentProcess from './components/sections/RecruitmentProcess.jsx';
import WhyAlphaTalent from './components/sections/WhyAlphaTalent.jsx';
import AboutSection from './components/sections/AboutSection.jsx';
import ConversionSection from './components/sections/ConversionSection.jsx';
import ContactSection from './components/sections/ContactSection.jsx';

function scrollToContact(reduced) {
  const node = document.getElementById('contact');
  node?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  window.setTimeout(() => {
    document.getElementById('contact-heading')?.focus();
  }, reduced ? 0 : 350);
}

export default function App() {
  const reduced = useReducedMotion();
  const [inquiry, setInquiry] = useState({ type: 'general', topic: '' });

  const openInquiry = useCallback((type, topic = '') => {
    setInquiry({ type, topic });
    scrollToContact(reduced);
  }, [reduced]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Navbar />
      <main id="main">
        <HeroSection />
        <AudiencePaths
          onEmployer={() => openInquiry('employer')}
          onCandidate={() => openInquiry('candidate')}
        />
        <RecruitmentServices onInquire={openInquiry} />
        <RecruitmentProcess />
        <WhyAlphaTalent />
        <AboutSection />
        <ConversionSection
          onEmployer={() => openInquiry('employer')}
          onCandidate={() => openInquiry('candidate')}
        />
        <ContactSection
          inquiryType={inquiry.type}
          topic={inquiry.topic}
          onTypeChange={(type) => setInquiry({ type, topic: '' })}
        />
      </main>
      <Footer />
    </>
  );
}
