import request from 'supertest';
import app from '../config/app';

describe('SignUp Routes', () => {
  it('Should return an account on success', async () => {
    await request(app).post('/api/signup')
      .send({
        name: 'Test',
        email: 'test@test.com',
        password: 'test12345',
        passwordConfirmation: 'test12345'
      })
      .expect(200);
  })
})