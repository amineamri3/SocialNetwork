const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
// --------------------------

const profile = require('./routes/api/profile');
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');


//config
const db = require('./config/keys').mongoURI;

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//passport
app.use(passport.initialize());
require('./config/passport')(passport);
//db connection
mongoose
.connect(db)
.then(()=>console.log('Database connected!'))
.catch((err)=>console.log(err))

app.get('/',(req,res)=>{
res.send('Hi!');
});



app.use('/api/profile',profile);
app.use('/api/posts',posts);
app.use('/api/users',users);


const port = process.env.port || 5000;

app.listen(port,()=>console.log(`Server started on port ${port}`));