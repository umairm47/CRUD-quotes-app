console.log('May Node be with you')
const bodyParser = require('body-parser');
const express = require('express')
const app = express();
 
const MongoClient = require('mongodb').MongoClient
const connectionString=`mongodb+srv://umairm47:Starcraft47@cluster0.1ldioi7.mongodb.net/?retryWrites=true&w=majority`
MongoClient.connect(connectionString).then(client=>{
    console.log('Connected to Database', {useUnifiedTopology:true})
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')



// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({extended:true}))

app.listen(3000, function(){
    console.log('listening on 3000')
})

//Middlewares and other routes here
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())


// All your routes/handlers are here...
app.get('/', (req,res)=>{
    
    db.collection('quotes').find().toArray()
    .then(results=>{
        res.render('index.ejs', {quotes: results})
    })
    
    .catch(error =>console.error(error))


 

})
app.post('/quotes',(req,res)=>{
    quotesCollection.insertOne(req.body)
    .then(result =>{
        res.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/quotes',(req,res)=>{
    console.log(req.body)
    quotesCollection.findOneAndUpdate(
        {name:'yoda'},
        {$set: {
            name:req.body.name,
            quote: req.body.quote
        }
    },
    {
        upsert:true
    }
    )
    .then(result=>{
        res.json('Success')
    })
    .catch(error =>console.error(error))
})
app.delete('/quotes',(req,res) =>{
    quotesCollection.deleteOne({
        name:req.body.name}
    ).then(result =>{
        if (result.deletedCount===0){
            return res.json('No quote to delete')
        }
        res.json(`Deleted Darth Vader's quote`)
    }).catch(error=>console.error(error))
})


}).catch(console.error)

