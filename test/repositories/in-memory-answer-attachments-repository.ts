import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = [];

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerComment = this.items.filter(
      (item) => item.answerId.toString() === answerId,
    );

    return answerComment;
  }

  async createMany(answerAttachment: AnswerAttachment[]): Promise<void> {
    this.items.push(...answerAttachment);
  }

  async deleteMany(answerAttachment: AnswerAttachment[]): Promise<void> {
    const answerAttachments = this.items.filter((item) => {
      return !answerAttachment.some((attachment) => attachment.equals(item));
    });

    this.items = answerAttachments;
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() !== answerId,
    );

    this.items = answerAttachments;
  }
}
