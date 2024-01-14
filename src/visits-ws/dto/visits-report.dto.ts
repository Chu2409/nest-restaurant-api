import { IsNumber, IsPositive, Max, Min } from 'class-validator';
import { MONTHS } from '../../common/data/date.data';

export class VisitsByMonthDto {
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

export interface DayVisitsByMonthResponse {
  [day: number]: number;
}

export const getDaysBase = (month: number): DayVisitsByMonthResponse => {
  const visitsByMonth: DayVisitsByMonthResponse = {};
  const days = MONTHS.find((m) => m.id === month).days;

  for (let i = 1; i <= days; i++) {
    visitsByMonth[i] = 0;
  }

  return visitsByMonth;
};

export class VisitsByYearDto {
  @IsNumber()
  @IsPositive()
  @Min(2020)
  @Max(2030)
  year: number;
}

export interface MonthVisitsByYearResponse {
  [month: number]: number;
}

export const getMonthsBase = (): MonthVisitsByYearResponse => {
  const visitsByYear: MonthVisitsByYearResponse = {};

  for (let i = 1; i <= 12; i++) {
    visitsByYear[i] = 0;
  }

  return visitsByYear;
};
