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
            const productsCollection = client.db('watchCollections').collection('watch');
            // const databaseCollection=database.collection('watch');
            //add product
            app.post('/addProduct', (req, res) => {
                const name = req.body.name;
                const description = req.body.description;
                const price = req.body.price;
                const image=req.body.image;
                productsCollection.insertOne({ name, description, price,image }).then(result => {
                    res.send(result.insertedCount > 0)
                })
            })

            // get product detail
            app.get('/getProduct',(req,res)=>{
                productsCollection.find({})
                .toArray((error,document)=>{
                    res.send(document)
                })
            });


            //connect admin pannel

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