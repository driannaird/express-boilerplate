import createServer from "./server.js";

const app = createServer();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listen on http://localhost:${PORT}`);
});
