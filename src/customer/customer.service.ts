import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { DressType } from 'src/dress/entities/dressType.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}
  create(createCustomerDto: CreateCustomerDto) {
    return this.customerRepository.save(createCustomerDto);
  }

  findAll(dressType: DressType) {
    // if (dresstype && !Object.values(DressEnum).includes(dresstype)) {
    //   throw new BadRequestException('DressType Not Found');
    // }
    const costomer = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.user', 'user')
      .leftJoinAndSelect('customer.tailor', 'tailor')
      .leftJoinAndSelect('tailor.user', 'tailorUser');
    // if (dresstype)
    //   return costomer
    //     .where('customer.dresstype = :dresstype', { dresstype })
    //     .getMany();
    return costomer.getMany();
    // return this.customerRepository.query(`SELECT * FROM Customer customer LEFT Join User user ON customer.id = user.id`)
    // return this.customerRepository
    //   .createQueryBuilder('customer')
    //   // .leftJoinAndSelect('customer.user', 'user')
    //   // .orderBy(
    //   //   `(case when "customer"."dresstype" = "embroidery" then 1 when customer.dresstype = "sarhi" then 2 when customer.dresstype = "lehnga" then 3 else null end)`,
    //   // )
    //   .orderBy(`(CASE WHEN customer.dresstype = simple THEN 1 ELSE 2)`)
    //   .getMany();
    // return this.customerRepository.find({
    //   order: {
    //     dresstype : `CASE WHEN customer.dresstype = simple THEN 1 ELSE 2`
    //   },
    //   relations: ['user'],
    // });
  }

  async findCustomerByOwner(tailor: number) {
    // return await this.customerRepository
    //   .createQueryBuilder('customer')
    //   .where('customer.owner = :ownerId', { ownerId: owner })
    //   .leftJoinAndSelect('customer.owner', 'owner')
    //   .getMany();
    return await this.customerRepository.find({
      where: {
        tailor: {
          id: tailor,
        },
      },
      relations: ['user', 'tailor'],
    });
  }

  findAndSelectIds() {
    return this.customerRepository.find({ select: { id: true } });
  }

  async findCustomersAndDress(tailor: number) {
    return await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.user', 'user')
      .leftJoinAndSelect('customer.dress', 'customerDress')
      .leftJoinAndSelect('customerDress.customer', 'customerDressCustomer')
      .leftJoinAndSelect(
        'customerDressCustomer.user',
        'customerDressCustomerUser',
      )
      .leftJoinAndSelect('customerDress.tailor', 'customerDressTailor')
      .leftJoinAndSelect('customerDressTailor.user', 'tailorUser')
      .leftJoin('customer.tailor', 'customerTailor')
      .where('customerTailor.id = :customerTailorId', {
        customerTailorId: tailor,
      })

      .where('customerDressTailor.id = :dressTailorId', {
        dressTailorId: tailor,
      })
      .getMany();
    // return await this.customerRepository.find({
    //   where: {
    //     tailor: {
    //       id: owner,
    //     },
    //     dress: {
    //       tailor: {
    //         id: owner,
    //       },
    //     },
    //   },

    //   relations: {
    //     user: true,
    //     dress: {
    //       customer: {
    //         user: true,
    //       },
    //       tailor: {
    //         user: true,
    //       },
    //     },
    //   },
    // });
  }

  findOne(id: number) {
    return this.customerRepository.findOne({ where: { id } });
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }

  async removeAll() {
    const customersIds = await this.findAndSelectIds();
    return await this.customerRepository.remove(customersIds);
  }
}
