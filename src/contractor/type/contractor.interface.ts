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
