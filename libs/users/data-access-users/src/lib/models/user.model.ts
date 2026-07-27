export type PhoneType = 'MOBILE' | 'HOME' | 'WORK';

export interface PhoneTypeOption {
  readonly value: PhoneType;
  readonly label: string;
}

export const PHONE_TYPE_OPTIONS: readonly PhoneTypeOption[] = [
  { value: 'MOBILE', label: 'Celular' },
  { value: 'HOME', label: 'Residencial' },
  { value: 'WORK', label: 'Comercial' },
];

export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly cpf: string;
  readonly phone: string;
  readonly phoneType: PhoneType;
}

export type UserPayload = Omit<User, 'id'>;

export interface SaveUserCommand {
  readonly id?: string;
  readonly payload: UserPayload;
}

export interface UsersPageChange {
  readonly pageIndex: number;
  readonly pageSize: number;
}
