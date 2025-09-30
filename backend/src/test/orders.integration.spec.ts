/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestAppModule } from './test-app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../order/order.entity';
import { Product } from '../product/product.entity';
import { Repository } from 'typeorm';

interface OrderResponse {
  id: number;
  title: string;
  description: string;
  date: string;
  products?: ProductResponse[];
}

interface ProductResponse {
  id: number;
  serialNumber: string;
  title: string;
  type: string;
  specification?: string;
  isNew?: boolean;
  price: Array<{
    value: number;
    symbol: string;
    isDefault: boolean;
  }>;
}

describe('Orders Integration Tests', () => {
  let app: INestApplication;
  let httpServer: any;
  let orderRepository: Repository<Order>;
  let productRepository: Repository<Product>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();

    orderRepository = moduleFixture.get<Repository<Order>>(
      getRepositoryToken(Order),
    );
    productRepository = moduleFixture.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await productRepository.query('DELETE FROM products');
    await orderRepository.query('DELETE FROM orders');
  });

  it('should create and retrieve orders', async () => {
    const orderData = {
      title: 'Test Order',
      description: 'Test order description',
      date: '2024-01-15T10:00:00Z',
    };

    await request(httpServer).post('/orders').send(orderData).expect(201);

    const getResponse = await request(httpServer).get('/orders').expect(200);

    const orders = getResponse.body as OrderResponse[];
    expect(orders).toHaveLength(1);
    expect(orders[0].title).toBe(orderData.title);
    expect(orders[0].description).toBe(orderData.description);
  });

  it('should delete an order', async () => {
    const orderData = {
      title: 'Test Order to Delete',
      description: 'This order will be deleted',
      date: '2024-01-15T10:00:00Z',
    };

    const createResponse = await request(httpServer)
      .post('/orders')
      .send(orderData)
      .expect(201);

    const orderId = (createResponse.body as OrderResponse).id;

    await request(httpServer).delete(`/orders/${orderId}`).expect(200);

    await request(httpServer).get(`/orders/${orderId}`).expect(404);
  });

  it('should get a single order by id', async () => {
    const orderData = {
      title: 'Single Order Test',
      description: 'Testing single order retrieval',
      date: '2024-01-15T10:00:00Z',
    };

    const createResponse = await request(httpServer)
      .post('/orders')
      .send(orderData)
      .expect(201);

    const orderId = (createResponse.body as OrderResponse).id;

    const getResponse = await request(httpServer)
      .get(`/orders/${orderId}`)
      .expect(200);

    const order = getResponse.body as OrderResponse;
    expect(order.title).toBe(orderData.title);
    expect(order.description).toBe(orderData.description);
    expect(order.id).toBe(orderId);
  });

  it('should update an order', async () => {
    const orderData = {
      title: 'Original Order',
      description: 'Original description',
      date: '2024-01-15T10:00:00Z',
    };

    const createResponse = await request(httpServer)
      .post('/orders')
      .send(orderData)
      .expect(201);

    const orderId = (createResponse.body as OrderResponse).id;

    const updateData = {
      title: 'Updated Order',
      description: 'Updated description',
    };

    const updateResponse = await request(httpServer)
      .patch(`/orders/${orderId}`)
      .send(updateData)
      .expect(200);

    const updatedOrder = updateResponse.body as OrderResponse;
    expect(updatedOrder.title).toBe(updateData.title);
    expect(updatedOrder.description).toBe(updateData.description);
  });

  it('should create an order with products', async () => {
    const orderData = {
      title: 'Order with Products',
      description: 'Testing order with products',
      date: '2024-01-15T10:00:00Z',
      products: [
        {
          serialNumber: '12345',
          title: 'Test Product 1',
          type: 'Electronics',
          specification: 'High quality',
          isNew: true,
          price: [
            {
              value: 100,
              symbol: 'USD',
              isDefault: true,
            },
          ],
        },
        {
          serialNumber: '67890',
          title: 'Test Product 2',
          type: 'Accessories',
          price: [
            {
              value: 50,
              symbol: 'USD',
              isDefault: true,
            },
          ],
        },
      ],
    };

    const createResponse = await request(httpServer)
      .post('/orders')
      .send(orderData)
      .expect(201);

    const orderWithProducts = createResponse.body as OrderResponse;
    expect(orderWithProducts.title).toBe(orderData.title);
    expect(orderWithProducts.products).toHaveLength(2);
    expect(orderWithProducts.products![0].title).toBe('Test Product 1');
    expect(orderWithProducts.products![1].title).toBe('Test Product 2');
  });

  it('should return 404 for non-existent order', async () => {
    await request(httpServer).get('/orders/99999').expect(404);
  });

  it('should return empty array when no orders exist', async () => {
    const getResponse = await request(httpServer).get('/orders').expect(200);

    const orders = getResponse.body as OrderResponse[];
    expect(orders).toHaveLength(0);
  });
});
