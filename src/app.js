import express from 'express';
import logger from '#config/logger.js';
import helmet from "helmet";
import morgan from 'morgan';
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express();

app.use(helmet());  //Adds security HTTP headers automatically. Protects against common attacks like clickjacking, XSS, and sniffing attacks. One line gives you 15+ security headers for free.

app.use(cors()); //Cross Origin Resource Sharing — allows your API to accept requests from different domains.Without it:Frontend on localhost:3000 → calls API on localhost:5000 → BLOCKED by browser

app.use(express.json()); //Parses incoming JSON request bodies. Without this req.body would be undefined when someone sends JSON data.

app.use(express.urlencoded({ extended: true })); //Parses form data submissions. extended: true allows nested objects in form data.

app.use(cookieParser()); //Parses cookies from incoming requests and makes them available in req.cookies. Used for authentication — storing session tokens or JWT in cookies.

app.use(morgan('combined', {stream: { write: (message) => logger.info(message.trim()) }})); //Every time someone makes a request to your API — Morgan automatically logs it without you writing any logging code manually.  By default Morgan writes to console.log. This stream option redirects Morgan's output into Winston instead — so all your logs go to the same place, same format, same files.

app.get('/', (req, res) => {

 logger.info('hello from aquisition')

  res.status(200).send('hello from aquisition');
});

export default app;