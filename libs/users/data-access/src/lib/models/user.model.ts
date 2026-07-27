export type PhoneType = 'CELULAR' | 'RESIDENCIAL' | 'COMERCIAL';

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  phoneType: PhoneType;
}

export type UserPayload = Omit<User, 'id'>;

export interface SaveUserCommand {
  id?: string;
  payload: UserPayload;
}