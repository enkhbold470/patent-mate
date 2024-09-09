'use server';

import Groq from 'groq-sdk';

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

export async function generateFinalReport(
	patentReport: string,
	contributorAnalysis: string
) {
	const prompt = `
Based on the following patent report and contributor analysis, generate a comprehensive final report. Include key metrics, insights, and recommendations. Present the information in a structured format suitable for visualization.

Patent Report:
${patentReport}

Contributor Analysis:
${contributorAnalysis}

Please provide the output in the following JSON format:
{
  "executiveSummary": "Brief overview of the patent and its potential",
  "patentabilityScore": 0-100,
  "marketPotential": 0-100,
  "riskAssessment": 0-100,
  "nextSteps": ["Step 1", "Step 2", "Step 3"],
  "contributorInsights": {
    "totalContributors": 0,
    "keyExpertiseAreas": ["Area 1", "Area 2", "Area 3"],
    "contributionDistribution": [
      { "name": "Contributor Name", "value": 0-100 }
    ]
  },
  "timelineEstimate": {
    "researchAndDevelopment": 0,
    "patentApplication": 0,
    "marketEntry": 0
  },
  "budgetEstimate": {
    "researchAndDevelopment": 0,
    "patentFees": 0,
    "legalFees": 0
  }
}
`;

	try {
		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: 'system',
					content:
						'You are an AI assistant specialized in analyzing patent reports and contributor analyses to generate comprehensive final reports.',
				},
				{ role: 'user', content: prompt },
			],
			model: 'gemma-7b-it',
			temperature: 0.5,
			max_tokens: 2048,
			response_format: { type: 'json_object' },
		});

		const finalReport = JSON.parse(
			completion.choices[0]?.message?.content || '{}'
		);

		return {
			success: true,
			message: 'Final report generated successfully!',
			report: finalReport,
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
