const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const contractsFilePath = path.join(__dirname, '../data/contracts.json');

// Helpers
function getContracts() {
  if (!fs.existsSync(contractsFilePath)) return {};
  const raw = fs.readFileSync(contractsFilePath);
  return JSON.parse(raw);
}

function saveContracts(data) {
  fs.writeFileSync(contractsFilePath, JSON.stringify(data, null, 2));
}

// GET all contracts for a user
router.get('/:username', (req, res) => {
  const { username } = req.params;
  const allContracts = getContracts();
  const userContracts = allContracts[username] || [];
  res.json(userContracts);
});

// POST a new contract (now uses frontend-calculated payments)
router.post('/:username', (req, res) => {
  const { username } = req.params;
  const {
    displayName,
    content,
    date,
    lenderSignature,
    borrowerSignature,
    lenderQR,
    borrowerQR,
    startDate,
    paymentCount,
    repaymentSchedule,
    loanAmount,
    interestRate,
    interestType,
    payments // Accept pre-calculated payments directly
  } = req.body;

  const newContract = {
    displayName,
    content,
    date,
    lenderSignature,
    borrowerSignature,
    lenderQR,
    borrowerQR,
    startDate,
    paymentCount,
    repaymentSchedule,
    loanAmount,
    interestRate,
    interestType,
    payments
  };

  const allContracts = getContracts();
  if (!allContracts[username]) {
    allContracts[username] = [];
  }

  allContracts[username].push(newContract);
  saveContracts(allContracts);

  res.json({ success: true });
});

// DELETE a contract by index
router.delete('/:username/:index', (req, res) => {
  const { username, index } = req.params;

  const allContracts = getContracts();
  if (!allContracts[username] || !allContracts[username][index]) {
    return res.status(404).json({ success: false, message: "Contract not found" });
  }

  allContracts[username].splice(index, 1);
  saveContracts(allContracts);

  res.json({ success: true });
});

// PUT: Update a specific contract at index
router.put('/:username/:index', (req, res) => {
  const { username, index } = req.params;
  const updatedContract = req.body;

  const allContracts = getContracts();
  if (!allContracts[username] || !allContracts[username][index]) {
    return res.status(404).json({ success: false, message: "Contract not found" });
  }

  allContracts[username][index] = updatedContract;
  saveContracts(allContracts);

  res.json({ success: true });
});

module.exports = router;
