import { useEffect, useState } from "react";
import Context from "./Context";
import {
  addDoc,
  doc,
  serverTimestamp,
  query,
  onSnapshot,
  getDoc,
  collection,
  getDocs,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { firebase, db, auth } from "../firebase";

const State = (props) => {
    const [selectedChat,setSelectedChat] =useState(null);
    const[chats,setChats]=useState(null);
    const [language,setLanguage]=useState("English");
    useEffect(() => {
        async function fetchData() {
          const querySnapshot = await getDocs(
            collection(db, "chats"),
            orderBy("createdAt", "desc")
          );
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
      }, []);

      const updateChat = async (messages) => {
        const docRef = doc(db, "chats", selectedChat.id);
        const updatedData = {
          messages: messages,
        };
        try {
          await updateDoc(docRef, updatedData);
          console.log("Document successfully updated!");
        } catch (error) {
          console.error("Error updating document:", error);
        }
      };

      const updateStatus = async (status) => {
        const docRef = doc(db, "chats", selectedChat.id);
        const updatedData = {
          status: status,
        };
        try {
          await updateDoc(docRef, updatedData);
          console.log("Document successfully updated!");
        } catch (error) {
          console.error("Error updating document:", error);
        }
      };

      const updateDeptOrSubgrp = async (department,subgrp) => {
        const docRef = doc(db, "chats", selectedChat.id);
        const updatedData = {
          department: department,
          subgroup: subgrp
        };
        try {
          await updateDoc(docRef, updatedData);
          console.log("Document successfully updated!");
        } catch (error) {
          console.error("Error updating document:", error);
        }
      };

      const translate=()=>{

      }
    return (
        <Context.Provider
        value={{selectedChat,setSelectedChat,chats, language,setLanguage, translate, updateChat, updateStatus, updateDeptOrSubgrp}}>
            {props.children}
        </Context.Provider>
    )
}

export default State;