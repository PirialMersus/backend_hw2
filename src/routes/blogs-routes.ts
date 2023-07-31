import {Request, Response, Router} from 'express'
import {blogsRepository} from "../repositories/blogs-repository";
import {errorObj} from "../index";
import {blogs} from "../repositories/db";
import {inputValidatorMiddleware} from "../middlewares/input-validator-middleware";
import {body, param} from "express-validator";
import {authMiddleware} from "../middlewares/auth-middleware";

export const blogsRoutes = Router({})

blogsRoutes.get('/', (req: Request, res: Response) => {
  const blogs = blogsRepository.getBlogs()
  res.send(blogs);
})
  .get('/:blogId?',
    param('blogId').not().isEmpty().withMessage('enter blogId value in params'),
    inputValidatorMiddleware,
    (req: Request, res: Response) => {
      const id = req.params.blogId;

      const blog = blogsRepository.getBlogById(id)
      if (blog) {
        res.send(blog)
      } else {
        res.send(404)
      }
    })
  .post('/',
    // body('youtubeUrl').trim().not().isEmpty().withMessage('enter input value in youtubeUrl field'),
    authMiddleware,

    body('name').trim().not().isEmpty().withMessage('enter input value in name field'),
    body('description').trim().not().isEmpty().withMessage('enter input value in description field'),
    body('websiteUrl').isLength({max: 100}).withMessage('websiteUrl length should be less then 100'),
    body('description').isLength({max: 500}).withMessage('description length should be less then 100'),
    body('name').isLength({max: 15}).withMessage('name length should be less then 15'),
    body('websiteUrl').custom((value, {req}) => {
      const regExp = new RegExp("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$");
      if (!regExp.test(req.body.websiteUrl)) {
        throw new Error('enter correct value');
      }

      return true;
    }),
    inputValidatorMiddleware,
    (req: Request, res: Response) => {

      const newBlog = blogsRepository.createBlog(req.body.name, req.body.websiteUrl, req.body.description)

      res.status(201).send(newBlog)

    })
  .put('/:id?',
    authMiddleware,
    param('id').trim().not().isEmpty().withMessage('enter id value in params'),
    body('name').trim().not().isEmpty().withMessage('enter input value in name field'),
    // body('youtubeUrl').not().isEmpty().withMessage('enter input value in youtubeUrl field'),
    body('websiteUrl').isLength({max: 100}).withMessage('websiteUrl length should be less then 100'),
    body('name').isLength({max: 15}).withMessage('name length should be less then 15'),
    body('websiteUrl').custom((value, {req}) => {
      const regExp = new RegExp("https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$");
      if (!regExp.test(req.body.websiteUrl)) {
        throw new Error('enter correct value');
      }

      return true;
    }),
    inputValidatorMiddleware,
    (req: Request, res: Response) => {
      const name = req.body.name;
      const websiteUrl = req.body.websiteUrl;
      const description = req.body.description;

      const id = req.params.id;
      const blog = blogsRepository.updateBlogById(id, name, websiteUrl, description)

      if (blog) {
        res.status(204).send(blog)
      } else {
        errorObj.errorsMessages = [{
          message: 'Required blog not found',
          field: 'none',
        }]
        res.status(404).send(errorObj)
      }
    })
  .delete('/:id?',
    authMiddleware,
    param('id').not().isEmpty().withMessage('enter id value in params'),
    inputValidatorMiddleware,
    (req: Request, res: Response) => {
      const id = req.params.id;

      const isDeleted = blogsRepository.deleteBlogById(id)


      if (!isDeleted) {
        errorObj.errorsMessages = [{
          message: 'Required blog not found',
          field: 'none',
        }]
        res.status(404).send(errorObj)
      } else {
        for (let i = 0; i < blogs.length; i++) {
          if (blogs[i].id === id) {
            blogs.splice(i, 1)
            break;
          }
        }
        res.send(204)
      }
    })