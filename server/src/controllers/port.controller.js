const { prisma } = require("../config/prismaClient.config.js");
const asyncHandler = require("../middlewares/asyncHandler.js");

const createPort = asyncHandler(async (req, res) => {
  const { country, district } = req.body;

  if (!country && !district) {
    return res.status(400).json({ error: "Name is required" });
  }

  const port = await prisma.Port.create({
    data: { country: country, district: district },
  });

  res.status(201).json(port);
});

const updatePort = asyncHandler(async (req, res) => {
  const { country, district } = req.body;
  const { portId } = req.params;

  const port = await prisma.Port.findUnique({
    where: { id: parseInt(portId) },
  });

  if (!port) {
    return res.status(404).json({ error: "Port not found" });
  }

  const updatedPort = await prisma.Port.update({
    where: { id: parseInt(portId) },
    data: { country: country, district: district },
  });

  res.json(updatedPort);
});

const removePort = asyncHandler(async (req, res) => {
  const { portId } = req.params;

  const port = await prisma.Port.findUnique({
    where: { id: parseInt(portId) },
  });

  if (!port) {
    return res.status(404).json({ error: "Category not found" });
  }

  await prisma.Port.delete({
    where: { id: parseInt(portId) },
  });

  res.json({ message: "Port removed successfully" });
});

const listPort = asyncHandler(async (req, res) => {
  const port = await prisma.Port.findMany();
  res.json(port);
});

module.exports = {
  createPort,
  updatePort,
  removePort,
  listPort,
};
