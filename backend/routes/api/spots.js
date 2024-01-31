const express = require('express');
const { Spot, SpotImage, Review, User, Sequelize } = require('../../db/models');
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

        if (isNaN (spotId)) {
            return res.status(400).json({ error: "\"spotId\" must be a valid integer"})
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

module.exports = router;
