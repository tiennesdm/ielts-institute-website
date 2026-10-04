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
        />
      )}

      {/* Main Navbar */}
      <Navbar settings={settings} onBookClick={() => handleOpenModal()} courses={courses} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          hero={settings.hero}
          settings={settings}
          onBookClick={() => handleOpenModal()}
        />

        {/* Floating Stats Counters */}
        <StatsSection stats={settings.stats} show={settings.showStats !== false} />

        {/* Band 8+ Courses Catalog */}
        <CoursesSection
          courses={courses}
          onSelectCourse={(courseTitle) => handleOpenModal(courseTitle)}
          config={sections.courses}
        />

        {/* Hall of Fame / High Scorers */}
        <ResultsSection results={results} config={sections.results} />

        {/* Global University Tie-Ups Section */}
        <UniversitySection
          universities={universities}
          onSelectUniversity={(uniName) => handleOpenModal(uniName)}
          config={sections.universities}
        />

        {/* Why Choose Us */}
        <WhyUsSection whyUs={settings.whyUs} onBookClick={() => handleOpenModal()} />

        {/* Dynamic Campus & Events Gallery */}
        <GallerySection gallery={gallery} config={sections.gallery} />

        {/* Upcoming Batches Schedule */}
        <BatchesSection
          batches={batches}
          onBookClick={() => handleOpenModal()}
          config={sections.batches}
        />

        {/* Student Testimonials */}
        <TestimonialsSection testimonials={testimonials} config={sections.testimonials} />

        {/* Frequently Asked Questions */}
        <FaqSection faqs={faqs} config={sections.faqs} />
      </main>

      {/* Footer */}
      <Footer settings={settings} />

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
