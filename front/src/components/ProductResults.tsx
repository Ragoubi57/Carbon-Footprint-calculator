"use client";

interface IngredientBreakdown {
  name: string;
  quantity: number;
  unit: string;
  emissionFactor: number | null;
  emissionCO2eInKg: number | null;
}

interface Product {
  id: number;
  name: string;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  totalCarbonFootprint: number | null;
  breakdown: IngredientBreakdown[] | null;
  createdAt: string;
}

interface ProductResultsProps {
  product: Product;
}

export default function ProductResults({ product }: ProductResultsProps) {
  const formatNumber = (num: number) => num.toFixed(4);

  if (product.totalCarbonFootprint === null) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Calculation Failed
        </h3>
        <p className="text-red-700">
          Unable to calculate carbon footprint for "{product.name}". 
          One or more ingredients do not have matching emission factors in the database.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500">
          Calculated on {new Date(product.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Total Carbon Footprint</p>
          <p className="text-4xl font-bold text-green-700">
            {formatNumber(product.totalCarbonFootprint)}
          </p>
          <p className="text-sm text-gray-600 mt-1">kg CO2e</p>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Carbon Source Breakdown
        </h4>
        <div className="space-y-3">
          {product.breakdown?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item.quantity} {item.unit} × {formatNumber(item.emissionFactor || 0)} kg CO2e/{item.unit}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatNumber(item.emissionCO2eInKg || 0)}
                </p>
                <p className="text-xs text-gray-500">kg CO2e</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {product.breakdown && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Ingredients</p>
              <p className="font-semibold text-gray-900">
                {product.breakdown.length}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Average per ingredient</p>
              <p className="font-semibold text-gray-900">
                {formatNumber(product.totalCarbonFootprint / product.breakdown.length)} kg CO2e
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}