/* ============================================
   MAIN APP - LANDING PAGE
   ============================================ */

   let allProjects = [];
   let currentFilter = 'all';
   
   /**
    * Initialize the app
    */
   async function init() {
     // Load projects data
     allProjects = await fetchData('./data/projects.json');
     
     if (allProjects.length === 0) {
       console.error('Failed to load projects data');
       return;
     }
     
     // Sort by date
     allProjects = sortByDate(allProjects);
     
     // Render initial state
     renderWork();
     setupFilterButtons();
     setupSmoothScroll();
     
     // Track page view
     trackEvent('page', 'landing_page_loaded');
   }
   
   /**
    * Render work grid (with filtering)
    */
  function renderWork(category = 'featured') {
    const container = document.getElementById('workGrid');
    if (!container) return;
    
    let projects = allProjects;
    
    // Handle "featured" filter
    if (category === 'featured') {
      projects = projects.filter(p => p.featured === true);
    } else if (category !== 'all') {
      // Handle category filters
      projects = filterProjects(projects, category);
    }
    
    container.innerHTML = '';
    
    if (projects.length === 0) {
      container.innerHTML = '<p>No projects found in this category.</p>';
      return;
    }
    
    projects.forEach(project => {
      const card = createWorkCard(project);
      container.appendChild(card);
    });
  }
   
   /**
    * Setup filter button click handlers
    */
   function setupFilterButtons() {
     const filterBtns = document.querySelectorAll('.filter-btn');
     
     filterBtns.forEach(btn => {
       btn.addEventListener('click', (e) => {
         const category = e.currentTarget.dataset.filter;
         currentFilter = category;
         
         // Update active state
         filterBtns.forEach(b => b.classList.remove('active'));
         e.currentTarget.classList.add('active');
         
         // Re-render work grid
         renderWork(category);
         
         // Track filter
         trackEvent('engagement', 'filter_applied', category);
       });
     });
   }
   
   /**
    * Setup smooth scroll for anchor links
    */
   function setupSmoothScroll() {
     document.querySelectorAll('a[href^="#"]').forEach(anchor => {
       anchor.addEventListener('click', (e) => {
         const href = anchor.getAttribute('href');
         const target = document.querySelector(href);
         
         if (target) {
           e.preventDefault();
           target.scrollIntoView({ behavior: 'smooth' });
         }
       });
     });
   }
   
   /**
    * Search projects (for future implementation)
    */
   function searchProjects(query) {
     const lowerQuery = query.toLowerCase();
     return allProjects.filter(project => 
       project.title.toLowerCase().includes(lowerQuery) ||
       project.excerpt.toLowerCase().includes(lowerQuery) ||
       project.categories.some(cat => cat.toLowerCase().includes(lowerQuery))
     );
   }
   
   // Initialize when DOM is ready
   onReady(init);
   
   // Export functions for debugging/testing
   window.app = {
     allProjects,
     currentFilter,
     renderWork,
     searchProjects,
     filterProjects
   };