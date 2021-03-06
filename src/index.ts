import "reflect-metadata";
import * as express from "express";
import {Request, Response} from "express";
import * as bodyParser from "body-parser";
import {Routes} from "./routes/routes";
import {dbConnectionMiddleware, tokenAuthMiddleware} from "./middleware";

const app = express();
app.use(bodyParser.json());
app.use(dbConnectionMiddleware);
app.use(tokenAuthMiddleware);

Routes.forEach(route => {
  (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
    const result = (new (route.controller as any))[route.action](req, res, next);
    if (result instanceof Promise) {
      result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
    } else if (result !== null && result !== undefined) {
      res.json(result);
    }
  });
});

app.listen(3000);

console.log("Express server has started on port 3000. Open http://localhost:3000 to see results");
