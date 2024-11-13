const {Router} = require('express');
const {execSync, execFileSync} = require('child_process'); 
const { error } = require('console');
const { get } = require('http');
const authTokenInstance=require('./authentication');


const router = Router();

class User{
    constructor(name, email){
        this.name=name;
        this.email=email;
    }

    #generatePrivateKey(){
        let stdout=execFileSync('python3', ['./python_utility/check.py', 'public_key'] , { encoding: 'utf-8' });
        this.public_key=JSON.parse(stdout).public_key;
        this.private_key=JSON.parse(stdout).private_key;
    }

    #createUserInDB(data){
        return new Promise((resolve, reject) => {
            if(this.name==="" || this.email==="" || data.password===""){
                return reject(`Please fill all the fields`);
            }
            resolve({mssg:'User created successfully',
                user_id:Math.floor(Math.random()*100)
            });
        });
    }

    createUser(data, res){
        this.#generatePrivateKey();
        this.#createUserInDB(data)
        .then((data) => {
            this.user_id=data.user_id;
            data.public_key=this.public_key;
            console.log(`User created successfully with user_id: ${this.user_id}, public_key: ${this.public_key} private_key: ${this.private_key}`);  
            return res.status(200).send(data);
        })
        .catch((err) => {
            console.log(err);
            return res.status(404).send(err);
        });
    }
}

class UserDetails{
    constructor(data, res){
        console.log(data);
        this.#validateUser(data.email, data.password).then((val) =>{
            console.log(val);
            this.token=authTokenInstance.generateToken({email:data.email, name:data.firstName, user_id:Math.floor(Math.random()*100)});
            console.log(this);
            res.cookie('authToken', this.token, {
                httpOnly: true,   // Prevents JavaScript access to the cookie (for security)
                secure: true,     // Use `true` if using HTTPS
                sameSite: 'Lax',  // Helps protect against CSRF attacks
                maxAge: 3600000,  // 1 hour
              });
            res.send({token:this.token});
        }).
        catch((error) =>{
            res.status(404).send(error);
        });
    }

    #check_db(email, password){
        return new Promise((resolve, reject) => {
            if(email==="" || password===""){
                return reject("Please fill all the fields");
            }
            resolve("User validated successfully");
        });
    }

    #validateUser(email, password){
        return new Promise((res,rej)=>{
            if(email==="" || password===""){
                rej("Please fill all the fields");
            }
            else{
                this.#check_db(email,password)
                .then(data=>{
                    res("User validated successfully");
                })
                .catch((error)=>{
                    rej(error);
                });
            }
        })
    }
    
    destroyObject(){
        delete this;
    }
}

function getDetails(user_id){
    return new Promise((resolve, reject) => {
        if(user_id===''){
            return reject("Please provide user id");
        }
        return resolve({user_id:user_id, name:'John Doe'});
    });
}

router.post('/login', (req, res) => {
    if(req.cookies.authToken && authTokenInstance.verifyToken(req.cookies.authToken)){
        let data=authTokenInstance.getTokenData(req.cookies.authToken);
        console.log(data);
        res.send("User already logged in");
        return;
    }
    let myuser= new UserDetails(req.body, res);
});

router.post('/signup', (req, res) => {
    console.log(req.body.params);
    let myuser= new User(req.body.params.firstName, req.body.params.email);
    myuser.createUser(req.body.params, res);
});

router.get('/:id', (req, res) => {
    res.send(`User id: ${req.params.id}`);
    if(user_id===''){
        res.status(404).send("Please provide user id");
    }
    getDetails(req.params.id).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.send(err);
    });

});

module.exports = router;