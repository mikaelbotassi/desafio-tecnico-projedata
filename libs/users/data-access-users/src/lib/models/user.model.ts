export class PhoneType{
  
  private constructor(public readonly value:string, public readonly label:string){}
  
  static MOBILE:PhoneType = new PhoneType('MOBILE','Celular');
  static HOME:PhoneType = new PhoneType('HOME','Residencial');
  static WORK:PhoneType = new PhoneType('WORK','Comercial');

  static values:PhoneType[] = [this.MOBILE,this.HOME,this.WORK];

}

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

export interface UserForm{
  name:string;
  email:string;
  cpf:string;
  phone:string;
  phoneType:PhoneType
}
