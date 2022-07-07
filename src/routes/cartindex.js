const { Router } = require('express')
const router = Router()
const fs = require('fs');

const { userAuth } = require('../controllers/userAuth')

let id;

class CartContenedor {
    constructor (nombreArchivo) {
        this.dbcart = nombreArchivo;
    }
    
    async getAll() {
        try {
            return JSON.parse(await fs.promises.readFile(this.dbcart,'utf-8'));
        }
        catch(e) {
            console.log("Hubo un error de lectura: ", e);
        }
    }
    
    async save(objectNew) {
        try {
            const object = JSON.parse(await fs.promises.readFile(this.dbcart,'utf-8'));
            
            try {
                await fs.promises.writeFile(this.dbcart, JSON.stringify(objectNew));
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
            const object = JSON.parse(await fs.promises.readFile(this.dbcart,'utf-8'));
            return object.find(x => x.id === number)
        }
        catch(e) {
            console.log(e);
        }
    }
    
    async deleteById(number) {
        try {
            const object = JSON.parse(await fs.promises.readFile(this.dbcart,'utf-8'));
            let newObject = object.filter(idDelete => idDelete.id != number);
            
            try {
                await fs.promises.writeFile(this.dbcart, JSON.stringify(newObject));
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
            await fs.promises.writeFile(this.dbcart,"[]");
            console.log("Archivo borrado/inicializado");
        }
        catch(e) {
            console.log("Hubo un error de escritura: ", e);
        }
    }

}

const carritos = new CartContenedor('./carrito.txt');

router.get('/', async(req,res)=> {
    cntCart = Object.keys(await carritos.getAll()).length
    if (cntCart > 0) {
        res.status(200).json(await carritos.getAll())
    } else {
        res.status(404).json({error: 'No hay carritos'})
    }
})

router.get('/:id/productos',async(req,res) => {
    cartId = Number(req.params.id)

    if (await carritos.getById(cartId) === undefined) {
        res.status(404).json({error: "carrito no encontrado"})
    } else {
        res.status(201).json(await carritos.getById(cartId))
    }
})

router.post('/',userAuth , async (req,res) => {
    let id
    tempId=0

    carts = await carritos.getAll()
    carts.forEach(element => {
        if ( tempId < element.id) {
            tempId=element.id
        }
        id=tempId+1
    })
    timeStamp = Date.now()
    
    carts.push({id,timeStamp,"productos":[]})
    await carritos.save(carts)
    res.status(201).json(await carritos.getById(id))
})

router.post('/:id/productos',userAuth , async (req,res) => {
    cartId = Number(req.params.id)
    cartActual = await carritos.getAll()
    cartToMod = await carritos.getById(cartId)
        
    const { id_prod, cant } = req.body

    let cantNum = Number(cant)
    let id_prodNum = Number(id_prod)

    if (cartToMod === undefined) {
        res.status(404).json({error: "carrito no encontrado"})
    } else {
        cartToMod.productos.push({'id_prod':id_prodNum,'cant':cantNum})
        
        cartIndex = cartActual.findIndex(buscaCartId => buscaCartId.id === Number(cartId))
        cartActual.splice(cartIndex,1,cartToMod)
        carritos.save(cartActual)
        res.status(201).json(cartToMod)
    }
})

router.delete('/:id',userAuth, async(req,res) => {
    id = Number(req.params.id)
    const cartActual = await carritos.getAll()
    if (await carritos.getById(id) !== undefined) {
        carritosNew = (cartActual.filter(buscaId => buscaId.id !== Number(id)))
        carritos.save(carritosNew)
        res.status(201).json(carritosNew)
    } else {
        res.status(404).json({ error : 'producto no encontrado' })
    }
})

router.delete('/:id/productos/:id_prod',userAuth, async(req,res) => {
    id = Number(req.params.id)
    id_prod = Number(req.params.id_prod)
    const cartActual = await carritos.getAll()
    const cartToChange = await carritos.getById(id)
    cartIndex = cartActual.findIndex(buscaCartId => buscaCartId.id === Number(id))
    if (cartToChange !== undefined) {
        prodIndex = cartToChange.productos.findIndex(buscaId => buscaId.id_prod === id_prod)
        console.log(prodIndex)
        if (prodIndex >= 0) {
            cartActual.splice(cartIndex,1)
            cartToChange.productos.splice(prodIndex,1)
            cartActual.push(cartToChange)
            res.status(201).json(cartActual)
            carritos.save(cartActual)
        } else {
            return res.status(404).json({ error : 'producto no encontrado' })    
        }
    } else {
        return res.status(404).json({ error : 'carrito no encontrado' })
    }
})

module.exports = router