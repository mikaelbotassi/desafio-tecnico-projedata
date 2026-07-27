import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
  PhoneType,
  User,
  UserForm,
  UserPayload,
} from '@attus/users-data-access';
import { cpfValidator, phoneValidator } from '../validators/user.validators';
import { email, form, FormField, FormRoot, maxLength, minLength, required } from '@angular/forms/signals';

export interface UserFormDialogData {
  readonly user?: User;
}

@Component({
  selector: 'attus-user-form-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    NgxMaskDirective,
    FormField,
    FormRoot
  ],
  templateUrl: './user-form-dialog.component.html',
  styleUrl: './user-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormDialogComponent {
  private readonly dialogRef = inject<
    MatDialogRef<UserFormDialogComponent, UserPayload | undefined>
  >(MatDialogRef);

  readonly data = inject<UserFormDialogData>(MAT_DIALOG_DATA);
  readonly phoneTypes = PhoneType.values;
  readonly isEditing = Boolean(this.data.user);

  readonly formModel = signal<UserForm>({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    phoneType: PhoneType.MOBILE
  });

  readonly form = form(this.formModel, (path) => {
    //Name Validators
    required(path.name, {message:'O nome é obrigatório.'});
    minLength(path.name, 3, {message: 'O nome deve ter mais de 3 caracteres.'});
    maxLength(path.name, 120, {message: 'O nome deve ter no máximo 4 caracteres.'});
    //Email validators
    required(path.email, {message: 'O Email é obrigatório.'});
    email(path.email, {message: 'Digite um Email válido.'});
    maxLength(path.email,160, {message: 'O Campo Email deve ter no máximo 160 caracteres.'});
    //CPF Validators
    required(path.cpf, {message: 'O CPF é obrigatório.'});
    cpfValidator(path.cpf);
    //Phone Validators
    required(path.phone, {message: 'O Telefone é obrigatório.'});
    phoneValidator(path.phone);
    //Phone Type Validators
    required(path.phoneType, {message: 'O Tipo de telefone é obrigatório'});
  },{submission: {
    // onInvalid: (field, details) => {
    //   this.form().markAsTouched();
    //   return;
    // },
    action: async (field) => {
      this.dialogRef.close(this.form().value());
    }
  }});

  constructor() {
    const user = this.data.user;

    if (user) {
      this.formModel.set({
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        phone: user.phone,
        phoneType: user.phoneType,
      });
    }
  }

  submit(): void {
    if(this.form().invalid()){
      this.form().markAsTouched();
      return;
    }
    this.dialogRef.close(this.form().value());
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
