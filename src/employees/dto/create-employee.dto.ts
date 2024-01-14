import {
  IsEmail,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { EMPLOYEE_ROLE_ENUM } from '../../common/enums/employee-role.enum';

export class CreateEmployeeDto {
  @IsNumberString()
  @Length(10, 10)
  id: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  secondName?: string;

  @IsString()
  @MinLength(2)
  firstLastName: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  secondLastName?: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumberString()
  @Length(10, 10)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  address?: string;

  @IsString()
  @MinLength(4)
  user: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsEnum(EMPLOYEE_ROLE_ENUM)
  role: EMPLOYEE_ROLE_ENUM;
}
