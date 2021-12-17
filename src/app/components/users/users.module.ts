import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MaterialModule } from 'src/app/modules/material.module';
import { DataService } from 'src/app/services/data.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DataGetterPipe } from 'src/app/shared/components/table/table-getter-pipe';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { UsersResolverService } from './users-resolver.service';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';

@NgModule({
  declarations: [UsersComponent, UserListComponent, UserFormComponent, TableComponent, DataGetterPipe],
  imports: [
    ReactiveFormsModule,
    UsersRoutingModule,
    CommonModule,
    MaterialModule,
    NgxIntlTelInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [UsersResolverService, DataService, LocalStorageService]
})

export class UsersModule { }
