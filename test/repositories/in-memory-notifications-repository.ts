import { NotificationsRepository } from '@/domain/notification/application/repositories/notification-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = [];

  async findById(id: string): Promise<Notification | undefined> {
    const notification = this.items.find(
      (notification) => notification.id.toString() === id,
    );

    return notification;
  }

  async create(notification: Notification): Promise<void> {
    this.items.push(notification);
  }

  async save(notification: Notification): Promise<void> {
    const index = this.items.findIndex((item) => item.id === notification.id);

    this.items[index] = notification;
  }
}
