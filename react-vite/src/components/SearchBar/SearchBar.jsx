import { useState } from "react";
import { useDispatch } from "react-redux";
// change this to new redux thing
// import { showAllStocksSearchThunk } from "../../redux/stock";
import "./SearchBar.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
	const [query, setQuery] = useState("");
	const dispatch = useDispatch();

	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();
		if (!query) {
			return alert("Input field cannot be empty!");
		}

		if (query.trim()) {
			dispatch(showAllStocksSearchThunk(query));
			setQuery("");
		}

		navigate("/searchres");
	};

	return (
		<div className="search-bar-container">
			<form onSubmit={handleSearch}>
				<input
					type="text"
					placeholder="search products here"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				<button type="submit">search</button>

				{/* when we get the result ,we need redirect to search result page */}
			</form>
		</div>
	);
};
export default SearchBar;