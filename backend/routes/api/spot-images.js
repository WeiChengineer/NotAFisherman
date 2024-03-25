const express = require('express');
const { Spot, SpotImage, Review, ReviewImage, User, Booking, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    try {
        const imageId = parseInt(req.params.imageId, 10);
        const userId = req.user.id;

        const spotImage = await SpotImage.findByPk(imageId, {
            include: {
                model: Spot,
                attributes: ['ownerId']
            }
        });

        if (!spotImage) {
            return res.status(404).json({ message: "Spot Image couldn't be found" });
        }

        if (spotImage.Spot.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await spotImage.destroy();
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
