import { prisma } from "@/config";
import faker from "@faker-js/faker";




export async function createHotel() {
    return prisma.hotel.create({
        data:{
            image:faker.image.business(),
            name: faker.company.companyName()
        }
    })
}