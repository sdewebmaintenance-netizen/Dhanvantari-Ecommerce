const getImage = (imageName) => {
  try {
    const images = require.context("../assets/images", true);
    return images(`./${imageName}`);
  } catch (e) {
    console.error(`Error loading image ${imageName}:`, e);
  }
};

export default getImage