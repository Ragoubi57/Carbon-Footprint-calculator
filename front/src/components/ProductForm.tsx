"use client";

import { useState } from "react";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface ProductFormProps {
  onSubmit: (name: string, ingredients: Ingredient[]) => Promise<void>;
  isSubmitting: boolean;
}

export default function ProductForm({
  onSubmit,
  isSubmitting,
}: ProductFormProps) {
  const [productName, setProductName] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", quantity: 0, unit: "kg" },
  ]);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: 0, unit: "kg" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string | number
  ) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validIngredients = ingredients.filter(
      (ing) => ing.name.trim() !== "" && ing.quantity > 0
    );

    if (productName.trim() === "" || validIngredients.length === 0) {
      alert("Please provide product name and at least one valid ingredient");
      return;
    }

    await onSubmit(productName, validIngredients);
    
    setProductName("");
    setIngredients([{ name: "", quantity: 0, unit: "kg" }]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Calculate Product Carbon Footprint
      </h2>

      <div className="mb-6">
        <label
          htmlFor="productName"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Product Name
        </label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          placeholder="e.g., Ham Cheese Pizza"
          required
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Ingredients
          </label>
          <button
            type="button"
            onClick={addIngredient}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add Ingredient
          </button>
        </div>

        <div className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2 items-start">
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) =>
                  updateIngredient(index, "name", e.target.value)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Ingredient name"
                required
              />
              <input
                type="number"
                step="0.01"
                min="0"
                value={ingredient.quantity || ""}
                onChange={(e) =>
                  updateIngredient(index, "quantity", parseFloat(e.target.value) || 0)
                }
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Qty"
                required
              />
              <select
                value={ingredient.unit}
                onChange={(e) =>
                  updateIngredient(index, "unit", e.target.value)
                }
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
              </select>
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Calculating..." : "Calculate Carbon Footprint"}
      </button>
    </form>
  );
}