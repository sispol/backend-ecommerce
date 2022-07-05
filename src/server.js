const express = require('express')
const app = express()
const fs = require('fs');
const portExpress = 8000;

const routes = require('./routes/index')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)
app.use((req,res) => {
    res.status(400).send('no existe la ruta')
});

app.listen(portExpress, (e) => {
    if (e) {
        console.log('error')
    } else {
        console.log('server ok')
    }
})