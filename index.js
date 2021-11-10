const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const cors=require('cors');
require('dotenv').config()
const app=express();
app.use(cors());
app.use(express.json())
const port=process.env.PORT || 7000;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tjpkh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database=client.db('watchCollections');
        const databaseCollection=database.collection('watch');
    }
    finally{
        // await client.close()
    }
}

app.get('/',(req,res)=>{
    res.send('This Project Is All About Watch And Watch And Watch And Watch')
})

app.listen(port,()=>{
    console.log('Port Number',port)
})