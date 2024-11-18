const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();

// Serve static files (HTML, CSS, JS) from the root directory
app.use(express.static(__dirname));

// Serve "index.html" for the root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Serve other static HTML files like "history.html"
app.get("/:file", (req, res) => {
    res.sendFile(path.join(__dirname, req.params.file));
});

// Proxy setup for Firebase API
app.use(
    "/firestore",
    createProxyMiddleware({
        target: "https://firestore.googleapis.com",
        changeOrigin: true,
        pathRewrite: { "^/firestore": "" },
    })
);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
