import { Notification } from '../../enterprise/entities/notification';

export interface NotificationsRepository {
  findById(id: string): Promise<Notification | undefined>;
  create(notification: Notification): Promise<void>;
  save(notification: Notification): Promise<void>;
}
