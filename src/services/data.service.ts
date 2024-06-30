import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getForecastByLatlng(
    latitude: any,
    longitude: any,
    start_date: string = '2024-04-23',
    end_date: string = '2024-04-23'
  ): Observable<any> {
    const apiURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=direct_radiation&timezone=Asia%2FSingapore&start_date=${start_date}&end_date=${end_date}`;

    return this.http.get(apiURL);
  }

  getLocaitons() {
    const apiURL =
      'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';
    return this.http.get(apiURL);
  }
}
