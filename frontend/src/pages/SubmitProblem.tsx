import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Building2, Settings, FileText, CheckCircle, ArrowLeft, 
  ArrowRight, ShieldAlert, UploadCloud, X, Check, Sparkles, ChevronRight
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { DifficultyLevel } from '../types';
import { uploadFile } from '../lib/api';

// Zod validation schema
const formSchema = z.object({
  // Step 1: Company Info
  industryName: z.string().min(1, 'Industry sector category is required'),
  companyName: z.string().min(1, 'Company name is required'),
  representativeName: z.string().min(1, 'Representative name is required'),
  designation: z.string().min(2, 'Designation is required'),
  email: z.string().email('Please enter a valid corporate email'),
  phone: z.string().min(1, 'Phone number is required'),
  website: z.string().min(1, 'Website URL is required'),
  industrySector: z.string().min(2, 'Industry sector is required'),

  // Step 2: Problem Details
  title: z.string().min(25, 'Title must be at least 25 characters'),
  description: z.string().min(25, 'Description must be at least 25 characters'),
  businessChallenge: z.string().min(25, 'Business challenge must be at least 25 characters'),
  existingProcess: z.string().min(10, 'Existing process explanation is required'),
  expectedOutcome: z.string().min(15, 'Expected outcome is required'),
  projectObjectives: z.string().min(15, 'Project objectives are required'),

  // Step 3: Technical Details
  requiredTechnologiesStr: z.string().min(2, 'Specify technologies separated by commas'),
  requiredSkillsStr: z.string().min(2, 'Specify skills separated by commas'),
  preferredBranchesStr: z.string().min(2, 'Preferred academic branches are required'),
  preferredAcademicYear: z.string().min(2, 'Preferred academic year is required'),
  difficultyLevel: z.enum(['Easy', 'Medium', 'Hard'] as const),
  expectedDuration: z.string().min(2, 'Duration is required (e.g., 6 Months)'),

  // Step 4: Additional Details
  expectedDeliverables: z.string().min(10, 'Expected deliverables are required'),
  budget: z.string().min(1, 'Budget / Funding Offered is required'),
  deadline: z.string().min(1, 'Expected Solution Deadline is required'),
  additionalNotes: z.string().optional(),
  declarationAccepted: z.boolean().refine(val => val === true, 'You must accept the declaration to submit')
});

type FormFields = z.infer<typeof formSchema>;

