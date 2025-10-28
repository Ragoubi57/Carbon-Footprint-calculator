import { Body, Controller, Get, Path, Post, Route } from "tsoa";
import { Product } from "./product.entity";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";

@Route("products")
export class ProductController extends Controller {
  private readonly productService: ProductService;

  constructor() {
    super();
    this.productService = new ProductService();
  }

  @Post()
  public async createProduct(
    @Body() createProductDto: CreateProductDto
  ): Promise<Product> {
    console.log(
      `[products] [POST] Creating product: ${createProductDto.name} with ${createProductDto.ingredients.length} ingredients`
    );
    return this.productService.calculateAndSave(createProductDto);
  }

  @Get()
  public async getProducts(): Promise<Product[]> {
    console.log(`[products] [GET] Retrieving all products`);
    return this.productService.findAll();
  }

  @Get("{id}")
  public async getProduct(@Path() id: number): Promise<Product | null> {
    console.log(`[products] [GET] Retrieving product with id: ${id}`);
    return this.productService.findOne(id);
  }
}