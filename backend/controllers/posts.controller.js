const db = require("../db");
const jwt = require("jsonwebtoken");

exports.getPostById = (req, res) => {
  const id = req.params.id;
  console.log("get post by id: " + id);
  const query =
    "SELECT p.id, `username`, `title`, `des`, p.img, u.img AS userImg,`cat`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id=?";
  db.query(query, id, (err, result) => {
    console.log(result[0]);
    if (err) return res.json(err);
    return res.status(200).json(result[0]);
  });
};

exports.getAllPosts = (req, res) => {
  const query1 = "SELECT * FROM posts WHERE is_deleted=1";
  const query2 = "SELECT *FROM posts WHERE cat=? AND is_deleted=1";
  const query = req.query.cat ? query2 : query1;

  console.log(req.query.cat);
  console.log("get posts..." + "query : " + query);

  db.query(query, [req.query.cat], (err, result) => {
    if (err) {
      return res.send(err);
    } else {
      return res.status(200).json(result);
    }
  });
};

exports.addPost = (req, res) => {
  console.log("add post:");
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts(`title`, `des`, `img`, `cat`, `date`,`uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.des,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];
    console.log("values: " +  values);
    db.query(q, [values], (er, data) => {
      if (er) {
        console.log("error!!!");
        return res.status(500).json(er);
      }
      console.log(" everything is fine!!")
      return res.status(200).json({message: "Successfully created the post!"});
    });
  });
};

exports.updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Np Authenticate");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const query = "UPDATE posts SET title=?, des=?, img=?, cat=? WHERE id = ? AND uid = ?";
    const valuse = [req.body.title, req.body.des, req.body.img, req.body.cat];
    const postId = req.params.id;
    const userId = userInfo.id;

    db.query(query, [...valuse, postId, userId], (err, result) => {
      if (err) return res.status(500).json(err);
      return res.json("Successfully Updated!");
    });
  });
};

exports.deletePost = (req, res) => {
  const token = req.cookies.access_token;
  console.log("token: " + token);
  if (!token) {
    return res.status(401).json("Not Authenticated!");
  }
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid");

    const postId = req.params.id;
    //const query = "DELETE from posts WHERE id=? AND uid=?";
    const query = "UPDATE posts SET is_deleted=0 WHERE id=? AND uid=?";
    db.query(query, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(400).json("This is not your post");
      return res.json("Successfully deleted the post");
    });
  });
};
