import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../product/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create({
      title: createOrderDto.title,
      description: createOrderDto.description,

      date: createOrderDto.date ? new Date(createOrderDto.date) : new Date(),
    });
    const savedOrder = await this.ordersRepository.save(order);

    if (createOrderDto.products && createOrderDto.products.length > 0) {
      const products = createOrderDto.products.map((productData) => {
        const product = this.productsRepository.create({
          ...productData,
          serialNumber: parseInt(productData.serialNumber),
          orderId: savedOrder.id,
        });
        return product;
      });

      await this.productsRepository.save(products);
    }

    return await this.findOne(savedOrder.id);
  }

  async findAll(): Promise<Order[]> {
    return await this.ordersRepository.find({
      where: { deleted: false },
      relations: ['products'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id, deleted: false },
      relations: ['products'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    Object.assign(order, updateOrderDto);
    return await this.ordersRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);

    if (order.products && order.products.length > 0) {
      await this.productsRepository.remove(order.products);
    }

    await this.ordersRepository.remove(order);
  }

  async restore(id: number): Promise<Order> {
    await this.ordersRepository.update(id, { deleted: false });
    return await this.findOne(id);
  }

  async findDeleted(): Promise<Order[]> {
    return await this.ordersRepository.find({
      where: { deleted: true },
      relations: ['products'],
      order: { updatedAt: 'DESC' },
    });
  }
}
