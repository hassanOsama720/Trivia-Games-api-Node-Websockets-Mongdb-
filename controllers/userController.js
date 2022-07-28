require("dotenv").config();
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


const randomBytes = require("randombytes");
const bcrypt = require("bcrypt");
const { redirect } = require("express/lib/response");



exports.login = (request, response, next) => {
  User.findOne({ email: request.body.email })
    .then((data) => {
      if (data == null) {
        // throw new Error("email not found");
        response.status(401).json({ message: "invalid credentials" });
        return;
      }
      encrypted = data.password;

      bcrypt.compare(request.body.password, encrypted).then(function (result) {
        if (result || (request.body.way && request.body.way === "google")) {
          let accessToken = jwt.sign(
            {
              role: data.role,
              id: data._id,
              email: data.email,
            },
            process.env.SECRET_KEY,
            { expiresIn: "24h" }
          );
          response.json({ msg : "success" , name:data.name, accessToken });
        } else {
          // next(new Error("wrong pass"));
          response.status(401).json({ message: "invalid credentials" });
          return;
        }
      });
    })
    .catch((error) => {
      next(error.message);
    });
};



exports.register = (request, response, next) => {
  //Validation
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  };

  let hashed = bcrypt.hashSync(request.body.password, 10);
  const object = new User({
    name: request.body.name,
    email: request.body.email,
    password: hashed,
  });
  object
      .save()
      .then((data) => {
        response.status(201).json({ message: "added", data });
      })
      .catch((error) => next(error));

  
};



// //send verification email
// exports.sendVerificationEmail = async (req, res, next) => {
//   try {
//     const infoHash = {};
//     const user = req.user;
//     infoHash.user = user;
//     infoHash.id = user._id;
//     const key = eval(process.env.mail_key);
//     const token = jwt.sign(infoHash, key, { expiresIn: "24h" });
//     const link = `${process.env.BASE_URL}/user/verify/${user._id}/${token}`;
//     //generate html code
//     const html = `<h3 style="color:blue;">Hello, ${user.fullName}</h3>
//     <p>E-mail verification was requested for this email address ${user.email}. If you requested this verification, click the link below :</p>
//     <p>
//     <p style="color:red;">This link is expired with in 24 hrs</p>
//       <a style="background-color:blue; color:white;padding:10px 20px;text-decoration:none; font-weight:bold;border-radius:7px" href="${link}">Verify Your Email</a>
//     </p>`;
//     await sendEmail(user.email, "Verify Email", html);
//     res.status(201).json({
//       data: "Registration successful ,An Email sent to your account please verify",
//       token,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
// //verify email on link sent
// exports.emailVerify = async (req, res, next) => {
//   try {
//     const key = process.env.mail_key;
//     const user = await userVerify(req, key);
//     await user.update({ verified: true });
//     res.status(200).json("mail verified success");
//   } catch (error) {
//     next(error);
//   }
// };

// exports.forgotPassword = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const user = await user.findOne({ email });
//     if (!user)
//       return res.status(400).json({ msg: "This email does not exist." });

//     const access_token = createAccessToken({ id: user._id });
//     const url = `${CLIENT_URL}/user/reset/${access_token}`;

//     sendMail(email, url, "Reset your password");
//     return res.json({ msg: "Re-send the password, please check your email." });
//   } catch (error) {
//     // next(error),
//     return res.status(500).json({ msg: err.message });
//   }
// };
// exports.resetPassword = async (req, res) => {
//   try {
//     const { password } = req.body;
//     const passwordHash = await bcrypt.hash(password, 10);

//     await User.findOneAndUpdate(
//       { _id: req.user.id },
//       {
//         password: passwordHash,
//       }
//     );

//     res.json({ msg: "Password successfully changed!" });
//   } catch (err) {
//     return res.status(500).json({ msg: err.message });
//   }
// };

