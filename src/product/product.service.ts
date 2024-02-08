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
   * It will create the grocery item.
   * @param createProductDto
   * @returns ProductEntity
   */
  async createProdct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productEntityRepository.save(createProductDto);
  }

  /**
   * It will return all the grocery items.
   * @returns ProductEntity[]
   */
  findAllProduct(): Promise<ProductEntity[]> {
    return this.productEntityRepository.find();
  }

  /**
   * It will update the grocery item by product id.
   * @param productId
   * @param updateDto
   * @returns ProductEntity
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
   * It will delete grocery item by product id.
   * @param productId
   * @returns
   */
  removeProduct(productId: number): Promise<{ affected?: number }> {
    return this.productEntityRepository.delete(productId);
  }

  /**
   * It will return all available grocery items 
   * @returns ProductEntity[]
   */
  viewAvailableProduct(): Promise<ProductEntity[]> {
    return this.productEntityRepository.findBy({ inventory: MoreThan(0) });
  }

  /**
   * It will validate product ids are valid or not. if valid, it will return true otherwise false.
   * @param productIds 
   * @returns boolean true | false
   */
  async isValidateProductIds(productIds: number[]): Promise<boolean> {
    const count = await this.productEntityRepository.countBy({
      productId: In(productIds),
    });
    if (count === productIds.length) return true;
    else return false;
  }
}
