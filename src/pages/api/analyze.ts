import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    const completion = await openai.chat.completions.create({
      messages: [{ 
        role: "user", 
        content: prompt
      }],
      model: "gpt-4",
      response_format: { type: "json_object" },
    });

    if (!completion.choices[0].message.content) {
      throw new Error('No content received from OpenAI');
    }

    const analysis = JSON.parse(completion.choices[0].message.content);
    res.status(200).json(analysis);
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ 
      message: 'Error analyzing game data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
 