export const SubmitProblem: React.FC = () => {
  const { addSubmission, currentUser, showToast } = useApp();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Initialize react-hook-form with Zod validation
  const {
    register,
    handleSubmit: _,
    trigger,
    formState: { errors },
    getValues
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industryName: 'Manufacturing',
      companyName: currentUser?.companyName || '',
      representativeName: currentUser?.name || '',
      designation: currentUser?.designation || '',
      email: currentUser?.email || '',
      phone: '+91 98765 43210',
      website: 'https://www.tatamotors.com',
      industrySector: 'Automotive',
      difficultyLevel: 'Medium',
      budget: '',
      deadline: '',
      declarationAccepted: false
    }
  });

  const steps = [
    { number: 1, title: 'Company Info', icon: <Building2 className="h-4.5 w-4.5" /> },
    { number: 2, title: 'Problem Details', icon: <FileText className="h-4.5 w-4.5" /> },
    { number: 3, title: 'Technical Spec', icon: <Settings className="h-4.5 w-4.5" /> },
    { number: 4, title: 'Filing & Consent', icon: <ShieldAlert className="h-4.5 w-4.5" /> }
  ];

  // Custom step validation before going forward
  const handleNextStep = async () => {
    let fieldsToValidate: Array<keyof FormFields> = [];

    if (currentStep === 1) {
      fieldsToValidate = ['industryName', 'companyName', 'representativeName', 'designation', 'email', 'phone', 'website', 'industrySector'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['title', 'description', 'businessChallenge', 'existingProcess', 'expectedOutcome', 'projectObjectives'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['requiredTechnologiesStr', 'requiredSkillsStr', 'preferredBranchesStr', 'preferredAcademicYear', 'difficultyLevel', 'expectedDuration'];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      showToast('Please complete the required fields in the current step.', 'error');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Pre-submit confirmation opener
  const handlePreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isFormValid = await trigger();
    if (isFormValid) {
      setIsConfirming(true);
    } else {
      showToast('Form has validation errors. Please check all steps.', 'error');
    }
  };

  // Format YYYY-MM-DD date to DD/MM/YYYY
  const formatToDDMMYYYY = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Final submission processing
  const onFormSubmit = async (data: FormFields) => {
    setIsSubmitting(true);
    try {
      let attachmentUrl: string | undefined = undefined;

      if (uploadedFile) {
        showToast('Uploading document attachment...', 'info');
        const uploadRes = await uploadFile(uploadedFile, 'DOCUMENT');
        attachmentUrl = uploadRes.url;
      }

      const formattedNotes = `Budget allocated: ${data.budget}. Target date: ${formatToDDMMYYYY(data.deadline)}${data.additionalNotes ? `. ${data.additionalNotes}` : ''}`;

      // Assemble data matching the state structure and await backend creation
      await addSubmission({
        company: {
          industryName: data.industryName,
          companyName: data.companyName,
          representativeName: data.representativeName,
          designation: data.designation,
          email: data.email,
          phone: data.phone,
          website: data.website,
          industrySector: data.industrySector
        },
        details: {
          title: data.title,
          description: data.description,
          businessChallenge: data.businessChallenge,
          existingProcess: data.existingProcess,
          expectedOutcome: data.expectedOutcome,
          projectObjectives: data.projectObjectives
        },
        technical: {
          requiredTechnologies: data.requiredTechnologiesStr.split(',').map((s) => s.trim()).filter(Boolean),
          requiredSkills: data.requiredSkillsStr.split(',').map((s) => s.trim()).filter(Boolean),
          preferredBranches: data.preferredBranchesStr.split(',').map((s) => s.trim()).filter(Boolean),
          preferredAcademicYear: data.preferredAcademicYear,
          difficultyLevel: data.difficultyLevel as DifficultyLevel,
          expectedDuration: data.expectedDuration
        },
        additional: {
          expectedDeliverables: data.expectedDeliverables,
          additionalNotes: formattedNotes,
          fileAttachmentName: attachmentUrl,
          declarationAccepted: data.declarationAccepted
        }
      });

      setIsSubmitting(false);
      setIsConfirming(false);
      showToast('Problem Statement filed successfully! Status is Pending Approval.', 'success');
      navigate('/industry/dashboard');
    } catch (err: any) {
      setIsSubmitting(false);
      showToast(err.message || 'An error occurred during submission. Please try again.', 'error');
    }
  };

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      showToast(`Selected file: ${e.target.files[0].name}`, 'info');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
      showToast(`Dropped file: ${e.dataTransfer.files[0].name}`, 'info');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const allValues = getValues();

  return (
    <div className="bg-[#faf8f4] min-h-screen py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header info */}
        <div className="mb-10 text-center space-y-3">
          <Link to="/industry/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-[#063028] transition-colors mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to Industry Partner Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#063028] tracking-tight font-serif">
            Post a Problem Statement
          </h1>
          <p className="text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
            Specify corporate challenges, technical requirements, and target outcomes for review by CII and distribution to academic institutions.
          </p>
        </div>

        {/* Progress Stepper Bar */}
        <div className="mb-8 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span className="text-sm font-bold text-[#063028] uppercase tracking-wider">
              Step {currentStep} of 4
            </span>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              {steps.map((st) => (
                <div key={st.number} className="flex items-center">
                  <button
                    type="button"
                    onClick={async () => {
                      if (st.number < currentStep) {
                        setCurrentStep(st.number);
                      } else if (st.number > currentStep) {
                        handleNextStep();
                      }
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      currentStep === st.number
                        ? 'bg-[#063028] text-white shadow-sm'
                        : st.number < currentStep
                        ? 'bg-[#edf4f0] text-[#063028] border border-[#063028]/20'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {st.number < currentStep ? <Check className="h-4 w-4" /> : st.icon}
                    <span className="hidden md:inline">{st.title}</span>
                  </button>
                  {st.number < 4 && <ChevronRight className="h-4 w-4 text-stone-300 mx-1 hidden sm:inline" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Multi-Step Form Wrapper */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-6 sm:p-10">
          <form onSubmit={handlePreSubmit} className="space-y-8">
            
            {/* STEP 1: COMPANY INFORMATION */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-stone-200 pb-4">
                  <h2 className="text-xl font-bold text-[#063028] font-serif flex items-center gap-2.5">
                    <Building2 className="h-6 w-6 text-[#c48825]" /> Corporate &amp; Representative Profile
                  </h2>
                  <p className="text-sm text-stone-600 mt-1">Provide official communication handles for administrative validation.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Company Name</label>
                    <input
                      type="text"
                      {...register('companyName')}
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white"
                    />
                    {errors.companyName && <p className="text-sm text-red-600 mt-1">{errors.companyName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Industry Category</label>
                    <select
                      {...register('industryName')}
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white cursor-pointer"
                    >
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Pharmaceuticals">Pharmaceuticals</option>
                      <option value="Energy & Power">Energy & Power</option>
                      <option value="Telecommunications">Telecommunications</option>
                      <option value="Infrastructure">Infrastructure</option>
                    </select>
                    {errors.industryName && <p className="text-sm text-red-600 mt-1">{errors.industryName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Representative Name</label>
                    <input
                      type="text"
                      {...register('representativeName')}
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white"
                    />
                    {errors.representativeName && <p className="text-sm text-red-600 mt-1">{errors.representativeName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Representative Designation</label>
                    <input
                      type="text"
                      {...register('designation')}
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white"
                    />
                    {errors.designation && <p className="text-sm text-red-600 mt-1">{errors.designation.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Official Email Address</label>
                    <input
                      type="email"
                      {...register('email')}
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white"
                    />
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Phone Number</label>
                    <input
                      type="text"
                      {...register('phone')}
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white"
                    />
                    {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Company Website URL</label>
                    <input
                      type="text"
                      {...register('website')}
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white"
                    />
                    {errors.website && <p className="text-sm text-red-600 mt-1">{errors.website.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Specific Industry Sector</label>
                    <input
                      type="text"
                      {...register('industrySector')}
                      placeholder="e.g. Automotive Engineering"
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white"
                    />
                    {errors.industrySector && <p className="text-sm text-red-600 mt-1">{errors.industrySector.message}</p>}
                  </div>

                </div>
              </div>
            )}

            {/* STEP 2: PROBLEM DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-stone-200 pb-4">
                  <h2 className="text-xl font-bold text-[#063028] font-serif flex items-center gap-2.5">
                    <FileText className="h-6 w-6 text-[#c48825]" /> Problem Description Details
                  </h2>
                  <p className="text-sm text-stone-600 mt-1">Detail your operating challenge so researchers can synthesize precise solutions.</p>
                </div>

                <div className="space-y-5">
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Problem Statement Title</label>
                    <input
                      type="text"
                      {...register('title')}
                      placeholder="e.g., Automated Bio-Reactor Foam Anomaly Control"
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white"
                    />
                    {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Problem Statement Description</label>
                    <textarea
                      rows={4}
                      {...register('description')}
                      placeholder="Describe the overall scope, operational environment, and physical parameters."
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white resize-y leading-relaxed"
                    ></textarea>
                    {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Current Business Challenge</label>
                    <textarea
                      rows={3}
                      {...register('businessChallenge')}
                      placeholder="What is the active operational, financial, or developmental bottleneck?"
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white resize-y leading-relaxed"
                    ></textarea>
                    {errors.businessChallenge && <p className="text-sm text-red-600 mt-1">{errors.businessChallenge.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-stone-700">Existing Process / Workarounds</label>
                      <textarea
                        rows={3}
                        {...register('existingProcess')}
                        placeholder="How is this handled currently?"
                        className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white resize-y leading-relaxed"
                      ></textarea>
                      {errors.existingProcess && <p className="text-sm text-red-600 mt-1">{errors.existingProcess.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-stone-700">Expected Outcomes</label>
                      <textarea
                        rows={3}
                        {...register('expectedOutcome')}
                        placeholder="What metrics or physical benchmarks must the solution satisfy?"
                        className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white resize-y leading-relaxed"
                      ></textarea>
                      {errors.expectedOutcome && <p className="text-sm text-red-600 mt-1">{errors.expectedOutcome.message}</p>}
                    </div>

                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Project Objectives</label>
                    <textarea
                      rows={2}
                      {...register('projectObjectives')}
                      placeholder="List specific milestones (e.g. 1. Conduct vibration analysis, 2. Build cloud monitoring dashboard)"
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white resize-y leading-relaxed"
                    ></textarea>
                    {errors.projectObjectives && <p className="text-sm text-red-600 mt-1">{errors.projectObjectives.message}</p>}
                  </div>

                </div>
              </div>
            )}

            {/* STEP 3: TECHNICAL SPECIFICATIONS */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-stone-200 pb-4">
                  <h2 className="text-xl font-bold text-[#063028] font-serif flex items-center gap-2.5">
                    <Settings className="h-6 w-6 text-[#c48825]" /> Technical Specifications &amp; Requirements
                  </h2>
                  <p className="text-sm text-stone-600 mt-1">Define student branches, difficulty benchmarks, and expected technology stacks.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  <div className="space-y-2 col-span-1 sm:col-span-2">
                    <label className="block text-sm font-bold text-stone-700">Required Technologies</label>
                    <input
                      type="text"
                      {...register('requiredTechnologiesStr')}
                      placeholder="e.g. Python, TensorFlow, React, Docker, MQTT (Comma separated)"
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white"
                    />
                    {errors.requiredTechnologiesStr && <p className="text-sm text-red-600 mt-1">{errors.requiredTechnologiesStr.message}</p>}
                  </div>

                  <div className="space-y-2 col-span-1 sm:col-span-2">
                    <label className="block text-sm font-bold text-stone-700">Required Skills &amp; Domain Expertise</label>
                    <input
                      type="text"
                      {...register('requiredSkillsStr')}
                      placeholder="e.g. Signal Processing, Deep Learning, Embedded IoT, Microservices (Comma separated)"
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white"
                    />
                    {errors.requiredSkillsStr && <p className="text-sm text-red-600 mt-1">{errors.requiredSkillsStr.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Preferred Academic Disciplines / Branches</label>
                    <input
                      type="text"
                      {...register('preferredBranchesStr')}
                      placeholder="e.g. Mechanical, Computer Science, Electronics (Comma separated)"
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white"
                    />
                    {errors.preferredBranchesStr && <p className="text-sm text-red-600 mt-1">{errors.preferredBranchesStr.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Preferred Student Academic Year</label>
                    <select
                      {...register('preferredAcademicYear')}
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white cursor-pointer"
                    >
                      <option value="Final Year UG">Final Year UG (Undergraduate)</option>
                      <option value="Pre-final / Final Year UG">Pre-final / Final Year UG</option>
                      <option value="Postgraduate (PG) / M.Tech">Postgraduate (PG) / M.Tech</option>
                      <option value="PhD Scholars / Researchers">PhD Scholars / Researchers</option>
                      <option value="All Academic Tiers Eligible">All Academic Tiers Eligible</option>
                    </select>
                    {errors.preferredAcademicYear && <p className="text-sm text-red-600 mt-1">{errors.preferredAcademicYear.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Difficulty Classification Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Easy', 'Medium', 'Hard'].map((lvl) => (
                        <label
                          key={lvl}
                          className="flex items-center justify-center p-3.5 rounded-xl border border-stone-300 bg-white cursor-pointer text-sm font-bold text-[#063028] hover:bg-stone-50 focus-within:border-[#063028] select-none text-center"
                        >
                          <input
                            type="radio"
                            value={lvl}
                            {...register('difficultyLevel')}
                            className="sr-only"
                          />
                          <span>{lvl}</span>
                        </label>
                      ))}
                    </div>
                    {errors.difficultyLevel && <p className="text-sm text-red-600 mt-1">{errors.difficultyLevel.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Expected Duration of Project</label>
                    <input
                      type="text"
                      {...register('expectedDuration')}
                      placeholder="e.g. 6 Months"
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white"
                    />
                    {errors.expectedDuration && <p className="text-sm text-red-600 mt-1">{errors.expectedDuration.message}</p>}
                  </div>

                </div>
              </div>
            )}

            {/* STEP 4: ADDITIONAL DETAILS & FILING */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-stone-200 pb-4">
                  <h2 className="text-xl font-bold text-[#063028] font-serif flex items-center gap-2.5">
                    <ShieldAlert className="h-6 w-6 text-[#c48825]" /> Deliverables &amp; Legal Declaration
                  </h2>
                  <p className="text-sm text-stone-600 mt-1">Provide final deliverables outline and accept platform terms.</p>
                </div>

                <div className="space-y-6">
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Expected Deliverables</label>
                    <textarea
                      rows={3}
                      {...register('expectedDeliverables')}
                      placeholder="What tangible output must be provided? (e.g. Working code repository, operational hardware prototype, engineering design schematic)"
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white resize-y leading-relaxed"
                    ></textarea>
                    {errors.expectedDeliverables && <p className="text-sm text-red-600 mt-1">{errors.expectedDeliverables.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Budget */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-stone-700">Budget / Funding Offered <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        {...register('budget')}
                        placeholder="e.g. Rs 5,00,000"
                        className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white font-medium"
                      />
                      {errors.budget && <p className="text-sm text-red-600 mt-1">{errors.budget.message}</p>}
                    </div>

                    {/* Deadline */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-stone-700">Expected Solution Deadline <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        {...register('deadline')}
                        className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white font-medium cursor-pointer"
                      />
                      {errors.deadline && <p className="text-sm text-red-600 mt-1">{errors.deadline.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Additional Notes (Optional)</label>
                    <textarea
                      rows={2}
                      {...register('additionalNotes')}
                      placeholder="Any supplementary timelines or operational requests."
                      className="block w-full px-4 py-3 border border-stone-300 rounded-xl text-base text-stone-900 focus:outline-none focus:border-[#063028] focus:ring-2 focus:ring-[#063028]/10 bg-white resize-y leading-relaxed"
                    ></textarea>
                  </div>

                  {/* File Upload Component */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-stone-700">Supporting Data Sheet / Attachment</label>
                    
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                        dragOver 
                          ? 'border-[#063028] bg-[#edf4f0]' 
                          : uploadedFile 
                          ? 'border-emerald-400 bg-emerald-50/50' 
                          : 'border-stone-300 bg-stone-50/60 hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="file"
                        id="file-upload"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".pdf,.zip,.csv,.xlsx,.docx"
                      />

                      {uploadedFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 bg-emerald-100 rounded-full text-emerald-700">
                            <Check className="h-6 w-6 font-bold" />
                          </div>
                          <p className="text-base font-bold text-stone-900">{uploadedFile.name}</p>
                          <p className="text-sm text-stone-500 font-mono">({uploadedFile.size < 1024 * 1024 ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`})</p>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="mt-2 text-sm font-bold text-red-600 hover:text-red-800 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <X className="h-4 w-4" /> Remove File
                          </button>
                        </div>
                      ) : (
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                          <UploadCloud className="h-10 w-10 text-stone-400" />
                          <div>
                            <span className="text-base font-bold text-[#c48825] hover:text-[#a6711c] underline">Click to upload</span>
                            <span className="text-base text-stone-600"> or drag and drop</span>
                          </div>
                          <p className="text-xs text-stone-500">PDF, ZIP, CSV, XLSX, or DOCX (Max 10MB)</p>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Declaration Checkbox */}
                  <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="declarationAccepted"
                        {...register('declarationAccepted')}
                        className="h-5 w-5 mt-0.5 text-[#063028] border-stone-300 rounded focus:ring-[#063028] cursor-pointer"
                      />
                      <label htmlFor="declarationAccepted" className="text-sm text-stone-700 leading-relaxed cursor-pointer select-none font-medium">
                        <strong className="text-stone-900">CII Official Declaration:</strong> By submitting this problem statement, the company representative certifies that the challenge is an active operational topic. The company agrees to facilitate review updates, engage with student research cohorts where appropriate, and ensure compliance with the CII Industry-Institute Collaboration Platform framework terms.
                      </label>
                    </div>
                    {errors.declarationAccepted && <p className="text-sm text-red-600">{errors.declarationAccepted.message}</p>}
                  </div>

                </div>
              </div>
            )}

            {/* Stepper Buttons Panel */}
            <div className="border-t border-stone-200 pt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={`inline-flex items-center gap-2 px-5 py-3 border border-stone-300 rounded-xl text-sm font-bold text-stone-700 hover:bg-stone-50 transition-all ${
                  currentStep === 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <ArrowLeft className="h-4 w-4" /> Previous Step
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#063028] hover:bg-[#04201a] transition-all cursor-pointer shadow-sm"
                >
                  Next Step <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white bg-[#063028] hover:bg-[#04201a] transition-all cursor-pointer shadow-md"
                >
                  <Sparkles className="h-5 w-5 text-[#c48825]" /> Complete Submission
                </button>
              )}
            </div>

          </form>
        </div>

        {/* Confirmation Dialog Backdrop & Modal */}
        {isConfirming && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-stone-200 max-w-2xl w-full p-8 shadow-2xl relative animate-fade-in max-h-[90vh] overflow-y-auto">
              
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="mx-auto h-14 w-14 rounded-full bg-[#edf4f0] text-[#063028] flex items-center justify-center">
                    <CheckCircle className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#063028] font-serif">Review Statement Filing</h3>
                  <p className="text-sm text-stone-600">Confirm the parameters of your operational problem proposal below.</p>
                </div>

                {/* Review block */}
                <div className="bg-[#faf8f4] p-6 rounded-2xl border border-stone-200 space-y-4 text-sm">
                  
                  <div>
                    <h4 className="text-xs font-bold uppercase text-[#c48825] tracking-wider">Title of Proposal</h4>
                    <p className="font-bold text-base text-[#063028] mt-1">{allValues.title}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider">Filing Organization</h4>
                      <p className="font-semibold text-stone-800 mt-1">{allValues.companyName}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider">Industry sector</h4>
                      <p className="font-semibold text-stone-800 mt-1">{allValues.industrySector}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider">Difficulty Level</h4>
                      <p className="font-semibold text-stone-800 mt-1">{allValues.difficultyLevel}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider">Academic Level</h4>
                      <p className="font-semibold text-stone-800 mt-1 truncate">{allValues.preferredAcademicYear}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider">Duration</h4>
                      <p className="font-semibold text-stone-800 mt-1">{allValues.expectedDuration}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase text-stone-500 tracking-wider">Technologies Requested</h4>
                    <p className="font-semibold text-stone-800 mt-1">{allValues.requiredTechnologiesStr}</p>
                  </div>

                  {uploadedFile && (
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
                      <span className="font-bold text-emerald-800">Attachment: {uploadedFile.name}</span>
                      <span className="font-mono text-xs text-emerald-700">File attached</span>
                    </div>
                  )}

                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsConfirming(false)}
                    className="flex-1 px-5 py-3.5 border border-stone-300 rounded-xl text-sm font-bold text-stone-700 bg-white hover:bg-stone-50 transition-all cursor-pointer"
                  >
                    Edit Information
                  </button>
                  <button
                    type="button"
                    onClick={() => onFormSubmit(allValues)}
                    disabled={isSubmitting}
                    className="flex-1 px-5 py-3.5 rounded-xl text-sm font-bold text-white bg-[#063028] hover:bg-[#04201a] transition-all disabled:opacity-50 flex justify-center items-center cursor-pointer shadow-md"
                  >
                    {isSubmitting ? 'Registering Statement...' : 'Yes, File Statement'}
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
