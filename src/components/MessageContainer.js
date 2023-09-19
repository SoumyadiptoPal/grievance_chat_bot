import React, { useContext,useState,useEffect } from 'react'
import Context from '../context/Context'
import InputText from './InputText';

const MessageContainer = () => {
    const context=useContext(Context);
    const {selectedChat,setSelectedChat,buffer,setBuffer}=context;
    // const [buffer,setBuffer]=useState([]);
    
  return (
    <div style={{display:'flex', flexDirection:'column',height:'100%'}}>
        <Header selectedChat={selectedChat}/>
        {(selectedChat)?<Messages Chat={selectedChat.messages}/>:<Messages Chat={buffer}/>}
        {(selectedChat)?<InputText chat={selectedChat} setChat={setSelectedChat} flag={false}/>:<InputText chat={buffer} setChat={setBuffer} flag={true}/>}
    </div>
  )
}
const Header=({selectedChat})=>{
    return(
    <div>
        <div className='MC_header'>{(selectedChat)?`Complaint #${selectedChat.id}`:`New Complaint`}</div>
    </div>
    )
}
const Messages=({Chat})=>(
    <div className='messages'>
    {Chat.map((item,index)=>(
        <div key={index} className={`${(item.sender==='User')?'right':'left'}`}>
        <MessageItem item={item}/>
        </div>
    ))}
    </div>
)
const MessageItem=({item})=>{

    return(
        <div className='message_cont'>
            {item.text}
            {item.url && item.url.length>0 &&
            <div style={{display:'flex', flexDirection:'column', justifyContent:'left', margin:'10px', border:'2px solid blue', maxWidth:'500px'}}>
                {item.url.map((item)=>(
                    <div>
                    <a href={item} target="_blank" rel="noopener noreferrer">
                    <img src={item}/>
                    </a>
                  </div>
                ))}
            </div>
            }
        </div>
    )
}

export default MessageContainer