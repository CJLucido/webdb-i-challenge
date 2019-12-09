const express = require('express')

const db = require("../data/dbConfig")

const router = express.Router()

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




module.exports = router;