import { SignUpController } from "./signup"

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {        
        email: 'test@test.com',
        password: 'test12345',
        passwordConfirmation: 'test12345'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})