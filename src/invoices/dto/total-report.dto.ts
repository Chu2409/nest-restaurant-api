import { IsNumber, IsPositive, Max, Min } from 'class-validator';
import { MONTHS } from '../../common/data/date.data';

export class DaysTotalByMonthDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  @IsPositive()
  @Min(2020)
  @Max(2030)
  year: number;
}

export interface DayTotalByMonthResponse {
  [day: number]: number;
}

export const getDaysBase = (month: number): DayTotalByMonthResponse => {
  const totalByMonth: DayTotalByMonthResponse = {};
  const days = MONTHS.find((m) => m.id === month).days;

  for (let i = 1; i <= days; i++) {
    totalByMonth[i] = 0;
  }

  return totalByMonth;
};

export class MonthsTotalByYearDto {
  @IsNumber()
  @IsPositive()
  @Min(2020)
  @Max(2030)
  year: number;
}

export interface MonthTotalByYearResponse {
  [month: number]: number;
}

export const getMonthsBase = (): MonthTotalByYearResponse => {
  const totalByYear: MonthTotalByYearResponse = {};

  for (let i = 1; i <= 12; i++) {
    totalByYear[i] = 0;
  }

  return totalByYear;
};
