import React from "react";
import { Link } from "react-router-dom";
import "./SearchCategory.css";

const categories_data = [
  { id: 1, type: "Electronics" },
  { id: 2, type: "Fashion" },
  { id: 3, type: "Home & Kitchen" },
  { id: 4, type: "Sports & Outdoors" },
  { id: 5, type: "Health & Beauty" },
  { id: 6, type: "Books" },
  { id: 7, type: "Toys & Games" },
  { id: 8, type: "Automotive" },
  { id: 9, type: "Groceries" },
  { id: 10, type: "Music & Movies" }
];

const CategoryNav = () => {
  return (
    <div className="category-nav">
      <h2>Product Categories</h2>
      <div className="category-list">
        {categories_data.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`} 
            className="category-item"
          >
            {category.type}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;



