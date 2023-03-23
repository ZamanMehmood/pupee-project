import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dtos/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Post('/')
  async createProduct(@Body() body: CreateProductDto) {
    const product = await this.productService.create(body.name);
    return product;
  }

  @Put('/')
  async updateProduct(@Body() body: UpdateProductDto) {
    const updatedProduct = await this.productService.update(body);
    return updatedProduct;
  }

  @Get('/')
  async getAllProducts() {
    const products = await this.productService.getAllProducts();
    return products;
  }
}
