"use client";

import { Product } from "@/types/product";

interface ProductListProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function ProductList({
  products,
  onSelectProduct,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <p className="text-gray-500">
          No products calculated yet. Create your first product above!
        </p>
      </div>
    );
  }

  const sortedProducts = [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Saved Products ({products.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {sortedProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{product.name}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(product.createdAt).toLocaleDateString()} at{" "}
                  {new Date(product.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                {product.totalCarbonFootprint !== null ? (
                  <>
                    <p className="text-lg font-semibold text-green-700">
                      {product.totalCarbonFootprint.toFixed(4)}
                    </p>
                    <p className="text-xs text-gray-500">kg CO2e</p>
                  </>
                ) : (
                  <p className="text-sm text-red-600 font-medium">Failed</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}