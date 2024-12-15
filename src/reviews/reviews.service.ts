import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DtoActionsReview } from './dto/reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async getReviewsUser(userId: string) {
    const reviews = await this.prisma.contractorsReviews.findMany({
      where: {
        userId: userId,
      },
    });

    return reviews;
  }

  async getReviewById(reviewId: number) {
    console.log(reviewId);
    const reviews = await this.prisma.contractorsReviews.findUnique({
      where: {
        id: reviewId,
      },
    });

    return reviews;
  }

  async getReviewСheck(userId: string, contractorId: number) {
    console.log(userId, contractorId);
    const check = await this.prisma.contractorsReviews.findFirst({
      where: {
        userId: userId,
        contractorsId: +contractorId,
      },
    });

    return {
      review: check?.id,
      createAt: check?.createdAt,
    };
  }

  async editReview(reviewId: number, dto: DtoActionsReview) {
    const editReview = await this.prisma.contractorsReviews.update({
      where: {
        id: reviewId,
      },
      data: {
        typeWork: dto.typeWork,
        gradeTotal: dto.gradeTotal,
        gradeQuality: dto.gradeQuality,
        gradeMaterials: dto.gradeMaterials,
        gradePrice: dto.gradePrice,
        gradeExperience: dto.gradeExperience,
        gradeDeadlines: dto.gradeDeadlines,
        gradeCommunication: dto.gradeCommunication,
        descDignity: dto.descDignity,
        descFlaws: dto.descFlaws,
        descReview: dto.descReview,
        images: dto.images,
      },
    });

    return editReview;
  }

  async createReview(userId: string, contractorId: number, dto: DtoActionsReview) {
    const createReview = await this.prisma.contractorsReviews.create({
      data: {
        userId: userId,
        contractorsId: contractorId,
        typeWork: dto.typeWork,
        gradeTotal: dto.gradeTotal,
        gradeQuality: dto.gradeQuality,
        gradeMaterials: dto.gradeMaterials,
        gradePrice: dto.gradePrice,
        gradeExperience: dto.gradeExperience,
        gradeDeadlines: dto.gradeDeadlines,
        gradeCommunication: dto.gradeCommunication,
        descDignity: dto.descDignity,
        descFlaws: dto.descFlaws,
        descReview: dto.descReview,
        images: dto.images,
      },
    });

    return createReview;
  }

  async deleteReview(reviewId: number) {
    const deleteReview = await this.prisma.contractorsReviews.delete({
      where: {
        id: reviewId,
      },
    });

    return deleteReview;
  }
}
