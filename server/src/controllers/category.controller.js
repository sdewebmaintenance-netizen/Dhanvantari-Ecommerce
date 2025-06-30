const { prisma } = require("../config/prismaClient.config.js");
const asyncHandler = require("../middlewares/asyncHandler.js");


const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const existingCategory = await prisma.category.findUnique({
    where: { name }
  });

  if (existingCategory) {
    return res.status(400).json({ error: "Category already exists" });
  }

  const category = await prisma.category.create({
    data: { name }
  });

  res.status(201).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { categoryId } = req.params;

  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) }
  });

  if (!category) {
    return res.status(404).json({ error: "Category not found" });
  }

  const updatedCategory = await prisma.category.update({
    where: { id: parseInt(categoryId) },
    data: { name }
  });

  res.json(updatedCategory);
});

const removeCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;


  const category = await prisma.category.findUnique({
    where: { id: parseInt(categoryId) }
  });

  if (!category) {
    return res.status(404).json({ error: "Category not found" });
  }


  await prisma.category.delete({
    where: { id: parseInt(categoryId) }
  });

  res.json({ message: "Category removed successfully" });
});

const listCategory = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

const exportCategories = asyncHandler(async (req, res) => {
  const exportCategories = await prisma.ExportCategory.findMany();
  res.json(exportCategories);
});


module.exports = {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  exportCategories
};