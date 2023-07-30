import {NextFunction, Request, Response} from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    const base64FirstWorld = req.headers.authorization.split(' ')[0];
    const base64Credentials = req.headers.authorization.split(' ')[1];

    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
    const [username, password] = credentials.split(':');
    if (`${base64FirstWorld} ${username}:${password}` === 'Basic admin:qwerty') {
      next()
    } else {
      res.sendStatus(401)
    }
    return
  }
  res.sendStatus(401)
}
