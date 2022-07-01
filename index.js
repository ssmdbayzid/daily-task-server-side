const express = require('express');
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000

// user : to-do-list
// pass: Gv1hn16HvClvVwsW


// Middle ware
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xquqwhb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const taskCollection = client.db("to-do-list").collection("task");
  // perform actions on the collection object
  client.close();
});

async function run(){
    try{
        await client.connect()

        app.post('/task', async (req, res)=>{
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result)

        })

    }
    finally{
        //This is finally
    }
}

run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('Task Server Connected')
})


app.listen(port, ()=>{
    console.log('Task server run with', port);
})