import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../order/order.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unique: true })
  serialNumber: number;

  @Column({ type: 'boolean', default: true })
  isNew: boolean;

  @Column({ type: 'text', nullable: true })
  photo: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 100 })
  type: string;

  @Column({ type: 'text', nullable: true })
  specification: string;

  @Column({ type: 'jsonb', nullable: true })
  guarantee: { start: string; end: string };

  @Column({ type: 'jsonb' })
  price: Array<{ value: number; symbol: string; isDefault: boolean }>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Order, (order) => order.products, { nullable: true })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ type: 'int', nullable: true })
  orderId: number;
}
