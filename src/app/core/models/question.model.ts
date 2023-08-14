export interface Option {
  option: string;
  extraPrice: number;
  slug: string;
}

export interface Question {
  id?: string;
  questionName: string;
  question: string;
  options: Option[];
}
