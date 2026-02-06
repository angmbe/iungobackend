import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatamasterModule } from './datamaster/datamaster.module';
import { ReceiptModule } from './receipt/receipt.module';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [UsersModule, DatamasterModule, ReceiptModule, InventoryModule, SalesModule],
})
export class AppModule {}
