const express = require('express')
const app = express()
require('dotenv').config()
const portExpress = process.env.EXPRESS_PORT

console.log(portExpress)
console.log(process.env.EXPRESS_PORT)

const routesProd = require('./routes/index')
const routesCart = require('./routes/cartindex')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/productos', routesProd)
app.use('/api/carrito', routesCart)
app.use((req,res) => {
    res.status(404).json({ error : 'not found' })
});

app.listen(portExpress, (e) => {
    if (e) {
        console.log('error')
    } else {
        console.log('server ok')
    }
})