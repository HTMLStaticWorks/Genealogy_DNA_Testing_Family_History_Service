// Customer Dashboard SPA Router and Controllers

document.addEventListener('DOMContentLoaded', () => {
  initDashboardRouter();
  initThemeAndRtl();
});

const dashRoutes = {
  '/overview': { templateId: 'dash-overview', title: 'Dashboard Overview' },
  '/dna-family': { templateId: 'dash-dna-family', title: 'DNA & Family History' }
};

function initDashboardRouter() {
  const handleRouting = () => {
    let path = window.location.hash.slice(1) || '/overview';
    
    // Fallback if incorrect route
    if (!dashRoutes[path]) {
      path = '/overview';
    }

    const route = dashRoutes[path];
    const dashView = document.getElementById('dash-view');
    const template = document.getElementById(route.templateId);
    
    if (!template) {
      console.error(`Dashboard template not found: ${route.templateId}`);
      return;
    }

    // Set page headers
    document.title = `${route.title} | Veritas Ancestry`;
    document.getElementById('dash-page-title').textContent = route.title;

    // View transition: Fade Out
    dashView.classList.remove('show');

    setTimeout(() => {
      dashView.innerHTML = '';
      dashView.appendChild(template.content.cloneNode(true));
      
      // Update sidebar nav highlights
      updateSidebarHighlight(path);

      // View transition: Fade In
      dashView.classList.add('show');

      // Initialize page specific scripting
      initDashboardViewLogic(path);
    }, 150);
  };

  window.addEventListener('hashchange', handleRouting);
  handleRouting(); // Trigger initial routing
}

function updateSidebarHighlight(path) {
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const dashRoute = link.getAttribute('data-dash');
    if (dashRoute && `/${dashRoute}` === path) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initDashboardViewLogic(path) {
  if (path === '/dna-family') {
    initDnaUploadPortal();
    initFamilyTreeBuilder();
  }
}

// ==============================================
// 1. RAW DNA DRAG & DROP UPLOAD SYSTEM
// ==============================================
function initDnaUploadPortal() {
  const uploadZone = document.getElementById('dna-upload-zone');
  const fileInput = document.getElementById('file-input');
  const statusText = document.getElementById('upload-status-text');
  const progressContainer = document.getElementById('upload-progress-container');
  const progressBar = document.getElementById('upload-progress-bar');
  const uploadHistoryBody = document.getElementById('upload-history-body');

  if (!uploadZone) return;

  // Open explorer on click
  uploadZone.addEventListener('click', () => fileInput.click());

  // Drag over states
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length) handleDnaFile(files[0]);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleDnaFile(fileInput.files[0]);
  });

  function handleDnaFile(file) {
    const allowed = ['.txt', '.zip'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!allowed.includes(extension)) {
      alert('Invalid file format. Please upload a .txt or .zip raw sequence file.');
      return;
    }

    // Trigger Upload Animation
    statusText.textContent = `Uploading ${file.name}...`;
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      progressBar.style.width = `${progress}%`;
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Complete state
        statusText.textContent = 'Upload Successful! Aligning raw haplotypes...';
        setTimeout(() => {
          progressContainer.style.display = 'none';
          statusText.textContent = 'File parsed. Report details unlocked below.';
          
          // Insert new row to upload history list
          const row = document.createElement('tr');
          const date = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
          
          row.innerHTML = `
            <td>${file.name}</td>
            <td>External Data Upload</td>
            <td>${date}</td>
            <td><span class="badge badge-teal" style="background:rgba(16,185,129,0.1); color:var(--success); border-color:rgba(16,185,129,0.2);">Completed</span></td>
            <td><button class="btn btn-outline" style="padding: 4px 10px; font-size: 0.75rem;" onclick="alert('Downloading PDF Haplotype Summary...');">Download PDF</button></td>
          `;
          
          if (uploadHistoryBody) {
            uploadHistoryBody.insertBefore(row, uploadHistoryBody.firstChild);
          }
          alert(`Success: Haplotype file '${file.name}' has been verified and merged with the relative matching registry!`);
        }, 800);
      }
    }, 100);
  }
}

