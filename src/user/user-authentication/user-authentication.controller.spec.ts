import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthenticationController } from './user-authentication.controller';
import { UserAuthenticationService } from './user-authentication.service';
import { CreateAccountDto } from './create-account.dto';
import { JwtPayload } from './jwt.interface';
import { UserAuthentication } from './user-authentication.entity';
import { LoginDto } from './login.dto';

jest.mock('./user-authentication.service');

describe('UserAuthentication Controller', () => {
  let module: TestingModule;
  let controller: UserAuthenticationController;
  let service: jest.Mocked<UserAuthenticationService>;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [UserAuthenticationController],
      providers: [UserAuthenticationService]
    }).compile();

    service = module.get<UserAuthenticationService>(UserAuthenticationService) as jest.Mocked<UserAuthenticationService>;
    controller = module.get<UserAuthenticationController>(UserAuthenticationController);
  });

  it('should be defined', () => {
    const controller: UserAuthenticationController = module.get<UserAuthenticationController>(UserAuthenticationController);
    expect(controller).toBeDefined();
  });

  it('successfully connects to the service', async () => {
    expect(controller.createAccount).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Method testing', () => {
    beforeAll(() => {
      service.createToken.mockImplementation(async (user: JwtPayload) => {
        return { expiresIn: 1000, accessToken: 'secret' };
      });

      service.createAccount.mockImplementation(async (user: CreateAccountDto) => 
        Object.assign(new UserAuthentication, user)
      );

      service.validateLogin.mockImplementation((user: LoginDto) => true);

      service.createLoginToken.mockImplementation(async (user: LoginDto) => {
        return { expiresIn: 1000, accessToken: 'secret' };
      })
    });

    it('creating a token should return a valid token object', async () => {
      const result = await controller.createToken({ username: 'user', email: 'user@example.com' });

      expect(result).toBeDefined();
      expect(result.expiresIn).toBeDefined();
      expect(result.accessToken).toBeDefined();
    });

    it('creating a new account should return a valid authentication object', async () => {
      const result = await controller.createAccount({
        username: 'user',
        email: 'user@example.com',
        password: 'secret'
      });

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(UserAuthentication);
      expect(result.email).toBe('user@example.com');
    });

    it('verifying a login should return a valid token object', async () => {
      const result = await controller.verifyLogin({ username: 'user', password: 'secret' });

      expect(result).toBeDefined();
      expect(result).toMatchObject({ expiresIn: 1000, accessToken: 'secret'});
    });
  });
});
