const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const apiToken = "secret_ujRGbta0zugfm2CpF9DdxaBZcR6BR0kx5zlod1KUEO7"; // Replace with your actual API token

app.post("/notion-proxy/:databaseID", async (req, res) => {
  try {
    const databaseID = req.params.databaseID;
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${databaseID}/query`,
      { filter: {} },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-08-16",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
