export interface ProductIngredientResponseDto {
  name: string;
  quantity: number;
  unit: string;
  emissionCO2eInKg: number | null;
  emissionFactor: number | null;
}

export class ProductResponseDto {
  id: number;
  name: string;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  totalCarbonFootprint: number | null;
  breakdown: ProductIngredientResponseDto[] | null;
  createdAt: Date;
}