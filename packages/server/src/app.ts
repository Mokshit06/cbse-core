import pgSession from 'connect-pg-simple';
import cors from 'cors';
import express from 'express';
import expressSession from 'express-session';
import { authMiddleware } from './middleware/auth';
import routes from './routes';

const app = express();

app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
  })
);
app.use(express.json());

const PgStore = pgSession(expressSession);
const sessionMiddleware = expressSession({
  secret: process.env.COOKIE_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: new PgStore(),
});

app.use(sessionMiddleware);
app.use(authMiddleware);

app.use('/', routes);

export default app;
