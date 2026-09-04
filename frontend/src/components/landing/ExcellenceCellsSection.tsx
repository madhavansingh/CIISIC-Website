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
    whoThisIsFor?: string[];
    problemsWeHelpSolve?: string[];
    howWeWorkTogether?: {
      flow: string;
      description: string;
    };
    whatYouWalkAwayWith?: string[];
    whyPartnerTitle?: string;
    whyPartner?: string[];
    structuredOfferings?: {
      icon: string;
      title: string;
      description: string;
    }[];
    offerings?: string[];
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
      name: "AI in Business Excellence Cell",
      partner: "Oriental Group of Institutes (OGI)",
      image: "/images/4_ai_in_business.jpg",
      brief: "Helping organizations adopt Artificial Intelligence through practical use cases, analytics, automation, and AI-driven business transformation.",
      details: "The AI in Business Excellence Cell, run by Oriental Group of Institutes in collaboration with the CII Industry Academia Excellence Cell, exists to give organizations a dependable starting point for AI adoption, one built on evidence and experimentation rather than sales pitches. We help companies figure out where AI genuinely fits, test it before committing real budget, and build the internal skills needed to sustain it once the pilot is over.",
      icon: <Brain className="h-5 w-5 text-purple-600" />,
      extended: {
        vision: "To close the gap between real industry problems and what AI can practically solve, through hands-on innovation, honest research collaboration, and talent that's genuinely ready for the workplace.",
        whoThisIsFor: [
          "Startups and early-stage ventures exploring their first AI use case",
          "MSMEs looking for affordable, low-risk ways to automate or analyze",
          "Corporates validating AI investments before scaling",
          "Educational institutions building AI programs or research partnerships",
          "Government bodies and industry associations exploring digital transformation"
        ],
        problemsWeHelpSolve: [
          "Manual, repetitive processes eating up team time",
          "Large volumes of documents or unstructured data with no easy way to use them",
          "Customer support that doesn't scale",
          "Reporting and decision-making that relies on gut feel over data",
          "Forecasting, demand planning, and business intelligence gaps",
          "Uncertainty about where to even start with AI"
        ],
        howWeWorkTogether: {
          flow: "Discover → Assess → Prototype → Validate → Deploy → Scale",
          description: "We start by understanding your actual problem, assess where AI can realistically help, build a working prototype, test it against your data, support deployment, and help you scale what works. No step is skipped, and nothing gets built before it's been validated."
        },
        whatYouWalkAwayWith: [
          "An AI opportunity report specific to your business",
          "A practical, sequenced AI adoption roadmap",
          "A working proof-of-concept, not just a slide deck",
          "A tested prototype ready for real use",
          "Hands-on training for your team",
          "Ongoing access to student and faculty collaboration",
          "Research support and, where needed, deployment help"
        ],
        whyPartnerTitle: "Why an Academic AI Partner",
        whyPartner: [
          "Trusted academic partner for AI transformation",
          "Vendor-neutral guidance and expert consultation",
          "Collaborative innovation through faculty and student expertise",
          "Low-risk experimentation with AI solutions",
          "Access to future-ready talent and research capabilities",
          "Strong Industry–Academia collaboration through CII"
        ],
        structuredOfferings: [
          {
            icon: "🎓",
            title: "AI Education & Capability Building",
            description: "From foundational AI/ML and Generative AI workshops to prompt engineering training and hands-on bootcamps, we help faculty, students, and working professionals build real skills, not just certificates. This includes Faculty Development Programs and AI awareness sessions for leadership teams who need the big picture before making decisions."
          },
          {
            icon: "🛠️",
            title: "AI Projects & Prototyping",
            description: "We build working AI systems, not just proposals, including proof-of-concepts, computer vision solutions, NLP tools, recommendation engines, predictive models, and dashboards, often through live student-industry projects that give both sides something real to show for it."
          },
          {
            icon: "🤖",
            title: "Generative AI & Automation",
            description: "This is where a lot of near-term value sits: chatbots, RAG-based knowledge assistants, AI agents, document Q&A systems, and workflow automation that takes repetitive work off your team's plate, whether that's customer support, internal knowledge lookup, or content generation."
          },
          {
            icon: "📊",
            title: "Data & Business Intelligence",
            description: "We turn scattered data into decisions through business analytics, forecasting, decision-intelligence dashboards, and process-improvement work grounded in what your numbers are actually telling you."
          },
          {
            icon: "🏢",
            title: "AI Transformation for Organizations",
            description: "Before recommending any tool, we assess readiness, identify realistic use cases, and build a vendor-neutral adoption roadmap, including responsible AI guidance, so growth doesn't outpace governance."
          },
          {
            icon: "🔬",
            title: "Research & Innovation",
            description: "Applied AI research, hackathons, innovation challenges, and faculty-student collaboration aimed at solving real problems, with support extended to startups building their own AI-driven products."
          },
          {
            icon: "👨‍💻",
            title: "Talent & Industry Connect",
            description: "Internships, mentorships, industry expert sessions, and placement-oriented training that connect capable students directly with the organizations that need them, plus project showcases that double as a live talent pipeline."
          }
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

                      {/* Who This Is For */}
                      {selectedCell.extended.whoThisIsFor && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-stone-600 uppercase tracking-wider">Who This Is For</h4>
                          <ul className="space-y-2.5">
                            {selectedCell.extended.whoThisIsFor.map((item, idx) => (
                              <li key={idx} className="flex gap-2.5 items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-2 shrink-0" />
                                <span className="text-sm sm:text-base text-stone-700 leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Problems We Help Solve */}
                      {selectedCell.extended.problemsWeHelpSolve && (
                        <div className="space-y-3 pt-4 border-t border-stone-100">
                          <h4 className="text-sm font-bold text-stone-600 uppercase tracking-wider">Problems We Help Solve</h4>
                          <ul className="space-y-2.5">
                            {selectedCell.extended.problemsWeHelpSolve.map((item, idx) => (
                              <li key={idx} className="flex gap-2.5 items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c48825] mt-2 shrink-0" />
                                <span className="text-sm sm:text-base text-stone-700 leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* How We Work Together */}
                      {selectedCell.extended.howWeWorkTogether && (
                        <div className="space-y-3 pt-4 border-t border-stone-100">
                          <h4 className="text-sm font-bold text-stone-600 uppercase tracking-wider">How We Work Together</h4>
                          <div className="bg-[#edf4f0] text-[#063028] px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold inline-block">
                            {selectedCell.extended.howWeWorkTogether.flow}
                          </div>
                          <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                            {selectedCell.extended.howWeWorkTogether.description}
                          </p>
                        </div>
                      )}

                      {/* What You Walk Away With */}
                      {selectedCell.extended.whatYouWalkAwayWith && (
                        <div className="space-y-3 pt-4 border-t border-stone-100">
                          <h4 className="text-sm font-bold text-stone-600 uppercase tracking-wider">What You Walk Away With</h4>
                          <ul className="space-y-2.5">
                            {selectedCell.extended.whatYouWalkAwayWith.map((item, idx) => (
                              <li key={idx} className="flex gap-2.5 items-start">
                                <CheckCircle2 className="h-5 w-5 text-[#063028] shrink-0 mt-0.5" />
                                <span className="text-sm sm:text-base text-stone-700 font-medium leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Why an Academic AI Partner / Why Partner */}
                      {selectedCell.extended.whyPartner && (
                        <div className="space-y-3 pt-4 border-t border-stone-100">
                          <h4 className="text-sm font-bold text-stone-600 uppercase tracking-wider">
                            {selectedCell.extended.whyPartnerTitle || 'Why Partner with Us?'}
                          </h4>
                          <ul className="space-y-2.5">
                            {selectedCell.extended.whyPartner.map((item, idx) => (
                              <li key={idx} className="flex gap-2.5 items-start">
                                <CheckCircle2 className="h-5 w-5 text-[#063028] shrink-0 mt-0.5" />
                                <span className="text-sm sm:text-base text-stone-700 font-medium leading-normal">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* What We Offer - Structured with icons */}
                      {selectedCell.extended.structuredOfferings && (
                        <div className="space-y-4 pt-4 border-t border-stone-100">
                          <h4 className="text-sm font-bold text-stone-600 uppercase tracking-wider">What We Offer</h4>
                          <div className="space-y-4">
                            {selectedCell.extended.structuredOfferings.map((offering, idx) => (
                              <div key={idx} className="bg-[#faf7f0] border border-stone-200/80 p-4 rounded-xl space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{offering.icon}</span>
                                  <h5 className="font-bold text-[#063028] text-sm sm:text-base">{offering.title}</h5>
                                </div>
                                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pl-7">
                                  {offering.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Fallback legacy offerings if any */}
                      {selectedCell.extended.offerings && !selectedCell.extended.structuredOfferings && (
                        <div className="space-y-4 pt-4 border-t border-stone-100">
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
