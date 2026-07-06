import { Contact } from '@/types';

const firstNamesEN = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Lisa', 'Daniel', 'Nancy',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Steven', 'Ashley',
  'Andrew', 'Dorothy', 'Paul', 'Kimberly', 'Joshua', 'Emily', 'Kenneth', 'Donna',
];

const firstNamesTH = [
  'สมชาย', 'สมหญิง', 'สุริยา', 'วิภา', 'ประเสริฐ', 'สุดา', 'วิชัย', 'นิภา',
  'ชาญ', 'พิมพ์', 'อนันต์', 'จันทร์', 'สมศักดิ์', 'รัตนา', 'ธนา', 'สมปอง',
  'กิตติ', 'วราภรณ์', 'อภิชาติ', 'นฤมล',
];

const lastNamesEN = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
];

const lastNamesTH = [
  'ใจดี', 'มีสุข', 'ทองคำ', 'สุขสม', 'รักไทย', 'วงศ์ใหญ่', 'ศรีสุข', 'พงษ์พันธ์',
  'แสงจันทร์', 'ดีมาก', 'สว่าง', 'เจริญ', 'มั่นคง', 'พรชัย', 'กล้าหาญ',
];

export function generateContacts(count: number): Contact[] {
  const contacts: Contact[] = [];
  const allFirstNames = [...firstNamesEN, ...firstNamesTH];
  const allLastNames = [...lastNamesEN, ...lastNamesTH];

  for (let i = 0; i < count; i++) {
    contacts.push({
      id: `contact-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 9)}`,
      firstName: allFirstNames[Math.floor(Math.random() * allFirstNames.length)],
      lastName: allLastNames[Math.floor(Math.random() * allLastNames.length)],
      age: Math.floor(Math.random() * 60) + 18,
    });
  }

  return contacts;
}
