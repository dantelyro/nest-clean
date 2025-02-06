import { PaginationParams } from '@/core/repositories/pagination-params';
import { Question } from '../../enterprise/entities/question';
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details';

export abstract class QuestionsRepository {
  abstract findById(id: string): Promise<Question | undefined>;
  abstract findBySlug(slug: string): Promise<Question | undefined>;
  abstract findDetailsBySlug(
    slug: string,
  ): Promise<QuestionDetails | undefined>;
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>;
  abstract create(question: Question): Promise<void>;
  abstract save(question: Question): Promise<void>;
  abstract delete(question: Question): Promise<void>;
}
