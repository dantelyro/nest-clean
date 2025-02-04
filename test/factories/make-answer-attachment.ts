import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
): AnswerAttachment {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return answerAttachment;
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(
    data: Partial<AnswerAttachmentProps> = {},
  ): Promise<AnswerAttachment> {
    const answerAttachment = makeAnswerAttachment(data);

    await this.prisma.attachment.update({
      where: {
        id: answerAttachment.attachmentId.toValue(),
      },
      data: {
        answerId: answerAttachment.answerId.toValue(),
      },
    });

    return answerAttachment;
  }
}
