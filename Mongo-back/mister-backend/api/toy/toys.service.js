// const gToys = require('../data/toys.json')
const dbService = require('../../services/db.service')
// const utilService = require('../services/util.service')

const ObjectId = require('mongodb').ObjectId
const fs = require('fs')


module.exports = {
    query,
    removeToy,
    getById,
    addToy,
    updateToy
}


async function query(filterBy) {
    const criteria = {}
    const collection = await dbService.getCollection('toy')
    const toys = await collection.find(criteria).toArray()
    let newToys = toys
    if (!filterBy.name && !filterBy.stock && !filterBy.sort)
        return newToys
    if (filterBy.name) {
        newToys = newToys.filter(toy => toy.name.toLowerCase().includes(filterBy.name.toLowerCase()))
    }
    if (filterBy.stock === "true") {
        newToys = newToys.filter(toy => toy.stock === JSON.parse(filterBy.stock))
    }
    if (filterBy.sort) {
        switch (filterBy.sort) {
            case 'Name':
                newToys.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'Price':
                newToys.sort((a, b) => a.price - b.price)
                break
            case 'Created At':

                newToys.sort((a, b) => a.createdAt - b.createdAt)
        }
    }

    return newToys




}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        
        const toy = collection.findOne({ _id: ObjectId(toyId) })
        return toy
    }

    catch {
        console.log('Could not find a user with that ID');
    }
}

async function addToy(toy){
    try{
        const collection = await dbService.getCollection('toy')
        const addedToy = await collection.insertOne(toy)
        const newToy = getById(addedToy.insertedId)
        console.log(newToy);
        return newToy

    }
    catch{
        console.log('Cant add the toy!');
    }
}

async function updateToy(toy){

    var id = ObjectId(toy._id)
    delete toy._id
    const collection = await dbService.getCollection('toy')
    await collection.updateOne({ _id: id }, { $set: { ...toy } })
    return toy

}




async function removeToy(toyId) {
    try{
        const collection = await dbService.getCollection('toy')
        collection.deleteOne({_id:ObjectId(toyId)})
        console.log(toyId);

    }

    catch{
        console.log('Cannot remove the toy');
    }
    
    
    
}


