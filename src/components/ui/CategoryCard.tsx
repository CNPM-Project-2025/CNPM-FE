import React from "react";
import '/src/assets/styles/Home.css'


interface CategoryCardProps {
  image: string;
  name: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ image, name }) => {
  return (
    <div className="CategoryCard">
      <img src={image} alt={name} className="CategoryCard-img" />
      <span className="CategoryCard-name">{name}</span>
    </div>
  );
};

export default CategoryCard;