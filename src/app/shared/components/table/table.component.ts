import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})


export class TableComponent implements OnInit {

  searchValue: string;
  tableData: any[];

  @Input() tableColumns: any[] = [];
  private eventsSubscription: Subscription;
  @Input() eventsSub: Observable<any>;
  @Input() requestBody: any = {};
  @Input() endPointConfiguration: { url: string; endpoint: string; method: string; contentType: string } = { url: '', endpoint: '', method: 'POST', contentType: 'application/json' };

  @Output() checkboxCheckedUpdated: EventEmitter<any> = new EventEmitter<any>();
  @Output() clickedOnRow: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectedUsersCount: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchQuery: EventEmitter<any> = new EventEmitter<any>();

  // displayedColumns: string[] = ['select', 'name', 'progress', 'fruit'];
  public displayedColumns: string[];
  dataSource: MatTableDataSource<User>;
  selection = new SelectionModel<User>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    const columnNames = this.tableColumns.map((tableColumn: any) => tableColumn.value);
    this.displayedColumns = ['select', ...columnNames]
    this.loadResource();
    this.eventsSubscription = this.eventsSub.subscribe((action) => {
      if (action.origin == 'users') {
        this.searchValue = action.value;
        this.applyFilter(this.searchValue);
      } else if (action.origin == 'delete-users') {
        this.loadResource();
        this.selection.clear();
      }
    });
  }


  ngAfterViewInit() {
  }

  applyFilter(value: string) {
    this.router.navigate([], { relativeTo: this.route.parent, queryParams: { search: value }, queryParamsHandling: 'merge' }); // remove to replace all query params by provided
    this.dataSource.filter = value.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection?.selected?.length;
    const numRows = this.dataSource?.data?.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: User): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  getSelected(selectedRows: any) {
    this.selectedUsersCount.emit({ selectedRows: selectedRows });
  }

  searchValueUpdate() {
    this.searchQuery.emit({ search: this.searchValue ? this.searchValue : '' });
  }

  onClickedRow(item: any): void {
    this.clickedOnRow.emit(item);
  }

  loadResource() {
    this.dataService.fetchData({
      apiUrl: this.endPointConfiguration.url,
      method: this.endPointConfiguration.method,
      contentType: this.endPointConfiguration.contentType,
      params: undefined,
      body: null
    }).pipe(
      map(response => {
        return response;
      }),
    ).subscribe((resource: any) => {
      if (resource) {
        this.tableData = resource;
        this.dataSource = new MatTableDataSource(resource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (data: any, filter) => {
          const dataStr = JSON.stringify(data).toLowerCase();
          return dataStr.indexOf(filter) != -1;
        }
        this.route.queryParams.subscribe((param) => {
          if (param.search) {
            this.searchValue = param.search;
            this.applyFilter(this.searchValue);
            this.searchValueUpdate();
          }
          if (param.page) {
            this.paginator.pageIndex = param.page;
          }
        });
      }
    });

  }

  sortTable(sortParameters: Sort) {
    // defining name of data property, to sort by, instead of column name
    sortParameters.active = this.tableColumns.find(column => column.value === sortParameters.active).key;
    const keyName = sortParameters.active;
    if (sortParameters.direction === 'asc') {
      this.tableData = this.tableData.sort((a: any, b: any) => a[keyName].localeCompare(b[keyName]));
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else if (sortParameters.direction === 'desc') {
      this.tableData = this.tableData.sort((a: any, b: any) => b[keyName].localeCompare(a[keyName]));
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      this.loadResource();
    }

  }

  pageChange(event: any) {
    this.router.navigate([], { relativeTo: this.route.parent, queryParams: { page: event.pageIndex }, queryParamsHandling: 'merge' }); // remove to replace all query params by provided
  }

  ngOnDestroy(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }
}
