import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('categories')
export class Category {
  @PrimaryColumn({
    name: 'id',
    type: 'smallint',
  })
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: '100',
  })
  name: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: '100',
    nullable: true,
  })
  description?: string;

  @OneToMany(() => Product, (product) => product.category)
  products?: Product[];
}
