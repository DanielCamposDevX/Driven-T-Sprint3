import { prisma } from "@/config";




export async function validateEnrollment(userId: number) {
    const enroll = await prisma.enrollment.findFirst({
        where: {
            userId
        }
    })
    if (!enroll) { return null }
    const ticket = await prisma.ticket.findFirst({
        where: {
            enrollmentId: enroll.id
        }
    })
    if (!ticket) { return null };
    const ticketType = await prisma.ticketType.findFirst({
        where: {
            id: ticket.ticketTypeId
        }
    })
    return { enroll, ticket, ticketType }
}


export async function showHotels() {
    const hotels = await prisma.hotel.findMany();
    return hotels;
}

export async function showHotelsById(id:number) {
    const hotel = await prisma.hotel.findUnique({
        where:{
            id
        }
    });
    return hotel;
}