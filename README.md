# BankControlPanel

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Description

Imagine writing a small banking control panel, where we can view details, add, delete, update or delete users.
Admin user should be able to add users, filter them, or sort. The user list should come with paging.
- Filtering and paging parameters should be saved in URL query so he does not lose any data when the admin refreshes.
- Admin should see the last 3 search parameters as suggestions.
- View details should be a separate page, and Id should be part of the URL.


The user fields should be following:

Email, First name, Last name, Personal Id, Profile photo, Mobile number, Sex (Male, Female), Address with subfields( Country, City, Street, Zip Code), Account (Account can be added as many as necessary)

### Validations:
Email: Should be required and email format.
First name: Should be required and less than 60 characters. 
Last name: Should be required and less than 60 characters.
Mobile number: Should be correct format with country code (you can use some library as well).
Personal id: Should be required and it should be exactly 11 characters.
Sex: Should be required.
Accounts: At least one account is required.

