import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = [];

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionComment = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    );

    return questionComment;
  }

  async createMany(questionAttachment: QuestionAttachment[]): Promise<void> {
    this.items.push(...questionAttachment);
  }

  async deleteMany(questionAttachment: QuestionAttachment[]): Promise<void> {
    const questionAttachments = this.items.filter((item) => {
      return !questionAttachment.some((attachment) => attachment.equals(item));
    });

    this.items = questionAttachments;
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    );

    this.items = questionAttachments;
  }
}
