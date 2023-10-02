import { getHotelById, getHotels } from '@/controllers';
import { authenticateToken } from '@/middlewares';
import { Router } from 'express';


const hotelRouter = Router();
hotelRouter.all('/*', authenticateToken)
hotelRouter.get('/hotels', getHotels);
hotelRouter.get('/hotels/:hotelId',getHotelById)

export { hotelRouter };
