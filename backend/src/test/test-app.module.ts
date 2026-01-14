import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { AuthModule } from '../auth/auth.module';

import { OrdersModule } from '../order/orders.module';
import { ProductsModule } from '../product/product.module';

import { AppWebSocketGateway } from '../websocket/websocket.gateway';
import { testDatabaseConfig } from './test-database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    testDatabaseConfig,
    AuthModule,
    OrdersModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppWebSocketGateway],
})
export class TestAppModule {}
