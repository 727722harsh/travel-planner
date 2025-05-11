
const express = require("express");
const User = require("../models/User");
const router = express.Router();


router.post("/addPlan", async (req, res) => {
    const { userId, location, plan } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        let loc = user.locations.find((l) => l.name === location);

        if (!loc) {
            user.locations.push({ name: location, plans: [plan] });
        } else {
            loc.plans.push(plan);
        }

        await user.save();
        res.json(user.locations);
    } catch (err) {
        console.error("Error saving plan:", err.message);
        res.status(500).json({ error: err.message });
    }
});

router.get("/getProfile/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({
            user: {
                name: user.username,
                email: user.email,
            },
            locations: user.locations,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get("/test", (req, res) => {
    res.send("Test route works!");
});
module.exports = router;
