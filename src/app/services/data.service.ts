import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  fetchData({ apiUrl, method = 'POST', contentType = 'application/json', params = new HttpParams(), body = null, responseType = null }: {
    apiUrl: string, method?: string, contentType?: string, params?: HttpParams, body?: any, accept?: any, responseType?: any
  }): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', contentType).append('Accept', '*/*');
    const options: { headers?: HttpHeaders, params?: HttpParams, body?: any, responseType?: 'json' } = { headers, params, body, responseType };
    return this.httpClient.request(method, apiUrl, options).pipe(map((response: any) => {
      return response
    }), shareReplay());
  }

  uploadFile(method = 'POST', url: string, formData: any): Observable<any> {
    const req = new HttpRequest(method, url, formData);
    return this.httpClient.request(req).pipe(map((response: any) => { return response }));
  }

}
