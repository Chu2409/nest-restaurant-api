import {
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
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
}
