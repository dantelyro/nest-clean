import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { WrongCredentialError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import z from 'zod';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

@Controller('/sessions')
@UsePipes(new ZodValidationPipe(authenticateBodySchema))
export class AuthenticateController {
  constructor(private authenticateStudentUseCase: AuthenticateStudentUseCase) {}

  @Post()
  async handle(@Body() body) {
    const { email, password } = body;

    const result = await this.authenticateStudentUseCase.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return { access_token: accessToken };
  }
}
