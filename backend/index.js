const express = require('express');

const app = express();
const userRouter = require('./routes/users.route');
const postsRouter = require('./routes/posts.route');
const authRouter = require('./routes/auth.route');
const cookieParser = require('cookie-parser');
const multer = require("multer");
const bodyParser = require("body-parser");
const { urlencoded } = require('body-parser');

const PORT = 5050;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.json());
app.use(cookieParser());

//upload images
//const upload = multer({dest: './uploads/'});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../frontend/public/upload");
    },
    filename: function (req, file, cb) {
     console.log("=>" + Date.now() + file.originalname);
      cb(null, Date.now() + file.originalname);
    },
  });
  
  const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), function (req, res) {
    const file = req.file;
    res.status(200).json(file.filename);
});

app.use("/api/users", userRouter);
app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);


app.listen((PORT), ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});