import { ProductService } from "./product.service";
import { CarbonEmissionFactor } from "../carbonEmissionFactor/carbonEmissionFactor.entity";
import { CreateProductDto } from "./dto/create-product.dto";

describe("ProductService", () => {
  let service: ProductService;
  let mockEmissionFactors: CarbonEmissionFactor[];

  beforeEach(() => {
    service = new ProductService();

    mockEmissionFactors = [
      new CarbonEmissionFactor({
        name: "ham",
        unit: "kg",
        emissionCO2eInKgPerUnit: 0.11,
        source: "Agrybalise",
      }),
      new CarbonEmissionFactor({
        name: "cheese",
        unit: "kg",
        emissionCO2eInKgPerUnit: 0.12,
        source: "Agrybalise",
      }),
      new CarbonEmissionFactor({
        name: "tomato",
        unit: "kg",
        emissionCO2eInKgPerUnit: 0.13,
        source: "Agrybalise",
      }),
    ];
  });

  describe("calculateBreakdown", () => {
    it("should calculate breakdown for all matching ingredients", () => {
      const ingredients = [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "cheese", quantity: 0.15, unit: "kg" },
      ];

      const breakdown = (service as any).calculateBreakdown(
        ingredients,
        mockEmissionFactors
      );

      expect(breakdown).not.toBeNull();
      expect(breakdown).toHaveLength(2);
      expect(breakdown[0].emissionCO2eInKg).toBeCloseTo(0.011);
      expect(breakdown[1].emissionCO2eInKg).toBeCloseTo(0.018);
    });

    it("should return null when ingredient not found", () => {
      const ingredients = [
        { name: "ham", quantity: 0.1, unit: "kg" },
        { name: "chicken", quantity: 0.2, unit: "kg" },
      ];

      const breakdown = (service as any).calculateBreakdown(
        ingredients,
        mockEmissionFactors
      );

      expect(breakdown).toBeNull();
    });

    it("should convert grams to kilograms automatically", () => {
      const breakdown = service["calculateBreakdown"](
        [{ name: "ham", quantity: 100, unit: "g" }],
        mockEmissionFactors
      );

      expect(breakdown).not.toBeNull();
      expect(breakdown).toHaveLength(1);
      expect(breakdown![0].quantity).toBe(0.1);
      expect(breakdown![0].unit).toBe("kg");
      expect(breakdown![0].emissionCO2eInKg).toBeCloseTo(0.011);
    });

    it("should convert kilograms to grams if needed", () => {
      const gramsFactors = [
        {
          id: 1,
          name: "salt",
          unit: "g",
          emissionCO2eInKgPerUnit: 0.001,
          source: "test",
          createdAt: new Date(),
        },
      ];

      const breakdown = service["calculateBreakdown"](
        [{ name: "salt", quantity: 1, unit: "kg" }],
        gramsFactors as any
      );

      expect(breakdown).not.toBeNull();
      expect(breakdown).toHaveLength(1);
      expect(breakdown![0].quantity).toBe(1000);
      expect(breakdown![0].unit).toBe("g");
    });

    it("should convert milliliters to liters", () => {
      const litersFactors = [
        {
          id: 5,
          name: "water",
          unit: "L",
          emissionCO2eInKgPerUnit: 0.0001,
          source: "test",
          createdAt: new Date(),
        },
      ];

      const breakdown = service["calculateBreakdown"](
        [{ name: "water", quantity: 500, unit: "ml" }],
        litersFactors as any
      );

      expect(breakdown).not.toBeNull();
      expect(breakdown).toHaveLength(1);
      expect(breakdown![0].quantity).toBe(0.5);
      expect(breakdown![0].unit).toBe("L");
    });

    it("should return null for unsupported unit conversions", () => {
      const breakdown = service["calculateBreakdown"](
        [{ name: "ham", quantity: 100, unit: "lbs" }],
        mockEmissionFactors
      );

      expect(breakdown).toBeNull();
    });

    it("should handle empty ingredients array", () => {
      const ingredients: any[] = [];

      const breakdown = (service as any).calculateBreakdown(
        ingredients,
        mockEmissionFactors
      );

      expect(breakdown).toEqual([]);
    });
  });

  describe("calculateTotal", () => {
    it("should sum all emissions correctly", () => {
      const breakdown = [
        {
          name: "ham",
          quantity: 0.1,
          unit: "kg",
          emissionFactor: 0.11,
          emissionCO2eInKg: 0.011,
        },
        {
          name: "cheese",
          quantity: 0.15,
          unit: "kg",
          emissionFactor: 0.12,
          emissionCO2eInKg: 0.018,
        },
      ];

      const total = (service as any).calculateTotal(breakdown);

      expect(total).toBeCloseTo(0.029);
    });

    it("should return null when breakdown is null", () => {
      const total = (service as any).calculateTotal(null);

      expect(total).toBeNull();
    });

    it("should return 0 for empty breakdown", () => {
      const total = (service as any).calculateTotal([]);

      expect(total).toBe(0);
    });

    it("should handle zero emissions", () => {
      const breakdown = [
        {
          name: "water",
          quantity: 1,
          unit: "L",
          emissionFactor: 0,
          emissionCO2eInKg: 0,
        },
      ];

      const total = (service as any).calculateTotal(breakdown);

      expect(total).toBe(0);
    });
  });
});