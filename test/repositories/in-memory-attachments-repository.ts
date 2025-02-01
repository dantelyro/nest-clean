import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: any[] = [];

  async create(attachment: any): Promise<void> {
    this.items.push(attachment);
  }
}
