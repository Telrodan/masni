import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Place, PostcodeApiData } from '@core/models/postcode-api-data.model';

import { Observable, map } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostcodeApiService {
  constructor(private http: HttpClient) {}

  getPostcodeInformation$(postcode: number): Observable<Place> {
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': environment.zippopotamusApiKey,
      'X-RapidAPI-Host': 'community-zippopotamus.p.rapidapi.com'
    });

    return this.http
      .get<PostcodeApiData>(
        `https://community-zippopotamus.p.rapidapi.com/hu/${postcode}`,
        {
          headers
        }
      )
      .pipe(map((postcodeDTO) => postcodeDTO.places[0]));
  }
}
