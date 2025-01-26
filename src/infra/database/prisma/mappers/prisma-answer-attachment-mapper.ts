import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { Attachment as PrismaAnswerAttachments } from '@prisma/client';

export class PrismaAnswerAttachmentsMapper {
  static toDomain(raw: PrismaAnswerAttachments) {
    if (!raw.answerId) {
      throw new Error('Invalid comment type');
    }

    return AnswerAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        answerId: new UniqueEntityID(raw.answerId),
      },
      new UniqueEntityID(raw.id),
    );
  }
}
