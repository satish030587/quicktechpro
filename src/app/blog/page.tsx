import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "QuickTechPro Blog | Tech Tips, Tutorials & Industry Insights",
  description: "Stay updated with the latest tech tips, computer repair guides, web development tutorials, and industry insights from QuickTechPro experts.",
  keywords: "tech blog, computer repair tips, web development tutorials, tech guides, quicktechpro blog, technology insights",
};

const blogPosts = [
  {
    id: 1,
    title: "5 Signs Your Computer Needs Immediate Professional Help",
    excerpt: "Learn to identify critical warning signs that indicate your computer requires professional repair services before it's too late.",
    category: "Computer Repair",
    author: "Priya Sharma",
    date: "2024-01-15",
    readTime: "5 min read",
    image: "🖥️",
    tags: ["Computer Repair", "Troubleshooting", "Maintenance"]
  },
  {
    id: 2,
    title: "How to Choose the Right Web Design for Your Business",
    excerpt: "A comprehensive guide to selecting web design elements that convert visitors into customers and reflect your brand identity.",
    category: "Web Design",
    author: "Amit Patel",
    date: "2024-01-12",
    readTime: "8 min read",
    image: "🎨",
    tags: ["Web Design", "Business", "User Experience"]
  },
  {
    id: 3,
    title: "Remote Work Security: Protecting Your Business Data",
    excerpt: "Essential security practices every remote worker should follow to protect sensitive business data and prevent cyber threats.",
    category: "Security",
    author: "Rajesh Kumar",
    date: "2024-01-10",
    readTime: "6 min read",
    image: "🔒",
    tags: ["Security", "Remote Work", "Data Protection"]
  },
  {
    id: 4,
    title: "The Complete Guide to Website Performance Optimization",
    excerpt: "Learn proven techniques to make your website load faster, improve user experience, and boost search engine rankings.",
    category: "Web Development",
    author: "Rajesh Kumar",
    date: "2024-01-08",
    readTime: "12 min read",
    image: "⚡",
    tags: ["Performance", "SEO", "Web Development"]
  },
  {
    id: 5,
    title: "Common Computer Problems You Can Fix Yourself",
    excerpt: "Simple troubleshooting steps for common computer issues that don't require professional help - save time and money.",
    category: "DIY Tech",
    author: "Priya Sharma",
    date: "2024-01-05",
    readTime: "7 min read",
    image: "🔧",
    tags: ["DIY", "Troubleshooting", "Computer Repair"]
  },
  {
    id: 6,
    title: "Building Custom Web Applications: What You Need to Know",
    excerpt: "Understanding the process, costs, and benefits of custom web application development for your business needs.",
    category: "Web Development",
    author: "Rajesh Kumar",
    date: "2024-01-03",
    readTime: "10 min read",
    image: "💻",
    tags: ["Web Applications", "Custom Development", "Business"]
  }
];

const categories = [
  { name: "All Posts", count: blogPosts.length, slug: "all" },
  { name: "Computer Repair", count: 2, slug: "computer-repair" },
  { name: "Web Design", count: 1, slug: "web-design" },
  { name: "Web Development", count: 2, slug: "web-development" },
  { name: "Security", count: 1, slug: "security" },
  { name: "DIY Tech", count: 1, slug: "diy-tech" }
];

const featuredPost = blogPosts[0];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl mb-6">
              QuickTechPro Blog
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Expert insights, practical tips, and industry knowledge to help you navigate the world of technology.
            </p>
            <div className="inline-flex items-center rounded-full bg-white/20 px-6 py-2 text-sm font-medium">
              <span>📚 Fresh content updated weekly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  category.slug === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Featured Article
            </h2>
            <p className="text-xl text-gray-600">
              Our most popular and trending content this week.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
                    {featuredPost.category}
                  </span>
                  <span className="text-gray-600 text-sm">{featuredPost.readTime}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h3>
                <p className="text-gray-600 text-lg mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {featuredPost.author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{featuredPost.author}</p>
                      <p className="text-gray-600 text-sm">{featuredPost.date}</p>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${featuredPost.id}`}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Read Full Article
                  </Link>
                </div>
              </div>
              <div className="text-center">
                <div className="text-8xl mb-4">{featuredPost.image}</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {featuredPost.tags.map((tag, index) => (
                    <span key={index} className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Latest Articles
            </h2>
            <p className="text-xl text-gray-600">
              Stay updated with our latest tech insights and tutorials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="text-4xl text-center mb-4">{post.image}</div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-2">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{post.author}</p>
                        <p className="text-gray-500 text-xs">{post.date}</p>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Stay Updated with Tech Insights
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get the latest tech tips, tutorials, and industry insights delivered to your inbox weekly.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 hover:bg-gray-50 font-bold py-3 px-6 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-sm opacity-75 mt-4">
            No spam, unsubscribe at any time. Privacy policy applies.
          </p>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
              Popular Topics
            </h2>
            <p className="text-xl text-gray-600">
              Explore our most searched and read content categories.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Computer Repair", icon: "🔧", count: "25 articles" },
              { name: "Web Design", icon: "🎨", count: "18 articles" },
              { name: "Security", icon: "🔒", count: "15 articles" },
              { name: "Performance", icon: "⚡", count: "12 articles" },
              { name: "Troubleshooting", icon: "🔍", count: "20 articles" },
              { name: "Development", icon: "💻", count: "22 articles" }
            ].map((topic, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="text-3xl mb-3">{topic.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{topic.name}</h3>
                <p className="text-gray-600 text-sm">{topic.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
