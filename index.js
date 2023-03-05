const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
var jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_SECURITY_KEY}@clusterjobboy.xkxgypm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const usersCollection = client.db('bPluginsMicrojobDatabase').collection('usersCollection');
        const usersInfo = client.db('bPluginsMicrojobDatabase').collection('usersInfo');

        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: user
            };
            const result = await usersCollection.updateOne(filter, updatedDoc, options);

            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '24h' });
            res.send({ result, token });
        });
    } finally {

    };
};

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send('bPlugins MicroJob Server Up')
});

app.listen(port, () => {
    console.log('bPlugins MicroJob Server Pumping')
})

