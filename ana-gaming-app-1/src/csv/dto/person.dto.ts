import { IsInt, IsNotEmpty, IsString, Matches } from 'class-validator';

export class PersonDto {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}$/, { message: 'state must be two uppercase letters' })
  state: string;
}
