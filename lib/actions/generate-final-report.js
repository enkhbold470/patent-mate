'use server';

import Groq from 'groq-sdk';

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

export async function generateFinalReport(inventionDetails, similarPatents, suggestedAttorneys) {
	const prompt = `
Generate a comprehensive final report for a patent application based on the following information:

Invention Details:
${JSON.stringify(inventionDetails, null, 2)}

Similar Patents:
${JSON.stringify(similarPatents, null, 2)}

Suggested Attorneys:
${JSON.stringify(suggestedAttorneys, null, 2)}

Please provide a detailed report that includes:
1. Executive Summary
2. Invention Overview
3. Novelty and Non-Obviousness Analysis
4. Market Potential
5. Recommended Next Steps
6. Suggested Patent Attorneys

Format the report in Markdown.
`;

	try {
		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: 'system',
					content: 'You are an AI assistant specialized in generating comprehensive patent application reports.',
				},
				{ role: 'user', content: prompt },
			],
			model: 'gemma-7b-it',
			temperature: 0.5,
			max_tokens: 4096,
		});

		const report = completion.choices[0]?.message?.content || '';

		return {
			success: true,
			message: 'Final report generated successfully!',
			report: report,
		};
	} catch (error) {
		console.error('Error generating final report:', error);
		return {
			success: false,
			message: 'An error occurred while generating the final report.',
			report: null,
		};
	}
}
