import {
  Question as PrismaQuestion,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { PrismaAttachmentMapper } from './prisma-attachments-mapper';

type PrismaQuestionsDetails = PrismaQuestion & {
  author: PrismaUser;
  attachments: PrismaAttachment[];
};

export class PrismaQuestionsDetailsMapper {
  static toDomain(raw: PrismaQuestionsDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.authorId),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityID(raw.bestAnswerId)
        : undefined,
      slug: Slug.createFromText(raw.slug),
      title: raw.title,
      author: raw.author.name,
      content: raw.content,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      updatedAt: raw.updatedAt,
      createdAt: raw.createdAt,
    });
  }
}
