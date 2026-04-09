import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma';
import { AppError } from '@utils/app-error.util';
import { StatusCodes } from 'http-status-codes';
import { generateToken } from '@utils/generate-token.util';
import { env } from '../../configs/env.config';

export const register = async (data: { email: string; password: string; name: string }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError('User already exists', StatusCodes.CONFLICT);
  }

  const hashedPassword = await bcrypt.hash(data.password, env.BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  }, env.JWT_SECRET, env.JWT_EXPIRES_IN);

  return { user, token };
}


export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid credentials', StatusCodes.UNAUTHORIZED);
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  }, env.JWT_SECRET, env.JWT_EXPIRES_IN);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  };
}

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  return user;
}

