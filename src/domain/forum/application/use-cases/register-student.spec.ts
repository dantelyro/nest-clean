import { RegisterStudentUseCase } from './register-student';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';

let fakeHasher: FakeHasher;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: RegisterStudentUseCase;

describe('Resgister Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher);
  });

  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    });
  });

  it('should hash a student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentsRepository.items[0].password).toEqual(
      hashedPassword,
    );
  });
});
