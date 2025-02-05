import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

export class CommentWithAuthorPresenter {
  static toHTTP(commentwithAuthor: CommentWithAuthor) {
    return {
      commentId: commentwithAuthor.commentId.toString(),
      authorId: commentwithAuthor.authorId.toString(),
      authorName: commentwithAuthor.author,
      content: commentwithAuthor.content,
      updatedAt: commentwithAuthor.updatedAt,
      createdAt: commentwithAuthor.createdAt,
    };
  }
}
