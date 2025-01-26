import { Student } from '@/domain/forum/enterprise/entities/student';
import { Injectable } from '@nestjs/common';
import { PrismaServise } from '../prisma.service';
import { StudentRepository } from '@/domain/forum/application/repositories/students-repository';
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper';

@Injectable()
export class PrismaStudentsRepository implements StudentRepository {
  constructor(private prisma: PrismaServise) {}

  async findByEmail(email: string): Promise<Student | undefined> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!student) {
      return undefined;
    }

    return PrismaStudentMapper.toDomain(student);
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student);

    await this.prisma.user.create({
      data,
    });
  }
}
