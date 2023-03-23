import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorResponse, successResponse } from '../utils/response';
import { UpdateProductDto } from './dtos/create-product.dto';
import { ProductDocument } from './models/products.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('products')
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(name: string) {
    const newProduct = new this.productModel({ name });
    const saveProduct = await newProduct.save();
    return successResponse(200, 'User created', saveProduct);
  }

  async update(payload: UpdateProductDto) {
    const product: any = await this.productModel.findById(payload.product_id);
    if (product) {
      product.name = payload.name || product.name;
      await product.save();
      return successResponse(200, 'Product Updated', product);
    } else {
      return errorResponse(404, 'Product not found');
    }
  }

  async getAllProducts() {
    const products = await this.productModel.find({});
    if (products) {
      return successResponse(200, 'Products', products);
    } else {
      return errorResponse(404, 'Products not found');
    }
  }
}
