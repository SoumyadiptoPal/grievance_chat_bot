import { Box, Button, Modal, TextField } from "@mui/material";
import React, { useState, useContext, useEffect, useRef } from "react";
import SendIcon from '@mui/icons-material/Send';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { storage } from "../firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import MicIcon from '@mui/icons-material/Mic';
import Context from "../context/Context";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const InputText = ({chat, setChat, flag}) => {
  const context=useContext(Context);
  const {uploadChat,updateChat,askBard}=context;
  const [text,setText]=useState("");
  const [show,setShow]=useState(false);
  const [progress,setProgress]=useState(0);
  const [url,setUrl]=useState([]);
  const [file, setFile] = useState(null);
  const { transcript, browserSupportsSpeechRecognition,resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    console.log(transcript);
    setText(transcript);
  }, [transcript])


  if (!browserSupportsSpeechRecognition) {
    return null;
  }
  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    console.log("start")
  }
  const stopListening = () => {
    SpeechRecognition.stopListening();
    console.log("start")
  }
  
  
  const handleSend=async()=>{
    const object={
      sender: "User",
      text: text,
      url: url
    }
    resetTranscript();
    if(flag)
    {
      //chat in buffer
      let messages=[...chat,object];
      setChat((prevChat) => [...prevChat, object]);
      
      let reply=await askBard(text);
      const obj={
        sender: "Bot",
        text: reply
      }
      
      setChat((prevChat) => [...prevChat, obj]);
      setText("");
      setUrl([]);
      // uploadChat(messages);
    }
    else
    {
      //chat in selectedChat
      let messages=[...chat.messages,object];
      setChat({...chat, messages: messages})
      updateChat(messages);
      setText("");
      setUrl([]);
    }
  }
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (error) => {
        console.log(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log(url)

          setUrl([...url,downloadURL]);
        });
        setProgress(0);
        setFile(null);
        setShow(false);
      }
    );
  };
  return (
    <div>
    <div className="it_cont">
      <Modal
        open={show}
        onClose={() => setShow(!show)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <input type="file" onChange={handleChange} />
          {progress > 0 && <progress value={progress} max="100" />}
          <button onClick={handleUpload} className="btn1">
            Upload
          </button>
        </Box>
      </Modal>
      <Button variant="outlined" sx={{height:'56px', marginRight:'5px'}}
      // onTouchStart={startListening}
      onMouseDown={startListening}
      // onTouchEnd={stopListening}
      onMouseUp={stopListening}
      ><MicIcon/></Button>
      <TextField
          id="outlined-multiline-flexible"
          label="Enter you grievance here"
          multiline
          maxRows={4}
          fullWidth={true}
          value={text}
          onChange={(e)=>setText(e.target.value)}
        />
        <Button variant="outlined" sx={{height:'56px', marginLeft:'5px'}} onClick={()=>setShow(true)}><ControlPointIcon/></Button>
        <Button variant="outlined" sx={{height:'56px', marginLeft:'5px'}} onClick={handleSend}><SendIcon/></Button>
    </div>
    <div style={{display:'flex', flexDirection:'row', justifyContent:'left', marginLeft:'20px'}}>
      {url && url.map((item)=>(
        <div className="imgIcon">
          <a href={item} target="_blank" rel="noopener noreferrer">
          <img src={item} className="imgIcon"/>
          </a>
        </div>
      ))}
    </div>
    </div>
  )
}

export default InputText