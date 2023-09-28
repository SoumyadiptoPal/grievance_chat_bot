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
import translations from "../data/translatedText";

const State = (props) => {
  const [chats, setChats] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [language, setLanguage] = useState("English");
  const [buffer, setBuffer] = useState([{
    sender: 'Bot',
    text:'Welcome to Grievance bot India. Please register your complain.'
  }]);
  const [code,setCode]=useState(0);
  const host = "http://localhost:5000";
  const [department,setDepartment]=useState("");
  const [Complain,setComplain]=useState("");
  const [subGroup,setSubgroup]=useState("");
  const [summary,setSummary]=useState("");
  const [flag1,setFlag1]=useState(false);

  

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

  const uploadChat = async (messages) => {
    try {
      
   
    const upload = await addDoc(collection(db, "chats"), {
      customer_id: 12345678,
      status: "Complaint Submitted",
      messages: messages,
      createdAt: serverTimestamp(),
    });
    // console.log(upload);
    await getDoc(upload)
      .then((doc) => {
        if (doc.exists()) {
          // Document found, you can access its data
          let data = {
            id: doc.id,
            ...doc.data(),
          };
          const obj = {
              sender: "Bot",
              text: `Your Complain id is #${data.id}`
            };
            const messages=[...data.messages,obj]
          data = {...data, messages:messages};
          setSelectedChat(data);
          setCode(0);
          console.log("Document data:", data);
        } else {
          console.log("Document does not exist");
        }
      })
      .catch((error) => {
        console.error("Error fetching document:", error);
      });
    } catch (error) {
      alert("There has been an error!! Plese try again");
      console.log(error);
    }
  };
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

  const askBard = async (message) => {
    const response = await fetch(`${host}/api/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message }),
    });
    const json = await response.json();
    return json.message;
  };
  const translate = async (text, code) => {
    const response = await fetch(`${host}/api/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: text, code: code }),
    });
    const json = await response.json();
    return json.data;
  };
  const takeUserReply= async (object)=>{
    setBuffer((prevChat) => [...prevChat, object]);
    if(language!="English")
    {
      object.text=await translate(object.text);
    }
    if(code==0)
    {
      setCode(1);
      await askQuestion1(object.text);
    }
    else if(code==1)
    {
      if(object.text.toLowerCase().includes('y'))
      {
        setCode(2);
        askQuestion2()
      }
      else
      {
        setCode(-1);
        replyQuestion1();
      }
    }
    else if(code==2)
    {
      setCode(3);
      askQuestion3(object);
    }
    else if(code==3)
    {
      if(object.text==="cancel")
      {
        setCode(6);
      }
      else if(object.text.toLowerCase().includes('n'))// for multilingual support add "no/yes" in different languages
      {
        setCode(4);
        const object = {
          sender: "User",
          text: "No",
        };
        setBuffer((prevChat) => [...prevChat, object]);
        console.log([...buffer,object]);
        await uploadChat([...buffer,object]);
      }
      else
      {
        setCode(5);
        replyQuestion2();
      }
      
    }
    else if(code==5)
    {
      setCode(3);
      // setSummary(summary+" "+object.text);
      askQuestion3(object,1);
    }
    else if(code==-1)
    {
      setCode(1);
      replyQuestion3(object.text)
    }
  }
  const askQuestion1=async(complain)=>{
    const text=`Legitimate complaint: <Yes/No>
    Department: <Department Name>
    Subgroup: <Group Name>
    Summary: <Only the important details>
    
    Statement: "${complain}"
    
    Please answer in the above given format

    These are the following Departments along with there subgroup:-
    1) Financial Services:-
    Loans,
    Credit/Debit/ATM Cards,
    Government-sponsored Schemes,
    Insurance,
    Allegation on Corruption/Malpractice,
    Retirement Benefits,
    Others.
    2) Labour and Employment:-
    Cash Benefit,
    Medical Benefits,
    Recruitment,
    Non-Payment of reasonable wages,
    Maternity Benefit,
    Violation of terms of employment,
    PF Withdrawal,
    Pension,
    Transfer related issues,
    Others.
    3)Health and Family Welfare:
    Hospitals or Health Centre,
    Medicines/Vaccines,
    Financial Assistance for Medical Treatment,
    Health Schemes,
    Food Regulation,
    Online Health Services,
    Policy Matters,
    Other.
    4)Agriculture and Farmers Welfare:
    Policy related matters,
    Seeds/Crop quality related issues,
    Crop Insurance Scheme
    Agriculture Credit
    Horticulture related issues
    Organic farming and fertilizers issues
    Machinery and Technology issues
    Price Support System
    Trade related issues,
    5) Animal Husbandry, Dairying:
    Administration Related,
    Trade Related,
    Livestock Health,
    Others.
    6) Posts:
    Delay/Non-Delivery/Abstraction of Postal Articles,
    Allegation of Corruption/Malpractices/Harassment,
    Aadhar and Post Office Passport Seva Kendra (POPSK) Related,
    E-commerce portal Related,
    ePost Office Related,
    Others/Misc.
    7) Home Affairs:
    Property Disputes,
    Domestic violence,
    Social/Cultural/Caste/Gender Abuse,
    Citizenship disputes,
    Others.
    8) Other Griveances.`
    let reply=await askBard(text);
    reply=reply.replace(/\*/g, '');
    // reply=reply.replace(/ {2,}/g, ' ');
    console.log(reply);

    let match=reply.match(/Legitimate\scomplaint:\s*(.*?)\n+/);
    console.log(match);
    const complainValue=(match)?match[1]:"No";
    match=reply.match(/Department:\s(.*?)\n+/);
    const departmentValue=(match)?match[1]:"";
    match=reply.match(/Subgroup:\s(.*?)\n+/)
    const subgroupValue=(match)?match[1]:"";
    match=reply.match(/Summary:\s(.*?)\n+/);
    const summaryValue=(match)?match[1]:"";
    setComplain(complainValue);
      setDepartment(departmentValue);
      setSubgroup(subgroupValue);
      setSummary(summaryValue);
    let ans,object;
    console.log("Hi",complainValue);
    if(complainValue.toLowerCase()==="yes")
    {
      ans=`You complain will be submitted to "${departmentValue}" department under "${subgroupValue}" subgroup. Please enter "Yes"/"No" to confirm this details.`  
    }
    else
    {
      ans=`Your text is not a valid complain. Please refrain from asking any other questions.`
    } 
    object = {
      sender: "Bot",
      text: ans,
    };
    setBuffer((prevChat) => [...prevChat, object]);
  }
  const askQuestion2=()=>{
    const ans=`Please upload the following documents: Identity proof, Address proof, ....`
    const object = {
      sender: "Bot",
      text: ans,
    };
    setBuffer((prevChat) => [...prevChat, object]);
  }
  const askQuestion3=(object1,c=0)=>{
    const ans=`Department Name: ${department},\n
    Subgroup:${subGroup},\n
    Complaint Summary:${summary} ${(c==1)?"+"+object1.text:""}\n

    The following documents were uploaded.\n Do you want to add anything else? 
    Please enter yes/no.`
    setSummary(summary+object1.text);
    let url=[];
    buffer.forEach((obj) => {
      if (obj.url && Array.isArray(obj.url) && obj.sender==="User") {
        url = [...url, ...obj.url];
      }
    });
  
  url=[...url,...object1.url];
    const object = {
      sender: "Bot",
      text: ans,
      url: url
    };
    setBuffer((prevChat) => [...prevChat, object]);
  }
  const replyQuestion1=()=>{
    const ans=`Please give me the department name and under the subgroup you want to apply.\n Reply in the following order:\n Department:<Department Name>\n Subgroup:<Subgroup Name>.`
    const object = {
      sender: "Bot",
      text: ans,
    };

    setBuffer((prevChat) => [...prevChat, object]);
  }
  const replyQuestion2=()=>{
    const ans=`Please enter your additional details.`
    const object = {
      sender: "Bot",
      text: ans,
    };
    setBuffer((prevChat) => [...prevChat, object]);
  }
  const replyQuestion3=(reply)=>{
    reply=reply.toLowerCase();
    let match=reply.match(/department:\s(.*?)\ssubgroup+/);
    const departmentValue=(match)?match[1]:"";
    match=reply.match(/subgroup:\s(.*)+/)
    const subgroupValue=(match)?match[1]:"";
      setDepartment(departmentValue);
      setSubgroup(subgroupValue);

      const ans=`You complain will be submitted to "${departmentValue}" department under "${subgroupValue}" subgroup. Please enter "Yes"/"No" to confirm.`

      const object = {
        sender: "Bot",
        text: ans,
      };
  
      setBuffer((prevChat) => [...prevChat, object]);
  }
  return (
    <Context.Provider
      value={{
        selectedChat,
        setSelectedChat,
        language,
        setLanguage,
        buffer,
        setBuffer,
        uploadChat,
        chats,
        updateChat,
        askBard,
        translate,
        takeUserReply,
        setCode,
        flag1,
        setFlag1
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default State;
