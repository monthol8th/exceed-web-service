var express = require('express');
var app = express();
var Redis = require('ioredis');
var redis = new Redis();

app.get('/',function(req, res){
   res.send("root path"); 
});

app.get('/data/:key', function(req, res){
    redis.get(req.params.key,function(err,result){
        if(err){
            res.send(err);
        }else{
            res.send(result);
        }
    });
});

app.get('/data/:key/set/:value', function(req, res){
    redis.set(req.params.key, req.params.value);
    res.send(req.params.value);
});


app.listen(3000,function(){
    console.log('listen on port 3000');
})
