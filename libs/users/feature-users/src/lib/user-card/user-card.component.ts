import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskPipe } from 'ngx-mask';

import {
  PhoneType,
  User,
} from '@attus/users-data-access';

@Component({
  selector: 'attus-user-card',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, NgxMaskPipe],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  readonly user = input.required<User>();
  readonly editRequested = output<User>();

  readonly initials = computed(() =>
    this.user()
      .name.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toLocaleUpperCase('pt-BR') ?? '')
      .join(''),
  );

  readonly phoneMask = computed(() =>
    this.user().phone.length === 11
      ? '(00) 00000-0000'
      : '(00) 0000-0000',
  );

  readonly phoneTypeLabel = computed(
    () =>
      PhoneType.values.find(
        (option) => option === this.user().phoneType,
      )?.label ?? 'Telefone',
  );

  requestEdit(): void {
    this.editRequested.emit(this.user());
  }
}
