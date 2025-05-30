const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path to users.json file
const usersFilePath = path.join(__dirname, '../data/users.json');

// Helper: Load users from file
function getUsers() {
    if (!fs.existsSync(usersFilePath)) return [];
    const rawData = fs.readFileSync(usersFilePath);
    return JSON.parse(rawData);
}

// Helper: Save users to file
function saveUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Signup Route
router.post('/signup', (req, res) => {
    const {
        username,
        password,
        email,
        firstName,
        lastName,
        phone,
        address
    } = req.body;

    const users = getUsers();

    if (users.find(u => u.username === username)) {
        return res.json({ success: false, message: "Username already exists." });
    }

    const newUser = {
        username,
        password,
        email,
        firstName,
        lastName,
        phone,
        address
    };

    users.push(newUser);
    saveUsers(users);

    res.json({ success: true, user: newUser });
});

// Login Route
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const users = getUsers();
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        res.json({ success: true, user });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});

// Update User Info Route (RESTful)
router.put('/:username', (req, res) => {
    const { username } = req.params;
    const updatedData = req.body;

    const users = getUsers();
    const index = users.findIndex(u => u.username === username);

    if (index === -1) {
        return res.json({ success: false, message: "User not found" });
    }

    const existingUser = users[index];

    // Merge existing user with updated fields (preserve password if not provided)
    const updatedUser = {
        ...existingUser,
        ...updatedData,
        password: updatedData.password || existingUser.password,
        username: existingUser.username // Don't allow username to change
    };

    users[index] = updatedUser;
    saveUsers(users);

    res.json({ success: true, user: updatedUser });
});

module.exports = router;
