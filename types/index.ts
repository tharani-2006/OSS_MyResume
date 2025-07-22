// Common types used throughout the application

export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  image: string;
  github: string;
  live: string;
  category: string;
  icon: any;
  featured?: boolean;
  status?: 'completed' | 'in-progress' | 'planned';
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  icon: any;
  author?: string;
  published?: boolean;
}

export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'other';
  icon?: any;
  description?: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string[];
  technologies: string[];
  achievements?: string[];
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string[];
  relevantCourses?: string[];
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  location: string;
  linkedin: string;
  github: string;
  website?: string;
  twitter?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: any;
  color?: string;
}

export interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export interface FilterState {
  category: string;
  technology: string;
  search: string;
}

export interface UIVersion {
  id: 'new' | 'v1' | 'v2';
  name: string;
  description: string;
  features: string[];
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Utility types
export type Theme = 'light' | 'dark' | 'system';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

// Animation types
export interface AnimationVariants {
  hidden: any;
  visible: any;
  exit?: any;
}

export interface MotionProps {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  variants?: AnimationVariants;
  whileHover?: any;
  whileTap?: any;
  whileInView?: any;
  viewport?: any;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: ComponentVariant;
  size?: ComponentSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ComponentSize;
}

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

// Environment types
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_SITE_URL: string;
  NEXT_PUBLIC_EMAILJS_SERVICE_ID?: string;
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID?: string;
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?: string;
  NEXT_PUBLIC_GA_TRACKING_ID?: string;
}

// SEO types
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  ogUrl: string;
  twitterHandle: string;
  structuredData?: any;
}
