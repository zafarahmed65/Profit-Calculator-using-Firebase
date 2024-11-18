const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(express.static("public"));

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
