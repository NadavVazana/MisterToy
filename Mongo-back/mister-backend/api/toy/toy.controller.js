const { query } = require('express')
const express = require('express')
const toyService = require('../toy/toys.service')
const authService = require('../auth/auth.service')
const loggerService = require('../../services/logger.service')
const router = express.Router()
module.exports = {
    getToys,
    getById,
    removeToy,
    addToy,
    updateToy
    // save
}







// GET ALL
async function getToys(req,res) {
    const filterBy = req.query
    const toys = await toyService.query(filterBy)
    res.send(toys)
}


// GET BY ID
async function getById(req,res){
    const {id} = req.params
    const toy = await toyService.getById(id)
    res.send(toy)
}
// CREATE NEW TOY
async function addToy(req,res){
    try{
    const toy = req.body

    const addedToy = await toyService.addToy(toy)
    res.json(addedToy)}
    catch(err){
        loggerService.error(err)
    }
}


// REMOVE TOY
async function removeToy (req,res){

    const {id} = req.params
    toyService.removeToy(id)
    res.send(Promise.resolve())
}


// UPDATE TOY
async function updateToy(req,res){
    const toy = req.body
    const updatedToy = await toyService.updateToy(toy)
    res.send(updatedToy)
}
