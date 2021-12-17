import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { DataService } from 'src/app/services/data.service';
import * as apiList from 'src/app/shared/constants/apis-list';
import * as constantList from 'src/app/shared/constants/constant-list';
import * as routeList from 'src/app/shared/constants/routes-list';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent implements OnInit {

  userId: number;
  form: FormGroup;
  user: User;
  addOnBlur = true;
  public pageIdParam: any = 'id';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  accounts: any[] = [];
  image: any = { img: 'assets/images/designer.jpg', file: null };
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Pakistan, CountryISO.SaudiArabia];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.buildForm();
  }

  ngOnInit() {
    if (this.isEditMode() != null) {
      this.route?.data.subscribe((data: any) => {
        this.user = Object.assign({}, data?.data);
        this.userId = this.user.id;
        this.user.image ? this.image.img = this.user?.image : null;
        this.accounts = this.user?.accounts;
        this.form.patchValue({
          firstName: this.user?.firstName,
          lastName: this.user?.lastName,
          email: this.user?.email,
          contactNo: this.user?.contactNo,
          gender: this.user?.gender,
          accounts: this.user?.accounts,
          address: {
            street: this.user?.address?.street,
            city: this.user?.address?.city,
            country: this.user?.address?.country,
            zipCode: this.user?.address?.zipCode,
          }
        });
        this.form.updateValueAndValidity();
      });
    }
  }

  isEditMode(param: string = this.pageIdParam): string | null {
    return this.route.snapshot.paramMap.get(param);
  }

  onImageSelected($event: any) {
    if ($event.target.files.length === 0) return;
    const file = $event.target.files[0];
    var reader = new FileReader(); // Image upload
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      if (_event) {
        this.image.file = reader?.result?.toString();

        // this.image.file = _event?.target?.result;
        this.image.img = reader?.result?.toString();
      }
    }

  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.accounts.push(value);
    }
    this.form.controls['accounts'].setValue(this.accounts);
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(account: any): void {
    const index = this.accounts.indexOf(account);
    if (index >= 0) {
      this.accounts.splice(index, 1);
    }
    this.form.controls['accounts'].setValue(this.accounts);
  }


  /* Handle form errors */
  // public errorHandling = (control: string, error: string) => {
  //   return this.form.controls[control].hasError(error);
  // }

  submit() {
    if (this.form.valid) {
      if (this.image.file) {
        this.form.controls['image'].setValue(this.image.file);
      }
      this.user = Object.assign({}, this.form.value);
      if (this.form.controls['contactNo']) {
        this.user['contactNo'] = this.form.controls['contactNo'].value.internationalNumber
      }

      if (this.isEditMode() == null) {
        this.user['personalId'] = this.generateId();
        this.dataService.fetchData({
          apiUrl: apiList.USER_BASE_URL,
          method: 'POST',
          contentType: 'application/json',
          params: undefined,
          body: this.user
        }).pipe(map(response => { return response }),
        ).subscribe(() => {
          this._snackBar.open('User created succesfully.', 'Created', { duration: 2000 });
          this.router.navigateByUrl(routeList.USERS_LISTING);
        });
      } else {

        this.dataService.fetchData({
          apiUrl: apiList.USER_UPDATE.replace('{id}', this.userId.toString()),
          method: 'PUT',
          contentType: 'application/json',
          params: undefined,
          body: this.user
        }).pipe(map(response => { return response }),
        ).subscribe(() => {
          this._snackBar.open('User updated succesfully.', 'Updated', { duration: 2000 });
          this.router.navigateByUrl(routeList.USERS_LISTING);
        });

      }

    } else {
      this.form.markAllAsTouched();
      this._snackBar.open('Please fill in the required fields.', 'Error', { duration: 2000 });
    }

  }

  generateId() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 11; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  buildForm() {
    this.form = this.fb.group({
      image: [null],
      firstName: ['', [Validators.required, Validators.maxLength(60)]],
      lastName: ['', [Validators.required, Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.pattern(constantList.REGEX_EMAIL_ADDRESS)]],
      contactNo: [null, Validators.required],
      gender: ['male', Validators.required],
      accounts: [],
      address: this.fb.group({ // Nested Group
        street: [''],
        city: [''],
        country: [''],
        zipCode: [''],
      }),
    });
  }

}
