const express = require('express');
const { Booking, Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;

    try {
        const bookings = await Booking.findAll({
            where: { userId },
            include: [
                {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                    include: [{
                        model: SpotImage,
                        attributes: ['url'],
                        where: { preview: true },
                        required: false
                    }]
                }
            ]
        });

        res.status(200).json({ Bookings: bookings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
