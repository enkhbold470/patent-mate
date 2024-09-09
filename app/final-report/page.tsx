'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateFinalReport } from '@/lib/actions/generate-final-report';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';

interface FinalReport {
	executiveSummary: string;
	patentabilityScore: number;
	marketPotential: number;
	riskAssessment: number;
	nextSteps: string[];
	contributorInsights: {
		totalContributors: number;
		keyExpertiseAreas: string[];
		contributionDistribution: { name: string; value: number }[];
	};
	timelineEstimate: {
		researchAndDevelopment: number;
		patentApplication: number;
		marketEntry: number;
	};
	budgetEstimate: {
		researchAndDevelopment: number;
		patentFees: number;
		legalFees: number;
	};
}

export default function FinalReportPage() {
	const [report, setReport] = useState<FinalReport | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchReport = async () => {
			setLoading(true);
			const patentReport = localStorage.getItem('patentReport') || '{}';
			const contributorAnalysis =
				localStorage.getItem('contributorAnalysis') || '{}';
			const result = await generateFinalReport(
				patentReport,
				contributorAnalysis
			);
			if (result.success && result.report) {
				setReport(result.report);
			}
			setLoading(false);
		};

		fetchReport();
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="w-8 h-8 animate-spin" />
			</div>
		);
	}

	if (!report) {
		return <div>No report available.</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Final Patent Report</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Executive Summary</CardTitle>
					</CardHeader>
					<CardContent>
						<p>{report.executiveSummary}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Key Metrics</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="text-sm font-medium">Patentability Score</p>
							<Progress value={report.patentabilityScore} className="h-2" />
							<p className="text-sm text-right">{report.patentabilityScore}%</p>
						</div>
						<div>
							<p className="text-sm font-medium">Market Potential</p>
							<Progress value={report.marketPotential} className="h-2" />
							<p className="text-sm text-right">{report.marketPotential}%</p>
						</div>
						<div>
							<p className="text-sm font-medium">Risk Assessment</p>
							<Progress value={report.riskAssessment} className="h-2" />
							<p className="text-sm text-right">{report.riskAssessment}%</p>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Next Steps</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="list-disc list-inside">
							{report.nextSteps.map((step, index) => (
								<li key={index}>{step}</li>
							))}
						</ul>
					</CardContent>
				</Card>
				<Card className="col-span-full">
					<CardHeader>
						<CardTitle>Contributor Insights</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p className="font-medium">
									Total Contributors:{' '}
									{report.contributorInsights.totalContributors}
								</p>
								<p className="font-medium mt-2">Key Expertise Areas:</p>
								<ul className="list-disc list-inside">
									{report.contributorInsights.keyExpertiseAreas.map(
										(area, index) => (
											<li key={index}>{area}</li>
										)
									)}
								</ul>
							</div>
							<div className="h-64">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart
										data={report.contributorInsights.contributionDistribution}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Bar dataKey="value" fill="#8884d8" />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Timeline Estimate</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							<li>
								Research & Development:{' '}
								{report.timelineEstimate.researchAndDevelopment} months
							</li>
							<li>
								Patent Application: {report.timelineEstimate.patentApplication}{' '}
								months
							</li>
							<li>
								Market Entry: {report.timelineEstimate.marketEntry} months
							</li>
						</ul>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Budget Estimate</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							<li>
								Research & Development: $
								{report.budgetEstimate.researchAndDevelopment.toLocaleString()}
							</li>
							<li>
								Patent Fees: $
								{report.budgetEstimate.patentFees.toLocaleString()}
							</li>
							<li>
								Legal Fees: ${report.budgetEstimate.legalFees.toLocaleString()}
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>
			<div className="mt-8 flex justify-end">
				<Button>Download Report</Button>
			</div>
		</div>
	);
}
