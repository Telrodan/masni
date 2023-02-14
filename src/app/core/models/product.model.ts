export class Product {
  public id: string;
  public name: string;
  public images: string[];
  public description: string;
  public price: number;

  constructor(
    id: string,
    name: string,
    images: string[],
    description: string,
    price: number
  ) {
    this.id = id;
    this.name = name;
    this.images = images;
    this.description = description;
    this.price = price;
  }

  public static fromDTO(productResult: any): Product {
    return new Product(
      productResult._id,
      productResult.name,
      productResult.images,
      productResult.description,
      productResult.price
    );
  }
}
