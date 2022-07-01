const express = require('express');
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000

// user : to-do-list
// pass: Gv1hn16HvClvVwsW


// Middle ware
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xquqwhb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const taskCollection = client.db("to-do-list").collection("task");
const taskCompletedCollection = client.db("to-do-list").collection("task-complete");

async function run(){
    try{
        await client.connect()

        app.post('/task', async (req, res)=>{
            const task = req.body;
            console.log(task)
            // const quote = {task: task}
            // console.log(quote)
            const exist = await taskCollection.findOne(task)
            if(exist){
                return res.send({success: false, task: exist})
            }
                const result = await taskCollection.insertOne(task)
                return res.send({success: true, result})            
        })

        app.get('/task', async(req, res)=>{
            const result = await taskCollection.find().toArray();
            res.send(result)
        })

        app.post('/taskComplete', async (req, res)=>{
            const id = req.body;
            // console.log(id)
            // const result = await taskCompletedCollection.insertOne(task)
            // res.send(result)
            const query = {_id: ObjectId(id)}
            const task = await taskCollection.findOne(query)
            console.log(task)

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