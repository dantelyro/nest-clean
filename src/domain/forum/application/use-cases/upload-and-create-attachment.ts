import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type';
import { Attachment } from '../../enterprise/entities/attachment';
import { AttachmentsRepository } from '../repositories/attachments-repository';
import { Uploader } from '../storage/uploader';

interface UploadAndCreateAttachmentsUseCaseRequest {
  fileName: string;
  fileType: string;
  buffer: Buffer;
}

type UploadAndCreateAttachmentsUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  { attachment: Attachment }
>;

@Injectable()
export class UploadAndCreateAttachmentsUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    buffer,
  }: UploadAndCreateAttachmentsUseCaseRequest): Promise<UploadAndCreateAttachmentsUseCaseResponse> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType));
    }

    const { url } = await this.uploader.upload({ fileName, fileType, buffer });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);

    return right({ attachment });
  }
}
