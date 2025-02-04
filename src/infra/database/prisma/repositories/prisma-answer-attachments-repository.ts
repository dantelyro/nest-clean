import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAnswerAttachmentsMapper } from '../mappers/prisma-answer-attachment-mapper';

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const AnswerAttachments = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    });

    return AnswerAttachments.map(PrismaAnswerAttachmentsMapper.toDomain);
  }

  async createMany(answerAttachment: AnswerAttachment[]): Promise<void> {
    if (answerAttachment.length === 0) {
      return;
    }

    const data =
      PrismaAnswerAttachmentsMapper.toPrismaUpdateMany(answerAttachment);

    await this.prisma.attachment.updateMany(data);
  }

  async deleteMany(answerAttachment: AnswerAttachment[]): Promise<void> {
    if (answerAttachment.length === 0) {
      return;
    }

    const attachmentsIds = answerAttachment.map((attachment) => {
      return attachment.attachmentId.toString();
    });

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    });
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    });
  }
}
