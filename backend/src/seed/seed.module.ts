import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ContactsModule } from '../contacts/contacts.module';
import { SeedService } from './seed.service';

@Module({
  imports: [UsersModule, ContactsModule],
  providers: [SeedService],
})
export class SeedModule {}
