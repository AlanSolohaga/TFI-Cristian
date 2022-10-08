const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//el numero de veces que se encripta el password
const saltRounds = 10;

//esquema con el que se creo el user en mongoDB
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

UserSchema.pre( , function(next){
    if(this.isNew || this.isModified('password')){
        const document = this;
        bcrypt.hash(document.password,saltRounds,(err,hashedPassword)=>{
            if(err){
                next(err);
            }else{
                document.password = hashedPassword;
                next();
            }
        });
    }else{
        next();
    }
});

UserSchema.methods.isCorrectPassword = function(password,callback){
    bcrypt.compare(password,this.password,function(err,same){
        if(err){
            callback(err);
        }else{
            callback(err,same);
        }
    });
}

module.exports = mongoose.model('User',UserSchema);