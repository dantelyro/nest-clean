import { Either, left, right } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Question } from '../../enterprise/entities/question';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository';
import { QuestionsRepository } from '../repositories/questions-repository';

interface EditQuestionUseCaseRequest {
  questionId: string;
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>;

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    questionId,
    authorId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId);
    const questionAttachmentsList = new QuestionAttachmentList(
      currentQuestionAttachments,
    );

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      });
    });

    questionAttachmentsList.update(questionAttachments);

    question.attachments = questionAttachmentsList;
    question.title = title;
    question.content = content;

    await this.questionsRepository.save(question);

    return right({ question });
  }
}
