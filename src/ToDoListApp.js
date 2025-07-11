// 🟢 Import MUI Components
import {
  Box,
  Button,
  Stack,
  Switch,
  TextField,
  Typography,
  Modal,
  CircularProgress,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

// 🟢 Import React and Theme
import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// 🟢 Import Local Components
import ToDoCon from "./TodoCon";
import TopSaid from "./TopSaid";

// 🟢 Theme
const theme = createTheme({
  Typography: {
    fontFamily: "Kanit, sans-serif",
  },
});

// 🟢 Component for Circular Progress with Label
function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "text.secondary" }}
        >
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

// 🟢 Modal Style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

// 🟢 Main Component
export default function ToDoListApp() {
  const theme = useTheme();
  const lightGradient = "linear-gradient(to right, #CDC1FF, #A294F9)";
  const darkGradient = "linear-gradient(to right, rgb(55, 51, 51), #434343)";

  const [openModal, setOpenModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isProgressRunning, setIsProgressRunning] = useState(false);
  const [TitleInput, SetTitleInput] = useState("");
  const [UseAi, setUseAi] = useState(false);
  const [tasks, setTasks] = useState(() => {
    const saveTasks = localStorage.getItem("tasks");
    return saveTasks ? JSON.parse(saveTasks) : [];
  });

  const [arrayCount, setArrayCount] = useState(0);
  const [isDoneCount, setIsDoneCount] = useState(0);

  // 🟢 Effects
  useEffect(() => {
    const saveTasks = localStorage.getItem("tasks");
    if (saveTasks) setTasks(JSON.parse(saveTasks));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    let interval;
    if (isProgressRunning) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProgressRunning(false);
            setOpenModal(false);
            return 100;
          }
          return prev + 5;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isProgressRunning]);

  // 🟢 دالة ارسال الرسالة للباك اند
  const sendMessage = async (userMessage) => {
    const res = await fetch(
      "/api/chat", // 🔷 رابط الباك اند الثابت
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("🔴 Error:", errorText);
      throw new Error("حدث خطأ في الاتصال بالسيرفر");
    }

    const data = await res.json();
    console.log(data.reply);
    return data.reply;
  };

  // 🟢 Handlers
  const toggleAddModal = () => setOpenModal(!openModal);
  const handleAgree = () => {
    setProgress(0);
    setIsProgressRunning(true);
  };

  const handleAddClicked = async () => {
    if (TitleInput.trim() !== "") {
      let tipsResult = "";

      if (UseAi) {
        try {
          tipsResult = await sendMessage(
            `عايزك تكون مدرب مهام محترف. عندي مهمه وهي: (${TitleInput}).
            عايزك تكتبلي ازاي اقدر انفذ المهمه دي في اربع خطوات بس،
            وكل خطوه تكتبها في سطر واحد ومختصر،
            وكل خطوه تكون محاطه فقط بـ <li> من بداية ونهاية الجمله بدون استخدام ul نهائي.
            عايزك تلاحظ لو اسم المهمه مكتوب بالانجليزي، تجاوب بالانجليزي،
            ولو مكتوب بالعربي تجاوب بالعربي،
            ولو مكتوب بين اقواس مثلا (English) او (عربي)، تجاوب باللغه المحدده بينهم.`
          );
        } catch (err) {
          console.error("🔴 Error:", err.message);
        }
      }

      const NewToDos = {
        id: uuidv4(),
        Title: TitleInput,
        Tips: tipsResult,
        isDone: false,
        ShowTips: UseAi,
      };

      setTimeout(() => {
        setTasks((prevTasks) => [...prevTasks, NewToDos]);
      }, 4000);

      SetTitleInput("");
    }
  };

  const handleGetCount = (count) => setArrayCount(count);
  const handleGetDoneCount = (done) => setIsDoneCount(done);

  // 🟢 Return JSX
  return (
    <>
      {/* Floating Add Button */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          right: "20px",
          zIndex: 5,
        }}
      >
        <Button
          color="Botton"
          className={`bt ${openModal ? "rotate" : ""}`}
          onClick={toggleAddModal}
          sx={{ borderRadius: "55px", fontSize: "60px" }}
          variant="contained"
        >
          +
        </Button>
      </div>

      {/* Modal */}
      <Modal open={openModal} onClose={toggleAddModal}>
        <Box sx={modalStyle}>
          <TextField
            label="Title of Task:"
            variant="standard"
            value={TitleInput}
            onChange={(e) => SetTitleInput(e.target.value)}
          />
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Typography variant="subtitle1">Using AI To write tips</Typography>
            <Switch
              checked={UseAi}
              onChange={(e) => setUseAi(e.target.checked)}
              sx={{ ml: 2 }}
            />
          </Box>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              mt: 2,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CircularProgressWithLabel value={progress} />
            <Box>
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={toggleAddModal}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                endIcon={<CheckIcon />}
                sx={{ ml: 1 }}
                onClick={() => {
                  handleAgree();
                  handleAddClicked();
                }}
              >
                Agree
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

      {/* Main Content */}
      <div
        style={{
          background:
            theme.palette.mode === "dark" ? darkGradient : lightGradient,
          color: theme.palette.text.primary,
          padding: "10px",
          height: "100vh",
        }}
      >
        <ThemeProvider theme={theme}>
          <TopSaid arrayCount={arrayCount} isDone={isDoneCount} />
          <ToDoCon
            sendCountToParent={handleGetCount}
            sendIsDonetToParent={handleGetDoneCount}
            tasks={tasks}
            setTasks={setTasks}
          />
        </ThemeProvider>
      </div>
    </>
  );
}
