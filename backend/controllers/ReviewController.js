// reference:
// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/

import Review from './Review'; 

class ReviewController {
    create(req, res) {
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
            media: req.body.media,     
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

    update(req, res) {
        if (!req.content.title) {
            res.status(400).send({ message: "Title cannot be empty." });
            return;
        } else if (!req.content.description) {
            res.status(400).send({ message: "Content cannot be empty." });
            return;
        }

        const id = req.params.id;
        Review.findByIdAndUpdate(id, req.query.updated, { useFindAndModify: false })
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

    delete(req, res) {
        const id = req.params.id;
        Tutorial.findByIdAndRemove(id)
            .then(data => {
                if (!data)
                    res.status(404).send({ message: `Cannot delete review with id ${id}.` });
                else
                    res.send({ message: "Review was deleted successfully!" });
            })
            .catch(err => {
                res.status(500).send({ message: `Could not delete Review with id ${id}.` });
            });
    }
}

export default new ReviewController();