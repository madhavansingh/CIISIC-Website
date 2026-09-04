import React, { useEffect } from 'react';

export const Services: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const audiences = [
    'COLLEGES',
    'STARTUPS',
    'MSME',
    'CORPORATE',
    'GOVERNMENT',
    'STUDENTS',
  ];

  return (
    <div className="bg-[#faf8f4] min-h-screen py-16 sm:py-20 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#edf4f0] text-[#063028] text-xs font-bold tracking-widest uppercase">
            CIISIC · SERVICES
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#063028] tracking-tight font-serif leading-tight">
            What We Do
          </h1>
          
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            CIISIC unites AI strategists, engineers, and educators to help colleges, startups, MSMEs, corporates, and government organizations find where AI actually fits their problem. With deep expertise in generative AI, agentic systems, and deployment, we take ideas from a single conversation to a working solution running in the real world.
          </p>
        </div>

        {/* Audience Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {audiences.map((audience) => (
            <span
              key={audience}
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-wider bg-white text-[#063028] border border-stone-200/90 shadow-sm"
            >
              {audience}
            </span>
          ))}
        </div>

      </div>

      {/* Service Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20 md:mt-24">
        {/* Section Heading & Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#063028] tracking-tight font-serif">
            Ways we help you move forward with AI
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Whether you are choosing a direction, building a solution, helping teams adopt AI, or putting the right safeguards in place, CIISIC can support the next step.
          </p>
        </div>

        {/* 4 Cards Grid - 4 columns on desktop, equal height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Card 1: Strategy & Visibility */}
          <div
            id="service-strategy-visibility"
            className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028]/30 transition-all duration-200 scroll-mt-24"
          >
            <div>
              <div className="text-xs font-bold tracking-wider uppercase text-[#c48825] mb-2 font-mono">
                01 · STRATEGY
              </div>
              <h3 className="text-xl font-bold text-[#063028] font-serif mb-3">
                Strategy &amp; Visibility
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Clarify where AI can create value, choose the right tools, and make sure your brand and expertise show up in AI-driven search and recommendations.
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2.5">
                Key Services
              </span>
              <ul className="space-y-2">
                <li className="text-xs sm:text-sm text-stone-700 font-medium flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                  <span>Generative Engine Optimization (GEO)</span>
                </li>
                <li className="text-xs sm:text-sm text-stone-700 font-medium flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                  <span>AI Vendor Evaluation &amp; Selection</span>
                </li>
                <li className="text-xs sm:text-sm text-stone-700 font-medium flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                  <span>AI Market &amp; Competitive Intelligence</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Build & Deploy */}
          <div
            id="service-build-deploy"
            className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028]/30 transition-all duration-200 scroll-mt-24"
          >
            <div>
              <div className="text-xs font-bold tracking-wider uppercase text-[#c48825] mb-2 font-mono">
                02 · ENGINEERING
              </div>
              <h3 className="text-xl font-bold text-[#063028] font-serif mb-3">
                Build &amp; Deploy
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Design and implement AI assistants, agents, workflows, and simulations that operate in your real environment, not just in demos.
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2.5">
                Key Services
              </span>
              <ul className="space-y-2">
                <li className="text-xs sm:text-sm text-stone-700 font-medium flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                  <span>Forward Deployment Engineering</span>
                </li>
                <li className="text-xs sm:text-sm text-stone-700 font-medium flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                  <span>Multi-Agent Workflow Consulting</span>
                </li>
                <li className="text-xs sm:text-sm text-stone-700 font-medium flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                  <span>Digital Twin &amp; Simulation Modeling</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Adoption & Capability */}
          <div
            id="service-adoption-capability"
            className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028]/30 transition-all duration-200 scroll-mt-24"
          >
            <div>
              <div className="text-xs font-bold tracking-wider uppercase text-[#c48825] mb-2 font-mono">
                03 · CAPABILITY
              </div>
              <h3 className="text-xl font-bold text-[#063028] font-serif mb-3">
                Adoption &amp; Capability
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Build the skills, habits, and programmes that make AI stick in your teams, classrooms, and everyday workflows.
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2.5">
                Key Services
              </span>
              <ul className="space-y-2">
                <li className="text-xs sm:text-sm text-stone-700 font-medium flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                  <span>Change Management for AI Adoption</span>
                </li>
                <li className="text-xs sm:text-sm text-stone-700 font-medium flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                  <span>AI Hackathon Design-as-a-Service</span>
                </li>
                <li className="text-xs sm:text-sm text-stone-700 font-medium flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                  <span>Custom AI Curriculum Design</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 4: Governance & Insight */}
          <div
            id="service-governance-insight"
            className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028]/30 transition-all duration-200 scroll-mt-24"
          >
            <div>
              <div className="text-xs font-bold tracking-wider uppercase text-[#c48825] mb-2 font-mono">
                04 · GOVERNANCE
              </div>
              <h3 className="text-xl font-bold text-[#063028] font-serif mb-3">
                Governance &amp; Insight
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Put the right oversight, data practices, and reporting processes in place so AI is used safely, responsibly, and with clear business value.
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2.5">
                Key Services
              </span>
              <ul className="space-y-2">
                <li className="text-xs sm:text-sm text-stone-700 font-medium flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                  <span>AI Governance, Risk &amp; Compliance</span>
                </li>
                <li className="text-xs sm:text-sm text-stone-700 font-medium flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                  <span>AI for Sustainability &amp; ESG Reporting</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Start with what you need Section */}
      <div id="start-with-what-you-need" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20 md:mt-24">
        {/* Section Heading & Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#edf4f0] text-[#063028] text-[11px] font-bold tracking-wider uppercase">
            Start with what you need
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#063028] tracking-tight font-serif">
            Not sure where to start?
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Tell us what you're trying to achieve, and we'll point you toward the most relevant area.
          </p>
        </div>

        {/* 4 Clickable Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Option 1: I have an AI idea -> Build & Deploy */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('service-build-deploy');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group text-left bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028] hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#063028] focus:ring-offset-2"
          >
            <div>
              <div className="text-xs font-bold tracking-wider uppercase text-stone-400 mb-2 font-mono">
                OPTION 01
              </div>
              <h3 className="text-lg font-bold text-[#063028] font-serif mb-2.5 group-hover:text-[#063028]">
                I have an AI idea
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                Find the right path to turn an idea, use case, or prototype into a working AI solution.
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#063028]">
              <span>Go to Build &amp; Deploy</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-150">→</span>
            </div>
          </button>

          {/* Option 2: I need to choose the right AI tool -> Strategy & Visibility */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('service-strategy-visibility');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group text-left bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028] hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#063028] focus:ring-offset-2"
          >
            <div>
              <div className="text-xs font-bold tracking-wider uppercase text-stone-400 mb-2 font-mono">
                OPTION 02
              </div>
              <h3 className="text-lg font-bold text-[#063028] font-serif mb-2.5 group-hover:text-[#063028]">
                I need to choose the right AI tool
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                Compare options, understand the market, and make an informed decision before investing.
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#063028]">
              <span>Go to Strategy &amp; Visibility</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-150">→</span>
            </div>
          </button>

          {/* Option 3: I need my team or students to become AI-ready -> Adoption & Capability */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('service-adoption-capability');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group text-left bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028] hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#063028] focus:ring-offset-2"
          >
            <div>
              <div className="text-xs font-bold tracking-wider uppercase text-stone-400 mb-2 font-mono">
                OPTION 03
              </div>
              <h3 className="text-lg font-bold text-[#063028] font-serif mb-2.5 group-hover:text-[#063028]">
                I need my team or students to become AI-ready
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                Build practical AI skills through adoption support, hackathons, and industry-aligned learning programmes.
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#063028]">
              <span>Go to Adoption &amp; Capability</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-150">→</span>
            </div>
          </button>

          {/* Option 4: I need to use AI responsibly -> Governance & Insight */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('service-governance-insight');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group text-left bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028] hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#063028] focus:ring-offset-2"
          >
            <div>
              <div className="text-xs font-bold tracking-wider uppercase text-stone-400 mb-2 font-mono">
                OPTION 04
              </div>
              <h3 className="text-lg font-bold text-[#063028] font-serif mb-2.5 group-hover:text-[#063028]">
                I need to use AI responsibly
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                Put the right governance, risk checks, data practices, and reporting processes in place.
              </p>
            </div>
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#063028]">
              <span>Go to Governance &amp; Insight</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-150">→</span>
            </div>
          </button>

        </div>
      </div>

      {/* Service Details Section */}
      <div id="service-details" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24 md:mt-28 space-y-20 sm:space-y-24">
        
        {/* Subsection 1: Strategy & Visibility */}
        <div id="details-strategy-visibility" className="space-y-8 scroll-mt-24">
          <div className="border-b border-stone-200 pb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#edf4f0] text-[#063028] text-[11px] font-bold tracking-wider uppercase mb-2 font-mono">
              01 · AREA
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#063028] tracking-tight font-serif">
              Strategy &amp; Visibility
            </h3>
            <p className="text-stone-600 text-sm sm:text-base mt-1.5 max-w-3xl">
              Clarify where AI can create value, choose the right tools, and make sure your brand and expertise show up in AI-driven search and recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* Service 1.1: Generative Engine Optimization (GEO) */}
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028]/30 transition-all duration-200">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-[#063028] font-serif">
                    Generative Engine Optimization (GEO)
                  </h4>
                  <p className="text-sm font-semibold text-[#c48825] mt-1">
                    Be visible in the age of AI search.
                  </p>
                </div>

                <div className="bg-[#faf8f4] rounded-lg p-3 border border-stone-200/60">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Best for
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 font-medium leading-snug">
                    Startups &amp; corporates who want to show up in AI-generated answers
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Features
                  </span>
                  <ul className="space-y-1.5">
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>AI visibility audit</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>AI-search content optimization</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Brand &amp; entity optimization</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>GEO strategy</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    What you get
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                    An audit report + optimized content plan for AI search visibility
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-dashed border-stone-100">
                  <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider">Timeline</span>
                  <span className="font-medium text-stone-700">2–3 weeks for audit, ongoing for tracking</span>
                </div>

                <div className="bg-[#edf4f0] rounded-lg px-3 py-2 text-[11px] font-medium text-[#063028] flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#063028]/70">Flow:</span>
                  <span>Understand</span>
                  <span>→</span>
                  <span>Optimize</span>
                  <span>→</span>
                  <span>Track</span>
                </div>
              </div>
            </div>

            {/* Service 1.2: AI Vendor Evaluation & Selection */}
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028]/30 transition-all duration-200">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-[#063028] font-serif">
                    AI Vendor Evaluation &amp; Selection
                  </h4>
                  <p className="text-sm font-semibold text-[#c48825] mt-1">
                    Too many AI tools. Which one is right?
                  </p>
                </div>

                <div className="bg-[#faf8f4] rounded-lg p-3 border border-stone-200/60">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Best for
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 font-medium leading-snug">
                    MSMEs &amp; corporates comparing AI vendors before investing
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Features
                  </span>
                  <ul className="space-y-1.5">
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Evaluation criteria definition</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Shortlist of suitable tools</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Structured pilot runs</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Compared to your requirements</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    What you get
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                    A scored comparison + recommendation you can act on
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-dashed border-stone-100">
                  <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider">Timeline</span>
                  <span className="font-medium text-stone-700">2–3 weeks</span>
                </div>

                <div className="bg-[#edf4f0] rounded-lg px-3 py-2 text-[11px] font-medium text-[#063028] flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#063028]/70">Flow:</span>
                  <span>Requirements</span>
                  <span>→</span>
                  <span>Compare</span>
                  <span>→</span>
                  <span>Test</span>
                  <span>→</span>
                  <span>Choose</span>
                </div>
              </div>
            </div>

            {/* Service 1.3: AI Market & Competitive Intelligence */}
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028]/30 transition-all duration-200">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-[#063028] font-serif">
                    AI Market &amp; Competitive Intelligence
                  </h4>
                  <p className="text-sm font-semibold text-[#c48825] mt-1">
                    Know your market without hours of research.
                  </p>
                </div>

                <div className="bg-[#faf8f4] rounded-lg p-3 border border-stone-200/60">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Best for
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 font-medium leading-snug">
                    Corporates &amp; startups tracking competitors regularly
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Features
                  </span>
                  <ul className="space-y-1.5">
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Competitor update tracking</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Product &amp; pricing signal monitoring</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Structured industry view</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    What you get
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                    A structured, ongoing view of market and competitor signals
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-dashed border-stone-100">
                  <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider">Timeline</span>
                  <span className="font-medium text-stone-700">Ongoing engagement</span>
                </div>

                <div className="bg-[#edf4f0] rounded-lg px-3 py-2 text-[11px] font-medium text-[#063028] flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#063028]/70">Flow:</span>
                  <span>Public info</span>
                  <span>→</span>
                  <span>AI analysis</span>
                  <span>→</span>
                  <span>Insights</span>
                  <span>→</span>
                  <span>Decisions</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Subsection 2: Build & Deploy */}
        <div id="details-build-deploy" className="space-y-8 scroll-mt-24">
          <div className="border-b border-stone-200 pb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#edf4f0] text-[#063028] text-[11px] font-bold tracking-wider uppercase mb-2 font-mono">
              02 · AREA
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#063028] tracking-tight font-serif">
              Build &amp; Deploy
            </h3>
            <p className="text-stone-600 text-sm sm:text-base mt-1.5 max-w-3xl">
              Design and implement AI assistants, agents, workflows, and simulations that operate in your real environment, not just in demos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* Service 2.1: Forward Deployment Engineering */}
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028]/30 transition-all duration-200">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-[#063028] font-serif">
                    Forward Deployment Engineering
                  </h4>
                  <p className="text-sm font-semibold text-[#c48825] mt-1">
                    From AI idea to real-world deployment.
                  </p>
                </div>

                <div className="bg-[#faf8f4] rounded-lg p-3 border border-stone-200/60">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Best for
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 font-medium leading-snug">
                    Corporates &amp; startups ready to move past prototyping
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Features
                  </span>
                  <ul className="space-y-1.5">
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>AI agents</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Internal AI assistants</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>RAG knowledge systems</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Workflow automation</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    What you get
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                    A deployed, working AI solution running in your actual environment
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-dashed border-stone-100">
                  <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider">Timeline</span>
                  <span className="font-medium text-stone-700">4–10 weeks depending on scope</span>
                </div>

                <div className="bg-[#edf4f0] rounded-lg px-3 py-2 text-[11px] font-medium text-[#063028] flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#063028]/70">Flow:</span>
                  <span>Understand</span>
                  <span>→</span>
                  <span>Build</span>
                  <span>→</span>
                  <span>Deploy</span>
                  <span>→</span>
                  <span>Improve</span>
                </div>
              </div>
            </div>

            {/* Service 2.2: Multi-Agent Workflow Consulting */}
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028]/30 transition-all duration-200">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-[#063028] font-serif">
                    Multi-Agent Workflow Consulting
                  </h4>
                  <p className="text-sm font-semibold text-[#c48825] mt-1">
                    Make your AI agents work together.
                  </p>
                </div>

                <div className="bg-[#faf8f4] rounded-lg p-3 border border-stone-200/60">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Best for
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 font-medium leading-snug">
                    Teams already using AI agents who need them to collaborate reliably
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Features
                  </span>
                  <ul className="space-y-1.5">
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Clear agent responsibilities</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Reliable handoffs</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Human oversight built in</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Workflows easy to improve</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    What you get
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                    A documented multi-agent workflow design + implementation guidance
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-dashed border-stone-100">
                  <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider">Timeline</span>
                  <span className="font-medium text-stone-700">2–4 weeks</span>
                </div>

                <div className="bg-[#edf4f0] rounded-lg px-3 py-2 text-[11px] font-medium text-[#063028] flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#063028]/70">Flow:</span>
                  <span>One problem</span>
                  <span>→</span>
                  <span>Multiple agents</span>
                  <span>→</span>
                  <span>One workflow</span>
                </div>
              </div>
            </div>

            {/* Service 2.3: Digital Twin & Simulation Modeling */}
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028]/30 transition-all duration-200">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-[#063028] font-serif">
                    Digital Twin &amp; Simulation Modeling
                  </h4>
                  <p className="text-sm font-semibold text-[#c48825] mt-1">
                    Don't experiment on the real system first.
                  </p>
                </div>

                <div className="bg-[#faf8f4] rounded-lg p-3 border border-stone-200/60">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Best for
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 font-medium leading-snug">
                    Corporates &amp; government orgs planning process changes
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Features
                  </span>
                  <ul className="space-y-1.5">
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Virtual process representations</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Scenario exploration</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>AI-supported pattern analysis</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    What you get
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                    A working simulation model you can test scenarios against
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-dashed border-stone-100">
                  <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider">Timeline</span>
                  <span className="font-medium text-stone-700">6–8 weeks</span>
                </div>

                <div className="bg-[#edf4f0] rounded-lg px-3 py-2 text-[11px] font-medium text-[#063028] flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#063028]/70">Flow:</span>
                  <span>Real system</span>
                  <span>→</span>
                  <span>Virtual model</span>
                  <span>→</span>
                  <span>Simulate</span>
                  <span>→</span>
                  <span>Improve</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Subsection 3: Adoption & Capability */}
        <div id="details-adoption-capability" className="space-y-8 scroll-mt-24">
          <div className="border-b border-stone-200 pb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#edf4f0] text-[#063028] text-[11px] font-bold tracking-wider uppercase mb-2 font-mono">
              03 · AREA
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#063028] tracking-tight font-serif">
              Adoption &amp; Capability
            </h3>
            <p className="text-stone-600 text-sm sm:text-base mt-1.5 max-w-3xl">
              Build the skills, habits, and programmes that make AI stick in your teams, classrooms, and everyday workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* Service 3.1: Change Management for AI Adoption */}
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028]/30 transition-all duration-200">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-[#063028] font-serif">
                    Change Management for AI Adoption
                  </h4>
                  <p className="text-sm font-semibold text-[#c48825] mt-1">
                    You bought AI. Your team isn't using it.
                  </p>
                </div>

                <div className="bg-[#faf8f4] rounded-lg p-3 border border-stone-200/60">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Best for
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 font-medium leading-snug">
                    Organizations with an AI tool already purchased but underused
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Features
                  </span>
                  <ul className="space-y-1.5">
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Practical training</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Live demonstrations</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Onboarding &amp; feedback sessions</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Make AI part of everyday work</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    What you get
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                    A trained team using the tool as part of daily workflow
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-dashed border-stone-100">
                  <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider">Timeline</span>
                  <span className="font-medium text-stone-700">Ongoing, typically 4+ weeks</span>
                </div>

                <div className="bg-[#edf4f0] rounded-lg px-3 py-2 text-[11px] font-medium text-[#063028] flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#063028]/70">Flow:</span>
                  <span>Understand</span>
                  <span>→</span>
                  <span>Train</span>
                  <span>→</span>
                  <span>Adopt</span>
                  <span>→</span>
                  <span>Improve</span>
                </div>
              </div>
            </div>

            {/* Service 3.2: AI Hackathon Design-as-a-Service */}
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028]/30 transition-all duration-200">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-[#063028] font-serif">
                    AI Hackathon Design-as-a-Service
                  </h4>
                  <p className="text-sm font-semibold text-[#c48825] mt-1">
                    We design and run the whole hackathon.
                  </p>
                </div>

                <div className="bg-[#faf8f4] rounded-lg p-3 border border-stone-200/60">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Best for
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 font-medium leading-snug">
                    Colleges &amp; organizations wanting a full hackathon without managing it
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Features
                  </span>
                  <ul className="space-y-1.5">
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Real-world problem statements</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Participant onboarding</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Judging criteria &amp; mentors</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Full event execution</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    What you get
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                    A fully run event + shortlisted ideas ready for prototyping
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-dashed border-stone-100">
                  <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider">Timeline</span>
                  <span className="font-medium text-stone-700">3–6 weeks planning + event day</span>
                </div>

                <div className="bg-[#edf4f0] rounded-lg px-3 py-2 text-[11px] font-medium text-[#063028] flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#063028]/70">Flow:</span>
                  <span>Problem</span>
                  <span>→</span>
                  <span>Hackathon</span>
                  <span>→</span>
                  <span>Prototype</span>
                  <span>→</span>
                  <span>Pilot</span>
                </div>
              </div>
            </div>

            {/* Service 3.3: Custom AI Curriculum Design */}
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028]/30 transition-all duration-200">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-[#063028] font-serif">
                    Custom AI Curriculum Design
                  </h4>
                  <p className="text-sm font-semibold text-[#c48825] mt-1">
                    An AI program matching industry needs.
                  </p>
                </div>

                <div className="bg-[#faf8f4] rounded-lg p-3 border border-stone-200/60">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Best for
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 font-medium leading-snug">
                    Colleges &amp; universities building or updating an AI program
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Features
                  </span>
                  <ul className="space-y-1.5">
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Courses &amp; specialization tracks</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Workshops &amp; practical programs</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Classroom + real-world projects</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Hackathons &amp; internships woven in</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    What you get
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                    A ready-to-teach curriculum with projects and industry sessions built in
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-dashed border-stone-100">
                  <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider">Timeline</span>
                  <span className="font-medium text-stone-700">6–10 weeks design phase</span>
                </div>

                <div className="bg-[#edf4f0] rounded-lg px-3 py-2 text-[11px] font-medium text-[#063028] flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#063028]/70">Flow:</span>
                  <span>Industry skills</span>
                  <span>→</span>
                  <span>Curriculum</span>
                  <span>→</span>
                  <span>Projects</span>
                  <span>→</span>
                  <span>Job-ready talent</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Subsection 4: Governance & Insight */}
        <div id="details-governance-insight" className="space-y-8 scroll-mt-24">
          <div className="border-b border-stone-200 pb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#edf4f0] text-[#063028] text-[11px] font-bold tracking-wider uppercase mb-2 font-mono">
              04 · AREA
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#063028] tracking-tight font-serif">
              Governance &amp; Insight
            </h3>
            <p className="text-stone-600 text-sm sm:text-base mt-1.5 max-w-3xl">
              Put the right oversight, data practices, and reporting processes in place so AI is used safely, responsibly, and with clear business value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-4xl">
            
            {/* Service 4.1: AI Governance, Risk & Compliance */}
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028]/30 transition-all duration-200">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-[#063028] font-serif">
                    AI Governance, Risk &amp; Compliance
                  </h4>
                  <p className="text-sm font-semibold text-[#c48825] mt-1">
                    Use AI responsibly — know the risks first.
                  </p>
                </div>

                <div className="bg-[#faf8f4] rounded-lg p-3 border border-stone-200/60">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Best for
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 font-medium leading-snug">
                    Government &amp; regulated organizations introducing AI
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Features
                  </span>
                  <ul className="space-y-1.5">
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Data handling frameworks</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Human oversight design</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>AI risk assessment &amp; documentation</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    What you get
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                    A practical governance framework tailored to the use case
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-dashed border-stone-100">
                  <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider">Timeline</span>
                  <span className="font-medium text-stone-700">3–5 weeks</span>
                </div>

                <div className="bg-[#edf4f0] rounded-lg px-3 py-2 text-[11px] font-medium text-[#063028] flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#063028]/70">Flow:</span>
                  <span>Use case</span>
                  <span>→</span>
                  <span>Risk check</span>
                  <span>→</span>
                  <span>Governance</span>
                  <span>→</span>
                  <span>Adoption</span>
                </div>
              </div>
            </div>

            {/* Service 4.2: AI for Sustainability & ESG Reporting */}
            <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between hover:border-[#063028]/30 transition-all duration-200">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-[#063028] font-serif">
                    AI for Sustainability &amp; ESG Reporting
                  </h4>
                  <p className="text-sm font-semibold text-[#c48825] mt-1">
                    Sustainability data spread across teams.
                  </p>
                </div>

                <div className="bg-[#faf8f4] rounded-lg p-3 border border-stone-200/60">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Best for
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 font-medium leading-snug">
                    Corporates handling ESG or sustainability reporting
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Features
                  </span>
                  <ul className="space-y-1.5">
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Collect &amp; organize ESG data</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Reduce repetitive reporting</span>
                    </li>
                    <li className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#063028] mt-1.5 shrink-0" />
                      <span>Consistent sustainability insight</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    What you get
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                    A structured pipeline that turns operational data into report-ready insight
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-dashed border-stone-100">
                  <span className="font-bold text-stone-400 uppercase text-[10px] tracking-wider">Timeline</span>
                  <span className="font-medium text-stone-700">Pilot: 4–6 weeks</span>
                </div>

                <div className="bg-[#edf4f0] rounded-lg px-3 py-2 text-[11px] font-medium text-[#063028] flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-[#063028]/70">Flow:</span>
                  <span>Data</span>
                  <span>→</span>
                  <span>Organize</span>
                  <span>→</span>
                  <span>Analyze</span>
                  <span>→</span>
                  <span>Report</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
