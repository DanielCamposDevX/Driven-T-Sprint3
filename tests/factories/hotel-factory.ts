import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      image: faker.image.business(),
      name: faker.company.companyName(),
    },
  });
}
