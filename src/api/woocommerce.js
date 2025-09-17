import axios from "axios";

export const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
export const CONSUMER_KEY = "ck_f44feff81d804619a052d7bbdded7153a1f45bdd";
export const CONSUMER_SECRET = "cs_92458ba6ab5458347082acc6681560911a9e993d";

const authParams = `consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;


export async function fetchAPI(endpoint) {
  try {
    const url = `${API_BASE}${endpoint}&${authParams}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return null;
  }
}


export const getCategoryById = (id) =>
  fetchAPI(`/products/categories/${id}?`);

export const getCategoryBySlug = (slug) =>
  fetchAPI(`/products/categories?slug=${slug}&`);

export const getChildCategories = (parentId) =>
  fetchAPI(`/products/categories?parent=${parentId}&`);

// Products
export const getProductsByCategory = (categoryId, page = 1, perPage = 42) =>
  fetchAPI(
    `/products?category=${categoryId}&per_page=${perPage}&page=${page}&orderby=date&order=desc&_fields=id,name,slug,images,price,total_sales&`
  );

export const getProductsByCategories = async (
  categoryIds = [],
  page = 1,
  perPage = 42,
  order = "desc"  // <- default to desc
) => {
  if (!Array.isArray(categoryIds) || categoryIds.length === 0) return [];
  return fetchAPI(
    `/products?category=${categoryIds.join(",")}&per_page=${perPage}&page=${page}&orderby=date&order=${order}&_fields=id,name,slug,images,price,total_sales&`
  );
};

export const getProductBySlug = async (slug) => {
  const data = await fetchAPI(`/products?slug=${slug}&`);
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
};

export const searchProducts = (term) =>
  fetchAPI(`/products?search=${encodeURIComponent(term)}&`);

export const getProductById = (id) =>
  fetchAPI(`/products/${id}?`);

export const getProductsByTag = (tagSlug, page = 1, perPage = 42) =>
  fetchAPI(
    `/products?tag=${tagSlug}&per_page=${perPage}&page=${page}&orderby=date&order=desc&_fields=id,name,slug,images,price,total_sales&`
  );


export const getPromo = async () => {
  try {
    const res = await fetch(`${API_BASE}/custom/v1/promo`);
    if (!res.ok) throw new Error("Promo API error");
    return await res.json();
  } catch (err) {
    return null;
  }
};


export const getFirstVariation = async (productId) => {
  try {
    const data = await fetchAPI(`/products/${productId}/variations?per_page=1`);
    return data?.[0] || null;
  } catch (err) {
    console.error("Error fetching variation:", err);
    return null;
  }
};

export const getCurrencySymbol = async () => {
  try {
    const res = await fetch(`${API_BASE}/settings?${authParams}`);
    const data = await res.json();
    return data?.currency_symbol || "AED";
  } catch (err) {
    return "AED";
  }
};

export const getProductReviews = async (productId, perPage = 20) =>
  fetchAPI(`/products/${productId}/reviews?per_page=${perPage}&`);

export const addProductReview = async (
  productId,
  { review, reviewer, reviewer_email, rating = 5 }
) => {
  try {
    const res = await fetch(
      `${API_BASE}/products/${productId}/reviews?${authParams}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review,
          reviewer,
          reviewer_email,
          rating,
        }),
      }
    );

    if (!res.ok) throw new Error(`Failed to submit review: ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
};

export const getFastProducts = async (limit = 4) => {
  try {
    const res = await fetch(
      `https://db.store1920.com/wp-json/custom/v1/fast-products`
    );
    if (!res.ok) throw new Error("Fast products API error");
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, limit) : [];
  } catch (err) {
    console.error("Fast products fetch error:", err);
    return [];
  }
};


export const getProductsByIds = (ids = []) => {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  return fetchAPI(`/products?include=${ids.join(",")}&`);
};



export const getTagIdsBySlugs = async (slugs = []) => {
  if (!Array.isArray(slugs) || slugs.length === 0) return [];
  const tagPromises = slugs.map((slug) => fetchAPI(`/products/tags?slug=${slug}`));
  const results = await Promise.all(tagPromises);
  const ids = results.map((res) => res?.[0]?.id).filter(Boolean);
  return ids;
};


export const getProductsByTagSlugs = async (slugs = [], page = 1, perPage = 42) => {
  const tagIds = await getTagIdsBySlugs(slugs);
  if (!tagIds.length) return [];
  return fetchAPI(
    `/products?tag=${tagIds.join(',')}&per_page=${perPage}&page=${page}&orderby=date&order=desc&_fields=id,name,slug,images,price,total_sales`
  );
};




export const getTopSoldProducts = async (hours = 24, limit = 5) => {
  try {
 
    const res = await fetch(
      `${API_BASE}/products?per_page=${limit}&orderby=total_sales&order=desc&date_modified_min=${new Date(
        Date.now() - hours * 60 * 60 * 1000
      ).toISOString()}&${authParams}`
    );
    if (!res.ok) throw new Error("Top sold products API error");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching top sold products:", err);
    return [];
  }
};

//
export const getOrderById = async (orderId) => {
  if (!orderId) return null;
  return fetchAPI(`/orders/${orderId}?`);
};

export const getOrdersByEmail = async (email, perPage = 20) => {
  if (!email) return [];
  return fetchAPI(`/orders?customer=${email}&per_page=${perPage}&orderby=date&order=desc&`);
};

