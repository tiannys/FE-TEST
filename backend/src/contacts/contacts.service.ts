import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
  ) {}

  async create(
    dto: CreateContactDto,
    userId: string,
  ): Promise<ContactDocument> {
    const contact = new this.contactModel({
      ...dto,
      createdBy: new Types.ObjectId(userId),
    });
    return contact.save();
  }

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 20,
    search?: string,
  ): Promise<{ contacts: ContactDocument[]; total: number; page: number; totalPages: number }> {
    const filter: any = { createdBy: new Types.ObjectId(userId) };

    if (search && search.length >= 3) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
      ];
    }

    const total = await this.contactModel.countDocuments(filter).exec();
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const contacts = await this.contactModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return { contacts, total, page, totalPages };
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await this.contactModel
      .deleteOne({ _id: id, createdBy: new Types.ObjectId(userId) })
      .exec();
    return result.deletedCount > 0;
  }

  async createMany(
    contacts: { firstName: string; lastName: string; age: number }[],
    userId: string,
  ): Promise<void> {
    const docs = contacts.map((c) => ({
      ...c,
      createdBy: new Types.ObjectId(userId),
    }));
    await this.contactModel.insertMany(docs);
  }

  async countByUser(userId: string): Promise<number> {
    return this.contactModel
      .countDocuments({ createdBy: new Types.ObjectId(userId) })
      .exec();
  }
}
