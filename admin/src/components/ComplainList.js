import { Button, TextField,InputLabel,MenuItem, FormControl, Select } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Context from "../context/Context";
import { departmentName } from "../data";

const ComplainList = () => {
  const context = useContext(Context);
  const {chats} = context;
  const[department,setDepartment]=useState("All");
  const [complain, setComplain] = useState(chats);
  // const departmentName=["All","Financial Services", "Labour and Employment", "Health and Family Welfare", "Home Affairs", "Agriculture and Farmers Welfare", "Animal Husbandry and dairying", "Others" ]
  useEffect(() => {
    setComplain(chats);
  }, [chats]);
//   const handleSearch = (e) => {
//     const value = e.target.value;
//     setSearch(value);
//     const filtered = chats.filter((item) => item.id.toString().includes(value));
//     setComplain(filtered);
//   };
const filterComplains = (term) => {
  if(term==="All")
  {setComplain(chats);
  return;}
  else if(term=="Others")
  {
    const filteredComplaint = chats.filter((complain) =>
    !departmentName.includes(complain.department)
  );
  setComplain(filteredComplaint);
  }
  else{
  const filteredComplaint = chats.filter((complain) =>
    complain.department && complain.department.toLowerCase()===term.toLowerCase()
  );
  setComplain(filteredComplaint);
  }
};
const handleChange=(e)=>{
  setDepartment(e.target.value);
  filterComplains(e.target.value);
}
  return (
    <div className="no-Scroll">
      <div>
      <FormControl sx={{ m: 1, minWidth: 300 }} size="small">
        <InputLabel id="demo-simple-select-label">Select Department</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={department}
          label="Select Department"
          onChange={handleChange}
        >
          {
            departmentName.map((item, index)=>(
              <MenuItem key={index} value={item}>{item}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      </div>
      {complain && complain.map((item) => <Item key={item.id} item={item}/>)}
    </div>
  );
};

const Item = ({ item }) => {
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
      <strong>Complaint #{item.id}</strong>
      <span>Status: {item.status}</span>
    </div>
  );
};
export default ComplainList;
