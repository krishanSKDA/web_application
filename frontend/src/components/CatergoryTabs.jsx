import React, { useState, useRef } from "react";
import { ChevronRight } from "lucide-react"; // for scroll arrow

const CategoryTabs = ({ onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState("Business & Management");
  const scrollRef = useRef(null);

  const categories = [
    { name: "Business & Management", icon: "/assets/business-icon.png" },
    { name: "Health & Social Care", icon: "/assets/health-icon.png" },
    { name: "Information Technology", icon: "/assets/information-icon.png" },
    { name: "Teaching & Education", icon: "/assets/teaching-icon.png" },
    { name: "Accounting & Finance", icon: "/assets/teaching-icon.png" },
  ];

  const handleClick = (category) => {
    setActiveCategory(category);
    if (onCategoryChange) onCategoryChange(category);
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="category-tabs-wrapper">
      <div className="category-tabs" ref={scrollRef}>
        {categories.map((c) => (
          <div
            key={c.name}
            className={`category-tab ${
              activeCategory === c.name ? "active" : ""
            }`}
            onClick={() => handleClick(c.name)}
          >
            <img src={c.icon} alt={c.name} className="category-tab-icon" />
            <span>{c.name}</span>
          </div>
        ))}
      </div>
      <button className="scroll-btn" onClick={scrollRight}>
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default CategoryTabs;
