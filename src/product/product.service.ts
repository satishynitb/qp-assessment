import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productEntityRepository: Repository<ProductEntity>,
  ) { }

  /**
   *
   * @param createProductDto
   * @returns
   */
  async createProdct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productEntityRepository.save(createProductDto);
  }

  /**
   *
   * @returns
   */
  findAllProduct(): Promise<ProductEntity[]> {
    return this.productEntityRepository.find();
  }

  /**
   *
   * @param productId
   * @param updateDto
   * @returns
   */
  async updateProduct(
    productId: number,
    updateDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const prepareObject: UpdateProductDto = { productId };
    const record = await this.productEntityRepository.findOneBy({ productId });
    if (!record) throw new BadRequestException('Invalid productId.');
    if (updateDto?.productName)
      prepareObject.productName = updateDto.productName;
    if (updateDto?.uom) prepareObject.uom = updateDto.uom;
    if (updateDto.hasOwnProperty('pricePerUnit'))
      prepareObject.pricePerUnit = updateDto.pricePerUnit;
    if (updateDto.hasOwnProperty('inventory'))
      prepareObject.inventory = updateDto.inventory;
    if (updateDto?.updatedAt) prepareObject.updatedAt = updateDto.updatedAt;
    return this.productEntityRepository.save(prepareObject);
  }

  /**
   *
   * @param productId
   * @returns
   */
  removeProduct(productId: number): Promise<{ affected?: number }> {
    return this.productEntityRepository.delete(productId);
  }

  /**
   *
   * @returns
   */
  viewAvailableProduct(): Promise<ProductEntity[]> {
    return this.productEntityRepository.findBy({ inventory: MoreThan(0) });
  }

  async isValidateProductIds(productIds: number[]) {
    const count = await this.productEntityRepository.countBy({
      productId: In(productIds),
    });
    if (count === productIds.length) return true;
    else return false;
  }
}
