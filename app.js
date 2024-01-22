//require models
const express = require('express');
const morgan = require('morgan');
const eventRoutes = require('./routes/eventRoutes')
const methodOverride = require('method-override')
const {fileUpload} = require('./fileUpload')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

//create app
const app = express();
//configure app
let port = 3000;
let host = 'localhost'
let url = 'mongodb+srv://ShailPatel:Shail1234@cluster0.d7gkzog.mongodb.net/events?retryWrites=true&w=majority'


app.set('view engine', 'ejs');

//connect to MongoDB

mongoose.connect(url)
.then(()=>{
    app.listen(port, host, () =>{
    console.log('Server is running on port: ', port)
    })
})
.catch(err=>console.log(err.message));

//mount middleware
app.use(
    session({
        secret: "crashinglps",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb+srv://ShailPatel:Shail1234@cluster0.d7gkzog.mongodb.net/events?retryWrites=true&w=majority'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});




app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(morgan('tiny'))
app.use(methodOverride('_method'))
//set up routes

app.get('/',(req,res)=>{
    res.render('index')
})

app.use('/events', eventRoutes)
app.use('/users', userRoutes)

app.use((req,res,next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
})

app.use((err, req, res, next)=> {
    console.log(err.stack)
    if(!err.status){
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error:err})
});

//start server
