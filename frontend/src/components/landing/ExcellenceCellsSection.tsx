import React, { useState } from 'react';
import { X, CheckCircle2, Cpu, Brain, Layers, GraduationCap, Globe, Lightbulb, Users } from 'lucide-react';

interface ExcellenceCellData {
  id: string;
  name: string;
  partner: string;
  image: string;
  brief: string;
  details: string;
  icon: React.ReactNode;
  extended?: {
    vision?: string;
    offerings?: string[];
    whyPartner?: string[];
  };
}

export const ExcellenceCellsSection: React.FC = () => {
  const [selectedCell, setSelectedCell] = useState<ExcellenceCellData | null>(null);

  const cells: ExcellenceCellData[] = [
    {
      id: 'family-business',
      name: "Family Business & Entrepreneurship",
      partner: "Jagran Lakecity University",
      image: "/images/1_family_business.jpg",
      brief: "Building sustainable family enterprises through governance, entrepreneurship, and next-generation leadership.",
      details: "The Family Business & Entrepreneurship Cell supports family-owned enterprises and aspiring entrepreneurs through structured guidance, industry engagement, and practical learning. It focuses on strengthening business continuity, encouraging innovation, promoting networking opportunities, and developing next-generation leadership for sustainable growth.",
      icon: <Users className="h-5 w-5 text-blue-650" />
    },
    {
      id: 'talent-readiness',
      name: "Talent Readiness & Employability",
      partner: "Lakshmi Narain College of Technology",
      image: "/images/2_talent_readiness.jpg",
      brief: "Preparing students with industry exposure, career readiness, mentoring, and employability skills.",
      details: "The Talent Readiness & Employability Cell prepares students for successful careers by enhancing professional skills and industry exposure. The cell emphasizes career readiness, placement preparation, employability enhancement, and mentorship to bridge the gap between academia and industry.",
      icon: <GraduationCap className="h-5 w-5 text-indigo-650" />
    },
    {
      id: 'research-innovation',
      name: "Research & Innovation",
      partner: "LNCT University",
      image: "/images/3_research_innovation.jpg",
      brief: "Promoting applied research, innovation, technology development, and industry collaboration.",
      details: "The Research & Innovation Cell promotes applied research and technology-driven innovation to solve real-world challenges. It encourages industry collaboration, supports innovation laboratories, facilitates intellectual property development, and nurtures startup-oriented research initiatives.",
      icon: <Lightbulb className="h-5 w-5 text-amber-600" />
    },
    {
      id: 'ai-in-business',
      name: "AI in Business",
      partner: "Oriental Group of Institutes",
      image: "/images/4_ai_in_business.jpg",
      brief: "Helping organizations adopt Artificial Intelligence through practical use cases, analytics, automation, and AI-driven business transformation.",
      details: "The AI in Business Excellence Cell, led by Oriental Group of Institutes (OGI) in collaboration with CII Industry Academia Excellence Cell, serves as a trusted academic partner for industries embarking on their AI transformation journey. The cell helps organizations identify opportunities, validate AI solutions, and build the capabilities needed for successful and responsible AI adoption.",
      icon: <Brain className="h-5 w-5 text-purple-600" />,
      extended: {
        vision: "To bridge the gap between industry challenges and Artificial Intelligence by enabling practical innovation, collaborative research, and future-ready talent development.",
        offerings: [
          "AI Readiness Assessment: Evaluate organizational readiness and identify high-impact opportunities for AI adoption.",
          "Proof of Concept Development: Prototype AI solutions in collaboration with faculty and students before making major technology investments.",
          "Business Analytics & Decision Intelligence: Transform business data into meaningful insights that support smarter and faster decision-making.",
          "Process Automation: Design AI-powered automation solutions that improve operational efficiency and productivity.",
          "Industry–Academia Collaboration: Work with OGI's faculty, researchers, and students to solve real-world business challenges through innovation.",
          "AI Capability Building: Bridge the AI literacy gap through workshops, training programs, and hands-on learning experiences.",
          "Cost-Effective AI Adoption: Explore AI in a vendor-neutral academic environment, reducing risk before large-scale implementation.",
          "Innovation & Product Development: Collaborate on live industry projects and develop AI-driven products and practical business solutions.",
          "Future-Ready Talent: Connect with skilled students equipped with the latest AI knowledge and practical experience."
        ],
        whyPartner: [
          "Trusted academic partner for AI transformation",
          "Vendor-neutral guidance and expert consultation",
          "Collaborative innovation through faculty and student expertise",
          "Low-risk experimentation with AI solutions",
          "Access to future-ready talent and research capabilities",
          "Strong Industry–Academia collaboration through CII"
        ]
      }
    },
    {
      id: 'agritech',
      name: "AgriTech",
      partner: "Rabindranath Tagore University",
      image: "/images/5_agritech.jpeg",
      brief: "Advancing agriculture through digital technologies, sustainability, and smart farming innovation.",
      details: "The AgriTech Cell promotes innovation in agriculture by integrating modern technologies with sustainable farming practices. It supports agricultural research, digital solutions, climate-smart agriculture, and startup initiatives that contribute to the growth of the agri ecosystem.",
      icon: <Globe className="h-5 w-5 text-emerald-650" />
    },
    {
      id: 'skill-development',
      name: "Skill Development",
      partner: "Scope Global Skills University",
      image: "/images/6_skill_development.jpeg",
      brief: "Empowering learners with industry-aligned training, certifications, and lifelong learning opportunities.",
      details: "The Skill Development Cell equips learners with industry-relevant knowledge and practical experience to improve career readiness. The cell focuses on hands-on training, skill certification, lifelong learning, and continuous professional development aligned with industry requirements.",
      icon: <Layers className="h-5 w-5 text-sky-600" />
    },
    {
      id: 'startup-cell',
      name: "Startup Cell",
      partner: "Rabindranath Tagore University",
      image: "/images/7_startup.jpeg",
      brief: "Supporting entrepreneurship through mentorship, incubation, funding opportunities, and startup growth.",
      details: "The Startup Cell empowers innovators by supporting the complete entrepreneurial journey from idea to venture creation. It provides guidance in ideation, mentorship, investor connections, and startup growth through collaboration with industry and academic experts.",
      icon: <Cpu className="h-5 w-5 text-rose-650" />
    }
  ];

  return (
    <section id="our-ecosystem" className="py-16 sm:py-24 bg-[#faf7f0] border-t border-[#e8e4dc] scroll-mt-20">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf4f0] text-[#063028] text-xs font-semibold tracking-wide">
            Excellence Cells
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063028] tracking-tight leading-tight font-serif">
            Driving Innovation Through Specialized Excellence
          </h2>
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
            The CII Industry–Academia Excellence Initiative brings together specialized Excellence Cells hosted by leading partner institutions. Each Excellence Cell focuses on a specific domain, enabling industries to collaborate with the right academic expertise and student talent.
          </p>
        </div>

        {/* Cells Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cells.map((cell) => (
            <div 
              key={cell.id}
              onClick={() => setSelectedCell(cell)}
              className="group bg-white border border-stone-200/90 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md hover:border-stone-300 transition-all duration-300 cursor-pointer"
            >
              <div className="space-y-4">
                {/* Cell Image Frame - natural height to prevent cropping infographic text */}
                <div className="w-full overflow-hidden relative bg-white border-b border-stone-100">
                  <img 
                    src={cell.image} 
                    alt={cell.name} 
                    className="w-full h-auto block group-hover:scale-[1.01] transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Card Content - Partner label placed inline above title to prevent overlapping */}
                <div className="px-5 sm:px-6 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-600 uppercase tracking-wider">
                    {cell.icon}
                    <span>{cell.partner}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#063028] font-serif group-hover:text-[#c48825] transition-colors leading-snug">
                    {cell.name}
                  </h3>
                  <p className="text-sm text-stone-700 leading-relaxed font-normal">
                    {cell.brief}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-2 mt-4 flex items-center gap-1.5 text-sm font-bold text-[#063028] group-hover:text-[#c48825] transition-colors">
                <span>Explore Cell Details</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Explore All Excellence Cells Button */}
        <div className="mt-16 text-center">
          <button
            onClick={() => {
              const el = document.getElementById('partner-institutions');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#063028] hover:bg-[#04201a] text-white rounded-xl text-sm sm:text-base font-bold shadow-xs transition-all duration-200 cursor-pointer"
          >
            Explore All CII Excellence Cells
          </button>
        </div>

      </div>

      {/* Slide-Over Drawer/Modal for Cell Details */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-[#04201a]/70 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedCell(null)}
          ></div>

          {/* Centered Modal Card Container */}
          <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-stone-200 shadow-2xl flex flex-col justify-between z-10 max-h-[90vh] overflow-hidden">
            
            {/* Header Block - Sticky top */}
            <div className="border-b border-stone-100 p-6 flex justify-between items-center bg-[#faf7f0] shrink-0">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase text-[#a6711c] tracking-wider">
                  Excellence Cell Profile
                </span>
                <h3 className="text-2xl font-bold text-[#063028] font-serif">
                  {selectedCell.name}
                </h3>
                <p className="text-sm text-stone-600 font-medium">
                  Partner Institution: {selectedCell.partner}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCell(null)}
                className="p-2.5 bg-white hover:bg-stone-100 text-stone-600 rounded-full border border-stone-200 shadow-xs transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow p-6 sm:p-8 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Left Column: Profile Image */}
                <div className="w-full rounded-2xl overflow-hidden border border-stone-200 bg-white shadow-xs md:sticky md:top-0">
                  <img 
                    src={selectedCell.image} 
                    alt={selectedCell.name} 
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                </div>

                {/* Right Column: Text descriptions */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-stone-600 uppercase tracking-wider">About the Cell</h4>
                    <p className="text-base text-stone-800 leading-relaxed font-semibold">
                      {selectedCell.brief}
                    </p>
                    <p className="text-base text-stone-700 leading-relaxed">
                      {selectedCell.details}
                    </p>
                  </div>

                  {/* Extended Details */}
                  {selectedCell.extended && (
                    <div className="space-y-6 pt-6 border-t border-stone-100">
                      {selectedCell.extended.vision && (
                        <div className="bg-[#faf7f0] border border-stone-200/80 p-5 rounded-2xl space-y-2">
                          <h4 className="text-sm font-bold text-stone-700 uppercase tracking-wider">Our Vision</h4>
                          <p className="text-base text-stone-800 font-medium leading-relaxed">
                            {selectedCell.extended.vision}
                          </p>
                        </div>
                      )}

                      {selectedCell.extended.offerings && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold text-stone-600 uppercase tracking-wider">What We Offer</h4>
                          <div className="grid grid-cols-1 gap-3">
                            {selectedCell.extended.offerings.map((offering, idx) => {
                              const [title, desc] = offering.split(': ');
                              return (
                                <div key={idx} className="flex gap-3 items-start">
                                  <span className="h-6 w-6 rounded-full bg-[#edf4f0] text-[#063028] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <div className="text-sm sm:text-base">
                                    <strong className="font-bold text-[#063028]">{title}:</strong>
                                    <span className="text-stone-700 ml-1 leading-relaxed">{desc}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {selectedCell.extended.whyPartner && (
                        <div className="space-y-4 pt-6 border-t border-stone-100">
                          <h4 className="text-sm font-bold text-stone-600 uppercase tracking-wider">Why Partner with OGI?</h4>
                          <ul className="grid grid-cols-1 gap-3 pl-1">
                            {selectedCell.extended.whyPartner.map((item, idx) => (
                              <li key={idx} className="flex gap-2.5 items-start">
                                <CheckCircle2 className="h-5 w-5 text-[#063028] shrink-0 mt-0.5" />
                                <span className="text-sm sm:text-base text-stone-700 font-medium leading-normal">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-stone-100 p-6 bg-[#faf7f0] flex justify-end gap-3">
              <button
                onClick={() => setSelectedCell(null)}
                className="px-5 py-3 border border-stone-300 hover:bg-stone-100 rounded-xl text-sm font-bold text-stone-700 cursor-pointer"
              >
                Close Profile
              </button>
              <button
                onClick={() => {
                  setSelectedCell(null);
                  const el = document.getElementById('get-involved');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-[#063028] hover:bg-[#04201a] text-white rounded-xl text-sm font-bold shadow-xs transition-all cursor-pointer"
              >
                Connect &amp; Collaborate
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
