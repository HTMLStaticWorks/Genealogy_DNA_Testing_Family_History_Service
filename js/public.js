// Public SPA Router & Interactive Components

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initMobileMenu();
  initThemeAndRtl();
});

// Router configuration
const routes = {
  '/': { templateId: 'page-home', title: 'Home v1 | Veritas Ancestry' },
  '/home2': { templateId: 'page-home2', title: 'Home v2 | Veritas Ancestry' },
  '/about': { templateId: 'page-about', title: 'About Us | Veritas Ancestry' },
  '/dna-testing': { templateId: 'page-dna-testing', title: 'DNA Testing | Veritas Ancestry' },
  '/family-reports': { templateId: 'page-family-reports', title: 'Family Tree & Reports | Veritas Ancestry' },
  '/pricing': { templateId: 'page-pricing', title: 'Pricing | Veritas Ancestry' },
  '/resources': { templateId: 'page-resources', title: 'Resources | Veritas Ancestry' },
  '/contact': { templateId: 'page-contact', title: 'Contact Us | Veritas Ancestry' },
  '/login': { templateId: 'page-login', title: 'Sign In | Veritas Ancestry' },
  '/signup': { templateId: 'page-signup', title: 'Create Account | Veritas Ancestry' },
  '/forgot-password': { templateId: 'page-forgot', title: 'Reset Password | Veritas Ancestry' },
};

function initRouter() {
  const handleRouting = () => {
    // Get route hash (e.g. #/about -> /about, empty -> /)
    let path = window.location.hash.slice(1) || '/';
    
    // Normalize trailing slash if any
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    // Conditionally hide header and footer on authentication views
    const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(path);
    const headerEl = document.getElementById('main-header');
    const footerEl = document.querySelector('.footer');

    if (headerEl) {
      headerEl.style.display = isAuthPage ? 'none' : '';
    }
    if (footerEl) {
      footerEl.style.display = isAuthPage ? 'none' : '';
    }
    
    const route = routes[path] || routes['/'];
    const appView = document.getElementById('app-view');
    const template = document.getElementById(route.templateId);
    
    if (!template) {
      console.error(`Template not found for path: ${path}`);
      return;
    }

    // Set page title
    document.title = route.title;

    // View transition: Fade Out
    appView.classList.remove('show');
    
    setTimeout(() => {
      // Clear current content and mount template clone
      appView.innerHTML = '';
      appView.appendChild(template.content.cloneNode(true));
      
      // Update Navigation Active States
      updateActiveLinks(path);

      // Scroll to top of viewport
      window.scrollTo(0, 0);

      // View transition: Fade In
      appView.classList.add('show');
      
      // Initialize view specific logic
      initializeViewLogic(path);
    }, 150);
  };

  window.addEventListener('hashchange', handleRouting);
  // Trigger initial routing
  handleRouting();
}

function updateActiveLinks(path) {
  // Update header links
  document.querySelectorAll('#main-header .nav-link, #mobile-menu .mobile-nav-link').forEach(link => {
    const route = link.getAttribute('data-route');
    if (route === path) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }
}

// Route controllers and interactive component builders
function initializeViewLogic(path) {
  // Global components initialization (e.g. Accordions, maps)
  initAccordions();

  if (path === '/') {
    initHomeCharts();
    initTreeTooltip();
  } else if (path === '/home2') {
    initHome2Logic();
  } else if (path === '/resources') {
    initResourcesFilters();
  } else if (path === '/login') {
    initAuthForms('login');
  } else if (path === '/signup') {
    initAuthForms('signup');
  }
}

// 1. Interactive Accordion Toggles
function initAccordions() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close other active questions
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// 2. Interactive Ethnicity Pie/Donut Chart Hover Logic (Home View)
function initHomeCharts() {
  const segments = document.querySelectorAll('#preview-donut-chart .chart-segment');
  const legendItems = document.querySelectorAll('.ethnicity-legend .legend-item');
  const donutPct = document.getElementById('donut-pct');
  const donutLbl = document.getElementById('donut-lbl');

  if (!segments.length) return;

  const dataMap = {
    nwe: { pct: '42%', label: 'Northwest European' },
    eana: { pct: '28%', label: 'East Asian & Indigenous' },
    scand: { pct: '18%', label: 'Scandinavian' },
    baltic: { pct: '12%', label: 'Baltic & Eastern European' }
  };

  const highlightSegment = (region) => {
    // Highlight segment
    segments.forEach(seg => {
      if (seg.getAttribute('data-region') === region) {
        seg.style.strokeWidth = '28px';
      } else {
        seg.style.strokeWidth = '24px';
      }
    });

    // Update legend active classes
    legendItems.forEach(item => {
      if (item.getAttribute('data-region') === region) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update center donut text
    if (dataMap[region]) {
      donutPct.textContent = dataMap[region].pct;
      donutLbl.textContent = dataMap[region].label;
    }
  };

  // Add event handlers to donut segments
  segments.forEach(segment => {
    segment.addEventListener('mouseenter', () => {
      const region = segment.getAttribute('data-region');
      highlightSegment(region);
    });
  });

  // Add event handlers to legend lists
  legendItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const region = item.getAttribute('data-region');
      highlightSegment(region);
    });
  });
}

// 3. Tree Node Preview Tooltip Hover (Home View)
function initTreeTooltip() {
  const nodes = document.querySelectorAll('.tree-node-demo');
  const tooltip = document.getElementById('tree-node-tooltip');

  if (!nodes.length || !tooltip) return;

  nodes.forEach(node => {
    node.addEventListener('mouseenter', (e) => {
      const name = node.getAttribute('data-name');
      const info = node.getAttribute('data-info');
      
      tooltip.innerHTML = `<strong>${name}</strong><br><span style="color:var(--text-secondary);">${info}</span>`;
      tooltip.style.opacity = '1';
    });

    node.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  });
}

