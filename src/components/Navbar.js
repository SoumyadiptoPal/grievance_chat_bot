import React, {useContext, useEffect, useState} from 'react'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Context from '../context/Context';

const Navbar = () => {
    const context=useContext(Context);
    const {language,setLanguage,translate}=context
    const [lang,setLang]=useState('English');
    const Languages=['English','বাংলা'];
    const lang_codes={}
    lang_codes['English']='en';
    lang_codes['বাংলা']='bn';
    const handleChange=(e)=>{
        setLang(e.target.value);
        setLanguage(lang_codes[e.target.value])
    }
    const [text1,setText1]=useState("Grievance Bot India")
    useEffect(()=>{
      const updateTranslatedText = async () => {
        const translatedText = await translate(text1);
        setText1(translatedText); // Update the state with the translated text
      };
  
      updateTranslatedText();
    },[language])
  return (
    <div className='nav'>
        <div style={{fontWeight:'bolder', fontSize:'2rem'}}>{text1 || ""}
        </div>
        <div>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <InputLabel id="demo-simple-select-label">Select Language</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={lang}
          label="Select Language"
          onChange={handleChange}
        >
            {
                Languages.map((item)=>(
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                ))
            }
          
        </Select>
      </FormControl>
        </div>
    </div>
  )
}

export default Navbar