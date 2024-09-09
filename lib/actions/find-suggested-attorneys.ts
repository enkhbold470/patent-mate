'use server';

import Groq from 'groq-sdk';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const groq = new Groq({
	apiKey: process.env.GROQ_API_KEY,
});

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new Pinecone({
	apiKey: process.env.PINECONE_API_KEY as string,
});

interface Attorney {
	name: string;
	specialty: string;
	summary: string;
	budget_range:
		| {
				start: number;
				end: number;
		  }
		| string; // Add string type to handle JSON strings
	location: string;
	years_of_experience: number;
	contact: string;
}

export async function findSuggestedAttorneys(patentDescription: string) {
	try {
		// Generate attorney requirements using Groq
		const requirementsCompletion = await groq.chat.completions.create({
			messages: [
				{
					role: 'system',
					content:
						'You are an AI assistant that generates attorney requirements based on patent descriptions.',
				},
				{
					role: 'user',
					content: `Based on the following patent description, generate a summary of ideal attorney requirements:\n\n${patentDescription}`,
				},
			],
			model: 'gemma2-9b-it',
			temperature: 0.5,
			max_tokens: 200,
		});

		const attorneyRequirements =
			requirementsCompletion.choices[0]?.message?.content || '';

		// Generate embedding for the attorney requirements using OpenAI
		const embeddingResponse = await openai.embeddings.create({
			model: 'text-embedding-ada-002',
			input: attorneyRequirements,
		});
		const embedding = embeddingResponse.data[0].embedding;

		// Query Pinecone for similar attorneys
		const index = pinecone.Index('attorney');
		const queryResponse = await index.query({
			vector: embedding,
			topK: 3,
			includeMetadata: true,
		});

		const suggestedAttorneys = queryResponse.matches.map(match => {
			const attorney = match.metadata as Attorney;
			// Parse budget_range if it's a string
			if (typeof attorney.budget_range === 'string') {
				attorney.budget_range = JSON.parse(attorney.budget_range);
			}
			return attorney;
		});

		return {
			success: true,
			attorneys: suggestedAttorneys,
		};
	} catch (error) {
		console.error('Error finding suggested attorneys:', error);
		return {
			success: false,
			attorneys: [],
		};
	}
}
