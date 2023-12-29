import { Visit } from '../../visits/entities/visit.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('tables')
export class Table {
  @PrimaryColumn({
    name: 'id',
    type: 'smallint',
  })
  id: number;

  @Column({
    name: 'size',
    type: 'smallint',
  })
  size: number;

  @Column({
    name: 'availability',
    type: 'boolean',
    default: true,
  })
  availability: boolean;

  @OneToMany(() => Visit, (visit) => visit.table)
  visits: Visit[];
}
