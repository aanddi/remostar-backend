export interface IRibbonQuery {
  page: number;
  perPage: number;
  city: string;
  type?: string;
  veryfi?: string;
  tags?: string;
  sortPopularity: string;
  sortRating: string;
  sortSize: string;
}

export interface IReviewStatistics {
  gradeTotal: number;
  gradeQuality: number;
  gradeMaterials: number;
  gradePrice: number;
  gradeExperience: number;
  gradeDeadlines: number;
  gradeCommunication: number;
}


