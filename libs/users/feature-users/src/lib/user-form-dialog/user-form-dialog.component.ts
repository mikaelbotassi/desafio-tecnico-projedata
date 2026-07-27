import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';

import {
  PHONE_TYPE_OPTIONS,
  PhoneType,
  User,
  UserPayload,
} from '@attus/users-data-access';
import { cpfValidator, phoneValidator } from '../validators/user.validators';

export interface UserFormDialogData {
  readonly user?: User;
}

@Component({
  selector: 'attus-user-form-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    NgxMaskDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormDialogComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogRef = inject<
    MatDialogRef<UserFormDialogComponent, UserPayload | undefined>
  >(MatDialogRef);

  readonly data = inject<UserFormDialogData>(MAT_DIALOG_DATA);
  readonly phoneTypes = PHONE_TYPE_OPTIONS;
  readonly isEditing = Boolean(this.data.user);

  readonly form = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(120),
    ]),
    email: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(160),
    ]),
    cpf: this.formBuilder.nonNullable.control('', [
      Validators.required,
      cpfValidator,
    ]),
    phone: this.formBuilder.nonNullable.control('', [
      Validators.required,
      phoneValidator,
    ]),
    phoneType: this.formBuilder.nonNullable.control<PhoneType>('MOBILE', [
      Validators.required,
    ]),
  });

  constructor() {
    const user = this.data.user;

    if (user) {
      this.form.setValue({
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        phone: user.phone,
        phoneType: user.phoneType,
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
