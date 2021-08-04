const express = require('express');
const mongoose = require('mongoose');
const app = express();

//config
const db = require('./config/keys').mongoURI;


//db connection
mongoose
.connect(db)
.then(()=>console.log('Database connected!'))
.catch((err)=>console.log(err))

app.get('/',(req,res)=>{
res.send('Hi!');
});


const port = process.env.port || 5000;

app.listen(port,()=>console.log(`Server started on port ${port}`));