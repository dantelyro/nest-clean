import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { Prisma, Attachment as PrismaAnswerAttachments } from '@prisma/client';

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

  static toPrismaUpdateMany(
    attachments: AnswerAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map((attachment) => {
      return attachment.attachmentId.toString();
    });
    return {
      where: {
        id: {
          in: attachmentIds,
        },
      },
      data: {
        answerId: attachments[0].answerId.toString(),
      },
    };
  }
}
