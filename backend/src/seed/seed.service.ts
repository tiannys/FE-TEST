import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ContactsService } from '../contacts/contacts.service';

const THAI_FIRST_NAMES = [
  'สมชาย', 'สมหญิง', 'นิภา', 'วิชัย', 'อภิชาติ', 'กิตติ', 'สุรีย์', 'วราภรณ์',
  'ประเสริฐ', 'สุนทร', 'พิชัย', 'อรุณ', 'ศิริ', 'มานะ', 'วิไล',
];
const ENGLISH_FIRST_NAMES = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael',
  'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Thomas',
];
const THAI_LAST_NAMES = [
  'สุขใจ', 'มั่นคง', 'พงษ์พันธ์', 'ดีมาก', 'รักชาติ', 'ศรีสุข',
  'วงศ์สวัสดิ์', 'ใจดี', 'สว่างจิตร', 'เจริญสุข',
];
const ENGLISH_LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
];

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private usersService: UsersService,
    private contactsService: ContactsService,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const count = await this.usersService.countUsers();
    if (count > 0) {
      this.logger.log('Database already seeded, skipping...');
      return;
    }

    this.logger.log('🌱 Seeding default admin user...');

    const admin = await this.usersService.create({
      email: 'admin@contactapp.com',
      password: 'P@ssw0rd',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    });

    this.logger.log(`✅ Admin created: admin@contactapp.com / P@ssw0rd`);

    // Generate 100 random contacts
    const contacts: { firstName: string; lastName: string; age: number }[] = [];
    const allFirstNames = [...THAI_FIRST_NAMES, ...ENGLISH_FIRST_NAMES];
    const allLastNames = [...THAI_LAST_NAMES, ...ENGLISH_LAST_NAMES];

    for (let i = 0; i < 100; i++) {
      contacts.push({
        firstName: allFirstNames[Math.floor(Math.random() * allFirstNames.length)],
        lastName: allLastNames[Math.floor(Math.random() * allLastNames.length)],
        age: Math.floor(Math.random() * 60) + 18,
      });
    }

    await this.contactsService.createMany(contacts, admin._id.toString());
    this.logger.log(`✅ Seeded 100 random contacts for admin`);
  }
}
