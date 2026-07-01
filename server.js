require("dotenv").config();

const express = require("express");

const webhookRoutes = require("./routes/webhook");

const app = express();

app.use(express.json({ limit: "2mb" }));

app.use("/", webhookRoutes);

app.get("/", (req, res) => {
    res.send("🚀 Kızık AI v1.0 çalışıyor.");
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
console.log("=================================");
console.log("🚀 Kızık AI v1.0");
console.log("Port :", PORT);
console.log(`URL  : http://localhost:${PORT}`);
console.log("================================="); 
});    
