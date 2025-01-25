import { Student } from '../../enterprise/entities/student';

export abstract class StudentRepository {
  abstract findById(id: string): Promise<Student | undefined>;
  abstract findByEmail(email: string): Promise<Student | undefined>;
  abstract create(student: Student): Promise<void>;
  abstract update(student: Student): Promise<void>;
  abstract delete(student: Student): Promise<void>;
}
