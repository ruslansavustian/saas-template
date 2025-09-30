# Тесты для Frontend

## Структура тестов

```
__tests__/
├── setup.ts                    # Настройка тестовой среды
├── mocks/
│   ├── product-mocks.ts        # Моки для продуктов
│   ├── order-mocks.ts          # Моки для ордеров
│   └── request-mock.ts         # Мок для HTTP запросов
├── redux/
│   └── slices/
│       ├── product-slice.test.ts  # Тесты для создания продуктов
│       └── order-slice.test.ts    # Тесты для создания ордеров
└── README.md                   # Документация тестов
```

## Запуск тестов

```bash
# Запуск всех тестов
npm test

# Запуск тестов в режиме наблюдения
npm run test:watch

# Запуск тестов с покрытием
npm run test:coverage
```

## Что тестируется

### Product Slice Tests

- ✅ **Initial State** - проверка начального состояния
- ✅ **createProduct.pending** - состояние загрузки при создании
- ✅ **createProduct.fulfilled** - успешное создание продукта
- ✅ **createProduct.rejected** - обработка ошибок создания
- ✅ **API Integration** - проверка вызовов API
- ✅ **fetchProducts** - получение списка продуктов
- ✅ **Reducers** - clearErrorProducts, setProducts
- ✅ **Integration Tests** - полный цикл создания продукта

### Order Slice Tests

- ✅ **Initial State** - проверка начального состояния
- ✅ **createOrder.pending** - состояние загрузки при создании
- ✅ **createOrder.fulfilled** - успешное создание ордера
- ✅ **createOrder.rejected** - обработка ошибок создания
- ✅ **fetchOrders** - получение списка ордеров
- ✅ **updateOrder** - обновление ордера
- ✅ **deleteOrder** - удаление ордера
- ✅ **Reducers** - clearErrorOrders, setOrders
- ✅ **Integration Tests** - полные циклы CRUD операций

## Покрытие тестами

Тесты покрывают:

- **Redux Async Thunks** - все асинхронные действия
- **Redux Reducers** - синхронные действия
- **API Integration** - мокирование HTTP запросов
- **Error Handling** - обработка ошибок
- **State Management** - управление состоянием

## Моки

### Вынесенные моки:

- `__tests__/mocks/product-mocks.ts` - моки для продуктов
- `__tests__/mocks/order-mocks.ts` - моки для ордеров
- `__tests__/mocks/request-mock.ts` - мок для HTTP запросов

### Автоматические моки:

- `@/utils/request` - HTTP клиент
- `next/navigation` - Next.js роутер
- `next-intl` - интернационализация

## Примеры использования

### Тестирование создания продукта

```typescript
it("should create product successfully", async () => {
  const mockProductData: CreateProductDto = {
    title: "Test Product",
    type: "Electronics",
    price: [{ value: 100, symbol: "USD", isDefault: true }],
  };

  mockRequest.post.mockResolvedValueOnce({ data: mockCreatedProduct });

  const result = await store.dispatch(createProduct(mockProductData));

  expect(result.type).toBe("product/createProduct/fulfilled");
  expect(store.getState().products.products).toHaveLength(1);
});
```

### Тестирование создания ордера

```typescript
it("should create order successfully", async () => {
  const mockOrderData: CreateOrderDto = {
    title: "Test Order",
    description: "Test description",
    products: [
      /* ... */
    ],
  };

  mockRequest.post.mockResolvedValueOnce({ data: mockCreatedOrder });

  const result = await store.dispatch(createOrder(mockOrderData));

  expect(result.type).toBe("order/createOrder/fulfilled");
  expect(store.getState().orders.orders).toHaveLength(1);
});
```

## Настройка Jest

Конфигурация Jest находится в `jest.config.js`:

- Настройка Next.js
- Алиасы путей (`@/`)
- Покрытие кода
- Игнорирование файлов

## Зависимости

- `@testing-library/jest-dom` - дополнительные матчеры
- `@testing-library/react` - тестирование React компонентов
- `@testing-library/user-event` - симуляция пользовательских действий
- `jest` - тестовый фреймворк
- `@types/jest` - типы для Jest
