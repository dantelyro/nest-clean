import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment';
import { StudentFactory } from 'test/factories/make-student';

describe('Get Questions by slug (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'question 01',
    });

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: 'attachment 01',
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    });

    const response = await request(app.getHttpServer())
      .get('/questions/question-01')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: 'question 01',
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: 'attachment 01',
          }),
        ],
      }),
    });
  });
});
