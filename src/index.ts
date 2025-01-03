import createServer from "./server";

const app = createServer();
const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listen on http://localhost:${PORT}`);
});
