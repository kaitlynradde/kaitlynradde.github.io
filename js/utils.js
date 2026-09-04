/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Slugify a string for use in URLs
 * @param {string} str - String to slugify
 * @returns {string} Slugified string
 */
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove special characters
    .replace(/[\s_-]+/g, '-')  // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
}

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g., "June 10, 2025")
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Create a work card HTML element
 * @param {object} project - Project data object
 * @returns {HTMLElement} Card element
 */
 function createWorkCard(project) {
  const card = document.createElement('a');
  card.href = `/work/${project.id}/`;
  card.className = 'work-card';
  
  const categoriesHTML = project.categories
    .map(cat => `<span class="category">${cat}</span>`)
    .join('');
  
  // Handle missing images with fallback gradient
  const mediaHTML = project.image 
    ? (project.image.endsWith('.mp4') || project.image.endsWith('.mov')
      ? `<video src="${project.image}" class="work-card-image" autoplay muted loop></video>`
      : `<img src="${project.image}" alt="${project.title}" class="work-card-image" onerror="this.parentElement.classList.add('no-image')" />`)
    : `<div class="work-card-image work-card-image-placeholder"></div>`;
  
  card.innerHTML = `
    ${mediaHTML}
    <div class="work-card-content">
      <div class="work-card-meta">${formatDate(project.date)}</div>
      <h3 class="work-card-title">${project.title}</h3>
      <p class="work-card-excerpt">${project.excerpt}</p>
      <div class="work-card-categories">
        ${categoriesHTML}
      </div>
    </div>
  `;
  
  return card;
}

/**
 * Create a work list item HTML element
 * @param {object} project - Project data object
 * @returns {HTMLElement} List item element
 */
function createWorkListItem(project) {
  const item = document.createElement('article');
  item.className = 'work-item';
  
  const categoriesHTML = project.categories
    .map(cat => `<span class="category">${cat}</span>`)
    .join('');
  
  item.innerHTML = `
    <a href="/work/${project.id}/" class="work-item-title">${project.title}</a>
    <div class="work-item-meta">${formatDate(project.date)} • ${project.organization || 'Personal'}</div>
    <p>${project.excerpt}</p>
    <div class="work-card-categories">
      ${categoriesHTML}
    </div>
  `;
  
  return item;
}

/**
 * Filter projects by category
 * @param {array} projects - Array of project objects
 * @param {string} category - Category to filter by ('all' for no filter)
 * @returns {array} Filtered projects
 */
function filterProjects(projects, category) {
  if (category === 'all') {
    return projects;
  }
  
  return projects.filter(project => 
    project.categories.includes(category)
  );
}

/**
 * Get featured projects
 * @param {array} projects - Array of project objects
 * @returns {array} Featured projects only
 */
function getFeaturedProjects(projects) {
  return projects.filter(project => project.featured === true);
}

/**
 * Sort projects by date (newest first)
 * @param {array} projects - Array of project objects
 * @returns {array} Sorted projects
 */
function sortByDate(projects) {
  return [...projects].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
}

/**
 * Get unique categories from projects
 * @param {array} projects - Array of project objects
 * @returns {array} Unique categories
 */
function getCategories(projects) {
  const categories = new Set();
  projects.forEach(project => {
    project.categories.forEach(cat => categories.add(cat));
  });
  return Array.from(categories).sort();
}

/**
 * Find project by ID
 * @param {array} projects - Array of project objects
 * @param {string} id - Project ID
 * @returns {object|null} Project object or null
 */
function findProjectById(projects, id) {
  return projects.find(project => project.id === id) || null;
}

/**
 * Get related projects
 * @param {array} projects - Array of project objects
 * @param {string} projectId - Current project ID
 * @returns {array} Related projects (up to 3)
 */
function getRelatedProjects(projects, projectId) {
  const project = findProjectById(projects, projectId);
  
  if (!project || !project.relatedProjects || project.relatedProjects.length === 0) {
    return projects
      .filter(p => p.id !== projectId && p.featured)
      .slice(0, 3);
  }
  
  return projects
    .filter(p => project.relatedProjects.includes(p.id))
    .slice(0, 3);
}

/**
 * Truncate text to a certain length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength = 150) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Add analytics event
 * @param {string} category - Event category
 * @param {string} action - Event action
 * @param {string} label - Event label (optional)
 */
function trackEvent(category, action, label = '') {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      'event_category': category,
      'event_label': label
    });
  }
}

/**
 * DOM ready helper
 * @param {function} callback - Function to run when DOM is ready
 */
function onReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

/**
 * Fetch JSON data
 * @param {string} url - URL to fetch
 * @returns {Promise<array>} Parsed JSON data
 */
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading data:', error);
    return [];
  }
}
