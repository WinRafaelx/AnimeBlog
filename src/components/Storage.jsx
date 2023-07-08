import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase/firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import {
  Container,
  TextField,
  Box,
  Rating,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import SendIcon from "@mui/icons-material/Send";
import { TextareaAutosize } from "@mui/base";
import Navbar from "./Navbar.jsx";
import { useNavigate } from "react-router-dom";
import "./Css/Storage.css";

function Storage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [detail, setDetail] = useState("");
  const [file, setFile] = useState();
  const [percent, setPercent] = useState(0);
  const [value, setValue] = React.useState(5);
  const [hover, setHover] = React.useState(5);
  const [labelColor, setLabelColor] = useState("#FFC300");
  const navigate = useNavigate();

  const clearValues = () => {
    setTitle("");
    setDescription("");
    setDetail("");
    setValue(2.5);
    setFile(null);
  };

  const labels = {
    1: "Useless",
    2: "Useless+",
    3: "Poor",
    4: "Poor+",
    5: "Ok",
    6: "Ok+",
    7: "Good",
    8: "Good+",
    9: "Excellent",
    10: "Excellent+",
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please upload a image file");
      return;
    }
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercent(progress);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          addDoc(collection(db, "posts"), {
            title: title,
            description: description,
            detail: detail,
            rate: value,
            image: url,
            timestamp: serverTimestamp(),
          });
          console.log("File available at", url);
          clearValues();
          navigate("/");
        });
      }
    );
  };

  const getLabelText = (value) => {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
  };

  const changeLabelColor = (value) => {
    if (value >= 8) setLabelColor("#03C04A");
    else if (value >= 4) setLabelColor("#FFC300");
    else setLabelColor("#C70039");
  };

  return (
    <div
      style={{
        backgroundColor: "#19181A",
        color: "#FFFFFF",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Container sx={{ mx: "auto", pt: 10 }}>
        <TextField
          placeholder="Title"
          variant="standard"
          color="warning"
          focused
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ input: { color: "white", fontSize: 23 }, mb: 2.5 }}
          inputProps={{ maxLength: 128 }}
          className="Title"
        />
        <TextareaAutosize
          placeholder="Description"
          className="Description"
          value={description}
          style={{
            color: "#FFFFFF",
            backgroundColor: "#242427",
            width: "100%",
            minHeight: "80px",
            padding: "16px",
            fontSize: "20px",
            borderRadius: "5px",
            border: "none",
            outline: "none",
            resize: "none",
            marginBottom: "15px",
          }}
          onChange={(e) => setDescription(e.target.value)}
          maxlength="256"
        />
        <TextareaAutosize
          placeholder="Detail"
          className="Description"
          value={detail}
          style={{
            color: "#FFFFFF",
            backgroundColor: "#242427",
            width: "100%",
            minHeight: "380px",
            padding: "16px",
            fontSize: "20px",
            borderRadius: "5px",
            border: "none",
            outline: "none",
            resize: "none",
            marginBottom: "20px",
          }}
          onChange={(e) => setDetail(e.target.value)}
        />
        <Box
          sx={{
            maxWidth: 400,
            display: "flex",
            alignItems: "center",
            mx: "auto",
            p: 1,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Rating
            name="hover-feedback"
            value={value}
            precision={1}
            max={10}
            size="large"
            getLabelText={getLabelText}
            onChange={(event, newValue) => {
              setValue(newValue);
              changeLabelColor(newValue);
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
            emptyIcon={
              <StarIcon
                style={{ opacity: 0.55, color: "grey" }}
                fontSize="inherit"
              />
            }
          />
          {value !== null && (
            <Typography sx={{ ml: 2, color: labelColor }} variant="h5">
              {labels[hover !== -1 ? hover : value]}
            </Typography>
          )}
        </Box>

        <br />
        <input
          style={{ width: "100%", backgroundColor: "#242427" }}
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Stack
          direction="row"
          spacing={2}
          sx={{ py: 3, display: "flex", justifyContent: "right" }}
        >
          <Button color="primary" disabled >Save Draft</Button>
          <Button
            variant="contained"
            color="success"
            endIcon={<SendIcon />}
            onClick={handleUpload}
          >
            Post
          </Button>
        </Stack>
      </Container>
    </div>
  );
}

export default Storage;
