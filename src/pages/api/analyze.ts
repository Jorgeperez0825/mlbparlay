import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { MLBGame } from '@/services/mlbApi';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Remover las interfaces comentadas si no se usan
interface TeamStats {
  team: {
    id: number;
    name: string;
  };
  // ... resto de la interfaz
}

// ... resto del código
 