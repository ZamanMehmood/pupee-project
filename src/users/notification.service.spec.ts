import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {NotificationsService} from "./notifications.service";

describe('NotificationService', () => {
  let service:NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
