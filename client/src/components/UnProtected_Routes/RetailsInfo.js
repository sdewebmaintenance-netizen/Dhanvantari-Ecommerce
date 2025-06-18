const RetailInfo = () => {
  return (
    <div>
      <h2 className="title text-animation">RETAIL</h2>
      <p>
        For retail customers, you can try sample products through popular online
        platforms such as:
      </p>
      <ul className="retail-list">
        <li>
          Amazon{" "}
          <a
            href="https://www.amazon.in/s?me=A3J8VNXC4KF2VJ&ref=sf_seller_app_share_new"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-customized"
            style={{display:"inline-flex"}}
          >
            🔗 Check out the products on Amazon
          </a>
        </li>
        <li>
          Flipkart{" "}
          <a
            href="https://www.flipkart.com/sri-dhanvantari-exports-tapioca-white-starch-flour-1-kg-cassava-for-cooking-baking-directly-sago-manufacturer/p/itmc13056504d67f?pid=FLRG5YZ4BBKWAHNV"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-customized"
            style={{display:"inline-flex"}}
          >
            🔗 Check out the products on Flipkart
          </a>
        </li>
        <li>
          Meesho{" "}
          <a
            href="https://www.meesho.com/tapioca-white-starch-powder-500-grams-cassava-flour-for-cooking-and-bakingsri-dhanvantari-exports/p/1q2t1e"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-customized"
            style={{display:"inline-flex"}}
          >
            🔗 Check out the products on Meesho
          </a>
        </li>
      </ul>
    </div>
  );
};

export default RetailInfo;
