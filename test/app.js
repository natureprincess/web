var express=require("express"); 
var bodyParser=require("body-parser"); 
  
const mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/gfg'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 
  
var app=express() 
  
  
app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
    extended: true
})); 
  
app.post('/sign_up', function(req,res){ 
    var name = req.body.name; 
    var email =req.body.email; 
    var pass = req.body.password; 
    var phone =req.body.phone; 
  
    var data = { 
        "name": name, 
        "email":email, 
        "password":pass, 
        "phone":phone 
    } 
    
db.collection('details').insertOne(data,function(err, collection){ 
        if (err) throw err; 
        console.log("Record inserted Successfully"); 
              
    }); 
          
    return res.redirect('log.html'); 
}) 
app.get('/find',function(req,res)
{
	db.collection("details").find({}).toArray(function(err,result)
	{
		if (err) throw err;
		console.log(result);
		res.send(result);
	});
})

  
app.post('/home', function(req,res){ 
   
    var uname = req.body.name; 
    var passw = req.body.password;

    
    db.collection('details').findOne({name:uname,password:passw}, function (err,val){ 
        
        console.log(val.name);
        if (val.name == 'admin' && val.password =='admin')
        {
            return res.redirect('admin.html');
        } 
       else if (val.name == uname && val.password == passw)
        {
            return res.redirect('welcome.html');
        }
        else
        
         res.send('invalid user');
        
              
    }); 
    
}) 

app.post("/update", function(req, res, next) {

    var nam = req.body.name;
    var pass = req.body.password;

  
    //console.log(name);
  db.collection('details').update(
      {"name":nam},
      {
          $set:{
              "password":pass
                }
            },
        {"multi":true}
        );
        return res.redirect('up.html');
})


  
app.get('/',function(req,res){ 
res.set({ 
    'Access-control-Allow-Origin': '*'
    }); 
return res.redirect('index.html'); 
}).listen(3000) 
  
  
console.log("server listening at port 3000"); 