// routes/archivedRoutes.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const archivedFilePath = path.join(__dirname, '../data/archivedContracts.json');

// Helpers
function getArchivedContracts() {
    if (!fs.existsSync(archivedFilePath)) return {};
    const raw = fs.readFileSync(archivedFilePath);
    return JSON.parse(raw);
}

function saveArchivedContracts(data) {
    fs.writeFileSync(archivedFilePath, JSON.stringify(data, null, 2));
}

// GET - Get all archived contracts for a user
router.get('/:username', (req, res) => {
    const { username } = req.params;
    const allArchived = getArchivedContracts();
    const userArchived = allArchived[username] || [];
    res.json(userArchived);
});

// POST - Archive a new contract
router.post('/:username', (req, res) => {
    const { username } = req.params;
    const contract = req.body;

    const allArchived = getArchivedContracts();
    if (!allArchived[username]) {
        allArchived[username] = [];
    }

    allArchived[username].push(contract);
    saveArchivedContracts(allArchived);

    res.json({ success: true });
});

// DELETE - Delete an archived contract
router.delete('/:username/:index', (req, res) => {
    const { username, index } = req.params;

    const allArchived = getArchivedContracts();
    if (!allArchived[username] || !allArchived[username][index]) {
        return res.status(404).json({ success: false, message: "Archived contract not found" });
    }

    allArchived[username].splice(index, 1);
    saveArchivedContracts(allArchived);

    res.json({ success: true });
});

module.exports = router;
