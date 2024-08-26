import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateQuestionDto } from './dto/question.dto';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
    constructor(
        private readonly configService:ConfigService,
    ){ }

    private readonly openai = new OpenAI();

    async askToGPT(createQuestionDto: CreateQuestionDto){

        try {
            const { choices }  = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    {
                        role: "user",
                        content: createQuestionDto.question,
                    },
                ],
            });
            return choices[0].message.content;            

        } catch (error) {
            throw new ServiceUnavailableException(error)
        }        
    }
}
