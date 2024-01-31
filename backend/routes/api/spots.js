const express = require('express');
const { Spot, SpotImage, Review, Sequelize } = require('../../db/models');
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

module.exports = router;
