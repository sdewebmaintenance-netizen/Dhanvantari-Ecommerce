const { prisma } = require("../config/prismaClient.config.js");
const asyncHandler = require("../middlewares/asyncHandler.js");
const cloudinary = require("../config/cloudinary.config.js");

const { EmailTransmitter } = require("../utils/nodemailer.js");
const EmailTemplates = require("../utils/EmailTemplates.js");
const { NODEMAILER_USERNAME } = require("../config/configuration.js");

const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    pcode,
    moq,
    category,
    quantity,
    brand,
    countInStock,
    productType,
    incoTerm,
    discount,
    port,
    variant,
    isVisible,
    hsnSac,
    cgst,
    sgst,
    igst,
  } = req.body;
  const images = req.files;

  console.log("req", req.files, req.body);

  if (
    !name ||
    !description ||
    !price ||
    !pcode ||
    !category ||
    !quantity ||
    !brand ||
    !countInStock ||
    !productType
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const uploadResults = await Promise.all(
    req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "product_images",
        resource_type: "auto",
      });
      return {
        image_url: result.secure_url,
        public_id: result.public_id,
      };
    })
  );

  const productData = {
    name,
    description,
    price: parseFloat(price),
    pcode,
    moq: parseFloat(moq),
    category_id: parseInt(category),
    discount_id: parseInt(discount),
    weight: parseInt(quantity),
    brand,
    countInStock: parseInt(countInStock),
    productType,
    isVisible: isVisible === "true" || isVisible === true,
    hsnSac: hsnSac ? parseInt(hsnSac) : null,
    CGST: cgst ? parseFloat(cgst) : null,
    SGST: sgst ? parseFloat(sgst) : null,
    IGST: sgst ? parseFloat(igst) : null,
  };

  if (productType === "EXPORT") {
    if (!incoTerm || !port || !variant) {
      return res
        .status(400)
        .json({ error: "Export fields are required for EXPORT productType" });
    }

    Object.assign(productData, {
      inco_term_id: parseInt(incoTerm),
      port_id: parseInt(port),
      variant,
    });
  }

  const product = await prisma.product.create({
    data: productData,
  });

  console.log("uppp", uploadResults);

  if (uploadResults.length > 0) {
    await prisma.productImage.createMany({
      data: uploadResults.map((img) => ({
        image_url: img.image_url,
        public_id: img.public_id,
        product_id: product.id,
      })),
    });
  }
  res.status(201).json(product);
});
const updateProductDetails = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    pcode,
    moq,
    category,
    discount,
    quantity,
    brand,
    countInStock,
    existingImages,
    productType,
    incoTerm,
    port,
    variant,
    hsnSac,
    cgst,
    sgst,
    igst,
    isVisible,
  } = req.body;

  if (!name || !description || !price || !pcode || !category || !quantity || !brand || !productType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const uploadedImages = await Promise.all(
      (req.files || []).map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "product_images",
          resource_type: "auto",
        });
        return {
          image_url: result.secure_url,
          public_id: result.public_id,
        };
      })
    );

   
    const existingImageIds = existingImages
      ? Array.isArray(existingImages)
        ? existingImages.map((id) => parseInt(id))
        : JSON.parse(existingImages).map((id) => parseInt(id))
      : [];

    const imagesToDelete = await prisma.productImage.findMany({
      where: {
        product_id: parseInt(req.params.id),
        id: {
          notIn: existingImageIds,
        },
      },
    });

    await Promise.all(
      imagesToDelete.map((img) => cloudinary.uploader.destroy(img.public_id))
    );

    const updatedProduct = await prisma.$transaction(async (prisma) => {
      const updateData = {
        name,
        description,
        price: parseFloat(price),
        pcode,
        moq: parseFloat(moq),
        category_id: parseInt(category),
        discount_id: parseInt(discount),
        weight: parseInt(quantity),
        brand,
        countInStock: parseInt(countInStock),
        productType,
        hsnSac: hsnSac ? parseInt(hsnSac) : null,
        CGST: cgst ? parseFloat(cgst) : null,
        SGST: sgst ? parseFloat(sgst) : null,
        IGST: igst ? parseFloat(igst) : null,
        isVisible: isVisible === "true" || isVisible === true,
      };

      if (productType === "EXPORT") {
        Object.assign(updateData, {
          inco_term_id: parseInt(incoTerm),
          port_id: parseInt(port),
          variant,
        });
      }

      const product = await prisma.product.update({
        where: { id: parseInt(req.params.id) },
        data: updateData,
      });

      if (imagesToDelete.length > 0) {
        await prisma.productImage.deleteMany({
          where: {
            product_id: product.id,
            id: {
              notIn: existingImageIds,
            },
          },
        });
      }

      if (uploadedImages.length > 0) {
        await prisma.productImage.createMany({
          data: uploadedImages.map((img) => ({
            image_url: img.image_url,
            public_id: img.public_id,
            product_id: product.id,
          })),
        });
      }

      const currentImages = await prisma.productImage.findMany({
        where: { product_id: product.id },
      });

      if (currentImages.length > 4) {
        throw new Error("Product cannot have more than 4 images");
      }

      return prisma.product.findUnique({
        where: { id: product.id },
        include: {
          ProductImages: true,
          ProductCategory: true,
          ProductDiscount: true,
          ProductIncoTerm: true,
          ProductPort: true,
        },
      });
    }, {
      maxWait: 10000, 
      timeout: 10000, 
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    
    if (uploadedImages) {
      await Promise.all(
        uploadedImages.map(img => 
          cloudinary.uploader.destroy(img.public_id).catch(e => console.error(e))
        )
      );
    }

    res.status(400).json({ 
      error: error.message || "Product update failed",
      code: error.code
    });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    console.log("Deleting product with ID:", req.params.id);
    const productId = parseInt(req.params.id);

    const productImages = await prisma.productImage.findMany({
      where: { product_id: productId }
    });

    const deleteFromCloudinary = async () => {
      const deletePromises = productImages.map(img => {
        if (img.public_id) {
          return cloudinary.uploader.destroy(img.public_id)
            .catch(err => {
              console.error(`Failed to delete image ${img.public_id} from Cloudinary:`, err);
        
              return Promise.resolve();
            });
        }
        return Promise.resolve();
      });
      return Promise.all(deletePromises);
    };

    await prisma.$transaction(async (prisma) => {
      await prisma.productImage.deleteMany({
        where: { product_id: productId }
      });

      await prisma.product.delete({
        where: { id: productId }
      });
    });

    await deleteFromCloudinary();

    res.json({ 
      success: true,
      message: "Product and all associated images removed successfully",
      deletedImagesCount: productImages.length
    });

  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Failed to delete product",
      code: error.code
    });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  console.log("keyyyyyyyyyyyyyy", req.query.keyword);
  const pageSize = 6;
  const keyword = req.query.keyword
    ? {
        name: {
          contains: req.query.keyword,
          mode: "insensitive",
        },
      }
    : {};

  const baseWhere = {
    ...keyword,
    isVisible: true,
  };

  const [count, products] = await Promise.all([
    prisma.product.count({ where: baseWhere }),
    prisma.product.findMany({
      where: baseWhere,
      take: pageSize,
      include: {
        ProductCategory: true,
        ProductImages: true,
        ProductDiscount: true,
      },
    }),
  ]);

  res.json({
    products,
    page: 1,
    pages: Math.ceil(count / pageSize),
    hasMore: false,
  });
});

