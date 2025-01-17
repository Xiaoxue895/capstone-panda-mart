import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./SearchResultPage.css";

const SearchResultPage = () => {

  const searchResults = useSelector((state) => state.products.searchResults || []);

  return (
    <div className="search-result-container">
      <h2>Search Results</h2>
      <ul className="search-result-list">
        {searchResults.map((product) => (
          <li key={product.id} className="search-result-item">
            <div className="product-item">
              <img
                src={product.preview_image}
                alt={`${product.name} image`}
                className="product-image"
              />
              
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>Price: ${parseFloat(product.price).toFixed(2)}</p>
                <NavLink to={`/products/${product.id}`}>View Details</NavLink>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultPage;

