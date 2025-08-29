import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://db.store1920.com/wp-json/wc/v3";
const CONSUMER_KEY = "ck_f44feff81d804619a052d7bbdded7153a1f45bdd";
const CONSUMER_SECRET = "cs_92458ba6ab5458347082acc6681560911a9e993d";

const useQuery = () => new URLSearchParams(useLocation().search);

const Search = () => {
  const query = useQuery();
  const searchTerm = query.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchTerm) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        let response;
        if (!isNaN(searchTerm)) {
          response = await axios.get(
            `${API_BASE}/products/${searchTerm}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
          );
          setResults(Array.isArray(response.data) ? response.data : [response.data]);
        } else {
          response = await axios.get(
            `${API_BASE}/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&search=${encodeURIComponent(
              searchTerm
            )}`
          );
          setResults(response.data);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]);

  const handleRedirect = (slug) => {
    navigate(`/product/${slug}`);
  };

  const truncateText = (text, maxLength) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  return (
    <div style={{ maxWidth: "1200px", margin: "10px auto", padding: "0px 20px 10px", minHeight: "50vh" }}>
      <h2 style={{ marginBottom: "20px" }}>Search results for: "{searchTerm}"</h2>

      {loading && <p style={{ fontStyle: "italic" }}>Loading...</p>}
      {!loading && results.length === 0 && <p>No results found.</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "15px",
        }}
      >
        {results.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #eee",
              padding: "8px",
              borderRadius: "8px",
              textAlign: "center",
              transition: "transform 0.2s",
              height: "auto",
            }}
          >
            {/* Product Image */}
            {item.images?.[0] ? (
              <img
                src={item.images[0].src}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginBottom: "6px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "140px",
                  background: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#aaa",
                  borderRadius: "6px",
                  marginBottom: "6px",
                }}
              >
                No Image
              </div>
            )}

            {/* Product Name */}
            <p style={{ fontSize: "13px", fontWeight: "500", color: "#333", margin: "2px 0" }}>
              {truncateText(item.name, 20)}
            </p>

            {/* Product Price */}
            {item.price_html && (
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "bold",
                  color: "#064789",
                  margin: "2px 0 4px",
                }}
                dangerouslySetInnerHTML={{ __html: item.price_html }}
              />
            )}

            {/* Button */}
            <button
              onClick={() => handleRedirect(item.slug)}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "#ff6804",
                color: "#fff",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "bold",
                width: "100%",
                marginTop: "4px",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ff6804")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ff6805")}
            >
              View Product
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
