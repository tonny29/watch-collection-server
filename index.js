const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()
const app = express();
app.use(cors());
app.use(express.json())
const port = process.env.PORT || 7000;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tjpkh.mongodb.net/watchCollections?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect(e => {
            const database = client.db('watchCollection')
            const productsCollection = client.db('watchCollections').collection('watch');
            const orderCollection = database.collection('allOrders');
            const userCollection = database.collection('user');
            const userReviewCollection = database.collection('review');
            // const databaseCollection=database.collection('watch');
            //add product
            app.post('/addProduct', (req, res) => {
                const name = req.body.name;
                const description = req.body.description;
                const price = req.body.price;
                const image = req.body.image;
                productsCollection.insertOne({ name, description, price, image }).then(result => {
                    res.send(result.insertedCount > 0)
                })
            })

            // get product detail
            app.get('/getProduct', (req, res) => {
                productsCollection.find({})
                    .toArray((error, document) => {
                        res.send(document)
                    })
            });

            // delete a product 
            app.delete('/getProduct/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const result = await productsCollection.deleteOne(query);
                res.json(result);
                console.log(result);
            })


            //post method for collecting order
            app.post('/allOrder', async (req, res) => {
                const allOrder = req.body;
                const result = await orderCollection.insertOne(allOrder);
                res.json(result);
                console.log(result);
            })

            app.get('/allOrder', async (req, res) => {
                const cursor = orderCollection.find()
                const result = await cursor.toArray()
                res.json(result);
                console.log(result);
            })

            //delete for order
            app.delete('/allOrder/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const result = await orderCollection.deleteOne(query);
                res.json(result);
                console.log(result);
            })

            // post mathod for save user 
            app.post('/user', async (req, res) => {
                const user = req.body;
                const result = await userCollection.insertOne(user);
                console.log('register user', result);
                res.json(result);
            })

            // put mathod for google user 
            app.put('/user', async (req, res) => {
                const user = req.body;
                const filter = { email: user.email };
                const options = { upsert: true };
                const updateDoc = { $set: user };
                const result = await userCollection.updateOne(filter, updateDoc, options);
                res.json(result);
            })

            // make admin 
            app.put('/user/admin', async (req, res) => {
                const user = req.body;
                const filter = { email: user.email };
                const updateDoc = { $set: { role: 'admin' } };
                const result = await userCollection.updateOne(filter, updateDoc);
                res.json(result);
            })

            // get admin 
            app.get('/user/:email', async(req, res) =>{
                const email = req.params.email;
                const query = { email: email};
                const user = await userCollection.findOne(query)
                let isAdmin = false;
                if(user?.role == 'admin'){
                  isAdmin = true
                }
                res.json({admin: isAdmin})
              })

              //add reviews
              app.post('/review', async (req, res) => {
                const review = req.body;
                const result = await userReviewCollection.insertOne(review);
                res.json(result);
            })

            //get review
            app.get('/review', async (req, res) => {
                const cursor = userReviewCollection.find()
                const result = await cursor.toArray()
                res.json(result);
            })

        });

    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('This Project Is All About watch')
})

app.listen(port, () => {
    console.log('Port Number', port)
})