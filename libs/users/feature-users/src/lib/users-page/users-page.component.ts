import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { filter, startWith } from 'rxjs';

import {
  User,
  UserPayload,
  UsersStore,
} from '@attus/users-data-access';
import { UserCardComponent } from '../user-card/user-card.component';
import {
  UserFormDialogComponent,
  UserFormDialogData,
} from '../user-form-dialog/user-form-dialog.component';

function isUserPayload(
  payload: UserPayload | undefined,
): payload is UserPayload {
  return payload !== undefined;
}

@Component({
  selector: 'attus-users-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    UserCardComponent,
  ],
  providers: [UsersStore],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPageComponent {
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackBar = inject(MatSnackBar);

  readonly store = inject(UsersStore);
  readonly pageSizeOptions = [6, 12, 24];
  readonly searchControl = new FormControl('', { nonNullable: true });

  constructor() {
    this.store.setSearchTerm(
      this.searchControl.valueChanges.pipe(
        startWith(this.searchControl.value),
      ),
    );

    effect(() => {
      const feedback = this.store.feedback();

      if (feedback) {
        this.snackBar.open(feedback, 'Fechar', {
          duration: 3500,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      }
    });
  }

  createUser(): void {
    this.openUserDialog();
  }

  editUser(user: User): void {
    this.openUserDialog(user);
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  retry(): void {
    this.store.loadUsers();
  }

  pageChanged(event: PageEvent): void {
    this.store.setPage({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }

  private openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open<
      UserFormDialogComponent,
      UserFormDialogData,
      UserPayload | undefined
    >(UserFormDialogComponent, {
      width: '640px',
      maxWidth: '96vw',
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      data: { user },
    });

    dialogRef
      .afterClosed()
      .pipe(filter(isUserPayload), takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        this.store.saveUser({
          id: user?.id,
          payload,
        });
      });
  }
}
