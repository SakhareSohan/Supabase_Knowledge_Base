const express = require('express');
const userService = require('../services/word_embedding/user_services');

const getAllEmbedding = async (req, res) => {
    
        const data = await userService.getAllEmbedding(req.body);
        res.send(data);
    
};

const newEmbedding = async (req, res) => {

        const data = await userService.newEmbedding(req.body);
        res.send(data);
    
};

const userSearch = async (req, res) => {

    const data = await userService.userSearch(req.body.input);
    res.send(data);

};


const router = express.Router();

router.get('/embedding/', getAllEmbedding);
router.post('/embedding/', newEmbedding);
router.post('/search', userSearch)

module.exports = router;