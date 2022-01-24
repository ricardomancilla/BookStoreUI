import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgSortableHeader, SortEvent } from '@app/_helpers/sortable.directive';
import { Book } from '@app/_models/book';
import { BookSearchService } from '@app/_services/book-search.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'search-book',
  templateUrl: './search-book.component.html',
  styleUrls: ['./search-book.component.scss']
})
export class SearchBookComponent implements OnInit {
  books$: Observable<Book[]>;
  total$: Observable<number>;

  @ViewChildren(NgSortableHeader) headers!: QueryList<NgSortableHeader>;

  constructor(public bookSearchService: BookSearchService) {
    this.books$ = bookSearchService.booksResult$;
    this.total$ = bookSearchService.total$;
  }

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.bookSearchService.sortColumn = column;
    this.bookSearchService.sortDirection = direction;
  }

  ngOnInit(): void {
    this.bookSearchService._refreshData();
  }

}
