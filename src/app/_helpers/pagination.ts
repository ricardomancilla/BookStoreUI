import { Book } from "@app/_models/book";
import { SortColumn, SortDirection } from "./sortable.directive";

export interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: SortColumn;
    sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export function sort(list: Book[], column: SortColumn, direction: string): Book[] {
    if (direction === '' || column === '') {
        return list;
    } else {
        return [...list].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}
