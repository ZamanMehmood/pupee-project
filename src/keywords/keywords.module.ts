import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KeywordsController } from './keywords.controller';
import { KeywordsService } from './keywords.service';
import { KeywordSchema } from './models/keywords.models';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'keywords', schema: KeywordSchema }]),
  ],
  controllers: [KeywordsController],
  providers: [KeywordsService],
})
export class KeywordsModule {}
