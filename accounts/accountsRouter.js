const express = require('express')

const db = require("../data/dbConfig")

const router = express.Router()


//ENDPOINTS

//POST

router.post('/', (req, res) => {

    db('accounts')
    .insert(req.body, 'id')
    .then(ids => {
        const id = ids[0] //the first one will be the last one (entered/added)

        return db('accounts')
                .select('name', 'budget')
                .where({id})
                .first()
                .then(account => {
                    res.status(200).json(account)
                })

    })
    .catch(err => {
        console.log("this is POST err, server", err)
        res.status(500).json({error: "server POST issue"})
    })
})


//READ

router.get('/', (req, res)=> {
    db('accounts')
    .select('*')
    .then(accounts => {
        res.status(200).json(accounts)
    })
    .catch(err => {
        console.log("this is GET err, server", err)
        res.status(500).json({error: "server GET issue"})
    })
    
})

router.get('/:id', validateId, (req, res) => {
    db('accounts')
    .select('*')
    .where({id: req.params.id})
    .first()
    .then(account => {
        res.status(200).json(account)
    })
    .catch(err => {
        console.log("this is GET err, server", err)
        res.status(500).json({error: "server GET issue"})
    })
})

//UPDATE

router.put('/:id', validateId, (req, res) => {
    db('accounts')
    .where({id: req.params.id})
    .update(req.body)
    .then(count => {
        res.status(201).json({message: `Number of accounts changed ${count}`})
    })
    .catch(err => {
        console.log("this is PUT err, server", err)
        res.status(500).json({error: "server PUT issue"})
    })
})

//DELETE

router.delete('/:id', validateId, (req, res) =>{
    db('accounts')
    .where("id", "=", req.params.id)
    .del()
    .then(count => {
        res.status(200).json({message: `Number of deleted accounts ${count}`})
    })
    .catch(err => {
        console.log("This is delete err", err)
        res.status(500).json({error: "error deleting, server"})
    })
})

//MIDDLEWARE

function validateId(req, res, next){
    db('accounts')
    .select('*')
    .where({id: req.params.id})
    .first()
    .then(account => {
        if(!account){
            res.status(404).json({error: 'account not found'})
        }
        else{
            next()
        }
    })
    .catch(err => {
        console.log("this is valid id err, server", err)
        res.status(500).json({error: "server valid id"})
    })
}

module.exports = router;