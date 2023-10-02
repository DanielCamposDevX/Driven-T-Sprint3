import httpStatus from 'http-status';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createHotel,
  createTicket,
  createTicketTypewithHotel,
  createUser,
} from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotel', () => {
  it('Should respond 401 when token is missing', async () => {
    const response = await server.get('/hotels').set('Authorization', `Bearer ${faker.random.word}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with 402 when ticket is not payed', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enroll = await createEnrollmentWithAddress(user);
    const type = await createTicketTypewithHotel(true);
    await createTicket(enroll.id, type.id, 'RESERVED');
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('Shoul respond with 402 when ticket is not Hotel included', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enroll = await createEnrollmentWithAddress(user);
    const type = await createTicketTypewithHotel(false);
    await createTicket(enroll.id, type.id, 'PAID');
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('Should respond 404 when enrollment is missing on user', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('Should respond 404 when ticket is missing on user', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);
    await createTicketTypewithHotel(true);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('Should respond 404 when no hotels', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enroll = await createEnrollmentWithAddress(user);
    const type = await createTicketTypewithHotel(true);
    await createTicket(enroll.id, type.id, 'PAID');
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('Should Get all hotels and status 200 OK!', async () => {
    await cleanDb();
    const user = await createUser();
    const token = await generateValidToken(user);
    const enroll = await createEnrollmentWithAddress(user);
    const type = await createTicketTypewithHotel(true);
    await createHotel();
    await createTicket(enroll.id, type.id, 'PAID');
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body[0]).toEqual({
      createdAt: expect.any(String),
      id: expect.any(Number),
      image: expect.any(String),
      name: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});

describe('Get /Hotels/:hotelId', () => {
  it('Should respond 401 when token is missing', async () => {
    const hotel = await createHotel();
    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${faker.random.word}`);
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Should respond with 402 when ticket is not payed', async () => {
    const hotel = await createHotel();
    const user = await createUser();
    const token = await generateValidToken(user);
    const enroll = await createEnrollmentWithAddress(user);
    const type = await createTicketTypewithHotel(true);
    await createTicket(enroll.id, type.id, 'RESERVED');
    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('Shoul respond with 402 when ticket is not Hotel included', async () => {
    const hotel = await createHotel();
    const user = await createUser();
    const token = await generateValidToken(user);
    const enroll = await createEnrollmentWithAddress(user);
    const type = await createTicketTypewithHotel(false);
    await createTicket(enroll.id, type.id, 'PAID');
    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('Should respond 404 when enrollment is missing on user', async () => {
    const hotel = await createHotel();
    const user = await createUser();
    const token = await generateValidToken(user);
    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('Should respond 404 when ticket is missing on user', async () => {
    const hotel = await createHotel();

    const user = await createUser();
    const token = await generateValidToken(user);
    await createEnrollmentWithAddress(user);
    await createTicketTypewithHotel(true);
    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('Should respond 404 when no hotels', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enroll = await createEnrollmentWithAddress(user);
    const type = await createTicketTypewithHotel(true);
    await createTicket(enroll.id, type.id, 'PAID');
    const response = await server.get(`/hotels/dlsk}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('Should Get all hotels and status 200 OK!', async () => {
    await cleanDb();
    const user = await createUser();
    const token = await generateValidToken(user);
    const enroll = await createEnrollmentWithAddress(user);
    const type = await createTicketTypewithHotel(true);
    const hotel = await createHotel();
    await createTicket(enroll.id, type.id, 'PAID');
    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      createdAt: expect.any(String), // Or expect.any(Date) if you want to check the type
      id: expect.any(Number),
      image: expect.any(String),
      name: expect.any(String),
      updatedAt: expect.any(String), // Or expect.any(Date) if you want to check the type
    });
  });
});
