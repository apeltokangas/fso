const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    let favorite = blogs[0]
    for (let i = 1; i < blogs.length; i++) {
        if (blogs[i].likes > favorite.likes) {
            favorite = blogs[i]
        }
    }
    return favorite
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null
    const counts = {}

    blogs.forEach(blog => {
        counts[blog.author] = (counts[blog.author] || 0) + 1
    })

    let maxAuthor = null
    let maxBlogs = 0

    for (const author in counts) {
        if (counts[author] > maxBlogs) {
            maxAuthor = author
            maxBlogs = counts[author]
        }
    }
    return {
        author: maxAuthor,
        blogs: maxBlogs
    }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likeCounts = {}

  blogs.forEach(blog => {
    likeCounts[blog.author] = (likeCounts[blog.author] || 0) + blog.likes
  })

  let maxAuthor = null
  let maxLikes = 0

  for (const author in likeCounts) {
    if (likeCounts[author] > maxLikes) {
      maxAuthor = author
      maxLikes = likeCounts[author]
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

