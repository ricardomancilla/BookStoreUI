import { Book } from "./book";

export interface BookSearchResult {
    books: Book[];
    total: number;
}