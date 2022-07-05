const { Router } = require('express')
const router = Router()
const fs = require('fs');

const { userAuth } = require('../controllers/userAuth')

let id;

class Contenedor {
    constructor (nombreArchivo) {
        this.dbprod = nombreArchivo;
    }
    
    async getAll() {
        try {
            return JSON.parse(await fs.promises.readFile(this.dbprod,'utf-8'));
        }
        catch(e) {
            console.log("Hubo un error de lectura: ", e);
        }
    }
    
    async save(objectNew) {
        try {
            const object = JSON.parse(await fs.promises.readFile(this.dbprod,'utf-8'));
            
            try {
                await fs.promises.writeFile(this.dbprod, JSON.stringify(objectNew));
                }
            catch(e) {
                    console.log("Hubo un error de escritura: ", e);
            }
        }
        catch(e) {
            console.log("Hubo un error de lectura: ", e);
        }
    }
    
    async getById(number) {
        try {
            const object = JSON.parse(await fs.promises.readFile(this.dbprod,'utf-8'));
            return object.find(x => x.id === number)
        }
        catch(e) {
            console.log(e);
        }
    }
    
    async deleteById(number) {
        try {
            const object = JSON.parse(await fs.promises.readFile(this.dbprod,'utf-8'));
            let newObject = object.filter(idDelete => idDelete.id != number);
            
            try {
                await fs.promises.writeFile(this.dbprod, JSON.stringify(newObject));
            }
            catch(e) {
                console.log("Hubo un error de escritura: ", e);
            }
            
        }
        catch(e) {
            console.log(e);
        }
    }
    
    async deleteAll() {
        try {
            await fs.promises.writeFile(this.dbprod,"[]");
            console.log("Archivo borrado/inicializado");
        }
        catch(e) {
            console.log("Hubo un error de escritura: ", e);
        }
    }

}

const productos = new Contenedor('./productos.txt');

router.get('/productos', async(req,res)=> {
    cntProd = Object.keys(await productos.getAll()).length
    if (cntProd > 0) {
        res.status(200).json(await productos.getAll())
    } else {
        res.status(404).json({error: 'No hay productos'})
    }
})

router.get('/productos/:id',async(req,res) => {
    prodId = Number(req.params.id)

    if (await productos.getById(prodId) === undefined) {
        res.status(404).json({error: "producto no encontrado"})
    } else {
        res.status(201).json(await productos.getById(prodId))
    }
})

router.post('/productos',userAuth , async (req,res) => {
    tempId=0
    prods = await productos.getAll()
    cntProds = prods.length
    prods.forEach(element => {
        if ( tempId < element.id) {
            tempId=element.id
        }
        id=tempId+1
    });
    
    const { title, price, thumbnail } = req.body
    prods.push({id,title,price,thumbnail})
    productos.save(prods)
    res.status(201).json(await productos.getById(id))
})

router.put('/productos/:id',userAuth, async (req,res) => {
    id = Number(req.params.id)
    title = req.body.title
    price = req.body.price
    thumbnail = req.body.thumbnail
    let resultado = "";
    let i;

    const products = await productos.getAll()

    for (i = 0; i < products.length ; i++) {
        if (id === products[i].id) {
            resultado = 'encontrado';
            products.splice(i, 1, {
                                        id: products[i].id,
                                        title: title,
                                        price: price,
                                        thumbnail: thumbnail
                                    }); 
            console.log(products)
            await productos.save(products)
            res.status(201).json(productos.getById(id))
        } 
    }

    if (resultado !== 'encontrado') {
        res.status(404).json({ error : 'producto no encontrado' })
    }
})

router.delete('/productos/:id',userAuth, async(req,res) => {
    id = Number(req.params.id)
    const prodActual = await productos.getAll()
    if (await productos.getById(id) !== undefined) {
        productosNew = (prodActual.filter(buscaId => buscaId.id !== Number(id)))
        productos.save(productosNew)
        res.status(201).json(productosNew)
    } else {
        res.status(404).json({ error : 'producto no encontrado' })
    }
})

module.exports = router