const fs = require("fs");
const https = require("https");

const token = "d7e078a0-3f49-4419-981a-8695c399b0d8";
const collection = "34199304";
const apiUrl = `https://api.raindrop.io/rest/v1/raindrops/${collection}?access_token=${token}&perpage=50&sort=-created`;
const outputPath = "data/data.json";

https
  .get(apiUrl, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      const jsonData = JSON.parse(data);
      fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
      console.log("Data updated successfully");
    });
  })
  .on("error", (error) => {
    console.error("Error fetching data:", error);
  });
