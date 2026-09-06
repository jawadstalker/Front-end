import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  CircularProgress,
  Rating,
  Alert,
} from "@mui/material";

export default function CommentBox({ productId }) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadComments = () => {
    setLoading(true);
    setError("");

    fetch(`https://iliyacore.ir/get_comments.php?product_id=${productId}`)
      .then((res) => res.json())
      .then((data) => {
        
        const commentsArray = Array.isArray(data) ? data : [];
        setComments(commentsArray);
        setLoading(false);
      })
      .catch((err) => {
        setError("خطا در دریافت نظرات");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadComments();
  }, [productId]);

  const sendComment = async () => {
    if (!name.trim() || !comment.trim()) {
      setError("لطفاً نام و نظر خود را وارد کنید");
      return;
    }

    setSubmitting(true);
    setError("");

    // const now = new Date();
    
    // //   زمانی به ایران 
    // const iranTime = new Date(now.getTime() + (3.5 * 60 * 60 * 1000));
    
    // const persianDate = iranTime.toLocaleDateString('fa-IR', {
    //   year: 'numeric',
    //   month: 'long',
    //   day: 'numeric'
    // });
    // const persianTime = iranTime.toLocaleTimeString('fa-IR', {
    //   hour: '2-digit',
    //   minute: '2-digit',
    //   hour12: false
    // });

    const newLocalComment = {
      id: `temp_${Date.now()}`,
      name: name.trim(),
      comment: comment.trim(),
      rating: rating,
      // created_at: `${persianDate} - ${persianTime}`,
      created_at: "", // تاریخ خالی
      isLocal: true
    };

    setComments(prev => [newLocalComment, ...prev]);

    const dataToSend = {
      name: name.trim(),
      comment: comment.trim(),
      product_id: productId,
      rating: rating,
    };

    console.log("📤 ارسال داده به سرور:", dataToSend);

    try {
      const response = await fetch("https://iliyacore.ir/add_comment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      setName("");
      setComment("");
      setRating(5);
      
      setTimeout(() => {
        loadComments();
      }, 500);
      
    } catch (err) {
      setError("خطا در ارسال نظر. لطفاً دوباره تلاش کنید.");
      setComments(prev => prev.filter(c => !c.isLocal));
    } finally {
      setSubmitting(false);
    }
  };

  // //   فرمت تاریخ به فارسی با زمان
  // const formatDate = (dateString) => {
  //   if (!dateString) return "";
    
  //   try {
  //     // اگر تاریخ به صورت رشته فارسی بود، مستقیم برگردون
  //     if (typeof dateString === 'string' && dateString.includes(' - ')) {
  //       return dateString;
  //     }
      
  //     const date = new Date(dateString);
      
  //     if (isNaN(date.getTime())) return dateString;
      
  //     //   منطقه زمانی به ایران 
  //     const iranTime = new Date(date.getTime() + (3.5 * 60 * 60 * 1000));
      
  //     const persianDate = iranTime.toLocaleDateString('fa-IR', {
  //       day: 'numeric',
  //       year: 'numeric',
  //       month: 'long',
  //     });
      
  //     const persianTime = iranTime.toLocaleTimeString('fa-IR', {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //       hour12: false
  //     });
      
  //     return `${persianDate} - ${persianTime}`;
      
  //   } catch (error) {
  //     console.error("خطا در فرمت تاریخ:", error);
  //     return dateString;
  //   }
  // };

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        mt: 4,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 700,
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            نظرات کاربران 💬
            <Typography
              component="span"
              sx={{
                fontSize: 12,
                fontWeight: 400,
                color: "#6b7280",
                mr: 1,
              }}
            >
              ({comments.length} نظر)
            </Typography>
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, fontSize: 12 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={30} />
            </Box>
          ) : comments.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهید! 🌟
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={1.5}>
              {comments.map((item, index) => (
                <Paper
                  key={item.id || index}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    display: "flex",
                    gap: 1.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "#9ca3af",
                    },
                    ...(item.isLocal && {
                      borderColor: "#3b82f6",
                      backgroundColor: "#f0f7ff",
                    }),
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: item.isLocal ? "#3b82f6" : "#111827",
                      fontSize: 12,
                      flexShrink: 0,
                    }}
                  >
                    {item.name?.charAt(0) || "?"}
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.5,
                        flexWrap: "wrap",
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        {item.name || "ناشناس"}
                        {item.isLocal && (
                          <Typography
                            component="span"
                            sx={{
                              fontSize: 9,
                              color: "#3b82f6",
                              backgroundColor: "#dbeafe",
                              px: 0.5,
                              py: 0.2,
                              borderRadius: "4px",
                            }}
                          >
                            در حال ارسال
                          </Typography>
                        )}
                      </Typography>

                      {/* 🔥 تاریخ کامنت شده */}
                      {/* <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#6b7280",
                          backgroundColor: "#f3f4f6",
                          px: 1,
                          py: 0.3,
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          direction: "rtl",
                        }}
                      >
                        {formatDate(item.created_at)}
                      </Typography> */}
                    </Box>

                    <Rating
                      value={item.rating || 0}
                      readOnly
                      size="small"
                      sx={{ my: 0.3 }}
                    />

                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "#4b5563",
                        lineHeight: 1.8,
                        wordBreak: "break-word",
                      }}
                    >
                      {item.comment}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
            position: "sticky",
            top: 20,
            height: "fit-content",
          }}
        >
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 800,
              mb: 2.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            ثبت نظر شما ✍️
          </Typography>

          <Stack spacing={2}>
            <Box>
              <Typography sx={{ fontSize: 11, color: "#6b7280", mb: 0.5 }}>
                امتیاز شما
              </Typography>
              <Rating
                value={rating}
                onChange={(e, newValue) => {
                  console.log("⭐ ستاره انتخاب شد:", newValue);
                  setRating(newValue || 0);
                }}
                size="medium"
              />
              <Typography sx={{ fontSize: 11, color: "#9ca3af", mt: 0.5 }}>
                {rating === 0 && "بد"}
                {rating === 1 && "خیلی ضعیف"}
                {rating === 2 && "ضعیف"}
                {rating === 3 && "متوسط"}
                {rating === 4 && "خوب"}
                {rating === 5 && "عالی 🌟"}
              </Typography>
            </Box>

            <TextField
              size="small"
              label="نام شما"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                "& .MuiInputBase-root": { fontSize: 13 },
                "& .MuiInputLabel-root": { fontSize: 12 },
              }}
              fullWidth
            />

            <TextField
              multiline
              rows={3}
              label="نظر شما"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{
                "& .MuiInputBase-root": { fontSize: 13 },
                "& .MuiInputLabel-root": { fontSize: 12 },
              }}
              fullWidth
            />

            <Button
              variant="contained"
              onClick={sendComment}
              disabled={!name.trim() || !comment.trim() || submitting}
              fullWidth
              sx={{
                borderRadius: "8px",
                py: 1.5,
                fontWeight: 600,
                fontSize: 13,
                background: "#111827",
                "&:hover": { background: "#000" },
                "&:disabled": {
                  background: "#9ca3af",
                },
              }}
            >
              {submitting ? "در حال ارسال..." : "ارسال نظر"}
            </Button>

            {error && (
              <Alert severity="error" sx={{ fontSize: 12 }}>
                {error}
              </Alert>
            )}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}