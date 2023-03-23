import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userEmail } = request.session;

    if (userEmail) {
      const user = await this.usersService.findByEmail(userEmail);
      request.currentUser = user;
    }

    return handler.handle();
  }
}