// ==============================================
// 2. INTERACTIVE FAMILY TREE BUILDER
// ==============================================
let treeNodes = [
  { id: 'self', name: 'Alex Mercer (You)', birth: '1995 (Boston)', death: '', role: 'Self', parentId: '', x: 425, y: 360, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=60&h=60' },
  { id: 'father', name: 'David Mercer', birth: '1962 (Boston)', death: '', role: 'Father', childId: 'self', x: 250, y: 220, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=60&h=60' },
  { id: 'mother', name: 'Elena Rostova', birth: '1966 (Munich)', death: '', role: 'Mother', childId: 'self', x: 600, y: 220, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=60&h=60' },
  { id: 'gfather_p', name: 'Charles Mercer', birth: '1931 (London)', death: '2015', role: 'Grandfather (P)', childId: 'father', x: 150, y: 80, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=60&h=60' },
  { id: 'gmother_p', name: 'Eleanor Vance', birth: '1935 (Boston)', death: '2021', role: 'Grandmother (P)', childId: 'father', x: 350, y: 80, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=60&h=60' }
];

let selectedNode = null;
let treeZoomScale = 1.0;

function initFamilyTreeBuilder() {
  const workspace = document.getElementById('tree-workspace');
  const nodesLayer = document.getElementById('tree-nodes-layer');
  const svgLayer = document.getElementById('tree-svg-lines');

  if (!workspace || !nodesLayer) return;

  // Zoom controls
  document.getElementById('tree-zoom-in').addEventListener('click', () => {
    treeZoomScale = Math.min(treeZoomScale + 0.1, 1.5);
    nodesLayer.style.transform = `scale(${treeZoomScale})`;
  });

  document.getElementById('tree-zoom-out').addEventListener('click', () => {
    treeZoomScale = Math.max(treeZoomScale - 0.1, 0.6);
    nodesLayer.style.transform = `scale(${treeZoomScale})`;
  });

  // Event handlers for node additions
  document.getElementById('btn-add-father').addEventListener('click', () => addRelative('Father'));
  document.getElementById('btn-add-mother').addEventListener('click', () => addRelative('Mother'));
  document.getElementById('btn-add-spouse').addEventListener('click', () => addRelative('Spouse'));
  document.getElementById('btn-add-child').addEventListener('click', () => addRelative('Child'));

  // Input editing bindings
  const nameInput = document.getElementById('node-edit-name');
  const birthInput = document.getElementById('node-edit-birth');
  const deathInput = document.getElementById('node-edit-death');

  nameInput.addEventListener('input', (e) => {
    if (selectedNode) {
      selectedNode.name = e.target.value;
      updateNodeDOM(selectedNode);
    }
  });

  birthInput.addEventListener('input', (e) => {
    if (selectedNode) {
      selectedNode.birth = e.target.value;
      updateNodeDOM(selectedNode);
    }
  });

  deathInput.addEventListener('input', (e) => {
    if (selectedNode) {
      selectedNode.death = e.target.value;
      updateNodeDOM(selectedNode);
    }
  });

  // Run initial render
  renderTree();
}

function renderTree() {
  const nodesLayer = document.getElementById('tree-nodes-layer');
  if (!nodesLayer) return;

  // Clear previous cards (keeping SVG layer)
  document.querySelectorAll('.tree-node-card').forEach(c => c.remove());

  // Render cards
  treeNodes.forEach(node => {
    const card = document.createElement('div');
    card.className = `tree-node-card ${selectedNode && selectedNode.id === node.id ? 'selected' : ''}`;
    card.id = `card-${node.id}`;
    card.style.left = `${node.x}px`;
    card.style.top = `${node.y}px`;

    card.innerHTML = `
      <img src="${node.avatar}" class="tree-node-avatar" alt="${node.name}">
      <div class="tree-node-name">${node.name}</div>
      <div class="tree-node-dates">${node.birth} ${node.death ? ' - ' + node.death : ''}</div>
      <span style="font-size:0.65rem; color:var(--accent-gold);">${node.role}</span>
    `;

    card.addEventListener('click', (e) => {
      e.stopPropagation();
      selectNode(node);
    });

    nodesLayer.appendChild(card);
  });

  // Render lines
  renderTreeLines();
}

function updateNodeDOM(node) {
  const card = document.getElementById(`card-${node.id}`);
  if (card) {
    card.querySelector('.tree-node-name').textContent = node.name;
    card.querySelector('.tree-node-dates').textContent = `${node.birth} ${node.death ? ' - ' + node.death : ''}`;
  }
}

function selectNode(node) {
  selectedNode = node;
  
  // Update selected card DOM classes
  document.querySelectorAll('.tree-node-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById(`card-${node.id}`);
  if (card) card.classList.add('selected');

  // Fill forms sidebar
  document.getElementById('tree-side-title').textContent = `Editing: ${node.role}`;
  document.getElementById('tree-side-subtitle').textContent = `Manage details and lineages of this card.`;
  document.getElementById('tree-edit-form-wrap').style.display = 'flex';

  document.getElementById('node-edit-name').value = node.name;
  document.getElementById('node-edit-birth').value = node.birth;
  document.getElementById('node-edit-death').value = node.death || '';
}

function renderTreeLines() {
  const svg = document.getElementById('tree-svg-lines');
  if (!svg) return;

  svg.innerHTML = ''; // Clear lines

  // Draw connectors (lines from child to father/mother)
  treeNodes.forEach(node => {
    if (node.childId) {
      const child = treeNodes.find(n => n.id === node.childId);
      if (child) {
        // Compute connection points (Card width: 150px, height: approx 100px)
        const parentX = node.x + 75;
        const parentY = node.y + 100; // Bottom center
        
        const childX = child.x + 75;
        const childY = child.y; // Top center

        // SVG Path definition (S-shape curve)
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const midY = parentY + (childY - parentY) / 2;
        path.setAttribute('d', `M ${parentX} ${parentY} C ${parentX} ${midY}, ${childX} ${midY}, ${childX} ${childY}`);
        
        svg.appendChild(path);
      }
    }
  });
}

function addRelative(role) {
  if (!selectedNode) {
    alert('Please select a reference card first.');
    return;
  }

  // Pre-generate ID
  const newId = `rel_${Date.now()}`;
  let newX = selectedNode.x;
  let newY = selectedNode.y;
  let childId = '';

  // Determine node layout positioning
  if (role === 'Father') {
    newX = selectedNode.x - 100;
    newY = selectedNode.y - 140;
    childId = selectedNode.id;
  } else if (role === 'Mother') {
    newX = selectedNode.x + 100;
    newY = selectedNode.y - 140;
    childId = selectedNode.id;
  } else if (role === 'Spouse') {
    newX = selectedNode.x + 180;
    newY = selectedNode.y;
  } else if (role === 'Child') {
    newX = selectedNode.x;
    newY = selectedNode.y + 140;
  }

  // Create new node object
  const newNode = {
    id: newId,
    name: `New ${role}`,
    birth: 'YYYY (Location)',
    death: '',
    role: role,
    childId: childId,
    x: newX,
    y: newY,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=60&h=60' // default avatar
  };

  // Set child link on child node if Child relation was selected
  if (role === 'Child') {
    newNode.childId = selectedNode.id; // child points to parent
    // Wait, let's make it so child links to selected node.
    newNode.childId = ''; 
    selectedNode.childId = newId; // selected node is parent of new node
  }

  treeNodes.push(newNode);
  renderTree();
  selectNode(newNode);
}

// ==============================================
// 3. GLOBAL THEME AND RTL DIRECTION CONTROLLER
// ==============================================
function initThemeAndRtl() {
  const tBtn = document.getElementById('theme-toggle-btn');
  const rBtn = document.getElementById('rtl-toggle-btn');

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

    const desktopBtn = document.getElementById('theme-toggle-btn');
    if (desktopBtn) {
      desktopBtn.innerHTML = isLight ? moonSVG : sunSVG;
    }
  };

  // Run initial setup
  updateThemeIcons();

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

  if (tBtn) tBtn.addEventListener('click', toggleTheme);
  if (rBtn) rBtn.addEventListener('click', toggleRtl);

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
