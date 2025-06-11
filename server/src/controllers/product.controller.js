const { prisma } = require("../config/prismaClient.config.js");
const asyncHandler = require("../middlewares/asyncHandler.js");


const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity, brand } = req.fields;


  switch (true) {
    case !name:
      return res.status(400).json({ error: "Name is required" });
    case !brand:
      return res.status(400).json({ error: "Brand is required" });
    case !description:
      return res.status(400).json({ error: "Description is required" });
    case !price:
      return res.status(400).json({ error: "Price is required" });
    case !category:
      return res.status(400).json({ error: "Category is required" });
    case !quantity:
      return res.status(400).json({ error: "Quantity is required" });
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      category_id: parseInt(category),
      quantity: parseInt(quantity),
      brand,
      countInStock: parseInt(quantity),
      image: req.fields.image || ""
    }
  });

  res.status(201).json(product);
});

const updateProductDetails = asyncHandler(async (req, res) => {
  console.log("afiuhs", req.fields)
  const { name, description, price, category, quantity, brand, countInStock } = req.fields;

  switch (true) {
    case !name:
      return res.status(400).json({ error: "Name is required" });
    case !brand:
      return res.status(400).json({ error: "Brand is required" });
    case !description:
      return res.status(400).json({ error: "Description is required" });
    case !price:
      return res.status(400).json({ error: "Price is required" });
    case !category:
      return res.status(400).json({ error: "Category is required" });
    case !quantity:
      return res.status(400).json({ error: "Quantity is required" });
  }

  const product = await prisma.product.update({
    where: { id: parseInt(req.params.id) },
    data: {
      name,
      description,
      price: parseFloat(price),
      category_id: parseInt(category),
      quantity: parseInt(quantity),
      brand,
      countInStock: parseInt(countInStock),
      ...(req.fields.image && { image: req.fields.image })
    }
  });

  res.json(product);
});

const removeProduct = asyncHandler(async (req, res) => {
  await prisma.product.delete({
    where: { id: parseInt(req.params.id) }
  });
  res.json({ message: "Product removed" });
});

const fetchProducts = asyncHandler(async (req, res) => {
  const pageSize = 6;
  const keyword = req.query.keyword
    ? {
        name: {
          contains: req.query.keyword,
          mode: "insensitive"
        }
      }
    : {};

  const [count, products] = await Promise.all([
    prisma.product.count({ where: keyword }),
    prisma.product.findMany({
      where: keyword,
      take: pageSize,
      include: {
        ProductCategory: true
      }
    })
  ]);

  res.json({
    products,
    page: 1,
    pages: Math.ceil(count / pageSize),
    hasMore: false
  });
});

const fetchProductById = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      ProductCategory: true,
      reviews: {
        include: {
          ReviewUser: {
            select: {
              username: true
            }
          }
        }
      }
    }
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    include: {
      ProductCategory: true
    },
    take: 12,
    orderBy: {
      createdAt: "desc"
    }
  });
  res.json(products);
});

const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = parseInt(req.params.id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      reviews: true
    }
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const alreadyReviewed = product.reviews.some(
    review => review.user_id === req.user.user_id
  );

  if (alreadyReviewed) {
    return res.status(400).json({ error: "Product already reviewed" });
  }

  await prisma.review.create({
    data: {
      name: req.user.username,
      rating: parseFloat(rating),
      comment,
      user_id: req.user.user_id,
      product_id: productId
    }
  });


  const reviews = await prisma.review.findMany({
    where: { product_id: productId }
  });

  const numReviews = reviews.length;
  const ratingAvg = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      rating: ratingAvg,
      numReviews
    },
    include: {
      reviews: {
        include: {
          ReviewUser: {
            select: {
              username: true
            }
          }
        }
      }
    }
  });

  res.status(201).json({ message: "Review added", product: updatedProduct });
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    orderBy: {
      rating: "desc"
    },
    take: 4
  });
  res.json(products);
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    orderBy: {
      id: "desc"
    },
    take: 5
  });
  res.json(products);
});

const filterProducts = asyncHandler(async (req, res) => {
  const { checked, radio } = req.body;

  let where = {};
  if (checked && checked.length > 0) {
    where.category_id = { in: checked.map(id => parseInt(id)) };
  }
  if (radio && radio.length === 2) {
    where.price = { gte: radio[0], lte: radio[1] };
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      ProductCategory: true
    }
  });

  res.json(products);
});

module.exports = {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};