const ObjectId = require('mongodb').ObjectId
const dbService = require('../../services/db.service')
// const asyncLocalStorage = require('../../services/als.service')


// async function query(){
//     try{
//         const criteria = {}
//         const collection = await dbService.getCollection('review')
//         var reviews = await collection.aggregate([
//             {
//                 $match: criteria
//             },
//             {
//                 $lookup:
//                 {
//                     localField: 'userId',
//                     from: 'user',
//                     foreignField: '_id',
//                     as: 'user'
//                 }
                
                
                
//             },
//             {
//                 $unwind:'$user'
//             },
//             {
//             $lookup:
//             {
//                 localField:'toy',
//                 from:'toy',
//                 foreignField:'name',
//                 as:'toy'
//             }},
//             {
//                 $unwind: '$toy'
//             }
//         ]).toArray()
//         reviews = reviews.map(review=>{
//             review.user={userId:user._id,fullname:user.fullname}
//             review.toy = {toy}
//             return review
//         })
        

//         return reviews
//     }
//     catch(err){
//         console.log(err);
//     }
// }

async function query(filterBy) {
    try {
        const criteria = {}
        const collection = await dbService.getCollection('review')
        // console.log( await collection.find(criteria).toArray())
        var reviews = await collection.aggregate([
            {
                $match: criteria
            },
            {
                $lookup:
                {
                    localField: 'userId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'byUser'
                }
            },
            {
                $unwind: '$byUser'
            },

        ]).toArray()
        // console.log(reviews);
        reviews = reviews.map(review => {
            review.byUser = { _id: review.byUser._id, fullname: review.byUser.fullname }
            // review.aboutToy = { _id: review.aboutToy._id, name: review.aboutToy.name }
            delete review.byUserId
            delete review.aboutToyId
            delete review.userId
            console.log(review);
            return review
        })
        
        return reviews
    } catch (err) {
        logger.error('cannot find reviews', err)
        throw err
    }

}


async function addReviews(review){
    try{
        const collection  = await dbService.getCollection('review')
        const reviewToAdd={
            txt: review.txt,
            userId:ObjectId(review.userId),
            toy: review.toy
        }
        await collection.insertOne(reviewToAdd)
        return reviewToAdd
        
    }
    catch(err){
        console.log(err);
    }
}


module.exports={
    addReviews,
    query
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.byUserId) criteria.byUserId = ObjectId(filterBy.byUserId)
    if (filterBy.toyId) criteria.toyId = ObjectId(filterBy.toyId)
    return criteria
}