import { AuthMapper } from 'src/auth/infrastructure/mappers/auth.mapper';
import { AuthRequestDto } from 'src/auth/presentation/dtos/auth-request.dto';
import { LoginInputApplicationDTO } from 'src/auth/application/dtos/login-input-application.dto';
import { AuthResponseDto } from 'src/auth/presentation/dtos/auth-response.dto';
import { LoginOutputApplicationDTO } from 'src/auth/application/dtos/login-ouput-application.dto';

const mockMorphismFunc = jest.fn<unknown, unknown[]>();
jest.mock('morphism', () => ({
  morphism: (...arg: unknown[]) => mockMorphismFunc(...arg),
}));

describe('AuthMapper Unit Tests', () => {
  let authMapper: AuthMapper;

  beforeEach(() => {
    authMapper = new AuthMapper();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toApplication', () => {
    it('should map AuthRequestDto to LoginInputApplicationDTO', () => {
      const payload: AuthRequestDto = {
        email: 'test@test.com',
        password: 'securepassword',
      };

      const expectedResult: LoginInputApplicationDTO = {
        email: 'test@test.com',
        password: 'securepassword',
      };

      mockMorphismFunc.mockReturnValue(expectedResult);

      const result = authMapper.toApplication(payload);

      expect(result).toEqual(expectedResult);
      expect(mockMorphismFunc).toHaveBeenCalledWith(
        authMapper['loginRequestToApplicationSchema'],
        payload,
      );
    });
  });

  describe('toResponse', () => {
    it('should map LoginOutputApplicationDTO to AuthResponseDto', () => {
      const payload: LoginOutputApplicationDTO = {
        token: 'jwt-token-string',
      };

      const expectedResult: AuthResponseDto = {
        token: 'jwt-token-string',
      };

      mockMorphismFunc.mockReturnValue(expectedResult);

      const result = authMapper.toResponse(payload);

      expect(result).toEqual(expectedResult);
      expect(mockMorphismFunc).toHaveBeenCalledWith(
        authMapper['loginOutputToResponseSchema'],
        payload,
        AuthResponseDto,
      );
    });
  });
});
