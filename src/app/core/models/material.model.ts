export class Material {
  public id: string;
  public name: string;
  public nameWithExtra: string;
  public category: string;
  public image?: string;
  public extra: number;

  constructor(
    id: string,
    name: string,
    nameWithExtra: string,
    category: string,
    image: string,
    extra: number
  ) {
    this.id = id;
    this.name = name;
    this.nameWithExtra = nameWithExtra;
    this.category = category;
    this.image = image;
    this.extra = extra;
  }

  public static fromDTO(materialResult: any): Material {
    return new Material(
      materialResult._id,
      materialResult.name,
      materialResult.name +
        (materialResult.extra > 0 ? ' +' + materialResult.extra + ' Ft' : ''),
      materialResult.category,
      materialResult.image,
      materialResult.extra
    );
  }
}
