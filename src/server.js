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

let id;

/*
class Contenedor {

    constructor () {
        this.producto = producto
    }

    getAll() {
            return this.producto
    }
    
    getById(id) {
        return this.producto.find(x => x.id == id)    
    }

    deleteAll() {
            productos = []
            return this.producto
    }

    allItems() {
            return (Object.keys(this.producto).length)
    }

    lastId() {
        let newItem = this.allItems()
        if (newItem === 0) {
            return(1)
        } else {
            return this.producto[newItem-1].id+1
        }
    }

}
*/
