import { notFoundError, paymentRequiredError } from "@/errors";
import { showHotels, showHotelsById, validateEnrollment } from "@/repositories";




export async function listHotels(userId: number) {
    const data = await validateEnrollment(userId);
    if (data === null) { throw notFoundError() };
    if (data.ticket.status === "RESERVED" || data.ticketType.includesHotel === false) { throw paymentRequiredError() };
    const hotels = await showHotels();
    return hotels;
}

export async function listHotelById(userId: number, hotelId: string) {
    const data = await validateEnrollment(userId);
    if (isNaN(Number(hotelId))) { throw notFoundError() }
    if (data === null) { throw notFoundError() };
    if (data.ticket.status === "RESERVED" || data.ticketType.includesHotel === false) { throw paymentRequiredError() };
    const hotel = await showHotelsById(Number(hotelId));
    if (!hotel) { throw notFoundError() }
    return hotel;
}