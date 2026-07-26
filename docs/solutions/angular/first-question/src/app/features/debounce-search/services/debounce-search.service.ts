import { Injectable } from '@angular/core';
import { 
  BehaviorSubject,
  catchError,
  delay,
  finalize,
  Observable,
  of,
  switchMap
} from 'rxjs';

export interface Pessoa {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class DebounceSearchService {

  private readonly data: Pessoa[] = [
    { id: 1, name: 'Igor' },
    { id: 2, name: 'Maria' },
    { id: 3, name: 'João' },
    { id: 4, name: 'Ana' },
  ];


  private readonly pessoasSubject =
    new BehaviorSubject<Pessoa[]>([]);

  private readonly loadingSubject =
    new BehaviorSubject(false);

  private readonly errorSubject =
    new BehaviorSubject(false);


  readonly pessoas$ =
    this.pessoasSubject.asObservable();

  readonly loading$ =
    this.loadingSubject.asObservable();

  readonly error$ =
    this.errorSubject.asObservable();


  search(search: string): Observable<Pessoa[]> {

    this.loadingSubject.next(true);
    this.errorSubject.next(false);


    return this.getSmartSearchValues(search)
      .pipe(

        finalize(() => {
          this.loadingSubject.next(false);
        }),

        catchError(() => {
          this.errorSubject.next(true);
          return of([]);
        })

      );

  }


  updateResult(result: Pessoa[]): void {
    this.pessoasSubject.next(result);
  }


  reset(): void {
    this.pessoasSubject.next([]);
    this.errorSubject.next(false);
  }


  private getSmartSearchValues(search: string): Observable<Pessoa[]> {

    const filteredData = this.data.filter(pessoa =>
      pessoa.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );


    return of(filteredData).pipe(
      delay(500)
    );
  }

}