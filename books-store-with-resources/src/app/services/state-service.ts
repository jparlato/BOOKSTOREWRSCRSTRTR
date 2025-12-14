import { Injectable, resource, signal } from '@angular/core';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  readonly #apiBase = 'http://localhost:3000/api/books';
  readonly #wsbase = 's://localhost:3000/ws';

  #keyword = signal<string>('the');

  #searchResult = resource({
    params: () => ({keyword: this.#keyword()}),
    loader: (options) => this.#searchKeywordPromise(options.params.keyword),
    defaultValue: [] as Book[]
  });

  get searchResult() {
    return this.#searchResult.asReadonly();
  }

  get keyword() {
    return this.#keyword.asReadonly();
  }

  setKeyword(value: string) {
    console.log('Setting keyword to ', value);
    this.#keyword.set(value);
  }

  #searchKeywordPromise(value: string): Promise<Book[]> {
    return fetch(`${this.#apiBase}/search?q=${value}`).then(res => res.json());
  } 

  constructor() { }
}
