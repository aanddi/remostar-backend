import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Auth } from 'src/auth/decorators/auth.deorator';
import { DtoActionsReview } from './dto/reviews.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Auth()
  @Get('list/:id')
  async getReviewsUser(@Param('id') userId: string) {
    return this.reviewsService.getReviewsUser(userId);
  }

  @Auth()
  @Get('review/info/:id')
  async getReviewById(@Param('id') reviewId: string) {
    return this.reviewsService.getReviewById(+reviewId);
  }

  @Auth()
  @Get('review/check')
  async getReviewСheck(@Query('userId') userId: string, @Query('contractorId') contractorId: number) {
    return this.reviewsService.getReviewСheck(userId, contractorId);
  }

  @Auth()
  @Post('review/create')
  async createReview(
    @Query('userId') userId: string,
    @Query('contractorId') contractorId: number,
    @Body() dto: DtoActionsReview,
  ) {
    return this.reviewsService.createReview(userId, +contractorId, dto);
  }

  @Auth()
  @Put('review/:id/edit')
  async editReview(@Param('id') reviewId: string, @Body() dto: DtoActionsReview) {
    return this.reviewsService.editReview(+reviewId, dto);
  }

  @Auth()
  @Delete('review/:id/delete')
  async deleteReview(@Param('id') reviewId: string) {
    return this.reviewsService.deleteReview(+reviewId);
  }
}
