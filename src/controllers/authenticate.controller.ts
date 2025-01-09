import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaServise } from '@/prisma/prisma.service';
import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import z from 'zod';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

@Controller('/sessions')
@UsePipes(new ZodValidationPipe(authenticateBodySchema))
export class AuthenticateController {
  constructor(
    private prisma: PrismaServise,
    private jwt: JwtService,
  ) {}

  @Post()
  async handle(@Body() body) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('user credentials do not Match');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('user credentials do not Match');
    }

    const accessToken = this.jwt.sign({ sub: user.id });

    return {
      access_token: accessToken,
    };
  }
}
