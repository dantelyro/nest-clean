import { Either, left, right } from './either';

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(1);
  } else {
    return left('Error');
  }
}

describe('Either', () => {
  it('should be able to create a success value', () => {
    const result = doSomething(true);

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
  });

  it('should be able to create an error value', () => {
    const result = doSomething(false);

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
  });
});
