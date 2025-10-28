import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export interface ProductIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface IngredientBreakdown {
  name: string;
  quantity: number;
  unit: string;
  emissionCO2eInKg: number | null;
  emissionFactor: number | null;
}

@Entity("products")
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    type: "jsonb",
    nullable: false,
  })
  ingredients: ProductIngredient[];

  @Column({
    type: "float",
    nullable: true,
  })
  totalCarbonFootprint: number | null;

  @Column({
    type: "jsonb",
    nullable: true,
  })
  breakdown: IngredientBreakdown[] | null;

  @CreateDateColumn()
  createdAt: Date;

  constructor(props?: {
    name: string;
    ingredients: ProductIngredient[];
    totalCarbonFootprint: number | null;
    breakdown: IngredientBreakdown[] | null;
  }) {
    super();
    
    if (props) {
      this.name = props.name;
      this.ingredients = props.ingredients;
      this.totalCarbonFootprint = props.totalCarbonFootprint;
      this.breakdown = props.breakdown;
    }
  }
}