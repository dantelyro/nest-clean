import { QuestionAttachment } from '../../enterprise/entities/question-attachment';

export abstract class QuestionAttachmentsRepository {
  abstract createMany(questionAttachment: QuestionAttachment[]): Promise<void>;
  abstract deleteMany(questionAttachment: QuestionAttachment[]): Promise<void>;

  abstract findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]>;
  abstract deleteManyByQuestionId(questionId: string): Promise<void>;
}
