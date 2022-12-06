import React, { useContext, useEffect, useState } from "react";
import editImg from "../img/edit.png";
import deleteImg from "../img/delete.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import { AuthContext } from "../context/authContext";
import moment from "moment";
import axios from "axios";

const Single = () => {
  const [post, setPost] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const postId = location.pathname.split("/")[2];

  const { currentUser } = useContext(AuthContext);
  console.log("current user: " + currentUser);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`);
        
        console.log(res);

        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${postId}`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  }

  return (
    <div className="single">
      <div className="content">
        <img src={`../upload/${post?.img}`} />
        <div className="user">
          {
            post.userImg && <img src={post.userImg} />
          }
          <div className="info">
            <span>{post.username}</span>
            <p>{moment(post.date).fromNow()}</p>
          </div>
          {currentUser.username === post.username && (
            <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <img src={editImg} />
              </Link>
              <img src={deleteImg} onClick={handleDelete}/>
            </div>
          )}
        </div>
        <h1>
          {post.title}
        </h1>
        <p>
         {getText(post.des)}
        </p>
      </div>

      <div className="menu">
        <Menu cat={post.cat}/>
      </div>
    </div>
  );
};

export default Single;
