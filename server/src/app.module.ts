import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ChatService, ChatGateway],
})
export class AppModule {}