const fetchProductById = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      ProductCategory: true,
      ProductDiscount: true,
      ProductIncoTerm: true,
      ProductPort: true,
      ProductImages: true,
      reviews: {
        include: {
          ReviewUser: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    where: { isVisible: true },
    include: {
      ProductCategory: true,
      ProductDiscount: true,
      ProductImages: true,
      ProductIncoTerm: true,
      ProductPort: true,
    },
    take: 12,
    orderBy: {
      createdAt: "desc",
    },
  });
  res.json(products);
});

const fetchAllProductsAdmin = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    include: {
      ProductCategory: true,
      ProductDiscount: true,
      ProductImages: true,
      ProductIncoTerm: true,
      ProductPort: true,
    },
    take: 12,
    orderBy: {
      createdAt: "desc",
    },
  });
  res.json(products);
});

const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = parseInt(req.params.id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      reviews: true,
    },
  });

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const alreadyReviewed = product.reviews.some(
    (review) => review.user_id === req.user.user_id
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
      product_id: productId,
    },
  });

  const reviews = await prisma.review.findMany({
    where: { product_id: productId },
  });

  const numReviews = reviews.length;
  const ratingAvg =
    reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      rating: ratingAvg,
      numReviews,
    },
    include: {
      reviews: {
        include: {
          ReviewUser: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  });

  res.status(201).json({ message: "Review added", product: updatedProduct });
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    where: { isVisible: true },
    orderBy: {
      rating: "desc",
    },
    take: 4,
    include: {
      ProductImages: true,
      ProductDiscount: true,
    },
  });

  res.json(products);
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    where: { isVisible: true },
    orderBy: {
      id: "desc",
    },
    take: 5,
  });
  res.json(products);
});

