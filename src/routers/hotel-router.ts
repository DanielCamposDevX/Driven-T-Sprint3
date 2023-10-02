import { Router } from 'express';
import { getHotelById, getHotels } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const hotelRouter = Router();
hotelRouter.all('/*', authenticateToken);
hotelRouter.get('/hotels', getHotels);
hotelRouter.get('/hotels/:hotelId', getHotelById);

export { hotelRouter };
