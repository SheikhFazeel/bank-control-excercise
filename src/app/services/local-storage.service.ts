import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // @ts-ignore
  setDataInLocalStorage({ key, value }) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getDataInLocalStorage(key: string) {
    const item = localStorage.getItem(key);
    if (item && item != "undefined") {
      return JSON.parse(item);
    }
    return null;
  }

  removeDataInLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  remove(key: string): void {
    this.removeDataInLocalStorage(key);
  }

  get(key: string): any {
    return this.getDataInLocalStorage(key);
  }

  // @ts-ignore
  set({ key, value }): void {
    this.setDataInLocalStorage({ key, value });
  }

  clearDataInLocalStorage() {
    localStorage.clear();
  }

  getLocalStorageLength() {
    return localStorage.length;
  }

}
