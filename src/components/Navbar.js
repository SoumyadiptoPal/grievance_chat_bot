import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Context from "../context/Context";
import translations from "../data/translatedText";

const Navbar = () => {
  const context = useContext(Context);
  const { language, setLanguage, translate } = context;
  const [lang, setLang] = useState("English");
  const Languages = ["English", "বাংলা","हिंदी","தமிழ்","తెలుగు","मराठी","ಕನ್ನಡ","ਪੰਜਾਬੀ"];
  const handleChange = (e) => {
    setLang(e.target.value);
    setLanguage(e.target.value);
  };
  return (
    <div className="nav">
      <div style={{ fontWeight: "bolder", fontSize: "2rem" }}>
        {translations[language].heading}
      </div>
      <div>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-simple-select-label">{translations[language].text5}</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={lang}
            label="Select Language"
            onChange={handleChange}
          >
            {Languages.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default Navbar;
