import {
  Box,
  Grid,
  styled,
  Paper,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcone from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import React from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";



import woosh from "./assets/audio/woosh-260275.wav";



// 📝 ستايل العنصر Item
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
}));

export default function ToDoCon({
  sendCountToParent,
  sendIsDonetToParent,
  tasks,
  setTasks,
  SwitchTipButton,
}) {
  // 📝 حالة المهام (محفوظة من localStorage أو يتم توليدها أول مرة فقط)

  // 📝 حالة المهام المنجزة
  const [Completed, setCompletedId] = useState([]);

  // 📝 حالة التيبس المفتوحة
  const [openTips, setOpenTips] = useState(null);

  // ✅ ارسال عدد المهام للأب عند أي تغيير
  useEffect(() => {
    sendCountToParent(tasks.length);
  }, [tasks, sendCountToParent]);
  useEffect(() => {
    sendIsDonetToParent(Completed.length);
  }, [Completed, sendIsDonetToParent]);

  // ✅ حفظ المهام والمنجزات في localStorage عند أي تغيير في tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("Completed", JSON.stringify(Completed));
  }, [Completed]);

  // ✅ استرجاع المهام المنجزة عند أول تحميل
  useEffect(() => {
    const savedCompletedIds = localStorage.getItem("Completed");
    if (savedCompletedIds) {
      const completedArray = JSON.parse(savedCompletedIds);
      setCompletedId(completedArray);

      // 🔷 تحديث حالة المهام بجعل isDone true
      const updatedTasks = tasks.map((task) =>
        completedArray.includes(task.id) ? { ...task, isDone: true } : task
      );
      setTasks(updatedTasks);
    }
  }, 
  []
); // لا تضع tasks هنا حتى لا تعمل حلقة لا نهائية

  // 📝 دالة إظهار وإخفاء التيبس
  const HandleShowTips = (id) => {
    setOpenTips(openTips === id ? null : id);
  };

  // 📝 دالة تغيير حالة المهمة إلى منجزة أو إلغاء الإنجاز

  const handleCompleted = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, isDone: !task.isDone } : task
    );
    setTasks(updatedTasks);

    // 📝 تحديث قائمة Completed IDs
    if (Completed.includes(id)) {
      setCompletedId(Completed.filter((itemId) => itemId !== id));
    } else {
      setCompletedId([...Completed, id]);
    }
  };

  // 📝 دالة حذف المهمة
  const handleDelete = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    // حذف ID من قائمة Completed أيضًا إذا كانت موجودة
    setCompletedId(Completed.filter((itemId) => itemId !== id));

    // ✅ تحديث localStorage مباشرة بعد الحذف
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    localStorage.setItem(
      "Completed",
      JSON.stringify(Completed.filter((itemId) => itemId !== id))
    );
  };

  const PlaySound = () => {
    const audio = new Audio(woosh);
    audio.play().catch((error) => {
      console.error("Error Playing audio", error);
    });
  };
  // Handle Edit

  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [TitleEdit, SetTitleEdit] = React.useState("");
   const [selectedTaskId,SetselectedTaskId]=useState(null)

  const handleClickOpen = (task) => {
    SetTitleEdit(task.Title);
    setOpenEditDialog(true);
    SetselectedTaskId(task.id)
  };

  const handleClose = () => {
    setOpenEditDialog(false);
  };

  const handleUpdateConfirm = () => {
    console.log("Upditing Task : " + TitleEdit);

    const UpdatedToDos = tasks.map((task) => {
      if (task.id === selectedTaskId) {
        
        return { ...task, Title: TitleEdit };
      } else {
        return task;
      }
    });
    setTasks(UpdatedToDos);
    setOpenEditDialog(false);
  };

  // 📝 رسم عناصر المهام
  const GetItem = tasks.map((item) => {
    return (
      
        <Grid sx={{}} key={item.id} size={{ md: 5.5, sm: 10, xs: 11 }}>
          <Dialog
            sx={{ marginBottom: { xs: "300px", md: "0", sm: "0" } }}
            open={openEditDialog}
            onClose={handleClose}
          >
            <DialogTitle>Edit You Task Title </DialogTitle>
            <DialogContent sx={{ paddingBottom: 0, width: { md: "400px" } }}>
              <form>
                <TextField
                  sx={{ width: { md: "350px", sm: "350px" } }}
                  autoFocus
                  required
                  margin="dense"
                  id="name"
                  name="text"
                  label="Title here"
                  type="text"
                  // fullWidth
                  variant="standard"
                  value={TitleEdit}
                  onChange={(e) => SetTitleEdit(e.target.value)}
                  // onChange={(e)=>{
                  //   SetTitleEdit({ ...TitleEdit, TitleEdit: e.target.value });
                  // }}
                  // onChange={(e) => SetTitleInput(e.target.value)}
                />
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleUpdateConfirm}>Confirm</Button>
                </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
          <Item
            sx={{
              height: openTips === item.id ? "250px" : "100px",
              display: "flex",
              backgroundColor: item.isDone ? "#588b57" : "",
            }}
          >
            <Grid
              size={{ md: 8, sm: 8, xs: 6 }}
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "start",
                height: "100%",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <Typography
                color="primary"
                sx={{
                  fontSize: { md: "25px", sm: "20px" },
                  fontWeight: "bold",
                  paddingTop: "10px",
                }}
              >
                {item.Title}
              </Typography>

              <ol
                style={{ paddingTop: "35px" }}
                dangerouslySetInnerHTML={{ __html: item.Tips }}
              ></ol>
            </Grid>

            <Grid size={{ md: 7, sm: 7, xs: 6 }}>
              <Grid
                sx={{ justifyContent: { md: "start", sm: "center" } }}
                // style={{ height: item.isDone === true ? "100%" : "50%" }}
                className="TOpsaidInCard"
              >
                <Grid sx={{ direction: "rtl" }} container spacing={1}>
                  <Grid size={{ md: 4, xs: 3 }}>
                    <Button
                      color="warning"
                      variant="text"
                      sx={{
                        width: { md: "70px", xs: "15px" },
                        height: { md: "50px", sm: "50px", xs: "40px" },
                        borderRadius: "50px",
                        padding: "0",
                      }}
                      onClick={() => handleDelete(item.id)} // ✅ زر الحذف هنا
                    >
                      <DeleteIcon />
                    </Button>
                  </Grid>

                  <Grid size={{ md: 4, xs: 3 }}>
                    <Button
                      onClick={() => handleClickOpen(item)}
                      sx={{
                        width: { md: "70px", xs: "15px" },
                        height: { md: "50px", sm: "50px", xs: "40px" },
                        borderRadius: "50px",
                        padding: "0",
                      }}
                      color="primary"
                      variant="text"
                    >
                      <EditIcone />
                    </Button>
                  </Grid>

                  <Grid size={{ md: 4, xs: 3 }}>
                    <Button
                      onClick={() => {
                        handleCompleted(item.id);
                        PlaySound();
                      }}
                      sx={{
                        width: { md: "70px", xs: "15px" },
                        height: { md: "50px", sm: "50px", xs: "40px" },
                        borderRadius: "50px",
                        padding: "0",
                      }}
                      color="success"
                      variant="text"
                    >
                      <CheckIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                className="BottomsaidInCard"
                sx={{
                  justifyContent: { md: "center", sm: "end", xs: "end" },
                  alignItems: "end",
                  paddingBottom: "5px",
                }}
              >
                <Button
                  disabled={!item.ShowTips}
                  onClick={() => HandleShowTips(item.id)}
                  color="primary"
                  variant="contained"
                  sx={{
                    ml: 1,
                    backgroundColor: "Botton",
                    width: { md: 190, sm: 130, xs: 100 },
                    height: { md: 35, sm: 40, xs: 30 },
                    fontSize: { md: 20, sm: 15, xs: 10 },
                  }}
                >
                  Show Tips
                </Button>
              </Grid>
            </Grid>
          </Item>
        </Grid>
     
    );
  });

  // 📝 عنصر الإرجاع النهائي
  return (
    <div
      style={{
        width: "100%",
        height: "89vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box className="GridCon" sx={{ flexGrow: 2, width: "100%" }}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{
            display: "flex",
            marginTop: "10px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {tasks.length > 0 ? GetItem : <h3>Not Found A Mission ....</h3>}
        </Grid>
      </Box>
    </div>
  );
}
