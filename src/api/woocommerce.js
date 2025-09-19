import axios from "axios";

export const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
export const CONSUMER_KEY = "ck_f44feff81d804619a052d7bbdded7153a1f45bdd";
export const CONSUMER_SECRET = "cs_92458ba6ab5458347082acc6681560911a9e993d";

const authParams = `consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;

// ===================== Generic Fetch =====================
export async function fetchAPI(endpoint) {
  try {
    const separator = endpoint.includes("?") ? "&" : "?";
    const url = `${API_BASE}${endpoint}${separator}${authParams}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("fetchAPI error:", error);
    return null;
  }
}

// ===================== Categories =====================
export const getCategoryById = (id) => fetchAPI(`/products/categories/${id}`);
export const getCategoryBySlug = (slug) => fetchAPI(`/products/categories?slug=${slug}`);
export const getChildCategories = (parentId) => fetchAPI(`/products/categories?parent=${parentId}`);
export const getCategories = () => fetchAPI(`/products/categories?per_page=100`);

// ===================== Products =====================
export const getProductsByCategory = (categoryId, page = 1, perPage = 42) =>
  // Remove _fields to allow custom fields like enable_saving_badge
  fetchAPI(`/products?category=${categoryId}&per_page=${perPage}&page=${page}&orderby=date&order=desc`);

export const getProductsByCategories = (categoryIds = [], page = 1, perPage = 42, order = "desc") => {
  if (!Array.isArray(categoryIds) || !categoryIds.length) return [];
  return fetchAPI(`/products?category=${categoryIds.join(",")}&per_page=${perPage}&page=${page}&orderby=date&order=${order}&_fields=id,name,slug,images,price,total_sales,enable_saving_badge
`);
};

export const getProductBySlug = async (slug) => {
  const data = await fetchAPI(`/products?slug=${slug}`);
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
};

export const getProductById = (id) => fetchAPI(`/products/${id}`);
export const searchProducts = (term) => fetchAPI(`/products?search=${encodeURIComponent(term)}`);
export const getProductsByIds = (ids = []) => {
  if (!Array.isArray(ids) || !ids.length) return [];
  return fetchAPI(`/products?include=${ids.join(",")}`);
};

// ===================== Tags =====================
export const getTagIdsBySlugs = async (slugs = []) => {
  if (!slugs.length) return [];
  const allTags = await fetchAPI("/products/tags?per_page=100");
  if (!allTags || !Array.isArray(allTags)) return [];
  return slugs
    .map((slug) => allTags.find((t) => t.slug.toLowerCase() === slug.toLowerCase())?.id)
    .filter(Boolean);
};

export const getProductsByTagSlugs = async (slugs = [], page = 1, perPage = 42, orderBy = "date", order = "desc") => {
  const tagIds = await getTagIdsBySlugs(slugs);
  if (!tagIds.length) return [];
  const url = `/products?tag=${tagIds.join(",")}&per_page=${perPage}&page=${page}&orderby=${orderBy}&order=${order}&_fields=id,name,slug,images,price,total_sales,enable_saving_badge
`;
  return fetchAPI(url);
};

// ===================== Specific Tag-based Products =====================
export const getNewArrivalsProducts = (page = 1, perPage = 24) => getProductsByTagSlugs(["new-arrivals"], page, perPage);
export const getRatedProducts = (page = 1, perPage = 24) => getProductsByTagSlugs(["rated"], page, perPage, "rating");
export const getFestSaleProducts = (page = 1, perPage = 24) => getProductsByTagSlugs(["fest-sale"], page, perPage);
export const getTopSellingItemsProducts = (page = 1, perPage = 24) => getProductsByTagSlugs(["top-selling"], page, perPage, "total_sales");

// ===================== Variations =====================
export const getFirstVariation = async (productId) => {
  try {
    const data = await fetchAPI(`/products/${productId}/variations?per_page=1`);
    return data?.[0] || null;
  } catch (err) {
    console.error("getFirstVariation error:", err);
    return null;
  }
};

// ===================== Currency =====================
export const getCurrencySymbol = async () => {
  try {
    const res = await fetch(`${API_BASE}/settings?${authParams}`);
    const data = await res.json();
    return data?.currency_symbol || "AED";
  } catch {
    return "AED";
  }
};

// ===================== Reviews =====================
export const getProductReviews = (productId, perPage = 20) =>
  fetchAPI(`/products/${productId}/reviews?per_page=${perPage}`);

export const addProductReview = async (productId, { review, reviewer, reviewer_email, rating = 5 }) => {
  try {
    const res = await fetch(`${API_BASE}/products/${productId}/reviews?${authParams}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review, reviewer, reviewer_email, rating }),
    });
    if (!res.ok) throw new Error(`Failed to submit review: ${res.status}`);
    return await res.json();
  } catch {
    return null;
  }
};

// ===================== Other APIs =====================
export const getFastProducts = async (limit = 4) => {
  try {
    const res = await fetch(`https://db.store1920.com/wp-json/custom/v1/fast-products`);
    if (!res.ok) throw new Error("Fast products API error");
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, limit) : [];
  } catch (err) {
    console.error("getFastProducts error:", err);
    return [];
  }
};

export const getPromo = async () => {
  try {
    const res = await fetch(`${API_BASE}/custom/v1/promo`);
    if (!res.ok) throw new Error("Promo API error");
    return await res.json();
  } catch {
    return null;
  }
};

// ===================== Orders =====================
export const getOrderById = (orderId) => (orderId ? fetchAPI(`/orders/${orderId}`) : null);

export const getOrdersByEmail = (email, perPage = 20) =>
  email ? fetchAPI(`/orders?customer=${email}&per_page=${perPage}&orderby=date&order=desc`) : [];

// ===================== Top Sold Products =====================
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
    console.error("getTopSoldProducts error:", err);
    return [];
  }
};
// ===================== New: Products by Category Slug =====================
export const getProductsByCategorySlug = async (slug, page = 1, perPage = 42, order = "desc") => {
  try {
    // 1️⃣ Get category by slug
    const categories = await getCategoryBySlug(slug);
    if (!categories?.length) return [];

    const parentCategory = categories[0];

    // 2️⃣ Get child categories
    const children = await getChildCategories(parentCategory.id);
    const categoryIds = [parentCategory.id, ...(children?.map(c => c.id) || [])];

    if (!categoryIds.length) return [];

    // 3️⃣ Get products for all category IDs
    const products = await getProductsByCategories(categoryIds, page, perPage, order);
    return products || [];
  } catch (err) {
    console.error("getProductsByCategorySlug error:", err);
    return [];
  }
};
