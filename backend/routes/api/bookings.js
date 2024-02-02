const express = require('express');
const { Spot, SpotImage, Review, ReviewImage, User, Booking, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;

    try {
        let bookings = await Booking.findAll({
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

        bookings = bookings.map(booking => {
            const bookingJSON = booking.toJSON();

            const previewImage = bookingJSON.Spot.SpotImages.length > 0 ? bookingJSON.Spot.SpotImages[0].url : null;

            bookingJSON.Spot.previewImage = previewImage;
            delete bookingJSON.Spot.SpotImages;

            return {
                id: bookingJSON.id,
                spotId: bookingJSON.spotId,
                Spot: {
                    ...bookingJSON.Spot,
                    previewImage: previewImage 
                },
                userId: bookingJSON.userId,
                startDate: bookingJSON.startDate,
                endDate: bookingJSON.endDate,
                createdAt: bookingJSON.createdAt,
                updatedAt: bookingJSON.updatedAt
            };
        });

        res.status(200).json({ Bookings: bookings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/:bookingId', requireAuth, async (req, res) => {
    const { startDate, endDate } = req.body;
    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    try {
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking couldn't be found" });
        }

        if (booking.userId !== userId) {
            return res.status(403).json({ message: "Not authorized to edit this booking" });
        }

        if (new Date(booking.endDate) < new Date()) {
            return res.status(403).json({ message: "Past bookings can't be modified" });
        }

        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        if (startDateObj >= endDateObj) {
            return res.status(400).json({ errors: { endDate: "endDate cannot come before startDate" } });
        }

        const existingBookings = await Booking.findAll({
            where: {
                spotId: booking.spotId,
                id: { [Sequelize.Op.ne]: bookingId }
            }
        });

        for (const existingBooking of existingBookings) {
            const existingStartDate = new Date(existingBooking.startDate);
            const existingEndDate = new Date(existingBooking.endDate);

            if ((startDateObj < existingEndDate && endDateObj > existingStartDate) ||
                startDateObj.getTime() === existingEndDate.getTime() ||
                endDateObj.getTime() === existingStartDate.getTime()) {
                return res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    errors: {
                        startDate: "Start date conflicts with an existing booking",
                        endDate: "End date conflicts with an existing booking"
                    }
                });
            }
        }

        booking.startDate = startDate;
        booking.endDate = endDate;
        await booking.save();

        res.status(200).json(booking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    try {
        const bookingId = parseInt(req.params.bookingId, 10);
        const userId = req.user.id;

        const booking = await Booking.findByPk(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking couldn't be found" });
        }

        const spot = await Spot.findByPk(booking.spotId);

        if (booking.userId !== userId && (!spot || spot.ownerId !== userId)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (new Date(booking.startDate) <= new Date()) {
            return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
        }

        await booking.destroy();
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;


module.exports = router;
