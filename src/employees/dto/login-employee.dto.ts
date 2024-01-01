import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginEmployeeDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  user: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  password: string;
}
