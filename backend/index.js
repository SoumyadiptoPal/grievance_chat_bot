require("dotenv").config();
import("bard-ai")
  .then((module) => {
    const Bard = module.default;
    // Now you can use Bard as a module
    const express = require("express");
    var cors = require("cors");

    const app = express();
    const port = 5000;

    app.use(cors());
    app.use(express.json());
    // const COOKIE='bAj726WxO2wcnPVxC0C7_mJVOhIOomaIRGpJvLQkQ9O5Z4G9mA0a31w1Fstf1kyKzeBlpA.'
    const COOKIE = process.env.COOKIE;

    async function askBard(text) {
      let myBard = new Bard(COOKIE);
      text = text;
      try {
        let reply = await myBard.ask(text);
        return reply;
      } catch (error) {
        console.log(error);
      }
    }

    app.post("/api/ask", async (req, res) => {
      // Perform operations
      const { text } = req.body;
      message = await askBard(text);
      console.log(COOKIE);
      const data = { message: message };
      res.json(data);
    });
    import("translate-google")
      .then((module) => {
        const translate = module.default;
        app.post("/api/translate", async (req, res) => {
          const { text, code } = req.body;
          const data = await translateTo(text, code);
          const obj = { data: data };
          res.json(obj);
        });

        async function translateTo(text, code) {
          try {
            const res = await translate(text, { to: code });
            return res;
          } catch (err) {
            console.error(err);
          }
        }
      })
      .catch((error) => {});

    const server = app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error importing bard-ai:", error);
  });
