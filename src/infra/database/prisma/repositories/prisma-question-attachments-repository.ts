import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaQuestionAttachmentsMapper } from '../mappers/prisma-question-attachment-mapper';

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const QuestionAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    });

    return QuestionAttachments.map(PrismaQuestionAttachmentsMapper.toDomain);
  }

  async createMany(questionAttachment: QuestionAttachment[]): Promise<void> {
    if (questionAttachment.length === 0) {
      return;
    }

    const data =
      PrismaQuestionAttachmentsMapper.toPrismaUpdateMany(questionAttachment);

    await this.prisma.attachment.updateMany(data);
  }

  async deleteMany(questionAttachment: QuestionAttachment[]): Promise<void> {
    if (questionAttachment.length === 0) {
      return;
    }

    const attachmentsIds = questionAttachment.map((attachment) => {
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

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    });
  }
}
