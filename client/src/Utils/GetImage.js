const getImage = (imageName, source) => {
  try {
    let images;
    if (source == "Web-bg") {
      images = require.context("../assets/images/Website-bg", true);
    } else if (source == "ProductImage") {
      images = require.context("../assets/images/Product_Images", true);
    } else if (source == "Certificates") {
      images = require.context("../assets/images/Certificates", true);
    } else {
      images = require.context("../assets/images/Logo", true);
    }

    return images(`./${imageName}`);
  } catch (e) {
    console.error(`Error loading image ${imageName}:`, e);
  }
};

export default getImage;
