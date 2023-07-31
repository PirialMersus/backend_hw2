import {blogs, IBlog} from "./db";

export const blogsRepository = {
  getBlogs() {
    return blogs
  },
  getBlogById(id: string) {
    return blogs.find(blogger => blogger.id === id)
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
  updateBlogById(id: string, name: string, websiteUrl: string) {
    const blogger = blogs.find((blogger) => blogger.id === id);

    if (!blogger) return false;
    blogger.websiteUrl = websiteUrl
    blogger.name = name
    return blogger

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
