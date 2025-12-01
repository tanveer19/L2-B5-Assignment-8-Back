import app from "./app";
import { env } from "./app/config/env";

app.listen(env.port, () => {
  console.log(`Server running at http://localhost:${env.port}`);
});
