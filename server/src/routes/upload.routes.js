
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({ 
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../client/src/assets/images/Product_Images'));
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
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

const upload = multer({ storage, fileFilter });

const uploadMultipleImages = upload.array("images", 4);

module.exports = uploadMultipleImages; 