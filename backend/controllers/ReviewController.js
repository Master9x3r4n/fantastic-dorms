// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import Review from './Review'; 

// Read the cloudinary environment variable
require('dotenv').config();

// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// configure cloudinary
console.log(cloudinary.config().cloud_name);

const maxMedia = 4;

class ReviewController {
    async create(req, res) {
        if (!req.body.content.title) {
            res.status(400).send({message: "Title cannot be empty."});
            return;
        } else if (!req.body.content.description) {
            res.status(400).send({message: "Content cannot be empty."});
            return;
        } else if (!req.body.listingId) {
            res.status(400).send({message: "Given listing is invalid."});
            return;
        } else if (!req.body.username) {
            res.status(400).send({message: "User/author is invalid."});
            return;
        }
        
        let cldnryJson;
        const pictures = req.body.media;
        const mediaCount = pictures.length;
        let urls = [];
        
        // Check if image can be uploaded
        try {
            for (let i = 0; i < maxMedia; i++){
                if (i < mediaCount)
                {
                    cldnryJson = await cloudinary.uploader.
                    upload(pictures[i], {
                        resource_type: "image",
                        public_id: `${req.body._id}-${i}`,
                        folder: 'reviewPictures',
                    })
                    urls[i] = cldnryJson.secure_url;
                }
                else
                {
                    urls[i] = '';
                }
            }

        } catch (error) {
            console.log(error);
            return  res.status(500).send({
                message: 'An error occured while uploading picture'
            });
        }

        const newReview = new Review({
            listingId: req.body.listingId,
            username: req.body.username,
            
            content: {
                title: req.body.content.title,
                description: req.body.content.description,
                reply: ""
            },
            rating: [
                { name: "Cleanliness",  value: req.body.rating[0].value },
                { name: "Comfort",      value: req.body.rating[1].value },
                { name: "Spaciousness", value: req.body.rating[2].value },
                { name: "Price",        value: req.body.rating[3].value }
            ],
            score: 0,
            media: urls,     
            createdAt: req.body.createdAt
        });


        newReview
            .save(newReview)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "An error occurred while creating the review."
                });
            });
    };

    findAllByTitle(req, res) {
        const title = req.query.title;
        var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

        Review.find(condition)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "An error occurred while retrieving reviews."
                })
            });
    }

    findOneById(req, res) {
        const id = req.params.id;

        Review.findById(id)
            .then(data => {
                if (!data)
                    res.status(404).send({message: `Review with id ${id} not found.`});
                else
                    res.send(data);
            })
            .catch(err => {
                res.status(500).send({ message: `Error retrieving review with id ${id}.`});
            });
    }

    async update(req, res) {
        if (!req.content.title) {
            res.status(400).send({ message: "Title cannot be empty." });
            return;
        } else if (!req.content.description) {
            res.status(400).send({ message: "Content cannot be empty." });
            return;
        }

        const fieldName = req.params.fieldName;
        const newVal = req.params.newVal;
        const id = req.params.id;

        let cldnryJson;
        const pictures = req.body.media;
        const mediaCount = pictures.length;
        let urls = [];
        
        if (fieldName === 'media')
        {
            // Check if image can be uploaded
            try {
                for (let i = 0; i < maxMedia; i++){

                    if (i < mediaCount)
                    {
                        cldnryJson = await cloudinary.uploader.
                        upload(pictures[i], {
                            resource_type: "image",
                            public_id: `${req.body._id}-${i}`,
                            folder: 'reviewPictures',
                            overwrite: true
                        })
                        urls[i] = cldnryJson.secure_url;
                    }
                    else
                    {
                        urls[i] = '';
                    }
                    
                }

            } catch (error) {
                console.log(error);
                return  res.status(500).send({
                    message: 'An error occured while uploading picture'
                });
            }

            Review.findByIdAndUpdate(id, { media: urls}, { useFindAndModify: false })
            .then(data => {
                if (!data)
                    res.status(404).send({ message: `Cannot update review with id ${id}.` });
                else 
                    res.send({ message: "Review successfully updated." });
            })
            .catch(err => {
                res.status(500).send({ message: `Error updating review with id ${id}.`});
            });
        }
        else
        {
            Review.findByIdAndUpdate(id, { [fieldName]: newVal}, { useFindAndModify: false })
            .then(data => {
                if (!data)
                    res.status(404).send({ message: `Cannot update review with id ${id}.` });
                else 
                    res.send({ message: "Review successfully updated." });
            })
            .catch(err => {
                res.status(500).send({ message: `Error updating review with id ${id}.`});
            });
        }
    }

    async delete(req, res) {
        const id = req.params.id;
        let review;
        let mediaCount
        try {
            review = await Review.findById(id);

            if (!review) {
                return res.status(404).send({ message: "Review not found" });
            }

            mediaCount = review.media.length;
        } catch (error){
            res.status(500).send({ message: "Error deleting review", error });
        }

        Review.findByIdAndRemove(id)
            .then(data => {
                if (!data)
                    res.status(404).send({ message: `Cannot delete review with id ${id}.` });
                else
                {
                    // Delete image from cloudinary
                    try {
                        for (let i = 0; i < mediaCount; i++)
                        {
                            cloudinary.uploader
                            .destroy(`${id}-${i}`, {
                                resource_type: 'image'
                            })
                            .then(result => console.log(result))
                        }
                    } catch (error) {
                        console.log(error);
                    }

                    res.send({ message: "Review was deleted successfully!" });
                }
            })
            .catch(err => {
                res.status(500).send({ message: `Could not delete Review with id ${id}.` });
            });
    }
}

export default new ReviewController();