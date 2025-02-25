import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Student } from '@/domain/forum/enterprise/entities/student';
import { User as PrismaStudent, Prisma } from '@prisma/client';

export class PrismaStudentMapper {
  static toDomain(raw: PrismaStudent) {
    return Student.create(
      {
        email: raw.email,
        password: raw.password,
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      email: student.email,
      password: student.password,
      name: student.name,
    };
  }
}
