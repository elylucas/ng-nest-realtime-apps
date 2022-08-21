import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EchoGateway } from './echo.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EchoGateway],
})
export class AppModule {}
