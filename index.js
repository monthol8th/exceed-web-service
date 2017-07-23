var express = require('express');
var app = express();
var Redis = require('ioredis');
var redis = new Redis();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/',function(req, res){
   res.send("root path"); 
});

app.get('/data/:key', function(req, res){
    redis.get(req.params.key,function(err,result){
        if(err){
            res.status(500).send(err);
        }else{
            res.send(result);
        }
    });
});

app.get('/data/:namespace/:key', function(req, res){
    redis.get(req.params.namespace+'_'+req.params.key,function(err,result){
        if(err){
            res.status(500).send(err);
        }else{
            res.send(result);
        }
    })
})


app.post('/data/:namespace', function(req, res){
    for(key in req.body){
        console.log(key+":"+req.body[key])
        redis.set(req.params.namespace+'_'+key,req.body[key]);
    }
    res.json(req.body);
})


app.get('/data/:key/set/:value', function(req, res){
    redis.set(req.params.key, req.params.value);
    res.send(req.params.value);
});

app.get('/data/:namespace/:key/set/:value', function(req,res){
    redis.set(req.params.namespace+'_'+req.params.key, req.params.value)
    res.send("ok");    
})

app.get('/json/:name', function(req, res){
    redis.get('json_'+req.params.name, function(err,result){
        if(err){res.status(500).json({error: err});}
            else{
                result = JSON.parse(result);
                for(var key in result){
                    console.log(key+':'+result[key])
                }
                res.json(result);
            }
    })
})

app.post('/json/:name', function(req, res){
    console.log(req.body);
    redis.set('json_'+req.params.name, JSON.stringify(req.body));
    res.json(req.body);
})

app.listen(8000,function(){
    console.log('listen on port 8000');
})
