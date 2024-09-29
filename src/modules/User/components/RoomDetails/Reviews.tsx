import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CommentUrls, ReviewsUrls } from "../../../../constants/End_Points";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";

// Define the type for URL parameters (in this case, roomId)
interface Params {
  roomId: string;
}

// Define the type for the comment response (adjust fields as necessary)
interface CommentResponse {
  data: {
    comment: string;
    roomId: string;
  };
}

const Reviews: React.FC = () => {
  const { roomId } = useParams<Record<string, string>>(); // Use Record type
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (authToken) {
      setToken(authToken);
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  // Function to create a comment
  const createComment = async () => {
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    try {
      const response = await axios.post<CommentResponse>(
        CommentUrls.createComment,
        {
          comment: comment,
          roomId: roomId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      setComment(""); // Clear the comment input after successful submission
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  // Function to create a review
  const createReview = async () => {
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    if (rating === 0) {
      console.error("Rating must be between 1 and 5");
      return;
    }

    if (!review) {
      console.error("Review cannot be empty");
      return;
    }

    if (!roomId) {
      console.error("Room ID is missing");
      return;
    }

    try {
      console.log("Creating review with:", { rating, review, roomId, token });

      const response = await axios.post(
        ReviewsUrls.createReview,
        {
          roomId: roomId,
          rating: rating,
          review: review,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Review successfully created:", response.data);
      setReview("");
      setRating(0); // Clear review and rating after successful submission
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Error creating review:", error);
      }
    }
  };

  return (
    <Box sx={{ paddingY: 5, paddingX: 2 }}>
      {loggedIn ? (
        <>
          {/* Review Section */}
          <Stack
            sx={{
              border: "1px solid #ddd",
              borderRadius: 3,
              padding: 5,
              mb: 5,
            }}
            spacing={2}
          >
            <Typography variant="h6" color="#152C5B">
              Rate and Review
            </Typography>
            {/* Rating Stars */}
            <Box>
              {[1, 2, 3, 4, 5].map((value) => (
                <FaStar
                  key={value}
                  color={value <= rating ? "#DFCB1D" : "#ddd"}
                  onClick={() => setRating(value)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </Box>

            {/* Review Text Field */}
            <TextField
              id="review"
              label="Your Review"
              multiline
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            {/* Submit Review Button */}
            <Button
              onClick={createReview}
              variant="contained"
              sx={{
                backgroundColor: "#3252DF",
                width: "25%",
              }}
            >
              Submit Review
            </Button>
          </Stack>

          {/* Comment Section */}
          <Stack
            sx={{ border: "1px solid #ddd", borderRadius: 3, padding: 5 }}
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            divider={
              <Divider
                sx={{
                  backgroundColor: "rgb(32, 63, 199, 0.5)",
                  borderWidth: "2px",
                }}
                orientation="vertical"
                flexItem
              />
            }
          >
            <Stack
              spacing={2}
              sx={{
                width: { xs: "100%", md: "50%" },
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" color="#152C5B">
                Add Your Comment
              </Typography>
              <TextField
                id="comment"
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ borderColor: "3252DF" }}
              />
              <Button
                onClick={createComment}
                variant="contained"
                sx={{
                  backgroundColor: "#3252DF",
                  width: "25%",
                  alignSelf: "end",
                }}
              >
                Send
              </Button>
            </Stack>
          </Stack>
        </>
      ) : (
        <Typography
          variant="h6"
          color="#152C5B"
          sx={{ textAlign: "center", color: "green" }}
        >
          Please log in to add a review or rate.
        </Typography>
      )}
    </Box>
  );
};

export default Reviews;
