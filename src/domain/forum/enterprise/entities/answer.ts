import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import dayjs from 'dayjs';
import { AnswerCreatedEvent } from '../events/answer-created-event';
import { AnswerAttachmentList } from './answer-attachment-list';

export interface AnswerProps {
  authorId: UniqueEntityID;
  questionId: UniqueEntityID;
  content: string;
  attachments: AnswerAttachmentList;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Answer extends AggregateRoot<AnswerProps> {
  get content() {
    return this.props.content;
  }

  get authorId() {
    return this.props.authorId;
  }

  get questionId() {
    return this.props.questionId;
  }

  get attachments() {
    return this.props.attachments ?? new AnswerAttachmentList();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isNew() {
    return dayjs().diff(this.props.createdAt, 'day') <= 3;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  get excerpt() {
    return this.props.content.slice(0, 100).trimEnd().concat('...');
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  set content(value: string) {
    this.props.content = value;
    this.touch();
  }

  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityID,
  ): Answer {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    const isNewAnswer = !id;

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer));
    }

    return answer;
  }
}
