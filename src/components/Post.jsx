import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase.js";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Comment from "./Comment.jsx";
import AmountComments from "./AmountComments.jsx";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate, Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Avatar,
  CardHeader,
  Box,
  IconButton,
} from "@mui/material";

function getTimeOfPost(postTimestamp) {
  const now = Date.now();
  const diff = now - (postTimestamp && postTimestamp.toDate().getTime());

  // Define time units in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (Math.floor(diff / year) > 50) return "Just now";

  // Calculate the approximate time difference
  if (diff < minute) {
    return "Just now";
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diff < month) {
    const days = Math.floor(diff / day);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diff / year);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
}

function Post() {
  const [post, setPost] = useState([]);
  const [openComment, setOpenComment] = useState(false);
  const [commentId, setCommentId] = useState("");
  const navigate = useNavigate();

  const fetchPosts = async () => {
    await getDocs(query(collection(db, "posts"), orderBy("timestamp"))).then(
      (querySnapshot) => {
        const data = querySnapshot.docs.toReversed().map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPost(data);
      }
    );
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const rateStar = (rate) => {
    let stars = "";
    for (let i = 0; i < rate; i++) {
      stars += "★";
    }
    return stars;
  }; 

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      sx={{
        pt: 10,
        minHeight: "100vh",
        backgroundColor: "#19181A",
        color: "#FFFFFF",
      }}
    >
      {post.map((item) => (
        <Grid item xs={11} md={3.7} key={item.id} sx={{ m: 2 }}>
          <Card sx={{ backgroundColor: "#242427", color: "#FFFFFF" }}>
            <CardHeader
              avatar={<Avatar src={item.authorProfile}></Avatar>}
              title={item.author}
              titleTypographyProps={{ variant: "h6" }}
              subheader={
                <Typography>{getTimeOfPost(item.timestamp)}</Typography>
              }
            />
            <CardMedia
              sx={{ height: 300 }}
              image={item.image}
              title="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {item.title}
              </Typography>
              <Typography variant="body2" color="white">
                {item.description}
              </Typography>
              <Typography sx={{ color: "gold" }} variant="h5">
                {rateStar(item.rate)}
              </Typography>
            </CardContent>
            <CardActions>
              {/* <IconButton aria-label="add to favorites">
                <Typography variant="h6" sx={{ color: "#FFFFFF", mr: 1 }}>
                  12
                </Typography>
                <FavoriteIcon sx={{ color: "#FFFFFF" }} />
              </IconButton> */}
              <IconButton
                aria-label="add comments"
                onClick={() => {
                  if(commentId != item.id && openComment) {
                    setCommentId(item.id)
                    return ;
                  }
                  setCommentId(item.id)
                  setOpenComment(!openComment)
                }}
              >
                <AmountComments postId={item.id} />
              </IconButton>
              <Box
                sx={{ flexGrow: 1 }}
              ></Box>
              <Button size="small" sx={{ color: "#E38969", ml: 1 }}>
                <Link to={`post/${item.id}`} state={{post: item}}
                style={{textDecoration: "none"}}>
                  <Typography variant="subtitle1" sx={{color: "orange"}}>More Detail</Typography>
                </Link>
              </Button>
            </CardActions>
            <Comment postId={item.id} openComment={openComment} commentId={commentId}/>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default Post;
