let express =  require("express");
require('dotenv').config();
let app = express();
let bodyParser = require("body-parser");
let User =require("./data");
var jwt = require("express-jwt");
var jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// authentication is performed with jwt key and token
// this is middle ware who authenticate the user by token
const authenticate = async(req , res , next) =>
{
    try{
        let decoded = jwt.verify(

            // requesting the token from the header to authenticate
            req.headers.authorization,
            process.env.JWT_SECRET_KEY
        );
        // console.log(decoded);
        if (!decoded) {
          return res.send("Unauthenticated User");
        }
            next();
        
      } catch (err) {
        return res.send("Unauthenticated User");
      }
      
};


// fetch all the user when authentication is done
app.get('/AllUsers',authenticate ,async(req,res)=>{
    let data = await User.find({});
    res.send(data);
    console.log("fetch done");
})


// login with authentication and check the hash password
app.post('/login',async(req ,res)=>{
    let {email ,pass} =req.body;

    const password = pass;
    const saltRounds = 10;

    // hashing the current password and then match with db password
    bcrypt.hash(password, saltRounds, async(err, hash) => {
        if(err) throw err.message;
        // console.log("hash code",hash);
        pass=hash
        
    //    Now we can check the password hash in db.
        if(req.body.pass !==""  && req.body.email !== "")
        {
        let data = await User.find({ email });
        //    console.log(data[0].pass)
        if(data)
        {   
            // console.log(data[0].email)
            let k=await bcrypt.compare( req.body.pass,data[0].pass)
            // console.log(k)
            if (bcrypt.compare( pass,data[0].pass)) {
                res.send(generateAccessToken(email));
            } else {
                res.send("Incorrect Password");
            }
        } else {
        res.send("Incorrect Email");
        }
        }
    });
})



// Login 

// app.post('/login',async(req ,res)=>{
//     let {email ,pass} =req.body;

//     if(req.body.pass !==""  && req.body.email !== "")
//     {
//        let data = await User.find({ email });
//     //    console.log(data[0].pass)
//        if(data)
//        {
//         if (data[0].pass == pass) {
//             res.send(generateAccessToken(email));
//           } else {
//             res.send("Incorrect Password");
//           }
//         } else {
//           res.send("Incorrect Email");
//         }
//     }
// })


// hashing password or encryption
// create users
app.post('/CreateUser', async(req,res)=>{
    let {email ,pass} =req.body;

    //HASHING 
    const saltRounds = 10;
    const password =pass;

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err) throw err.message;
        // console.log("hash code",hash);
        pass=hash
        var data =  new User({email,pass});
        console.log(data)
        data.save();
        
//    Now we can store the password hash in db.
        if(data.email !== '' && data.pass !== " ")
        {
           res.send( generateAccessToken(email) );
        }else{
            console.log("error occur");
        }
    });
console.log("successfully Created");

})


// // create users

// app.post('/CreateUser', async(req,res)=>{
//     let {email ,pass} =req.body;
//     let data = new User(req.body);
//     data.save();
//     if(data.email !== '' && data.pass !== " ")
//     {
//        res.send( generateAccessToken(email) );
//     }else{
//         console.log("error occur");
//     }
//     console.log("successfully posted");
// })



// generate the token 
function generateAccessToken(username) {
    try{
    return jwt.sign(username, `${process.env.JWT_SECRET_KEY}`);
    }catch(err)
    {
        return err.message;
    }
}

// port is working on 8000 
app.listen(8000 ,()=>console.log("port is running on 8000"))