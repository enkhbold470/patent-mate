'use server';

import Groq from 'groq-sdk';

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

export async function submitInventionDisclosure(patentDescription: string) {
	const prompt = `
Based on the following patent description, identify the key contributions and potential contributors. For each contribution, provide a brief description. For each potential contributor, provide their name, area of expertise, and specific contribution to the invention. Present the information in a structured format.

Patent Description:
${patentDescription}

Please provide the output in the following JSON format:
{
  "contributions": [
    {
      "description": "Brief description of the contribution"
    },
    ...
  ],
  "contributors": [
    {
      "name": "Contributor's name",
      "expertise": "Area of expertise",
      "contribution": "Specific contribution to the invention"
    },
    ...
  ]
}
`;

	try {
		const completion = await groq.chat.completions.create({
			messages: [
				{
					role: 'system',
					content:
						'You are an AI assistant specialized in analyzing patent descriptions, identifying key contributions, and potential contributors. Use the exact wording from the patent description when describing contributions.',
				},
				{ role: 'user', content: prompt },
			],
			model: 'gemma-7b-it',
			temperature: 0.5,
			max_tokens: 2048,
			response_format: { type: 'json_object' },
		});

		const analysis = JSON.parse(
			completion.choices[0]?.message?.content || '{}'
		);

		return {
			success: true,
			message: 'Invention disclosure analyzed successfully!',
			analysis: analysis,
		};
	} catch (error) {
		console.error('Error analyzing invention disclosure:', error);
		return {
			success: false,
			message: 'An error occurred while analyzing the invention disclosure.',
			analysis: null,
		};
	}
}
