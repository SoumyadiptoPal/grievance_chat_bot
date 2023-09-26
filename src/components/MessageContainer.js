import React, { useContext, useState, useEffect } from "react";
import Context from "../context/Context";
import InputText from "./InputText";
import translations from "../data/translatedText";
import CircularProgress from '@mui/material/CircularProgress';

const MessageContainer = () => {
  const context = useContext(Context);
  const { selectedChat, setSelectedChat, buffer, setBuffer, language,translate,flag1 } = context;
  // const [buffer,setBuffer]=useState([]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Header selectedChat={selectedChat} language={language}/>
      {selectedChat ? (
        <Messages Chat={selectedChat.messages} language={language} translate={translate} flag1={flag1}/>
      ) : (
        <Messages Chat={buffer} language={language} translate={translate} flag1={flag1}/>
      )}
      {selectedChat ? (
        <InputText chat={selectedChat} setChat={setSelectedChat} flag={false} />
      ) : (
        <InputText chat={buffer} setChat={setBuffer} flag={true} />
      )}
    </div>
  );
};
const Header = ({ selectedChat, language }) => {
  return (
    <div>
      <div className="MC_header">
        {selectedChat ? `${translations[language].text3} #${selectedChat.id}` : `${translations[language].text2}`}
      </div>
    </div>
  );
};
const Messages = ({ Chat,language,translate,flag1 }) => {
  const langcodes = {};
  langcodes['English']='en';
  langcodes['বাংলা']='bn';
  langcodes['हिंदी']='hi';
  langcodes['தமிழ்']='ta';
  langcodes['తెలుగు']='te';
  langcodes['मराठी']='mr';
  langcodes['ಕನ್ನಡ']='kn';
  langcodes['ਪੰਜਾਬੀ']='pa';

  const [lang, setLang] = useState(langcodes[language]);
  // const [lang, setLang] = useState('bn');
  const [translatedChat, setTranslatedChat] = useState([]);

  useEffect(() => {
    // Function to translate a single message
    const translateMessage = async (text) => {
      if(lang=='en')
      return text;
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
  useEffect(()=>{
    setLang(langcodes[language])
  },[language])
  return(
  <div className="messages">
    {translatedChat.map((item, index) => (
      <div
        key={index}
        className={`${item.sender === "User" ? "right" : "left"}`}
      >
        <MessageItem item={item} />
      </div>
    ))}
    {(flag1)?
    <div
        className="left"
        style={{margin:"10px", border:"2px solid rgb(3, 168, 168)", width:"45px", borderRadius:"10px", padding:"10px"}}
      >
     <CircularProgress />
     </div>
:<></>}
{/* Add a spinner */}
  </div>

);
    }
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
                <img src={item} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
