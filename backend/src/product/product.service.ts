import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return await this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { deleted: false },
      relations: ['order'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id, deleted: false },
      relations: ['order'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);
    return await this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    product.deleted = true;
    await this.productsRepository.save(product);
  }

  async restore(id: number): Promise<Product> {
    await this.productsRepository.update(id, { deleted: false });
    return await this.findOne(id);
  }

  async findDeleted(): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { deleted: true },
      order: { updatedAt: 'DESC' },
    });
  }

  async hardRemove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  async findByType(type: string): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { type, deleted: false },
      relations: ['order'],
      order: { createdAt: 'DESC' },
    });
  }

  async findBySerialNumber(serialNumber: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { serialNumber, deleted: false },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with serial number ${serialNumber} not found`,
      );
    }

    return product;
  }
}
