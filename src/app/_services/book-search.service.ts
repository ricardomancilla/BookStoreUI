import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject, switchMap, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Book } from '../_models/book';
import { BookSearchResult } from '@app/_models/book-search-result';
import { sort, SortColumn, SortDirection, State } from '@app/_helpers';

@Injectable({ providedIn: 'root' })
export class BookSearchService {
    private _bookStoreApi: string = `${environment.bookStoreApi}/BookStore`;
    private _isLoading$ = new BehaviorSubject<boolean>(false);
    private _search$ = new Subject<void>();
    private _booksResult$ = new BehaviorSubject<Book[]>([]);
    private _total$ = new BehaviorSubject<number>(0);

    private _state: State = {
        page: 1,
        pageSize: 10,
        searchTerm: '',
        sortColumn: '',
        sortDirection: ''
    };

    constructor(
        private http: HttpClient) {
        this._search$
            .pipe(
                tap(() => this._isLoading$.next(true)),
                switchMap(() => this._getBooks()),
                switchMap(booksResult => this._search(booksResult)),
                tap(() => this._isLoading$.next(false))
            ).subscribe(result => {
                this._booksResult$.next(result.books);
                this._total$.next(result.total);
            });
    }

    get booksResult$() { return this._booksResult$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get isLoading$() { return this._isLoading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }
    get searchTerm() { return this._state.searchTerm; }

    set page(page: number) { this._set({ page }); }
    set pageSize(pageSize: number) { this._set({ pageSize }); }
    set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
    set sortColumn(sortColumn: SortColumn) { this._set({ sortColumn }); }
    set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    _refreshData() {
        this._search$.next();
    }

    _getBooks(): Observable<Book[]> {
        // return this.http.get<Book[]>(`${this._bookStoreApi}`);
        var bookResult: Book[] = [
            { id: 1, authorName: 'Evelin', genre: 'Drama', pages: 1000, publisher: 'Luis', title: 'El drama de Eve', year: 2022 },
            { id: 2, authorName: 'Luis', genre: 'Comedia', pages: 500, publisher: 'Evelin', title: 'La comedia de Luis', year: 2021 },
        ];
        return of<Book[]>(bookResult);
    }

    private _search(books: Book[]): Observable<BookSearchResult> {
        const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

        books = sort(books, sortColumn, sortDirection);
        
        books = books.filter(book => this.matches(book, searchTerm));
        const total = books.length;

        books = books.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of<BookSearchResult>({ books, total });
    }

    private matches(book: Book, term: string) {
        return book.authorName.toLowerCase().includes(term.toLowerCase())
            || book.title.toLowerCase().includes(term.toLowerCase())
            || book.year.toString().includes(term);
    }
}