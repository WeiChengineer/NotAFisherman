const express = require('express');
const { Spot, SpotImage, Review, ReviewImage, User, Booking, Sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;

    try {
        let reviews = await Review.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                    include: [{
                        model: SpotImage,
                        attributes: ['url'],
                        where: { preview: true },
                        required: false
                    }]
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });

        reviews = reviews.map(review => review.toJSON());

        reviews.forEach(review => {
            if (review.Spot.SpotImages && review.Spot.SpotImages.length > 0) {
                review.Spot.previewImage = review.Spot.SpotImages[0].url;
            } else {
                review.Spot.previewImage = null;
            }

            delete review.Spot.SpotImages;
        });

        res.status(200).json({ Reviews: reviews });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    const userId = req.user.id;

    try {
        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        if (review.userId !== userId) {
            return res.status(403).json({ message: "Not authorized to add image to this review" });
        }

        const count = await ReviewImage.count({ where: { reviewId } });
        if (count >= 10) {
            return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
        }

        const reviewImage = await ReviewImage.create({ reviewId, url });
        res.status(200).json(reviewImage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/:reviewId', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { review: newReviewText, stars: newStars } = req.body;
    const userId = req.user.id;

    try {
        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        if (review.userId !== userId) {
            return res.status(403).json({ message: "Not authorized to edit this review" });
        }

        review.review = newReviewText;
        review.stars = newStars;
        await review.save();

        res.status(200).json(review);
    } catch (err) {
        console.error(err);
        if (err.name === 'SequelizeValidationError') {
            const errors = err.errors.map(e => ({ [e.path]: e.message }));
            res.status(400).json({ message: "Validation error", errors });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

router.delete('/:reviewId', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id;

    try {
        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        if (review.userId !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        await review.destroy();

        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
