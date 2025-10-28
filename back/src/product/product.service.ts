import { dataSource } from "../../config/dataSource";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { Product, IngredientBreakdown } from "./product.entity";
import { CreateProductDto } from "./dto/create-product.dto";

export class ProductService {
  async calculateAndSave(createProductDto: CreateProductDto): Promise<Product> {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    const emissionFactorRepo = dataSource.getRepository(CarbonEmissionFactor);
    const allEmissionFactors = await emissionFactorRepo.find();

    const breakdown = this.calculateBreakdown(
      createProductDto.ingredients,
      allEmissionFactors
    );

    const totalCarbonFootprint = this.calculateTotal(breakdown);

    const product = new Product({
      name: createProductDto.name,
      ingredients: createProductDto.ingredients,
      totalCarbonFootprint,
      breakdown,
    });

    const productRepo = dataSource.getRepository(Product);
    return productRepo.save(product);
  }

  async findAll(): Promise<Product[]> {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    const productRepo = dataSource.getRepository(Product);
    return productRepo.find({ order: { createdAt: "DESC" } });
  }

  async findOne(id: number): Promise<Product | null> {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    const productRepo = dataSource.getRepository(Product);
    return productRepo.findOneBy({ id });
  }

  private convertToBaseUnit(
    quantity: number,
    fromUnit: string,
    toUnit: string
  ): number | null {
    if (fromUnit === toUnit) {
      return quantity;
    }

    const conversionMap: Record<string, Record<string, number>> = {
      g: { kg: 0.001 },
      kg: { g: 1000 },
      ml: { L: 0.001, l: 0.001 },
      L: { ml: 1000 },
      l: { ml: 1000 },
    };

    const conversionFactor = conversionMap[fromUnit]?.[toUnit];
    if (conversionFactor === undefined) {
      return null;
    }

    return quantity * conversionFactor;
  }

  private buildEmissionFactorIndex(
    emissionFactors: CarbonEmissionFactor[]
  ): Map<string, CarbonEmissionFactor> {
    const index = new Map<string, CarbonEmissionFactor>();
    
    for (const factor of emissionFactors) {
      const key = `${factor.name}:${factor.unit}`;
      index.set(key, factor);
    }
    
    return index;
  }

  private findEmissionFactor(
    ingredientName: string,
    ingredientUnit: string,
    index: Map<string, CarbonEmissionFactor>
  ): CarbonEmissionFactor | null {
    const exactKey = `${ingredientName}:${ingredientUnit}`;
    const exactMatch = index.get(exactKey);
    
    if (exactMatch) {
      return exactMatch;
    }
    
    for (const [key, factor] of index) {
      if (factor.name === ingredientName) {
        return factor;
      }
    }
    
    return null;
  }

  private calculateBreakdown(
    ingredients: CreateProductDto["ingredients"],
    emissionFactors: CarbonEmissionFactor[]
  ): IngredientBreakdown[] | null {
    const breakdown: IngredientBreakdown[] = [];
    const factorIndex = this.buildEmissionFactorIndex(emissionFactors);

    for (const ingredient of ingredients) {
      const ingredientName = ingredient.name.trim();
      const ingredientUnit = ingredient.unit.trim();

      const matchingFactor = this.findEmissionFactor(
        ingredientName,
        ingredientUnit,
        factorIndex
      );

      if (!matchingFactor) {
        return null;
      }

      let convertedQuantity = ingredient.quantity;
      let usedUnit = ingredientUnit;

      if (matchingFactor.unit !== ingredientUnit) {
        const converted = this.convertToBaseUnit(
          ingredient.quantity,
          ingredientUnit,
          matchingFactor.unit
        );

        if (converted === null) {
          return null;
        }

        convertedQuantity = converted;
        usedUnit = matchingFactor.unit;
      }

      const emissionCO2eInKg =
        convertedQuantity * matchingFactor.emissionCO2eInKgPerUnit;

      breakdown.push({
        name: ingredientName,
        quantity: convertedQuantity,
        unit: usedUnit,
        emissionFactor: matchingFactor.emissionCO2eInKgPerUnit,
        emissionCO2eInKg,
      });
    }

    return breakdown;
  }

  private calculateTotal(
    breakdown: IngredientBreakdown[] | null
  ): number | null {
    if (!breakdown) {
      return null;
    }

    return breakdown.reduce((sum, item) => {
      return sum + (item.emissionCO2eInKg || 0);
    }, 0);
  }
}