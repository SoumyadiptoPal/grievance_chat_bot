import { Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Context from "../context/Context";
import translations from "../data/translatedText";
const ComplainList = () => {
  // const data=[{
  //     id: 1234567,
  //     status:'approved',
  //     messages:[{
  //         sender: "User",
  //         text:"Hello how are you? I am fine"
  //     },
  //     {
  //         sender: "Bot",
  //         text:"I am also Fine. How's your family?"
  //     }]
  // },
  // {
  //     id: 1234568,
  //     status:'approved',
  //     messages:[{
  //         sender: "User",
  //         text:"Hello how are you? I am fine"
  //     },
  //     {
  //         sender: "Bot",
  //         text:"I am also Fine. How's your family?"
  //     }]
  // }]
  const context = useContext(Context);
  const { selectedChat, setSelectedChat, setBuffer, chats,setCode,language} = context;
  const [search, setSearch] = useState("");
  const [complain, setComplain] = useState(chats);

  useEffect(() => {
    setComplain(chats);
  }, [chats]);
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = chats.filter((item) => item.id.toString().includes(value));
    setComplain(filtered);
  };
  return (
    <div className="no-Scroll">
      <div className="cl_cont">
        <div className="search">
          <TextField
            id="outlined-size-small"
            label={translations[language].text1}
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <Button
          variant="outlined"
          onClick={() => {
            setSelectedChat(null);
            setBuffer([{
              sender: 'Bot',
              text:'Welcome to Grievance bot India. Please register your complain.'
            }]);
            setCode(0);
          }}
        >
          {translations[language].text2}
        </Button>
      </div>
      {complain && complain.map((item) => <Item key={item.id} item={item} language={language}/>)}
    </div>
  );
};

const Item = ({ item, language }) => {
  const context = useContext(Context);
  const { selectedChat, setSelectedChat } = context;
  const handleClick = () => {
    setSelectedChat(item);
  };

  return (
    <div
      className={`Item_cont ${
        selectedChat && selectedChat.id === item.id ? "blue" : ""
      }`}
      onClick={handleClick}
    >
      <strong>{translations[language].text3} #{item.id}</strong>
      <span>{translations[language].text4}: {item.status}</span>
    </div>
  );
};
export default ComplainList;
