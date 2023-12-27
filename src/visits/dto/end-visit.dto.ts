import { IsString, Length } from 'class-validator';

export class EndVisitDto {
  @IsString()
  @Length(10)
  customerId: string;
}
