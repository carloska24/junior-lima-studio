import { PrismaClient } from '@prisma/client';
require('dotenv').config();

export const prisma = new PrismaClient();
