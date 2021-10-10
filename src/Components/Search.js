import React from "react";

//Search bar for selecting files from the list of files
const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <form action="/" method="get">
    <label htmlFor="header-search">
      <span className="visually-hidden">Search Files</span>
    </label>
    <input
      value={searchQuery}
      onInput={(e) => setSearchQuery(e.target.value)}
      type="text"
      id="header-search"
      placeholder="Search files"
      name="s"
    />
    <button type="submit">Search</button>
  </form>
);

export default SearchBar;
