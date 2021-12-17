import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { DataService } from 'src/app/services/data.service';
import * as apiList from 'src/app/shared/constants/apis-list';

@Injectable()
export class UsersResolverService implements Resolve<any> {

  constructor(public dataService: DataService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const id = route.paramMap.get('id');
    return this.dataService.fetchData({ apiUrl: apiList.USER_BASE_URL + '/' + id, method: 'GET', contentType: 'application/json', params: undefined, body: null });
  }
}
