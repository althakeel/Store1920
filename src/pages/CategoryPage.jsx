// CategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../assets/styles/home/CategoryPage.css";

const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
const CONSUMER_KEY = "ck_f44feff81d804619a052d7bbdded7153a1f45bdd";
const CONSUMER_SECRET = "cs_92458ba6ab5458347082acc6681560911a9e993d";
const PRODUCTS_PER_PAGE = 20;

export default function CategoryPage() {
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Get all child category IDs recursively
  const getAllChildCategoryIds = (categories, parentId) => {
    let ids = [];
    categories
      .filter((c) => c.parent === parentId)
      .forEach((child) => {
        ids.push(child.id);
        ids = [...ids, ...getAllChildCategoryIds(categories, child.id)];
      });
    return ids;
  };

  // Fetch category IDs for the slug + children
  const fetchCategoryIds = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/products/categories?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=100`
      );
      const data = await res.json();

      const category = data.find(
        (c) => c.slug.toLowerCase() === slug.toLowerCase()
      );
      if (!category) return [];

      const childIds = getAllChildCategoryIds(data, category.id);
      return [category.id, ...childIds];
    } catch (err) {
      console.error("Error fetching categories:", err);
      return [];
    }
  };

  // Fetch products by category IDs
  const fetchProducts = async (ids, pageNum = 1) => {
    if (!ids || ids.length === 0) return;
    setLoading(true);

    try {
      const requests = ids.map((id) =>
        fetch(
          `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&category=${id}&per_page=${PRODUCTS_PER_PAGE}&page=${pageNum}`
        ).then((res) => res.json())
      );

      const results = await Promise.all(requests);
      const allProducts = results.flat();

      // Remove duplicates
      const uniqueProducts = Array.from(
        new Map(allProducts.map((p) => [p.id, p])).values()
      );

      if (pageNum === 1) setProducts(uniqueProducts);
      else
        setProducts((prev) => [
          ...prev,
          ...uniqueProducts.filter((p) => !prev.find((x) => x.id === p.id)),
        ]);

      setHasMore(allProducts.length >= PRODUCTS_PER_PAGE);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load category IDs first, then products
  useEffect(() => {
    (async () => {
      setPage(1);
      const ids = await fetchCategoryIds();
      setCategoryIds(ids);
      await fetchProducts(ids, 1);
    })();
  }, [slug]);

  const loadMore = async () => {
    if (!hasMore) return;
    const nextPage = page + 1;
    await fetchProducts(categoryIds, nextPage);
    setPage(nextPage);
  };

  return (
    <div className="cp-container">
  <h1 className="cp-title">{slug?.replace(/-/g, " ") || "Category"}</h1>

      {loading && products.length === 0 && (
        <p className="cp-message">Loading products...</p>
      )}
      {!loading && products.length === 0 && (
        <p className="cp-message">No products found in this category.</p>
      )}

      <div className="cp-products-grid">
        {products.map((product) => (
          <div key={product.id} className="cp-product-card">
            <div className="cp-product-image">
              <img
                src={product.images[0]?.src || "/placeholder.png"}
                alt={product.name}
              />
            </div>
            <h2 className="cp-product-name">{product.name}</h2>
            <p
              className="cp-product-price"
              dangerouslySetInnerHTML={{ __html: product.price_html }}
            ></p>
            <button className="cp-add-to-cart">Add to Cart</button>
          </div>
        ))}
      </div>

      {products.length > 0 && hasMore && (
        <div className="cp-load-more-container">
          <button
            onClick={loadMore}
            className="cp-load-more-btn"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
