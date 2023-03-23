import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchHistorySchema } from './models/search-history.model';
import { SearchHistoryController } from './search-history.controller';
import { SearchHistoryService } from './search-history.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'searchhistorys', schema: SearchHistorySchema },
    ]),
  ],
  controllers: [SearchHistoryController],
  providers: [SearchHistoryService],
})
export class SearchHistoryModule {}
