import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [OpenaiController],
  providers: [OpenaiService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Question]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ]
})
export class OpenaiModule {}
