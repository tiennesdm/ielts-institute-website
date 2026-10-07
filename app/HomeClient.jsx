'use client';
import { useState } from 'react';
import NoticeBar from '@/components/NoticeBar';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import CoursesSection from '@/components/CoursesSection';
import ResultsSection from '@/components/ResultsSection';
import UniversitySection from '@/components/UniversitySection';
import GallerySection from '@/components/GallerySection';
import WhyUsSection from '@/components/WhyUsSection';
import BatchesSection from '@/components/BatchesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FaqSection from '@/components/FaqSection';
import InquiryModal from '@/components/InquiryModal';
import WhatsAppButton from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';

export default function HomeClient({ initialData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');

  const settings = initialData?.settings || {};
  const sections = settings?.sections || {};
  const courses = initialData?.courses || [];
  const results = initialData?.results || [];
  const universities = initialData?.universities || {};
  const gallery = initialData?.gallery || [];
  const batches = initialData?.batches || [];
  const testimonials = initialData?.testimonials || [];
  const faqs = initialData?.faqs || [];

  const handleOpenModal = (courseName = '') => {
    setSelectedCourse(courseName);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-red-600 selection:text-white">
      {/* Top Announcement Bar */}
      {settings.showAnnouncement && (
        <NoticeBar
          announcement={settings.announcement}
          phone={settings.phone}
          show={settings.showAnnouncement}
          onBookClick={() => handleOpenModal()}
          callText={settings.announcementCallText}
          ctaText={settings.announcementCtaText}
        />
      )}

      {/* Main Navbar */}
      <Navbar settings={settings} onBookClick={() => handleOpenModal()} courses={courses} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        {settings.hero?.show !== false && (
          <HeroSection
            hero={settings.hero}
            settings={settings}
            onBookClick={() => handleOpenModal()}
          />
        )}

        {/* Floating Stats Counters */}
        {settings.showStats !== false && (
          <StatsSection stats={settings.stats} show={true} />
        )}

        {/* Band 8+ Courses Catalog */}
        {sections.courses?.show !== false && (
          <CoursesSection
            courses={courses}
            onSelectCourse={(courseTitle) => handleOpenModal(courseTitle)}
            config={sections.courses}
          />
        )}

        {/* Hall of Fame / High Scorers */}
        {sections.results?.show !== false && (
          <ResultsSection results={results} config={sections.results} />
        )}

        {/* Global University Tie-Ups Section */}
        {sections.universities?.show !== false && (
          <UniversitySection
            universities={universities}
            onSelectUniversity={(uniName) => handleOpenModal(uniName)}
            config={sections.universities}
          />
        )}

        {/* Why Choose Us */}
        {(sections.whyUs?.show !== false && settings.whyUs?.show !== false) && (
          <WhyUsSection whyUs={settings.whyUs} onBookClick={() => handleOpenModal()} />
        )}

        {/* Dynamic Campus & Events Gallery */}
        {sections.gallery?.show !== false && (
          <GallerySection gallery={gallery} config={sections.gallery} />
        )}

        {/* Upcoming Batches Schedule */}
        {sections.batches?.show !== false && (
          <BatchesSection
            batches={batches}
            onBookClick={() => handleOpenModal()}
            config={sections.batches}
          />
        )}

        {/* Student Testimonials */}
        {sections.testimonials?.show !== false && (
          <TestimonialsSection testimonials={testimonials} config={sections.testimonials} />
        )}

        {/* Frequently Asked Questions */}
        {sections?.faqs?.show !== false && (
          <FaqSection
            faqs={faqs}
            config={sections?.faqs}
            settings={settings}
            onBookClick={() => handleOpenModal()}
          />
        )}
      </main>

      {/* Footer */}
      {settings.showFooter !== false && <Footer settings={settings} />}

      {/* Floating WhatsApp Action Button */}
      <WhatsAppButton whatsapp={settings.whatsapp} whatsappConfig={settings.whatsappConfig} />

      {/* Book Free Demo / Mock Test Modal */}
      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prefilledCourse={selectedCourse}
        modalConfig={settings.modal}
        courses={courses}
      />
    </div>
  );
}
