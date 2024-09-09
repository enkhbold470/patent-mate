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

export async function findSimilarPatents(patentDescription: string) {
	try {
		// Generate fake abstract using Groq
		const abstractCompletion = await groq.chat.completions.create({
			messages: [
				{
					role: 'system',
					content:
						'You are an AI assistant that generates concise patent abstracts.',
				},
				{
					role: 'user',
					content: `Generate a concise abstract for the following patent description:\n\n${patentDescription}`,
				},
			],
			model: 'mixtral-8x7b-32768',
			temperature: 0.5,
			max_tokens: 200,
		});

		const fakeAbstract = abstractCompletion.choices[0]?.message?.content || '';

		// Generate embedding for the fake abstract using OpenAI
		const embeddingResponse = await openai.embeddings.create({
			model: 'text-embedding-ada-002',
			input: fakeAbstract,
		});
		const embedding = embeddingResponse.data[0].embedding;

		// Query Pinecone for similar patents
		const index = pinecone.Index('abstract');
		const queryResponse = await index.query({
			vector: embedding,
			topK: 5,
			includeMetadata: true,
		});

		const similarPatents = queryResponse.matches.map(match => match.metadata);

		return {
			success: true,
			patents: similarPatents,
		};
	} catch (error) {
		console.error('Error finding similar patents:', error);
		return {
			success: false,
			patents: [],
		};
	}
}
