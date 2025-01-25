import { Student } from '../../enterprise/entities/student';

export abstract class StudentRepository {
  abstract findByEmail(email: string): Promise<Student | undefined>;
  abstract create(student: Student): Promise<void>;
}
