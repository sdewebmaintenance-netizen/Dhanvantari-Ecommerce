import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
   <div className="favorites-container">
      <h2 className="title text-animation">
        Favourite Products
      </h2>

      <div className="special-products-grid">
        {favorites.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
