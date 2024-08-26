import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { CreateQuestionDto } from './dto/question.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('question')
  @UseGuards(AuthGuard())
  async askToGPT(@Body() createQuestionDto:CreateQuestionDto) {
    return this.openaiService.askToGPT(createQuestionDto);
  }

}
