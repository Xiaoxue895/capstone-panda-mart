import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./SearchResultPage.css";

const SearchResultPage = () => {
  const searchResults = useSelector((state) => state.stock.searchResults || []);

  return (
    <div className="search-result-container">
      <h2>Search Results</h2>
      <ul className="search-result-list">
        {searchResults.map((product) => (
          <li key={product.id} className="search-result-item">
            <div>
              <img src={product.graph_image} alt={`${product.name} graph`} />
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <NavLink to={`/products/${product.id}`}>View Details</NavLink>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultPage;
