export const filterProductsByType = (products, type = "wholesale") => {
  if (!Array.isArray(products)) return [];
  return products.filter(
    (product) => product.productType?.toLowerCase() === type.toLowerCase()
  );
};
