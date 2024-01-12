export class CreateInvoiceDto {
  paymentMethod: PAYMENT_METHOD_ENUM;
  employeeId: string;
  visitId: number;
  customerId: string;
}
