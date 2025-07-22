"use client";

import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, BookOpen, Code, Shield, Database } from 'lucide-react';
import { useState } from 'react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  icon: any;
}

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Building Scalable Microservices with Node.js and Docker",
      excerpt: "Learn how to architect and deploy production-ready microservices using modern containerization techniques.",
      content: `
# Building Scalable Microservices with Node.js and Docker

In today's rapidly evolving tech landscape, microservices architecture has become the gold standard for building scalable, maintainable applications. In this comprehensive guide, I'll walk you through the process of creating a robust microservices ecosystem using Node.js and Docker.

## Why Microservices?

Microservices offer several advantages over monolithic architectures:
- **Scalability**: Scale individual services based on demand
- **Technology Diversity**: Use different technologies for different services
- **Fault Isolation**: Failures in one service don't bring down the entire system
- **Team Independence**: Different teams can work on different services

## Getting Started

Let's start by creating a simple user service:

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/users/:id', (req, res) => {
  // User logic here
  res.json({ id: req.params.id, name: 'John Doe' });
});

app.listen(3000, () => {
  console.log('User service running on port 3000');
});
\`\`\`

## Containerization with Docker

Next, we'll containerize our service:

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

This approach ensures consistency across development, testing, and production environments.
      `,
      date: "2025-01-15",
      readTime: "8 min read",
      category: "Backend Development",
      tags: ["Node.js", "Docker", "Microservices", "DevOps"],
      icon: Code
    },
    {
      id: 2,
      title: "Advanced PostgreSQL Optimization Techniques",
      excerpt: "Deep dive into database performance optimization, indexing strategies, and query optimization for large-scale applications.",
      content: `
# Advanced PostgreSQL Optimization Techniques

Database performance is crucial for any application's success. In this article, I'll share advanced PostgreSQL optimization techniques I've learned through building high-performance applications.

## Index Optimization

Proper indexing is the foundation of database performance:

\`\`\`sql
-- Composite index for common query patterns
CREATE INDEX idx_user_activity ON user_logs(user_id, created_at DESC);

-- Partial index for specific conditions
CREATE INDEX idx_active_users ON users(id) WHERE status = 'active';
\`\`\`

## Query Optimization

Understanding query execution plans is essential:

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS) 
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.name;
\`\`\`

These techniques have helped me achieve 10x performance improvements in production systems.
      `,
      date: "2025-01-10",
      readTime: "12 min read",
      category: "Database",
      tags: ["PostgreSQL", "Performance", "SQL", "Optimization"],
      icon: Database
    },
    {
      id: 3,
      title: "Implementing Zero-Trust Security in Modern Web Applications",
      excerpt: "A comprehensive guide to implementing zero-trust security principles in web applications with practical examples.",
      content: `
# Implementing Zero-Trust Security in Modern Web Applications

Zero-trust security is no longer optional in today's threat landscape. This guide covers implementing zero-trust principles in web applications.

## Core Principles

1. **Never Trust, Always Verify**: Every request must be authenticated and authorized
2. **Least Privilege Access**: Grant minimum necessary permissions
3. **Assume Breach**: Design systems assuming they're already compromised

## Implementation Strategy

\`\`\`javascript
// JWT-based authentication with short-lived tokens
const jwt = require('jsonwebtoken');

function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
}
\`\`\`

## Multi-Factor Authentication

Implementing MFA adds an essential security layer:

\`\`\`javascript
const speakeasy = require('speakeasy');

function verifyTOTP(token, secret) {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2
  });
}
\`\`\`

These security measures are essential for protecting modern applications.
      `,
      date: "2025-01-05",
      readTime: "15 min read",
      category: "Security",
      tags: ["Security", "Zero-Trust", "Authentication", "JWT"],
      icon: Shield
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Backend Development': return 'text-blue-400 bg-blue-400/10';
      case 'Database': return 'text-green-400 bg-green-400/10';
      case 'Security': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <section id="blog" className="section-padding">
      <div className="container-max">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">
            Technical <span className="cyber-text">Blog</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-cyber mx-auto mb-6"></div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Sharing insights, tutorials, and best practices from my journey in software development and cybersecurity.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {blogPosts.map((post) => (
            <motion.article
              key={post.id}
              className="cyber-card group cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPost(post)}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-cyber-blue/10 rounded-lg">
                  <post.icon size={24} className="text-cyber-blue" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
              </div>

              <h3 className="text-xl font-semibold mb-3 group-hover:text-cyber-blue transition-colors">
                {post.title}
              </h3>

              <p className="text-gray-300 mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center text-cyber-blue group-hover:text-cyber-purple transition-colors">
                <span className="text-sm font-medium">Read More</span>
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Blog Post Modal */}
        {selectedPost && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              className="bg-card-bg border border-border-glow rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <selectedPost.icon size={24} className="text-cyber-blue" />
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedPost.category)}`}>
                      {selectedPost.category}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                <h1 className="text-3xl font-bold mb-4 cyber-text">
                  {selectedPost.title}
                </h1>

                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{selectedPost.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{selectedPost.readTime}</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                    {selectedPost.content}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-700">
                  {selectedPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
