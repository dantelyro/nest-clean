import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { StudentRepository } from '../repositories/students-repository';
import { HashComparer } from '../cryptography/hash-comparer';
import { WrongCredentialError } from './errors/wrong-credentials-error';
import { Encrypter } from '../cryptography/encrypter';

interface AuthenticateStudentUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialError,
  { accessToken: string }
>;

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentRepository: StudentRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentRepository.findByEmail(email);

    if (!student) {
      return left(new WrongCredentialError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      student.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    });

    return right({ accessToken });
  }
}
