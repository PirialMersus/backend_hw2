import express, {Request, Response} from 'express';
import bodyParser from "body-parser";
import {blogs, posts} from "./repositories/db";
import {blogsRoutes} from "./routes/blogs-routes";
import {postsRoutes} from "./routes/posts-routes";
import cors from 'cors'


const app = express();
app.use(cors());

app.use(bodyParser.json());


const port = process.env.PORT || 3000;


interface IErrorMessage {
  errorsMessages: [
    {
      message: string,
      field: string
    }
  ],
}

export const errorObj: IErrorMessage = {
  errorsMessages: [{
    message: '',
    field: ''
  }],
}


app.get('/', (req: Request, res: Response) => {
  res.send('Hello: World');
})

app.use('/blogs', blogsRoutes)
app.use('/posts', postsRoutes)
app.delete('/testing/all-data', (req: Request, res: Response) => {
  blogs.length = 0
  posts.length = 0
  res.send(204)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})