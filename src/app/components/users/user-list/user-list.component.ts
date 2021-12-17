import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith, tap } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import * as apiList from 'src/app/shared/constants/apis-list';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent {

  options: string[] = [];
  filteredOptions: Observable<string[]>;
  searchControl = new FormControl();
  selectedRecords: any[] = [];
  eventsSubject: Subject<any> = new Subject<any>();
  endPointConfiguration: any = { url: apiList.USER_BASE_URL, method: 'GET' };
  tableColumns: any;
  requestBody: any;
  searchValue: string;

  @ViewChild('input') input: ElementRef;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private localStorage: LocalStorageService
  ) {
    this.setTableConfigurationByLanguage();
  }

  ngOnInit() {
    if (this.localStorage.get('search') == null) {
      this.localStorage.set({ key: 'search', value: [] });
    }
    this.options = this.localStorage.get('search');
    this.filteredOptions = this.searchControl.valueChanges.pipe(startWith(''), map((value: string) => this._filter(value)));
  }

  ngAfterViewInit() {

    fromEvent(this.input.nativeElement, 'keyup').pipe(filter(Boolean), debounceTime(500), distinctUntilChanged(), tap(() => {
      this.searchValue = this.input.nativeElement.value;
      if (this.searchValue) {
        let value = [...this.localStorage.get('search').slice(Math.max(this.localStorage.get('search').length - 3, 0)), this.searchValue];
        this.localStorage.set({ key: 'search', value: [... new Set(value)] });
        this.options = this.localStorage.get('search');
      }
      this.eventsSubject.next({ origin: 'users', value: this.searchValue });
    })).subscribe();

  }

  setTableConfigurationByLanguage(tran?: any): void {
    this.tableColumns = [
      {
        key: 'image',
        value: 'Image',
        type: 'image',
        class: 'text-center',
        isSortable: false,
      },
      {
        key: 'firstName',
        value: 'First Name',
        type: 'text',
        class: 'text-capitalize',
        isSortable: true,
      },
      {
        key: 'lastName',
        value: 'Last Name',
        type: 'text',
        class: 'text-capitalize',
        isSortable: true,
      },
      {
        key: 'email',
        value: 'Email',
        type: 'text',
        class: '',
        isSortable: true,
      },
      {
        key: 'contactNo',
        value: 'Contact No',
        type: 'text',
        isSortable: true,
      },
      {
        key: 'gender',
        value: 'Gender',
        type: 'text',
        class: 'text-capitalize',
        isSortable: true,
      },
      {
        key: 'address.country',
        value: 'Country',
        type: 'text',
        class: 'text-capitalize',
        isSortable: false,
      },
    ];
  }

  onRowClicked(event: any): void {
    this.localStorage.remove('search');
    this.router.navigate([event.id], { relativeTo: this.route.parent }).then(() => null).catch(() => null);
  }

  selectedRows(rows: []) {
    this.selectedRecords = rows;
  }

  searchString(event: any) {
    this.searchValue = event.search;
  }

  getSelectedSearch(value: string) {
    this.searchValue = value;
    if (this.searchValue) {
      let value = [...this.localStorage.get('search').slice(Math.max(this.localStorage.get('search').length - 3, 0)), this.searchValue];
      this.localStorage.set({ key: 'search', value: [... new Set(value)] });
      this.options = this.localStorage.get('search');
    }
    this.eventsSubject.next({ origin: 'users', value: this.searchValue });
  }

  deleteUsers() {
    this.selectedRecords.forEach((row) => {
      this.dataService.fetchData({
        apiUrl: apiList.USER_DELETE.replace('{id}', row.id),
        method: 'DELETE',
        contentType: 'application/json',
        params: undefined,
        body: null
      }).pipe(map(response => { return response }),
      ).subscribe((resource: any) => {
      });
    });
    setTimeout(() => {
      this.eventsSubject.next({ origin: 'delete-users', value: this.selectedRecords });
    }, 500);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}
