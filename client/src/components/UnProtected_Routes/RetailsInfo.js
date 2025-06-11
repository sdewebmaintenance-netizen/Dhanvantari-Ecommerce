const RetailInfo = () => {
  return (
    <div >
      <h2 className="title text-animation">RETAIL</h2>
      <p>
        For retail customers, you can try sample products through popular online platforms such as:
      </p>
      <ul className="retail-list">
        <li>Amazon</li>
        <li>Flipkart</li>
        <li>Meesho</li>
      </ul>
      <p>
        <a
          href="https://www.amazon.in/s?me=A3J8VNXC4KF2VJ&ref=sf_seller_app_share_new"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-customized"
        >
        🔗 Check out the products on Amazon
        </a>
      </p>
    </div>
  );
};

export default RetailInfo;
