"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';

interface ProjectFilterProps {
  categories: string[];
  technologies: string[];
  onFilterChange: (filters: FilterState) => void;
  projectCount: number;
}

interface FilterState {
  category: string;
  technology: string;
  search: string;
}

export default function ProjectFilter({ 
  categories, 
  technologies, 
  onFilterChange, 
  projectCount 
}: ProjectFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    technology: 'All',
    search: ''
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { category: 'All', technology: 'All', search: '' };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters.category !== 'All' || filters.technology !== 'All' || filters.search !== '';

  return (
    <div className="mb-12">
      {/* Filter Toggle Button (Mobile) */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 cyber-button w-full justify-center"
        >
          <Filter size={16} />
          <span>Filter Projects</span>
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {(isExpanded || window.innerWidth >= 768) && (
          <motion.div
            className="cyber-card"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-cyber-blue focus:outline-none transition-colors"
                />
                {filters.search && (
                  <button
                    onClick={() => updateFilter('search', '')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-400 mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white focus:border-cyber-blue focus:outline-none transition-colors min-w-[140px]"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Technology Filter */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-400 mb-1">Technology</label>
                  <select
                    value={filters.technology}
                    onChange={(e) => updateFilter('technology', e.target.value)}
                    className="px-3 py-2 bg-dark-bg border border-gray-700 rounded-lg text-white focus:border-cyber-blue focus:outline-none transition-colors min-w-[140px]"
                  >
                    <option value="All">All Technologies</option>
                    {technologies.map((tech) => (
                      <option key={tech} value={tech}>
                        {tech}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <motion.button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-colors"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Clear Filters
                </motion.button>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <motion.div
                className="mt-4 pt-4 border-t border-gray-700"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-400">Active filters:</span>
                  
                  {filters.category !== 'All' && (
                    <span className="px-2 py-1 bg-cyber-blue/20 text-cyber-blue rounded-full text-xs flex items-center space-x-1">
                      <span>{filters.category}</span>
                      <button
                        onClick={() => updateFilter('category', 'All')}
                        className="hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  
                  {filters.technology !== 'All' && (
                    <span className="px-2 py-1 bg-cyber-purple/20 text-cyber-purple rounded-full text-xs flex items-center space-x-1">
                      <span>{filters.technology}</span>
                      <button
                        onClick={() => updateFilter('technology', 'All')}
                        className="hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  
                  {filters.search && (
                    <span className="px-2 py-1 bg-cyber-pink/20 text-cyber-pink rounded-full text-xs flex items-center space-x-1">
                      <span>"{filters.search}"</span>
                      <button
                        onClick={() => updateFilter('search', '')}
                        className="hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Results Count */}
            <motion.div
              className="mt-4 pt-4 border-t border-gray-700 text-center"
              key={projectCount}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-sm text-gray-400">
                Showing <span className="text-cyber-blue font-semibold">{projectCount}</span> project{projectCount !== 1 ? 's' : ''}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Filter Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="text-sm text-gray-400 mr-2">Quick filters:</span>
        {['Frontend', 'Backend', 'Full Stack', 'AI/ML', 'Security'].map((tag) => (
          <button
            key={tag}
            onClick={() => updateFilter('category', tag)}
            className={`px-3 py-1 rounded-full text-xs transition-all duration-200 ${
              filters.category === tag
                ? 'bg-cyber-blue text-dark-bg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
