export interface DtoEditContractorInfo {
  legalName: string;
  name: string;
  typeCompany: string;
  mainCity: string;
  adress: string;
  countEmployees: number;
  phone: string;
  email: string;
  inn: string;
  descCompany: string;
}

export interface DtoActionServices {
  servicesName: string;
  servicesDesc: string;
  servicesUnit: string;
  servicesSalary: number;
}

export interface DtoActionPortfolio {
  name: string;
  type: string;
  rooms: number;
  category: string;
  footage: number;
  budget: number;
  time: string;
  desc: string;
  gallery: string;
  author: string;
}
