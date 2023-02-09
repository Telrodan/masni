export class User {
  public id: string;
  public name: string;
  public phone: string;
  public password: string;
  public passwordConfirm: string;
  public street: string;
  public city: string;
  public postalcode: number;
  public county: string;

  constructor(
    id: string,
    name: string,
    phone: string,
    password: string,
    passwordConfirm: string,
    street: string,
    city: string,
    postalcode: number,
    county: string
  ) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.password = password;
    this.passwordConfirm = passwordConfirm;
    this.street = street;
    this.city = city;
    this.postalcode = postalcode;
    this.county = county;
  }
}
