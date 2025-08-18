import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import formatCurrency from "../../../../Utils/FormatCurrency";
import { useCreateCartMutation, useUpdateCartMutation } from "../../../../redux/api/cartApiSlice";
import ProductImageCarousel from "./ProductImageCarousel";

const ProductCard = ({ p, setParentLoading }) => {
  const qty = 1;
  const [createCart] = useCreateCartMutation();

  const addToCartHandler = async (e) => {
    e.preventDefault();
    setParentLoading(true);
    try {
      await createCart({
        product_id: p.id,
        quantity: parseInt(qty),
      }).unwrap();
      alert("Item added to cart successfully");
      // update card state
      
    } catch (error) {
      alert(error?.data?.error || "Adding to cart failed, try again.");
    } finally {
      setParentLoading(false);
    }
  };

  return (
    <div className="product-card-alt">
      <section className="product-card-image-section">
        <Link to={`/product/${p.id}`} className="product-card-link">
          {p.ProductDiscount && (
            <div className="product-discount-ribbon">
              Buy {p.ProductDiscount.qty}+ & Save ₹
              {p.ProductDiscount.pricetobereduced}
            </div>
          )}

          <ProductImageCarousel
            images={p.ProductImages}
            imageClassName="product-card-image"
            indicatorClassName="product-indicator-dot"
            activeIndicatorClassName="product-indicator-active"
          />
        </Link>
      </section>

      <div className="product-card-body">
        <div className="product-brand-badge-holder">
          {p.rating > 0 && (
            <div className="product-rating-badge">{p.rating.toFixed(1)} ★</div>
          )}
          <div className="product-brand-name-holder">
            <div className="product-brand-badge">{p?.brand}</div>
          </div>
        </div>
        <div className="product-card-header">
          <p className="product-card-names">{p?.name}</p>
        </div>
       <div className="product-price-contents-holder">
        <p className="">{formatCurrency(p?.price)}</p>

        {p.IGST > 0 ? (
            <p className="product-gst">GST: {p.IGST}%</p>
          ) : p.CGST > 0 || p.SGST > 0 ? (
            <p className="product-gst">
              GST: {p.CGST + p.SGST}%
              {p.CGST > 0 && ` (CGST: ${p.CGST}%)`}
              {p.SGST > 0 && ` (SGST: ${p.SGST}%)`}
            </p>
          ) : null}
       </div>

        <div className="pro-in">
          

          
        </div>

        <section className="product-card-actions">
          <Link
            to={`/product/${p.id}`}
            className="btn-customized"
            style={{ padding: "0.5rem" }}
          >
            Read More
            <svg
              className="read-more-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button className="add-to-cart-btn" onClick={addToCartHandler}>
            <AiOutlineShoppingCart size={25} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
