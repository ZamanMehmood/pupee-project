import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from '../posts/posts.module';
import { PostsService } from '../posts/posts.service';
import { CustomReviewController } from './custom-review.controller';
import { CustomReviewService } from './custom-review.service';
import { CustomReviewsSchema } from './models/create-custom-model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'customreviews',
        schema: CustomReviewsSchema,
      },
    ]),
    PostsModule,
  ],
  controllers: [CustomReviewController],
  providers: [CustomReviewService],
})
export class CustomReviewModule {}
