const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./public/user');

app.set('port',process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'public')));

const mongo_uri = "mongodb+srv://fullstack:fullstack@cluster0.hd0aepy.mongodb.net/TFI";

mongoose.connect(mongo_uri,function(err){
    if(err){
        throw err;
    }else{
        console.log("Se conectó correctamente: "+mongo_uri);
    }
});

//POST porque se envian datos
//req tiene todo lo del index
//res es la respueta
app.post('/register', (req,res)=>{
    const {username,password} = req.body;
    const user = new User({username,password});

    user.save(err =>{
        if(err){
            console.log(err);
            res.status(500).send('ERROR AL REGISTRAR');
        }else{
            res.status(200).send('USUARIO REGISTRADO');
        }
    });
});

app.post('/authenticate', (req,res)=>{
    const {username,password} = req.body;

    User.findOne({username},(err,userObtein)=>{
        console.log("el uer: " +userObtein)
        
        if(err){
            res.status(500).send('ERROR AL AUTENTICAR 1');
        }else if(!userObtein){
            console.log("el usuario es: "+userObtein)
            res.status(500).send('EL USUARIO NO EXISTE');
        }else{
            userObtein.isCorrectPassword(password, (err,result)=>{
                if(err){
                    res.status(500).send('ERROR AL AUTENTICAR 2');
                }else if(result){
                    res.status(200).send("USUARIO AUTENTICADO");
                }else{
                    res.status(500).send('USUARIO Y/O CONTRASEÑA INCORRECTA');
                }
            });
        }
    });
});

app.listen(app.get('port'), ()=>{
    console.log("server init with port: ", app.get('port'))
});

module.exports = app;