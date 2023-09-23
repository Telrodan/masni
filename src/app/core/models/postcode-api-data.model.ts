export interface Place {
  'place name': string;
  state: string;
}

export interface PostcodeApiData {
  places: Place[];
}
