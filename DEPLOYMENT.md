# Deployment Guide for Interactive Portfolio Terminal 🚀

## Latest Deployment (Jan 2025) - Enhanced Terminal Features

The portfolio now includes advanced terminal functionality with real network commands and system monitoring. This guide covers deployment considerations for the enhanced features.

## 🎯 Production Deployment - Vercel (Recommended)

### Recent Optimizations Applied
- **Size Optimization**: Updated `.vercelignore` to exclude large files (250MB+ → <50MB)
- **Build Performance**: Removed heavy frontend builds and cache directories
- **API Enhancement**: 7+ new API endpoints for network and system commands
- **TypeScript Compliance**: Full type safety with proper error handling

### Step 1: Pre-Deployment Verification
```bash
# Verify build works locally
npm run build

# Test network APIs locally
npm run dev
# Test: http://localhost:3000/api/network/ping?target=cisco.com

# Check bundle size
npm run build && ls -la .next/
```

### Step 2: Repository Management
```bash
# Ensure latest changes are committed
git add .
git commit -m "feat: Enhanced terminal with real networking commands"

# Push to GitHub (replace with your repo URL)
git remote add origin https://github.com/avis-enna/MyResume.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/in with GitHub
3. Click "New Project"
4. Import your portfolio repository
5. Configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Click "Deploy"

Your site will be live at: `https://your-username.vercel.app`

## Option 2: Deploy to Netlify

### Step 1: Build Settings
Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NEXT_EXPORT = "true"
```

### Step 2: Update Next.js Config
Add to `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

### Step 3: Deploy
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Deploy automatically

## Option 3: Deploy to GitHub Pages

### Step 1: Install gh-pages
```bash
npm install --save-dev gh-pages
```

### Step 2: Update package.json
```json
{
  "scripts": {
    "deploy": "next build && next export && gh-pages -d out"
  },
  "homepage": "https://sivavenna.github.io/portfolio-website"
}
```

### Step 3: Deploy
```bash
npm run deploy
```

## Custom Domain Setup (Optional)

### For Vercel:
1. Go to your project dashboard
2. Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

### For Netlify:
1. Site Settings → Domain Management
2. Add custom domain
3. Update DNS records

## Environment Variables (if needed)

Create `.env.local` for sensitive data:
```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Pre-deployment Checklist

- [ ] Test build locally: `npm run build`
- [ ] Update personal information in components
- [ ] Add real project links
- [ ] Test all navigation links
- [ ] Optimize images (if added)
- [ ] Update meta tags and SEO
- [ ] Test on mobile devices

## Continuous Deployment

Both Vercel and Netlify support automatic deployments:
- Push to main branch → Automatic deployment
- Pull requests → Preview deployments
- Easy rollbacks if needed

## Performance Optimization

### Before Deployment:
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Lighthouse audit
npm install -g lighthouse
lighthouse https://your-deployed-site.com
```

## Troubleshooting

### Build Errors:
- Check Node.js version (use Node 18+)
- Clear cache: `rm -rf .next node_modules && npm install`
- Check for TypeScript errors: `npm run lint`

### Runtime Errors:
- Check browser console for errors
- Verify all imports are correct
- Test in development mode first

Your portfolio will be live and professional! 🚀
