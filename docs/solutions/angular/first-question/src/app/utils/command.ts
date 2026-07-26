import { DestroyRef, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, finalize } from 'rxjs';

abstract class Command<T> {

  private readonly destroyRef = inject(DestroyRef);

  private readonly _running = signal(false);
  private readonly _value = signal<T | null>(null);
  private readonly _error = signal<Error | null>(null);

  readonly running = this._running.asReadonly();
  readonly value = this._value.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasError = computed(() => this._error() !== null);
  readonly hasValue = computed(() => this._value() !== null);

  protected executeAction(action: () => Observable<T>): void {

    if (this._running()) {
      return;
    }

    this._running.set(true);
    this._error.set(null);
    this._value.set(null);

    action()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this._running.set(false))
      )
      .subscribe({
        next: result => {
          this._value.set(result);
        },
        error: error => {
          this._error.set(
            error instanceof Error
              ? error
              : new Error(String(error))
          );
        }
      });
  }

  reset(): void {
    this._value.set(null);
    this._error.set(null);
  }
}


export class Command0<T> extends Command<T> {

  constructor(
    private readonly action: () => Observable<T>
  ) {
    super();
  }

  execute(): void {
    this.executeAction(this.action);
  }
}


export class Command1<T, A> extends Command<T> {

  constructor(
    private readonly action: (arg: A) => Observable<T>
  ) {
    super();
  }

  execute(arg: A): void {
    this.executeAction(() => this.action(arg));
  }
}