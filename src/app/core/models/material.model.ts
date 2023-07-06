export interface Material {
  id?: string;
  name: string;
  nameWithExtra: string;
  category: string;
  image?: string;
  extra: number;
  isAvailable: boolean;
}
