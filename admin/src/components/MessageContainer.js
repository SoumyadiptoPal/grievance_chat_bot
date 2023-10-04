import React, { useContext, useState, useEffect } from "react";
import Context from "../context/Context";
import {
  CircularProgress,
  Button,
  Box,
  Modal,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import InputText from "./InputText";
import CloseIcon from "@mui/icons-material/Close";
import { departmentName, subgroup,SelectStatus } from "../data";

const MessageContainer = () => {
  const context = useContext(Context);
  const { selectedChat, setSelectedChat, language, translate } = context;

  return (
    <>
      {selectedChat ? (
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Header selectedChat={selectedChat} language={language} />
          <Messages
            Chat={selectedChat.messages}
            language={language}
            translate={translate}
            selectedChat={selectedChat}
          />
          <InputText chat={selectedChat} setChat={setSelectedChat} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
const Header = ({ selectedChat, language }) => {
  return (
    <div>
      <div className="MC_header">{`Complaint #${selectedChat.id}`}</div>
    </div>
  );
};
const Messages = ({ Chat, language, translate, selectedChat }) => {
  const langcodes = {};
  langcodes["English"] = "en";
  langcodes["বাংলা"] = "bn";
  langcodes["हिंदी"] = "hi";
  langcodes["தமிழ்"] = "ta";
  langcodes["తెలుగు"] = "te";
  langcodes["मराठी"] = "mr";
  langcodes["ಕನ್ನಡ"] = "kn";
  langcodes["ਪੰਜਾਬੀ"] = "pa";

  const [lang, setLang] = useState(langcodes[language]);
  const [translatedChat, setTranslatedChat] = useState([]);
  const user = {
    Name: "Chirag Chowdhury",
    Aadhar: "000000000001",
    Address: "4/5, Sleeping Beuty Lane, Kolkata-69",
    Phone: "9999999999",
  };
  useEffect(() => {
    // Function to translate a single message
    const translateMessage = async (text) => {
      if (lang == "en") return text;
      try {
        const translatedText = await translate(text, lang);
        return translatedText;
      } catch (error) {
        console.error("Translation error:", error);
        return text; // Return the original text in case of an error
      }
    };

    // Translate all messages in the Chat
    const translateChat = async () => {
      const translatedMessages = await Promise.all(
        Chat.map(async (message) => {
          try {
            const translatedText = await translateMessage(message.text);
            // Create a new object with the translated text and other properties
            return {
              ...message,
              text: translatedText, // Replace text with translated text
            };
          } catch (error) {
            console.error("Translation error:", error);
            // Return the original message object in case of an error
            return message;
          }
        })
      );
      setTranslatedChat(translatedMessages);
    };

    // Call translateChat whenever the language changes or Chat updates
    translateChat();
  }, [Chat, lang]);
  useEffect(() => {
    setLang(langcodes[language]);
  }, [language]);
  return (
    <div className="messages">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Summary selectedChat={selectedChat} language={language} />
        <UserDetails user={user} />
      </div>
      {translatedChat.map((item, index) => (
        <div
          key={index}
          className={`${item.sender === "User" ? "left" : "right"}`}
        >
          <MessageItem item={item} />
        </div>
      ))}
    </div>
  );
};

const MessageItem = ({ item }) => {
  return (
    <div className="message_cont">
      {item.text}
      {item.url && item.url.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
            margin: "10px",
            border: "2px solid blue",
            maxWidth: "500px",
          }}
        >
          {item.url.map((item) => (
            <div>
              <a href={item} target="_blank" rel="noopener noreferrer">
                <img src={item} width="200px" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const Summary = ({ language }) => {

  const context = useContext(Context);
  const { updateStatus, updateDeptOrSubgrp, selectedChat,setSelectedChat } = context;
  const [flag1, setFlag1] = useState(false);
  const [flag2, setFlag2] = useState(false);
  const handleClose = () => {
    setFlag1(false);
    setFlag2(false);
  };
  const [status,setStatus]=useState(selectedChat.status);
  const [department,setDepartment]=useState(selectedChat.department);
  const [subgr,setSubgr]=useState(selectedChat.subgroup)
  
  useEffect(()=>{
    setDepartment(selectedChat.department);
    setStatus(selectedChat.status);
    setSubgr(selectedChat.subgroup);
  },[selectedChat])
  return (
    <div className="Summary_cont" style={{ width: "400px", flex: "1" }}>
      <Modal
        open={flag1 || flag2}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {flag1 && 
          <div>
            <Typography id="modal-modal-title" variant="h6" component="h2">
      Update Status
    </Typography>

            <FormControl sx={{ m: 1, minWidth: 300 }} size="small">
        <InputLabel id="demo-simple-select-label">Select Status</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={status}
          label="Select Department"
          onChange={(e)=> setStatus(e.target.value)}
        >
          {
            SelectStatus.map((item, index)=>(
              <MenuItem key={index} value={item}>{item}</MenuItem>
            ))
          }
        </Select>
      </FormControl>

      <Button variant="contained" onClick={()=>{
        updateStatus(status);
        setSelectedChat(prevState => ({
      ...prevState, 
      status: status, 
    }));
    setFlag1(false);
        }}> Update </Button>
          </div>}
          {flag2 && 
          <div>
            <Typography id="modal-modal-title" variant="h6" component="h2">
      Change Department/Sub-Category
    </Typography>

          <FormControl sx={{ m: 1, minWidth: 400 }} size="small">
        <InputLabel id="demo-simple-select-label">Change Department</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={department}
          label="Select Department"
          onChange={(e)=> setDepartment(e.target.value)}
        >
          {
            departmentName.map((item, index)=>(
              <MenuItem key={index} value={item}>{item}</MenuItem>
            ))
          }
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 400 }} size="small">
        <InputLabel id="demo-simple-select-label">Change Sub-Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={subgr}
          label="Select Department"
          onChange={(e)=> setSubgr(e.target.value)}
        >
          { subgroup[department] && 
            subgroup[department].map((item, index)=>(
              <MenuItem key={index} value={item}>{item}</MenuItem>
            ))
          }
        </Select>
      </FormControl>

      <Button variant="contained"
      onClick={()=>{
        updateDeptOrSubgrp(department,subgr);
        setSelectedChat(prevState => ({
      ...prevState, 
      department: department,
      subgroup: subgr 
    }));
    setFlag2(false);
      }}> Update </Button>
          </div>}
        </Box>
      </Modal>
      <strong>Summary: </strong>
      {selectedChat.summary}
      <div>
        <div>
          <strong>Department: </strong>
          {selectedChat.department}{" "}
          <strong style={{ marginLeft: 20 }}>Subgroup: </strong>
          {selectedChat.subgroup}
        </div>
        <div>
          <strong>Status: </strong>
          {selectedChat.status}
        </div>
        <div>
          <Button
            variant="outlined"
            onClick={() => {
              setFlag1(true);
            }}
            sx={{ m: 1 }}
          >
            Update Status
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setFlag2(true);
            }}
          >
            Change Department / Subgroup
          </Button>
        </div>
      </div>
    </div>
  );
};

const UserDetails = ({ user }) => {
  return (
    <div className="Summary_cont" style={{ width: "270px" }}>
      <div>
        <strong>Name: </strong>
        {user.Name}
      </div>
      <div>
        <strong>Aadhar No. </strong>
        {user.Aadhar}
      </div>
      <p>
        <strong>Address: </strong>
        {user.Address}
      </p>
      <div>
        <strong>Phn. No. </strong>
        {user.Phone}
      </div>
    </div>
  );
};
export default MessageContainer;