const filterProducts = asyncHandler(async (req, res) => {
  const { checked, radio } = req.body;

  let where = { isVisible: true };
  if (checked && checked.length > 0) {
    where.category_id = { in: checked.map((id) => parseInt(id)) };
  }
  if (radio && radio.length === 2) {
    where.price = { gte: radio[0], lte: radio[1] };
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      ProductCategory: true,
      ProductDiscount: true,
      ProductImages: true,
    },
  });

  res.json(products);
});

const requestQuotaForExportProduct = asyncHandler(async (req, res) => {
  try {
    console.log("sikulasu", req.body);
    const { name, email, phone, company, country, products, message } =
      req.body;

    if (!name || !email || !products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and at least one product are required",
      });
    }

    const productDetails = products.map((product) => ({
      name: product.name || "Unnamed Product",
      quantity: product.quantity || "Not specified",
      specifications: product.specifications || "Standard",
    }));

    const requesterDetails = {
      name,
      email,
      phone: phone || "Not provided",
      company: company || "Not provided",
      country: country || "Not provided",
      message: message || "No additional message",
    };

    const ownerEmail = NODEMAILER_USERNAME;

    const ownerSubject = `New Quote Request from ${name}`;
    const ownerHtml = EmailTemplates.requestQuoteTemplate.owner(
      "Sri Dhanvantari Exports Team",
      requesterDetails,
      productDetails
    );

    await EmailTransmitter(ownerEmail, ownerSubject, ownerHtml);

    const userSubject = "Your Quote Request Has Been Received";
    const userHtml = EmailTemplates.requestQuoteTemplate.user(
      name,
      productDetails.map((p) => p.name)
    );

    await EmailTransmitter(email, userSubject, userHtml);

    res.status(200).json({
      success: true,
      message:
        "Quote request submitted successfully. You will receive a confirmation email shortly.",
    });
  } catch (error) {
    console.error("Error processing quote request:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
      error: error.message,
    });
  }
});

const requestInvoiceForPlacedOrder = asyncHandler(async (req, res) => {
  try {
    console.log("sikulasu", req.body, req.user);

    const { email, username } = req.user;
    const { pdfDataUrl, orderDetails } = req.body;

    const base64Data = pdfDataUrl.replace(/^data:application\/pdf;base64,/, "");
    const pdfBuffer = Buffer.from(base64Data, "base64");

    const fileName = `invoice.pdf`;

    if (!pdfDataUrl || !email) {
      return res.status(400).json({
        success: false,
        message: "PDF Url and email are required",
      });
    }

    const ownerEmail = NODEMAILER_USERNAME;

    const ownerSubject = `Invoice from Sri Dhanvantari`;
    const ownerHtml = EmailTemplates.invoiceDownloadTemplate(
      username,
      orderDetails,
      fileName
    );

    await EmailTransmitter(ownerEmail, ownerSubject, ownerHtml);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error processing Invoice request:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
      error: error.message,
    });
  }
});

const requestMessage = asyncHandler(async (req, res) => {
  try {
    console.log("sikulasu", req.body);
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone and message are required",
      });
    }

    const requesterDetails = {
      name,
      email,
      phone: phone || "Not provided",
      message: message || "No additional message",
    };

    const ownerEmail = NODEMAILER_USERNAME;

    const ownerSubject = `New Message from Contact Us Form Submitted`;
    const ownerHtml = EmailTemplates.contactUsTemplate.owner(requesterDetails);

    await EmailTransmitter(ownerEmail, ownerSubject, ownerHtml);

    const userSubject = "Your Website Enquiry Has Been Received";
    const userHtml = EmailTemplates.contactUsTemplate.user(requesterDetails);

    await EmailTransmitter(email, userSubject, userHtml);

    res.status(200).json({
      success: true,
      message:
        "Message submitted successfully. You will receive a email response shortly.",
    });
  } catch (error) {
    console.error("Error processing message request:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your message",
      error: error.message,
    });
  }
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
  requestQuotaForExportProduct,
  requestInvoiceForPlacedOrder,
  requestMessage,
  fetchAllProductsAdmin,
};
