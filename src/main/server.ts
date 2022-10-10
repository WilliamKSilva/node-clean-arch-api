import { MongoHelper } from "../infra/db/mongodb/helpers/mongo-helper";
import env from "./config/env";

MongoHelper.connect('mongodb://localhost:27017/node-clean-arch').then(async () => {  
  const app = (await import ("./config/app")).default;
  app.listen(env.port, () => console.log(`App is running on ${env.port}!`));
})
  .catch(console.error);