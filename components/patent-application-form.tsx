'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { submitPatentApplication } from '@/lib/actions/submit-patent-application';
import { useRouter } from 'next/navigation';

export type FormData = {
	inventionStage: string;
	priorArtSearch: string;
	novelty: string;
	publicDisclosure: boolean | null;
	patentGoals: string[];
	protectionRegions: string;
	timeline: string;
	budget: string;
	disclosureProcessFamiliarity: string;
	needDisclosureExplanation: boolean | null;
	needDisclosureAssistance: boolean | null;
	needConfidentialityAgreement: boolean | null;
	otherGoal: string;
};

export function PatentApplicationForm() {
	const [step, setStep] = useState(0);
	const [formData, setFormData] = useState<FormData>({
		inventionStage: '',
		priorArtSearch: '',
		novelty: '',
		publicDisclosure: null,
		patentGoals: [],
		protectionRegions: '',
		timeline: '',
		budget: '',
		disclosureProcessFamiliarity: '',
		needDisclosureExplanation: null,
		needDisclosureAssistance: null,
		needConfidentialityAgreement: null,
		otherGoal: '',
	});

	const updateFormData = (
		field: keyof FormData,
		value: string | string[] | boolean
	) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const steps = [
		{
			title: 'Invention Stage',
			description: 'What stage is your invention in?',
			content: (
				<RadioGroup
					value={formData.inventionStage}
					onValueChange={value => updateFormData('inventionStage', value)}
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="idea" id="idea" />
						<Label htmlFor="idea">Idea only</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="prototype" id="prototype" />
						<Label htmlFor="prototype">Prototype developed</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="market" id="market" />
						<Label htmlFor="market">Product in market</Label>
					</div>
				</RadioGroup>
			),
			isValid: () => formData.inventionStage !== '',
		},
		{
			title: 'Prior Art Search',
			description: 'Have you conducted any prior art searches?',
			content: (
				<RadioGroup
					value={formData.priorArtSearch}
					onValueChange={value => updateFormData('priorArtSearch', value)}
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="self" id="self" />
						<Label htmlFor="self">Yes, I have conducted searches myself.</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="professional" id="professional" />
						<Label htmlFor="professional">
							Yes, but with professional help.
						</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="no" id="no" />
						<Label htmlFor="no">No, I need assistance with this.</Label>
					</div>
				</RadioGroup>
			),
			isValid: () => formData.priorArtSearch !== '',
		},
		{
			title: 'Novelty',
			description: 'Do you believe your invention is novel, and why?',
			content: (
				<Textarea
					placeholder="Explain why you believe your invention is novel..."
					value={formData.novelty}
					onChange={e => updateFormData('novelty', e.target.value)}
				/>
			),
			isValid: () => formData.novelty !== '',
		},
		{
			title: 'Public Disclosure',
			description: 'Have you disclosed your invention publicly in any form?',
			content: (
				<RadioGroup
					value={
						formData.publicDisclosure === null
							? ''
							: formData.publicDisclosure.toString()
					}
					onValueChange={value =>
						updateFormData('publicDisclosure', value === 'true')
					}
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="true" id="yes-disclosure" />
						<Label htmlFor="yes-disclosure">Yes</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="false" id="no-disclosure" />
						<Label htmlFor="no-disclosure">No</Label>
					</div>
				</RadioGroup>
			),
			isValid: () => formData.publicDisclosure !== null,
		},
		{
			title: 'Patent Goals',
			description: 'What are your main goals for patenting the invention?',
			content: (
				<div className="space-y-2">
					<Label>Select all that apply:</Label>
					<div className="space-y-2">
						{[
							'Protecting intellectual property',
							'Attracting investors or funding',
							'Licensing opportunities',
							'Other',
						].map(goal => (
							<div key={goal} className="flex items-center space-x-2">
								<input
									type="checkbox"
									id={goal}
									checked={formData.patentGoals.includes(goal as never)}
									onChange={e => {
										if (e.target.checked) {
											updateFormData('patentGoals', [
												...formData.patentGoals,
												goal as never,
											]);
										} else {
											updateFormData(
												'patentGoals',
												formData.patentGoals.filter(g => g !== goal)
											);
										}
									}}
								/>
								<Label htmlFor={goal}>{goal}</Label>
							</div>
						))}
					</div>
					{formData.patentGoals.includes('Other' as never) && (
						<Input
							placeholder="Please specify other goals"
							value={formData.otherGoal as string}
							onChange={e => updateFormData('otherGoal', e.target.value)}
						/>
					)}
				</div>
			),
			isValid: () => formData.patentGoals.length > 0,
		},
		{
			title: 'Protection Regions',
			description:
				'Are you interested in patent protection in specific countries or regions?',
			content: (
				<RadioGroup
					value={formData.protectionRegions}
					onValueChange={value => updateFormData('protectionRegions', value)}
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="domestic" id="domestic" />
						<Label htmlFor="domestic">Domestic only</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="international" id="international" />
						<Label htmlFor="international">International</Label>
					</div>
				</RadioGroup>
			),
			isValid: () => formData.protectionRegions !== '',
		},
		{
			title: 'Timeline',
			description: 'What is your timeline for filing a patent application?',
			content: (
				<RadioGroup
					value={formData.timeline}
					onValueChange={value => updateFormData('timeline', value)}
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="immediate" id="immediate" />
						<Label htmlFor="immediate">Immediate (within 1-3 months)</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="short-term" id="short-term" />
						<Label htmlFor="short-term">Short-term (within 4-6 months)</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="no-timeline" id="no-timeline" />
						<Label htmlFor="no-timeline">No specific timeline</Label>
					</div>
				</RadioGroup>
			),
			isValid: () => formData.timeline !== '',
		},
		{
			title: 'Budget',
			description: 'What is your budget for obtaining a patent?',
			content: (
				<Input
					type="text"
					placeholder="Enter your budget range"
					value={formData.budget}
					onChange={e => updateFormData('budget', e.target.value)}
				/>
			),
			isValid: () => formData.budget !== '',
		},
		{
			title: 'Disclosure Process Familiarity',
			description: 'Are you familiar with the invention disclosure process?',
			content: (
				<RadioGroup
					value={formData.disclosureProcessFamiliarity}
					onValueChange={value =>
						updateFormData('disclosureProcessFamiliarity', value)
					}
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="familiar" id="familiar" />
						<Label htmlFor="familiar">Yes, I am familiar.</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="somewhat" id="somewhat" />
						<Label htmlFor="somewhat">
							Somewhat familiar, but need more details.
						</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="not-familiar" id="not-familiar" />
						<Label htmlFor="not-familiar">Not familiar at all.</Label>
					</div>
				</RadioGroup>
			),
			isValid: () => formData.disclosureProcessFamiliarity !== '',
		},
		{
			title: 'Disclosure Explanation',
			description:
				'Would you like a detailed explanation of how invention disclosure can impact your patent application?',
			content: (
				<RadioGroup
					value={
						formData.needDisclosureExplanation === null
							? ''
							: formData.needDisclosureExplanation.toString()
					}
					onValueChange={value =>
						updateFormData('needDisclosureExplanation', value === 'true')
					}
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="true" id="yes-explanation" />
						<Label htmlFor="yes-explanation">
							Yes, please provide details.
						</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="false" id="no-explanation" />
						<Label htmlFor="no-explanation">
							No, I understand the implications.
						</Label>
					</div>
				</RadioGroup>
			),
			isValid: () => formData.needDisclosureExplanation !== null,
		},
		{
			title: 'Disclosure Assistance',
			description:
				'Would you like assistance in preparing a comprehensive invention disclosure document?',
			content: (
				<RadioGroup
					value={
						formData.needDisclosureAssistance === null
							? ''
							: formData.needDisclosureAssistance.toString()
					}
					onValueChange={value =>
						updateFormData('needDisclosureAssistance', value === 'true')
					}
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="true" id="yes-assistance" />
						<Label htmlFor="yes-assistance">
							Yes, I need help with documentation.
						</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="false" id="no-assistance" />
						<Label htmlFor="no-assistance">No, I will prepare it myself.</Label>
					</div>
				</RadioGroup>
			),
			isValid: () => formData.needDisclosureAssistance !== null,
		},
		{
			title: 'Confidentiality Agreement',
			description:
				'Do you require confidentiality agreements before disclosing details of your invention?',
			content: (
				<RadioGroup
					value={
						formData.needConfidentialityAgreement === null
							? ''
							: formData.needConfidentialityAgreement.toString()
					}
					onValueChange={value =>
						updateFormData('needConfidentialityAgreement', value === 'true')
					}
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="true" id="yes-nda" />
						<Label htmlFor="yes-nda">Yes, I need an NDA in place.</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="false" id="no-nda" />
						<Label htmlFor="no-nda">
							No, I am ready to disclose without an NDA.
						</Label>
					</div>
				</RadioGroup>
			),
			isValid: () => formData.needConfidentialityAgreement !== null,
		},
	];

	const [submitting, setSubmitting] = useState(false);
	const [submitResult, setSubmitResult] = useState<{
		success: boolean;
		message: string;
		report?: string | null;
	} | null>(null);

	const router = useRouter();

	const handleNext = () => {
		if (step < steps.length - 1 && steps[step].isValid()) {
			setStep(step + 1);
		}
	};

	const handlePrevious = () => {
		if (step > 0) {
			setStep(step - 1);
		}
	};

	const handleSubmit = async () => {
		if (steps[step].isValid()) {
			setSubmitting(true);
			try {
				const result = await submitPatentApplication(formData);
				localStorage.setItem('patentReport', JSON.stringify(result.report));
				localStorage.setItem('patentFormData', JSON.stringify(formData));
				if (result.success && result.report) {
					localStorage.setItem('patentReport', JSON.stringify(result.report));
					router.push('/report');
				} else {
					setSubmitResult(result);
				}
			} catch (error) {
				setSubmitResult({
					success: false,
					message: 'An error occurred while submitting the form.',
					report: null,
				});
			} finally {
				setSubmitting(false);
			}
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardDescription>
					Step {step + 1} of {steps.length}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<h3 className="text-lg font-semibold mb-2">{steps[step].title}</h3>
				<p className="text-sm text-gray-500 mb-4">{steps[step].description}</p>
				{steps[step].content}
				{submitResult && (
					<div
						className={`mt-4 p-4 rounded ${
							submitResult.success
								? 'bg-green-100 text-green-800'
								: 'bg-red-100 text-red-800'
						}`}
					>
						<p className="font-semibold">{submitResult.message}</p>
						{submitResult.report && (
							<div className="mt-4">
								<h4 className="font-semibold mb-2">Patent Ability Report:</h4>
								<div className="whitespace-pre-wrap text-sm">
									{submitResult.report}
								</div>
							</div>
						)}
					</div>
				)}
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button
					variant="outline"
					onClick={handlePrevious}
					disabled={step === 0 || submitting}
				>
					<ChevronLeftIcon className="mr-2 h-4 w-4" /> Previous
				</Button>
				{step < steps.length - 1 ? (
					<Button
						onClick={handleNext}
						disabled={!steps[step].isValid() || submitting}
					>
						Next <ChevronRightIcon className="ml-2 h-4 w-4" />
					</Button>
				) : (
					<Button
						onClick={handleSubmit}
						disabled={!steps[step].isValid() || submitting}
					>
						{submitting ? 'Submitting...' : 'Submit'}{' '}
						<CheckIcon className="ml-2 h-4 w-4" />
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
