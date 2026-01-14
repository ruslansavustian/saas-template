import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { Role } from './user/role.entity';
import { OrdersModule } from './order/orders.module';
import { ProductsModule } from './product/product.module';
import { Product } from './product/product.entity';
import { Order } from './order/order.entity';
import { AppWebSocketGateway } from './websocket/websocket.gateway';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Role, Product, Order],
      synchronize: process.env.NODE_ENV !== 'production',
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      extra: {
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
      },
    }),
    AuthModule,
    OrdersModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppWebSocketGateway],
})
export class AppModule {}
