import { useState } from "react";
import { useDispatch } from "react-redux";
import { showSearchResultsThunk } from "../../redux/product";
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
			dispatch(showSearchResultsThunk(query));
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
			</form>
		</div>
	);
};
export default SearchBar;