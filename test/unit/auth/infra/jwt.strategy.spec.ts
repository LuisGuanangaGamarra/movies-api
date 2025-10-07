import { JwtStrategy } from 'src/auth/infrastructure/jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy Unit Tests', () => {
  let jwtStrategy: JwtStrategy;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    configService = {
      get: jest.fn(),
    } as Partial<ConfigService> as jest.Mocked<ConfigService>;

    configService.get.mockImplementation((key: string) => {
      const config = {
        JWT_SECRET: 'my-secret-key',
        JWT_ISSUER: 'my-issuer',
        JWT_AUDIENCE: 'my-audience',
      };
      return config[key];
    });

    jwtStrategy = new JwtStrategy(configService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with the correct options from ConfigService', () => {
    expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
    expect(configService.get).toHaveBeenCalledWith('JWT_ISSUER');
    expect(configService.get).toHaveBeenCalledWith('JWT_AUDIENCE');
  });

  it('should successfully validate a valid JWT payload', () => {
    const payload = {
      sub: '123',
      email: 'user@example.com',
      role: 'USER',
    };

    const result = jwtStrategy.validate(payload);

    expect(result).toEqual({
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    });
  });
});
