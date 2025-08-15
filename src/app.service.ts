import { Injectable, Logger } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';

@Injectable()
export class AppService {
  constructor(private readonly eventEmitter: EventEmitter2) { }
  private readonly logger = new Logger(AppService.name);
  getHello(): string {
    return 'Hello World!';
  }

  createUser(body: CreateUserRequest) {
    this.logger.log(`Creating user with email: ${body.email}`, body);
    const userId = '1';
    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(userId, body.email),
    );
  }

  @OnEvent('user.created')
  sendWelcomeEmail(event: UserCreatedEvent) {
    this.logger.log(`Welcoming new user: ${event.email}`, event);
  }

  @OnEvent('user.created', { async: true })
  async sendWelcomeGift(event: UserCreatedEvent) {
    this.logger.log(`Sending welcome gift to: ${event.email}`);
    // Simulate async operation - we wait 3 seconds before sending the gift
    await new Promise((resolve) => setTimeout(resolve, 3000));
    this.logger.log(`Welcome gift sent to: ${event.email}`);
  }
}
