# New Design Branch - Portfolio Website

## Overview
This branch contains a clean, modern portfolio design inspired by minimalist design principles. The design features a clean white background with elegant typography and smooth animations.

## Design Features

### 🎨 Visual Design
- **Clean Minimalist Layout**: White background with black text for maximum readability
- **Modern Typography**: Professional font choices with proper hierarchy
- **Elegant Animations**: Smooth transitions and hover effects
- **Professional Color Scheme**: Monochromatic with subtle accent colors

### 🚀 New Components
- **Hero Section**: Dynamic title rotation with professional taglines
- **About Section**: Comprehensive profile with skills grid
- **Projects Section**: Interactive project cards with modal details
- **Contact Section**: Professional contact form with social links
- **Navigation**: Clean navigation with smooth scrolling

### 📱 Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## Technical Implementation

### File Structure
```
app/new_design/
├── NewDesignLayout.tsx    # Main layout component
├── Hero.tsx              # Hero section with animated titles
├── About.tsx             # About section with skills
├── Projects.tsx          # Projects showcase with modals
├── Contact.tsx           # Contact form and information
├── Navigation.tsx        # Navigation component
└── Footer.tsx           # Footer component
```

### Key Features
1. **Multi-UI Support**: Seamlessly switch between designs
2. **Professional Branding**: "mrk." brand identity
3. **Interactive Elements**: Hover effects, modals, animations
4. **Accessibility**: Proper ARIA labels and semantic HTML
5. **Performance**: Optimized components and lazy loading

## Usage

### Switching to New Design
1. Navigate to the portfolio website
2. Click the UI toggle button in the top-right corner
3. Cycle through: Original → Terminal → New Design

### Customization
- Update personal information in the component files
- Modify colors in the className props
- Add new projects to the projects array
- Customize animations and transitions

## Components Detail

### Hero Section
- Dynamic title rotation between professional roles
- Clean typography with animated cursor
- Professional introduction text
- Smooth transition animations

### About Section
- Professional profile with photo placeholder
- Skills grid with icons and descriptions
- Experience categories (experiences, years of experience, study topics)
- Social media links

### Projects Section
- Grid layout with project cards
- Interactive project modals
- Technology tags
- GitHub and demo links
- Project categorization

### Contact Section
- Professional contact form
- Contact information display
- Social media integration
- Order of service section

## Technologies Used
- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React Hooks**: State management
- **Responsive Design**: Mobile-first approach

## Personal Information Integration
The design automatically pulls from:
- Resume data from `resume.txt`
- Project information from existing portfolio
- Professional background and skills
- Contact information and social links

## Future Enhancements
- Dark mode toggle implementation
- Advanced animations with Framer Motion
- Email integration for contact form
- Blog section integration
- Project filtering and search
- Performance monitoring dashboard

## Design Philosophy
This design follows the "mrk." brand identity seen in the inspiration images:
- Clean, minimalist aesthetic
- Professional typography
- Intuitive navigation
- Focus on content and readability
- Subtle but effective animations
- Professional color palette