// 4. Resource Filter Buttons (Resources View)
function initResourcesFilters() {
  const filters = document.querySelectorAll('.filter-btn');
  const articles = document.querySelectorAll('#articles-grid .card');

  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button states
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-category');

      // Filter articles
      articles.forEach(art => {
        const artCat = art.getAttribute('data-cat');
        if (cat === 'all' || artCat === cat) {
          art.style.display = 'flex';
          art.style.animation = 'fadeIn 0.4s ease-out forwards';
        } else {
          art.style.display = 'none';
        }
      });
    });
  });
}

// 5. Auth form intercepts & Mock Authentication Login
function initAuthForms(type) {
  if (type === 'login') {
    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Authenticating...';
        
        setTimeout(() => {
          // Success mock redirect
          window.location.href = 'dashboard.html#/overview';
        }, 1200);
      });
    }
  } else if (type === 'signup') {
    const form = document.getElementById('signup-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Setting up profile...';
        
        setTimeout(() => {
          // Success mock sign-up redirect
          alert(`Welcome to Veritas Ancestry, ${name}! Your account has been initialized.`);
          window.location.href = 'dashboard.html#/overview';
        }, 1200);
      });
    }
  }
}

// ==============================================
// 6. DYNAMIC HOME 2 BIOTECH TRAITS EXPLORER
// ==============================================
function initHome2Logic() {
  const cards = document.querySelectorAll('#home2-traits-grid .trait-card');
  const detailBox = document.getElementById('trait-detail-box');
  const detailTitle = document.getElementById('trait-detail-title');
  const detailDesc = document.getElementById('trait-detail-desc');
  const detailGenotype = document.getElementById('trait-detail-genotype');
  const detailFreq = document.getElementById('trait-detail-freq');

  const traitData = {
    caffeine: {
      title: 'Caffeine Metabolism',
      desc: 'Your CYP1A2 gene coordinates fast caffeine metabolism. Caffeine is processed quickly in your liver, reducing sleep latency disruption even if consumed later in the day.',
      genotype: 'A/A (Fast)',
      freq: '42.1% of reference profiles'
    },
    muscle: {
      title: 'Muscle Composition',
      desc: 'You possess the ACTN3 "sprint gene" variant. Your genomic sequence yields alpha-actinin-3 in fast-twitch muscle fibers, supporting quick explosive sprints and weight lift capabilities.',
      genotype: 'C/C (Sprint / Power)',
      freq: '38.4% of reference profiles'
    },
    sleep: {
      title: 'Sleep Latency',
      desc: 'Specific variants within your CLOCK and ADA alleles indicate typical sleep onset rates and natural night-owl tendencies (circadian phase delay).',
      genotype: 'G/A (Intermediate)',
      freq: '51.2% of reference profiles'
    }
  };

  if (!cards.length || !detailBox) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const traitKey = card.getAttribute('data-trait');
      const data = traitData[traitKey];
      
      if (data) {
        detailTitle.textContent = data.title;
        detailDesc.textContent = data.desc;
        detailGenotype.textContent = data.genotype;
        detailFreq.textContent = data.freq;
        
        detailBox.style.display = 'block';
        detailBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
}

// ==============================================
// 7. GLOBAL THEME AND RTL DIRECTION CONTROLLER
// ==============================================
function initThemeAndRtl() {
  // Set initial state from storage
  const initialTheme = localStorage.getItem('theme') || 'dark';
  if (initialTheme === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }

  const initialDir = localStorage.getItem('dir') || 'ltr';
  document.documentElement.dir = initialDir;
  if (initialDir === 'rtl') {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }

  const updateThemeIcons = () => {
    const isLight = document.body.classList.contains('light-theme');
    const moonSVG = `<svg class="icon-theme" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    const sunSVG = `<svg class="icon-theme" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

    const currentThemeButtons = document.querySelectorAll('.theme-toggle-btn');
    currentThemeButtons.forEach(btn => {
      const isMobile = btn.id === 'theme-toggle-btn-mobile';
      if (isMobile) {
        const svgContainer = btn.querySelector('svg');
        if (svgContainer) {
          svgContainer.outerHTML = isLight ? moonSVG.replace('width="18" height="18"', 'width="16" height="16"') : sunSVG.replace('width="18" height="18"', 'width="16" height="16"');
        }
      } else {
        btn.innerHTML = isLight ? moonSVG : sunSVG;
      }
    });
  };

  // Run initial icon setup
  updateThemeIcons();

  // Export globally so router can trigger updates on view changes
  window.updateThemeIcons = updateThemeIcons;

  const toggleTheme = () => {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcons();
  };

  const toggleRtl = () => {
    const isRtl = document.documentElement.dir === 'rtl';
    const nextDir = isRtl ? 'ltr' : 'rtl';
    document.documentElement.dir = nextDir;
    if (nextDir === 'rtl') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    localStorage.setItem('dir', nextDir);
  };

  // Delegate theme and RTL clicks so dynamic buttons inside route templates work
  document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('.theme-toggle-btn');
    const rtlBtn = e.target.closest('.rtl-toggle-btn');
    if (themeBtn) {
      toggleTheme();
    }
    if (rtlBtn) {
      toggleRtl();
    }
  });

  // Scroll to Top Controller
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.style.display = 'flex';
      } else {
        scrollTopBtn.style.display = 'none';
      }
    });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

