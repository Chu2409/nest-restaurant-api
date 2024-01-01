export class CreateMasterOrderDto {
  visitId: number;
  products: { productId: number; quantity: number }[];
}
