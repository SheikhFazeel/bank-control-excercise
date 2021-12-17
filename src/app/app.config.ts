import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfig {

  config = {
    name: 'BankCMS',
    title: 'BANKCMS',
    version: '1.0.0',
    apiUrl: {
      backendUrl: 'http://localhost:3000/',
    },
  };

  constructor() {
  }

  getConfig(): any {
    return this.config;
  }
}

