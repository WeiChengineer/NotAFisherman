const express = require('express');
const { Spot, SpotImage, Review, ReviewImage, User, Sequelize } = require('../../db/models');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const spots = await Spot.findAll({
            include: [
                {
                    model: SpotImage,
                    as: 'SpotImages',
                    attributes: ['url'],
                    where: { preview: true },
                    limit: 1
                },
                {
                    model: Review,
                    attributes: []
                }
            ],
            attributes: {
                include: [
                    [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']
                ]
            },
            group: ['Spot.id']
        });

        const spotsResponse = spots.map(spot => {
            const spotJSON = spot.toJSON();
            spotJSON.avgRating = parseFloat(spotJSON.avgRating).toFixed(1);

            if (spotJSON.SpotImages && spotJSON.SpotImages.length) {
                spotJSON.previewImage = spotJSON.SpotImages[0].url;
            }
            delete spotJSON.SpotImages;
            return spotJSON;
        });

        res.status(200).json({ Spots: spotsResponse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/current', requireAuth, async (req, res) => {
    try {
        const currentUserId = req.user.id;

        const ownedSpots = await Spot.findAll({
            where: { ownerId: currentUserId },
            include: [
                {
                    model: SpotImage,
                    as: 'SpotImages',
                    attributes: ['url'],
                    where: { preview: true },
                    limit: 1
                },
                {
                    model: Review,
                    attributes: []
                }
            ],
            attributes: {
                include: [
                    [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']
                ]
            },
            group: ['Spot.id']
        });

        const ownedSpotsResponse = ownedSpots.map(spot => {
            const spotJSON = spot.toJSON();
            spotJSON.avgRating = parseFloat(spotJSON.avgRating).toFixed(1);

            if (spotJSON.SpotImages && spotJSON.SpotImages.length) {
                spotJSON.previewImage = spotJSON.SpotImages[0].url;
            }
            delete spotJSON.SpotImages;
            return spotJSON;
        });

        res.status(200).json({ Spots: ownedSpotsResponse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/:spotId', async (req, res) => {

    try {
        const spotId = parseInt(req.params.spotId, 10)

        if (isNaN(spotId)) {
            return res.status(400).json({ error: "\"spotId\" must be a valid integer" })
        }

        const spot = await Spot.findByPk(spotId, {
            include: [
                {
                    model: SpotImage,
                    as: 'SpotImages',
                    attributes: ['id', 'url', 'preview']
                },
                {
                    model: Review,
                    attributes: []
                },
                {
                    model: User,
                    as: 'Owner',
                    attributes: ['id', 'firstName', 'lastName']
                }
            ],
            attributes: {
                include: [
                    [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
                    [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgStarRating']
                ]
            },
            group: ['Spot.id', 'SpotImages.id', 'Owner.id']
        });

        if (spot) {
            spot.avgStarRating = parseFloat(spot.avgStarRating).toFixed(1);
            res.status(200).json(spot);
        } else {
            res.status(404).json({ message: "Spot couldn't be found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const ownerId = req.user.id;

    try {
        const newSpot = await Spot.create({
            ownerId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        });

        return res.status(201).json(newSpot);
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            const errors = {};
            err.errors.forEach((error) => {
                errors[error.path] = error.message;
            });
            return res.status(400).json({ message: "Validation error", errors });
        } else {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    }
});

router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;
    const userId = req.user.id;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        if (spot.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden. You don't have permission to add an image to this spot." });
        }

        const newImage = await SpotImage.create({
            spotId,
            url,
            preview
        });

        res.status(200).json({
            id: newImage.id,
            url: newImage.url,
            preview: newImage.preview
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/:spotId', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const userId = req.user.id;
    try {
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        if (spot.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden. You don't have permission to edit this spot." });
        }

        await spot.update({ address, city, state, country, lat, lng, name, description, price });

        res.status(200).json(spot);
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            const errors = err.errors.reduce((acc, error) => ({
                ...acc,
                [error.path]: error.message,
            }), {});

            return res.status(400).json({
                message: "Bad Request",
                errors,
            });
        } else {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }
});

router.delete('/:spotId', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user.id;
    try {
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        if (spot.ownerId !== userId) {
            return res.status(403).json({ message: "Forbidden. You don't have permission to delete this spot." });
        }

        await spot.destroy();
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const reviews = await Review.findAll({
            where: { spotId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });

        res.status(200).json({ Reviews: reviews });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const existingReview = await Review.findOne({
            where: { userId, spotId }
        });
        if (existingReview) {
            return res.status(500).json({ message: "User already has a review for this spot" });
        }

        const newReview = await Review.create({
            userId,
            spotId,
            review,
            stars
        });

        res.status(201).json(newReview);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(e => e.message);
            res.status(400).json({ message: "Bad Request", errors });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

module.exports = router;
