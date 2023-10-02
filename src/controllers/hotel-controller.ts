import { Response } from 'express';
import httpStatus from 'http-status';
import { listHotelById, listHotels } from '@/services';
import { AuthenticatedRequest } from '@/middlewares';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotels = await listHotels(userId);
  if (hotels.length < 1) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
  return res.status(200).send(hotels);
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelId } = req.params;
  const hotel = await listHotelById(userId, hotelId);
  return res.status(200).send(hotel);
}
