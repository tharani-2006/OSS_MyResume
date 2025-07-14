# Siva's Portfolio V3 - Desktop Terminal Interface

A revolutionary portfolio experience that combines a desktop-like interface with a Linux-style terminal navigation system.

## 🚀 Live Deployments

- **GitHub Pages (V3)**: [https://ssivared.github.io/MyResume](https://ssivared.github.io/MyResume) - Desktop Terminal Interface
- **Vercel (Main)**: [https://portfolio-website.vercel.app](https://portfolio-website.vercel.app) - Original Portfolio

> **Note**: V3 branch is specifically designed for GitHub Pages deployment with the new desktop terminal interface. The main branch continues to be used for Vercel deployment with the original portfolio design.

## ✨ V3 Features

### 🖥️ Desktop Interface
- **App-based navigation** with familiar desktop icons
- **Draggable terminal window** with resize capabilities
- **Professional desktop environment** with taskbar
- **Window management** (minimize, close, bring to front)

### 🐧 Linux-Style Terminal
- **Real terminal navigation** using `cd` commands
- **File system structure**: `~/about`, `~/skills`, `~/experience`, `~/projects`, `~/contact`
- **Linux commands**: `ls`, `pwd`, `cat`, `whoami`, `history`, `clear`
- **No focus conflicts** - single terminal instance

### 📁 Navigation Commands

```bash
# Navigate between sections
cd about          # View about information
cd skills         # Browse technical skills
cd experience     # Check work experience
cd projects       # Explore projects
cd contact        # Get contact details
cd ~              # Return to home directory

# View content (like Linux cat)
cat about.txt     # Display about information
cat skills.json   # Show technical skills
cat experience.log # View work history
cat projects.md   # Browse project details
cat contact.info  # Get contact information
cat resume.txt    # View complete resume

# System commands
ls                # List directory contents
pwd               # Show current path
whoami            # Display user info
history           # Command history
clear             # Clear terminal
help              # Show all commands
```

## 🎯 User Experience

1. **Click "V2"** on the main page to access the desktop interface
2. **Click Terminal icon** to open the terminal application
3. **Use Linux commands** to navigate and explore the portfolio
4. **Drag the window** to reposition, resize as needed
5. **Close or minimize** the terminal when done

## 🛠️ Technical Implementation

### Frontend Stack
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hooks** for state management

### Architecture
- `DesktopApp.tsx` - Main desktop interface component
- `TerminalApp.tsx` - Linux-style terminal application
- `page.tsx` - Entry point with UI version toggle
- `globals.css` - Desktop and terminal styling

### Key Innovations
- **Focus management solved** by eliminating mini-terminals
- **Real Linux experience** with proper cd/cat commands
- **Desktop paradigm** familiar to all users
- **Single terminal instance** prevents typing conflicts
- **File system simulation** with directory navigation

## 🚀 Deployment

### GitHub Pages Setup (V3 Branch)
```bash
# Switch to V3 branch
git checkout V3

# Push to trigger deployment
git push origin V3
```

### Vercel Setup (Main Branch)
The main branch continues to be used for Vercel deployment with the original portfolio design.

### Local Development
```bash
# Clone and setup
git clone https://github.com/ssivared/MyResume.git
cd MyResume
git checkout V3

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📈 Performance Features

- **Code splitting** for optimal loading
- **Static generation** where possible
- **Optimized images** and assets
- **Responsive design** for all devices
- **SEO optimization** with proper meta tags

## 🎉 Success Metrics

- ✅ **Zero focus conflicts** - Seamless typing experience
- ✅ **Intuitive navigation** - Linux users feel at home
- ✅ **Professional appearance** - Desktop-quality interface
- ✅ **Mobile responsive** - Works on all screen sizes
- ✅ **Fast loading** - Optimized for performance
- ✅ **Accessible** - Keyboard and screen reader friendly

## 📱 Mobile Experience

The desktop interface adapts gracefully to mobile devices:
- Touch-friendly app icons
- Swipe gestures for window management
- Virtual keyboard support in terminal
- Responsive terminal window sizing

## 🔧 Development

### Adding New Apps
1. Create new app component in `app/components/`
2. Add app icon to `DesktopApp.tsx`
3. Implement window management
4. Style with consistent theme

### Extending Terminal
1. Add new commands to `TerminalApp.tsx`
2. Implement command logic
3. Add help documentation
4. Test cross-platform compatibility

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines and submit pull requests to the V3 branch.

---

**Built with ❤️ by Siva Reddy**  
*Software Engineer Trainee @ Cisco*
