"use client";

import { useEffect, useState } from "react";
import ProductForm from "@/components/ProductForm";
import ProductResults from "@/components/ProductResults";
import ProductList from "@/components/ProductList";
import { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (name: string, ingredients: any[]) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, ingredients }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newProduct: Product = await response.json();
      setProducts([newProduct, ...products]);
      setSelectedProduct(newProduct);
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Failed to calculate carbon footprint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Emission Factors
          </a>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Food Product Carbon Footprint Calculator
          </h1>
          <p className="text-gray-600">
            Calculate and compare carbon emissions of food products based on Agrybalise data
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </div>
          
          <div>
            {selectedProduct ? (
              <ProductResults product={selectedProduct} />
            ) : (
              <div className="bg-white shadow rounded-lg p-8 text-center h-full flex items-center justify-center">
                <div>
                  <p className="text-gray-500 mb-2">No product selected</p>
                  <p className="text-sm text-gray-400">
                    Calculate a new product or select from saved products below
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <ProductList
            products={products}
            onSelectProduct={handleSelectProduct}
          />
        </div>
      </div>
    </div>
  );
}