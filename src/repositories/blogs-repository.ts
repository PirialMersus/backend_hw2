import {blogs, IBlog} from "./db";

export const blogsRepository = {
  getBlogs() {
    return blogs
  },
  getBlogById(id: string) {
    return blogs.find(blog => blog.id === id)
  },
  deleteBlogById(id: string) {
    let isDeleted = false;
    for (let i = 0; i < blogs.length; i++) {
      if (blogs[i].id === id) {
        blogs.splice(i, 1)
        isDeleted = true
        break;
      }
    }
    return isDeleted
  },
  updateBlogById(id: string, name: string, websiteUrl: string, description: string) {
    const blog = blogs.find((blogger) => blogger.id === id);

    if (!blog) return false;
    blog.websiteUrl = websiteUrl
    blog.name = name
    blog.description = description
    return blog

  },
  createBlog(name: string, websiteUrl: string, description: string) {
    const newBlog: IBlog = {
      id: blogs.length.toString(),
      name,
      description,
      websiteUrl
    }
    blogs.push(newBlog)
    return newBlog
  }
}
