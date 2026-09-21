import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Compass, Users, ShieldCheck } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const servicePillars = [
    {
      num: '01',
      domain: 'ENGINEERING',
      title: 'Build & Deploy',
      icon: Cpu,
      description: 'Design and implement AI assistants, agents, workflows, and simulations that operate in your real environment, not just in demos.',
      services: [
        'Forward Deployment Engineering',
        'Multi-Agent Workflow Consulting',
        'Digital Twin & Simulation Modeling',
      ],
      linkAnchor: 'build-deploy',
    },
    {
      num: '02',
      domain: 'STRATEGY',
      title: 'Strategy & Visibility',
      icon: Compass,
      description: 'Clarify where AI can create value, choose the right tools, and make sure your brand and expertise show up in AI-driven search and recommendations.',
      services: [
        'Generative Engine Optimization (GEO)',
        'AI Vendor Evaluation & Selection',
        'AI Market & Competitive Intelligence',
      ],
      linkAnchor: 'strategy-visibility',
    },
    {
      num: '03',
      domain: 'CAPABILITY',
      title: 'Adoption & Capability',
      icon: Users,
      description: 'Build the skills, habits, and programmes that make AI stick in your teams, classrooms, and everyday workflows.',
      services: [
        'Change Management for AI Adoption',
        'AI Hackathon Design-as-a-Service',
        'Custom AI Curriculum Design',
      ],
      linkAnchor: 'adoption-capability',
    },
    {
      num: '04',
      domain: 'GOVERNANCE',
      title: 'Governance & Insight',
      icon: ShieldCheck,
      description: 'Put the right oversight, data practices, and reporting processes in place so AI is used safely, responsibly, and with clear business value.',
      services: [
        'AI Governance, Risk & Compliance',
        'AI Readiness Audits',
        'AI Impact & ROI Measurement',
      ],
      linkAnchor: 'governance-insight',
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-24 bg-[#faf8f4] border-t border-[#e8e4dc] scroll-mt-20">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#edf4f0] text-[#063028] text-xs font-bold tracking-widest uppercase border border-[#063028]/10">
            CIISIC · SERVICES
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063028] tracking-tight font-serif leading-tight">
            Ways We Help You Move Forward with AI
          </h2>
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
            Whether you are choosing a direction, building a solution, helping teams adopt AI, or putting the right safeguards in place, CIISIC can support the next step.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {servicePillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:shadow-md hover:border-[#063028]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold tracking-wider uppercase text-[#c48825] font-mono">
                      {pillar.num} · {pillar.domain}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#edf4f0] text-[#063028] flex items-center justify-center group-hover:bg-[#063028] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#063028] font-serif mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2.5">
                    Key Offerings
                  </span>
                  <ul className="space-y-2">
                    {pillar.services.map((srv, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-stone-700 font-medium flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c48825] mt-1.5 shrink-0" />
                        <span>{srv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button linking to full Services page */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold text-white bg-[#063028] hover:bg-[#04201a] shadow-sm hover:shadow transition-all duration-200"
          >
            <span>Explore All Services &amp; Detailed Offerings</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
