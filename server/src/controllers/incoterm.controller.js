const { prisma } = require("../config/prismaClient.config.js");
const asyncHandler = require("../middlewares/asyncHandler.js");

const createIncoTerm = asyncHandler(async (req, res) => {
  const { inco_term_name } = req.body;

  try {
    if (!inco_term_name) {
      return res.status(400).json({ error: "inco_term_name is required" });
    }

    const incoTerm = await prisma.IncoTerm.create({
      data: { inco_term_name: inco_term_name },
    });

    res.status(201).json(incoTerm);
  } catch (error) {
    console.log(error);
  }
});

const updateIncoTerm = asyncHandler(async (req, res) => {
  const { inco_term_name } = req.body;
  const { incotermId } = req.params;

  try {
    const incoTerm = await prisma.IncoTerm.findUnique({
      where: { id: parseInt(incotermId) },
    });

    if (!incoTerm) {
      return res.status(404).json({ error: "Inco Term not found" });
    }

    const updatedIncoTerm = await prisma.IncoTerm.update({
      where: { id: parseInt(incotermId) },
      data: { inco_term_name: inco_term_name},
    });

    res.json(updatedIncoTerm);

    
  } catch (error) {
    console.log(error);
  }
});

const removeIncoTerm = asyncHandler(async (req, res) => {
  const { incotermId } = req.params;

  const incoterm = await prisma.IncoTerm.findUnique({
    where: { id: parseInt(incotermId) },
  });

  if (!incoterm) {
    return res.status(404).json({ error: "Inco Term  not found" });
  }

  await prisma.IncoTerm.delete({
    where: { id: parseInt(incotermId) },
  });

  res.json({ message: "Inco Term removed successfully" });
});

const listIncoTerm = asyncHandler(async (req, res) => {
  const incoterm = await prisma.IncoTerm.findMany();
  res.json(incoterm);
});

module.exports = {
  createIncoTerm,
  updateIncoTerm,
  removeIncoTerm,
  listIncoTerm,
};
