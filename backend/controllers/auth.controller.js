const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.dhon = (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    res.json({ result });
  });
};

exports.login = (req, res) => {

  const query = "SELECT * FROM users WHERE username=?";

  db.query(query, [req.body.username], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json("User not found!");


    console.log(req.body.password + " " + result[0].password);

    //Check password
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      result[0].password
    );

    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password!");

    const token = jwt.sign({ id: result[0].id }, "jwtkey");
    const { password, ...other } = result[0];

    res.cookie("access_token", token, {
        httpOnly: true,
      }).status(200).json(other);
  });
};

exports.logout = (req, res) => {
  res.clearCookie("access_token",{
    sameSite:"none",
    secure:true
  }).status(200).json("logout successfull")
};

exports.register = (req, res) => {
  const { username, email, password } = req.body;
  console.log("register : " + username + ", " + email + ", " + password);

  const query = "SELECT * FROM users WHERE email=? OR password=?";
  db.query(query, [email, username], (err, result) => {
    console.log("#" + result.length);
    if (err) {
      return res.json(err);
    }
    if (result.length) {
      return res.status(409).json({ msg: "User already exits" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const q = "INSERT INTO users(username, email, password) VALUES (?)";
    const VALUES = [username, email, hash];

    console.log(VALUES);

    db.query(q, [VALUES], (err, data) => {
      console.log("bal \n" + data);
      if (err) {
        return res.json(err);
      } else {
        return res.status(200).json({ msg: "user registration successful" });
      }
    });
  });
};
