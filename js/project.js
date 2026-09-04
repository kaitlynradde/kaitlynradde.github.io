/* ============================================
   PROJECT DETAIL PAGE
   ============================================ */

let allProjects = [];
let currentProject = null;

/**
 * Initialize project detail page
 */
async function initProject() {
  // Load projects data
  allProjects = await fetchData('../data/projects.json');
  
  if (allProjects.length === 0) {
    console.error('Failed to load projects data');
    return;
  }
  
  // Get project ID from URL
  const projectId = getProjectIdFromUrl();
  
  if (!projectId) {
    console.error('No project ID found in URL');
    return;
  }
  
  // Find current project
  currentProject = findProjectById(allProjects, projectId);
  
  if (!currentProject) {
    console.error(`Project "${projectId}" not found`);
    redirectTo404();
    return;
  }
  
  // Render project content
  renderProjectContent();
  renderRelatedProjects();
  
  // Track page view
  trackEvent('page', 'project_detail', currentProject.title);
}

/**
 * Get project ID from URL pathname
 * Assumes URL structure: /work/project-id/
 */
function getProjectIdFromUrl() {
  const path = window.location.pathname;
  const matches = path.match(/\/work\/([^\/]+)\/?$/);
  return matches ? matches[1] : null;
}

/**
 * Render project main content
 */
function renderProjectContent() {
  if (!currentProject) return;
  
  // Update page title
  document.title = `${currentProject.title} — Kaitlyn Radde`;
  
  // Update meta description
  updateMetaTag('description', currentProject.excerpt);
  updateMetaTag('og:title', `${currentProject.title} — Kaitlyn Radde`);
  updateMetaTag('og:description', currentProject.excerpt);
  updateMetaTag('og:image', currentProject.image);
  
  // Update project header
  const projectMeta = document.querySelector('.project-meta');
  if (projectMeta) {
    projectMeta.innerHTML = `
      <time datetime="${currentProject.date}">${formatDate(currentProject.date)}</time>
      <span class="project-org">${currentProject.organization || 'Personal Project'}</span>
    `;
  }
  
  const projectTitle = document.querySelector('.project-title');
  if (projectTitle) {
    projectTitle.textContent = currentProject.title;
  }
  
  const projectExcerpt = document.querySelector('.project-excerpt');
  if (projectExcerpt) {
    projectExcerpt.textContent = currentProject.excerpt;
  }
  
  // Update categories
  const projectCategories = document.querySelector('.project-categories');
  if (projectCategories) {
    projectCategories.innerHTML = currentProject.categories
      .map(cat => `<span class="category">${cat}</span>`)
      .join('');
  }
  
  // Update external link
  const projectActions = document.querySelector('.project-actions');
  if (projectActions && currentProject.externalLink) {
    projectActions.innerHTML = `
      <a href="${currentProject.externalLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        View project <i class="fas fa-external-link-alt"></i>
      </a>
    `;
  }
  
  // Update content (case study)
  const projectContent = document.querySelector('.project-content');
  if (projectContent && currentProject.content) {
    // Create a temporary container to parse markdown-ish HTML
    const contentDiv = document.createElement('div');
    contentDiv.className = 'project-text-content';
    contentDiv.innerHTML = convertMarkdownToHTML(currentProject.content);
    
    // Replace placeholder content
    projectContent.innerHTML = contentDiv.innerHTML;
  }
  
  // Update hero image
  const heroImage = document.querySelector('.project-hero-image img');
  if (heroImage) {
    heroImage.src = currentProject.image;
    heroImage.alt = currentProject.title;
  }
}

/**
 * Render related projects
 */
function renderRelatedProjects() {
  if (!currentProject) return;
  
  const relatedGrid = document.getElementById('relatedGrid');
  if (!relatedGrid) return;
  
  const related = getRelatedProjects(allProjects, currentProject.id);
  
  if (related.length === 0) {
    relatedGrid.innerHTML = '<p>No related projects yet.</p>';
    return;
  }
  
  relatedGrid.innerHTML = '';
  related.forEach(project => {
    const card = createWorkCard(project);
    relatedGrid.appendChild(card);
  });
}

/**
 * Convert markdown-like syntax to HTML
 * This is a simple converter for basic markdown
 * For production, consider using a library like marked.js
 */
function convertMarkdownToHTML(text) {
  return text
    // Headings
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gm, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gm, '<em>$1</em>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(.+)$/gm, (match, text) => {
      if (!text.match(/^<[^>]+>/) && !text.match(/^<\/[^>]+>$/)) {
        return `<p>${text}</p>`;
      }
      return text;
    });
}

/**
 * Update a meta tag value
 */
function updateMetaTag(name, content) {
  let tag = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`);
  
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(name.includes(':') ? 'property' : 'name', name);
    document.head.appendChild(tag);
  }
  
  tag.content = content;
}

/**
 * Redirect to 404 or home page
 */
function redirectTo404() {
  // For GitHub Pages, a 404.html would handle this
  // For now, redirect to home
  window.location.href = '/';
}

// Initialize when DOM is ready
onReady(initProject);

// Export for debugging
window.projectPage = {
  currentProject,
  allProjects,
  getProjectIdFromUrl
};
