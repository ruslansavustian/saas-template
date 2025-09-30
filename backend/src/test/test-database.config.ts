import { TypeOrmModule } from '@nestjs/typeorm';

export const testDatabaseConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'test-database',
  port: 5432,
  username: 'test_user',
  password: 'test_password',
  database: 'test_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  dropSchema: true,
  logging: false,
  cache: false,
  extra: {
    max: 1,
    min: 0,
    idleTimeoutMillis: 1000,
  },
});
