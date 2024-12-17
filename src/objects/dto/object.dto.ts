interface IActionsObject {
  usersId: string;
  name: string;
  address: string;
  status: number;
  footage: number;
  rooms: number;
  budget: number;
  type: string;
  squareKitchen: number;
  squareLived: number;
  floor: string;
  finishing: string;
  gallery: string;
  desc: string;
}

interface DtoCreateReport {
  gallery: string;
  title: string;
  desc: string;
  result: string;
  author: string;
}

export type { IActionsObject, DtoCreateReport };
