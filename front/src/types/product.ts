export interface ProductIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface IngredientBreakdown {
  name: string;
  quantity: number;
  unit: string;
  emissionFactor: number | null;
  emissionCO2eInKg: number | null;
}

export interface Product {
  id: number;
  name: string;
  ingredients: ProductIngredient[];
  totalCarbonFootprint: number | null;
  breakdown: IngredientBreakdown[] | null;
  createdAt: string;
}