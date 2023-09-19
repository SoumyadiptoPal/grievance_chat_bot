import { useEffect, useState } from "react";
import Context from "./Context";
import { addDoc, doc, serverTimestamp,query,onSnapshot,getDoc, collection,getDocs,orderBy,updateDoc } from "firebase/firestore";
import {firebase, db, auth} from "../firebase";
// import translate from "translate-google";

const State=(props)=>{

    const [chats,setChats]=useState(null);
    const [selectedChat,setSelectedChat]=useState(null);
    const [language,setLanguage]=useState('en');
    const [buffer,setBuffer]=useState([]);
    const host="http://localhost:5000"


    useEffect(()=>{
      async function fetchData() {
        const querySnapshot = await getDocs(collection(db, "chats"),orderBy('createdAt', 'desc'));
        const fetchedChats = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChats(fetchedChats);
      }
  
      const unsubscribe = onSnapshot(collection(db, "chats"), (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          fetchData();
        });
      });
      fetchData();
    },[])
      
    const uploadChat=async(messages)=>{
        const upload = await addDoc(collection(db, 'chats'), {
            customer_id: 12345678,
            status: "Approved",
            messages: messages,
            createdAt: serverTimestamp()
          })
          // console.log(upload);
          getDoc(upload)
          .then((doc) => {
    if (doc.exists()) {
      // Document found, you can access its data
      const data = {
        id: doc.id,
        ...doc.data(),
      }
      setSelectedChat(data);
      console.log("Document data:", data);
    } else {
      console.log("Document does not exist");
    }
  })
  .catch((error) => {
    console.error("Error fetching document:", error);
  });
    }
    const updateChat=async(messages)=>{
      const docRef = doc(db, 'chats', selectedChat.id);
      const updatedData={
        messages: messages
      }
      try {
        await updateDoc(docRef, updatedData);
        console.log('Document successfully updated!');
      } catch (error) {
        console.error('Error updating document:', error);
      }
    }

    const askBard= async (message)=>{
      const response = await fetch(`${host}/api/ask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({text: message})
    });
    const json = await response.json()
    return json.message;
    }
    const translate=async(text, code=language)=>{
      const response = await fetch(`${host}/api/translate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({text: text, code: code})
    });
    const json = await response.json()
    return json.data;
    }
    return(
        <Context.Provider value={{selectedChat,setSelectedChat,language,setLanguage,buffer,setBuffer,uploadChat,chats,updateChat,askBard,translate}}>
            {props.children}
        </Context.Provider>
    )
}

export default State;