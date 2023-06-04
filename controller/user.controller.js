const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Token = db.token;
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

async function signup (req, res) {
  try {

    //object destructuring 
    const {username,email,password} = req.body ;

    // Encrypt the password
   const hashedPassword = await bcrypt.hash(password, 10);

  // Save the base user
  const baseUser = new User({username,password: hashedPassword,email});
  const savedBaseUser = await baseUser.save();
 generateQrcode(username,savedBaseUser._id,email);
  res.status(201).send(savedBaseUser);
} catch (err) {
  res.status(400).send({message : err.message});
}
};

    



async function signin (req, res) {
try {
 let user = await User.findOne({
    username: req.body.username
  });
    
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

 

      
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token
      });}
      catch(err){

        
            res.status(500).send({ message: err });
           
          
    
      }
    
};



async function qrsignin (req, res) {
  try {
    let userId ;
    let user;
    jwt.verify(req.body.token, config.secret, (err, decoded) => {
      userId =decoded.id
      console.log(userId);
    });
      if (userId){
         user = await User.findOne({
          _id: userId
        });
      
      }
      console.log(user);

        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
  
        
        
        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          accessToken: req.body.token
        });}
        catch(err){
  
          
              res.status(500).send({ message: "unauthorised" });
             
            
      
        }
      
  };


 function allAccess (req, res) {
    res.status(200).send("Public Content.");
  };
  
  function userBoard (req, res) {
    res.status(200).send("User Content.");
  };


  // Generate and save QR code token
  async function generateQrcode (name,userId,email) {
    
    try {
      var token = jwt.sign({ id: userId }, config.secret, {
        expiresIn:  2629200000 // one month
      });

      const basetoken =new Token({ token, userId})
      const savedtoken = await basetoken.save();
      
      const qrCodeUrl = `http://localhost:4200/login?token=${encodeURIComponent(token)}`;

      const qrCodeUrlimg = await QRCode.toDataURL(qrCodeUrl);

      // Nodemailer setup
      var transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "ba8820e9320d76",
          pass: "a63cc0fe8f823c"
        }
      });
      
      const mailOptions = {
        from: 'glsicdrive@gmail.com',
        to: email ,
        subject: 'QR Code Login',
        html: `
          <h1>Hello ${name} 
          <h1>Scan QR Code to Login</h1>
          <img src="${ qrCodeUrlimg}" alt="QR Code">
        `
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: 'Failed to send email' });
        }
        console.log('Email sent:', info.response);
        res.json({ qrCodeUrl });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }}
  
module.exports ={

  signup,userBoard,signin,allAccess,qrsignin
};