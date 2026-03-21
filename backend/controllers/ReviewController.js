// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import Review from '../models/Review.js'; 
import { v2 as cloudinary } from 'cloudinary';
const maxMedia = 4;

class ReviewController {
    async findAll(req, res) {
        // console.log('QUERY:');
        // console.log(req.query);
        
        let condition = {}
        if (req.query.username) condition['username'] = req.query.username;
        if (req.query.listingId) condition['listingId'] = req.query.listingId;
        if (req.query.title) condition['title'] =  { $regex: `/${title}/`, $options: 'i' };

        // console.log('CONDITION:');
        // console.log(condition);
        Review.find(condition)
            .then(data => {
                if (data)
                    res.status(200).send(data);
                else
                    res.status(404).send({ message: 'Reviews could not be found.' });
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "An error occurred while retrieving reviews."
                })
            });
    }
        
    async find(req, res) {
        const id = req.params.id;
        
        Review.findById(id)
            .then(data => {
                if (data)
                    res.status(200).send(data);
                else
                    res.status(404).send({ message: `Review with ID ${id} could not be found.` });
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || `An error occurred.`
                });
            });
    }
    
    async create(req, res) {
        // let cldnryJson;
        // const pictures = req.body.media;
        // const mediaCount = pictures.length;
        // let urls = [];
        
        // Check if image can be uploaded
        // try {
        //     for (let i = 0; i < maxMedia; i++){
        //         if (i < mediaCount)
        //         {
        //             cldnryJson = await cloudinary.uploader.
        //             upload(pictures[i], {
        //                 resource_type: "image",
        //                 public_id: `${req.body._id}-${i}`,
        //                 folder: 'reviewPictures',
        //             })
        //             urls[i] = cldnryJson.secure_url;
        //         }
        //         else
        //         {
        //             urls[i] = '';
        //         }
        //     }

        // } catch (error) {
        //     console.log(error);
        //     return  res.status(500).send({
        //         message: 'An error occured while uploading picture'
        //     });
        // }

        const newReview = new Review(req.body);
        newReview.save()
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "An error occurred while creating the review."
                });
            });
    };

    async update(req, res) {
        if (!req.body.title) {
            res.status(400).send({ message: "Title cannot be empty." });
            return;
        } else if (!req.body.description) {
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

    async deleteByUser(req, res) {

    }
}

export default new ReviewController();