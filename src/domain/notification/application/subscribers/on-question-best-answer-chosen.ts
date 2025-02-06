import { DomainEvents } from '@/core/events/domain-events';
import { EventHandler } from '@/core/events/event-handler';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event';
import { SendNotificationUseCase } from '../use-cases/send-notification';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OnBestQuestionAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      OnBestQuestionAnswerChosen.name,
    );
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: 'Your answer was chosen as the best answer!',
        content: `Your answer to the question "${question.title.substring(0, 20).concat('...')}" was chosen as the best answer, by the author.`,
      });
    }
  }
}
