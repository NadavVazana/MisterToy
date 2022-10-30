const reviewService = require('./review.service')



async function getReviews(req,res){
    try{
        const reviews = await reviewService.query(req.query)
        res.send(reviews)

    }
    catch(err){
        res.status(500).send({err:'Failed to get the reviews'})
    }
}

async function addReviews(req,res){
    try{
        const review = await reviewService.addReviews(req.body)
        res.send(review)
    }
    catch(err){
        console.log(err);
    }


}

module.exports={
    addReviews,
    getReviews
}