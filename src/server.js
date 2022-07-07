const express = require('express')
const app = express()
const portExpress = 8000;

const routesProd = require('./routes/index')
const routesCart = require('./routes/cartindex')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/productos', routesProd)
app.use('/api/carrito', routesCart)
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