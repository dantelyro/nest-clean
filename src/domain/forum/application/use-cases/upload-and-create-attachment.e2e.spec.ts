import { FakeUploader } from 'test/storage/fake-uploader';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { UploadAndCreateAttachmentsUseCase } from './upload-and-create-attachment';

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentsUseCase;

describe('Upload and create attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentsUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    );
  });

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.jpeg',
      fileType: 'image/jpeg',
      buffer: Buffer.from(''),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    });

    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.jpeg',
      }),
    );
  });

  it('should not be able to upload attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'sample.txt',
      fileType: 'text/plain',
      buffer: Buffer.from(''),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
  });
});
