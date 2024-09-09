'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { submitInventionDisclosure } from '@/lib/actions/submit-invention-disclosure';
import { useRouter } from 'next/navigation';

export function InventionDisclosureForm() {
	const [patentDescription, setPatentDescription] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const storedFormData = localStorage.getItem('patentFormData');
		if (storedFormData) {
			const parsedFormData = JSON.parse(storedFormData);
			if (parsedFormData.patentDescription) {
				setPatentDescription(parsedFormData.patentDescription);
			}
		}
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const result = await submitInventionDisclosure(patentDescription);
			if (result.success && result.analysis) {
				localStorage.setItem(
					'contributorAnalysis',
					JSON.stringify(result.analysis)
				);
				router.push('/contributor-analysis');
			} else {
				// Handle error
				console.error(result.message);
			}
		} catch (error) {
			console.error('Error submitting invention disclosure:', error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Textarea
				placeholder="Enter your patent description here..."
				value={patentDescription}
				onChange={e => setPatentDescription(e.target.value)}
				className="mb-4"
				rows={10}
			/>
			<Button type="submit" disabled={submitting}>
				{submitting ? 'Analyzing...' : 'Submit for Analysis'}
			</Button>
		</form>
	);
}
