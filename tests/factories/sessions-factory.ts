import { Session } from '@prisma/client';
import { createUser } from './users-factory';
import { prisma } from '@/config';

export async function createSession(token: string): Promise<Session> {
  const user = await createUser();

  return prisma.session.create({
    data: {
      token: token,
      userId: user.id,
    },
  });
}

export async function createSessionWithId(token: string, id: number): Promise<Session> {
  return prisma.session.create({
    data: {
      token: token,
      userId: id,
    },
  });
}
