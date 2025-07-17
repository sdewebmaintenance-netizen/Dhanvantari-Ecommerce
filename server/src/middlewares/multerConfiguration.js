const path = require("path");
const fs = require('fs');
const multer = require("multer");

const productImagesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destPath = path.join(__dirname, "../uploads/Product_Images");
    fs.mkdirSync(destPath, { recursive: true }); 
    console.log("Saving file to:", destPath);
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${extname}`;
    console.log("Generated filename:", filename);
    cb(null, filename);
  },
});

const invoiceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/invoices");
    fs.mkdirSync(uploadDir, { recursive: true }); 
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `invoice-${uniqueSuffix}.pdf`);
  },
});

const imageFileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const uploadProductImages = multer({ 
  storage: productImagesStorage, 
  fileFilter: imageFileFilter 
}).array("images", 4);

const uploadInvoice = multer({ 
  storage: invoiceStorage, 
  fileFilter: pdfFileFilter 
}).single("invoice");

const uploadsDir = path.join(__dirname, '../uploads');
const staticFileOptions = {
  setHeaders: (res, path) => {
    if (path.endsWith('.pdf')) {
      res.set('Content-Disposition', 'attachment');
    }
  }
};

module.exports = { 
  uploadProductImages, 
  uploadInvoice,
  uploadsDir,
  staticFileOptions
};