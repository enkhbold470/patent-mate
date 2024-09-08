'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { jsPDF } from 'jspdf';

export default function ReportPage() {
	const [report, setReport] = useState<string | null>(null);

	useEffect(() => {
		const storedReport = localStorage.getItem('patentReport');
		if (storedReport) {
			setReport(JSON.parse(storedReport));
		}
	}, []);

	const downloadPDF = () => {
		if (report) {
			const doc = new jsPDF();
			doc.text(report, 10, 10);
			doc.save('patent_report.pdf');
		}
	};

	if (!report) {
		return <div>No report available.</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-4xl mx-auto">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						Patent Ability Report
					</CardTitle>
				</CardHeader>
				<CardContent>
					<ReactMarkdown className="prose">{report}</ReactMarkdown>
					<Button onClick={downloadPDF} className="mt-4">
						Download as PDF
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
