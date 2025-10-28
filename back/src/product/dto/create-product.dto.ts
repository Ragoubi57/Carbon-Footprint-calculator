export interface CreateProductIngredientDto {
  name: string;
  quantity: number;
  unit: string;
}

export class CreateProductDto {
  name: string;
  ingredients: CreateProductIngredientDto[];
}