import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
export const PORT: number = Number(process.env.PORT) || 3001
export const WS_URL: string = process.env.WS_URL || 'http://localhost:4000'