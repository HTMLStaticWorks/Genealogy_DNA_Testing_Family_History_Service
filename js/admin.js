// Admin Panel SPA Router and Modules Controller

document.addEventListener('DOMContentLoaded', () => {
  initAdminRouter();
  initThemeAndRtl();
});

const adminRoutes = {
  '/analytics': { templateId: 'admin-analytics', title: 'Dashboard Analytics' },
  '/customers': { templateId: 'admin-customers', title: 'Customer Directory' },
  '/dna-uploads': { templateId: 'admin-dna-uploads', title: 'DNA Sequences Portal' },
  '/reports': { templateId: 'admin-reports', title: 'Report Compilers' },
  '/orders-payments': { templateId: 'admin-orders-payments', title: 'Orders & Payments Registry' },
  '/tickets': { templateId: 'admin-tickets', title: 'Support Ticketing Queue' },
  '/cms-notifications': { templateId: 'admin-cms-notifications', title: 'CMS & Alert Management' },
  '/settings': { templateId: 'admin-settings', title: 'Portal Core Settings' }
};

function initAdminRouter() {
  const handleRouting = () => {
    let path = window.location.hash.slice(1) || '/analytics';
    
    if (!adminRoutes[path]) {
      path = '/analytics';
    }

    const route = adminRoutes[path];
    const adminView = document.getElementById('admin-view');
    const template = document.getElementById(route.templateId);
    
    if (!template) {
      console.error(`Admin template not found: ${route.templateId}`);
      return;
    }

    // Set titles
    document.title = `${route.title} | Veritas Admin`;
    document.getElementById('admin-page-title').textContent = route.title;

    // Transition Fade Out
    adminView.classList.remove('show');

    setTimeout(() => {
      adminView.innerHTML = '';
      adminView.appendChild(template.content.cloneNode(true));
      
      // Update sidebar nav active
      updateAdminSidebarHighlight(path);

      // Transition Fade In
      adminView.classList.add('show');

      // Initialize module specific logic
      initAdminModuleLogic(path);
    }, 150);
  };

  window.addEventListener('hashchange', handleRouting);
  handleRouting(); // Trigger initial routing
}

function updateAdminSidebarHighlight(path) {
  document.querySelectorAll('.admin-link').forEach(link => {
    const adminRoute = link.getAttribute('data-admin');
    if (adminRoute && `/${adminRoute}` === path) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initAdminModuleLogic(path) {
  if (path === '/analytics') {
    renderAnalyticsCharts();
  } else if (path === '/customers') {
    initCustomersDirectory();
  } else if (path === '/dna-uploads') {
    initDnaUploadsModule();
  } else if (path === '/orders-payments') {
    initOrdersModule();
  } else if (path === '/tickets') {
    initTicketingCenter();
  }
}

// Close modals globally
window.closeAdminModal = function() {
  document.querySelectorAll('.admin-modal').forEach(modal => {
    modal.classList.remove('show');
  });
};

// ==============================================
// 1. CANVAS ANALYTICS CHARTS (No external dependencies)
// ==============================================
function renderAnalyticsCharts() {
  // Sales Chart
  const salesCanvas = document.getElementById('chart-sales');
  if (salesCanvas) {
    const ctx = salesCanvas.getContext('2d');
    // Set internal resolution matching bounding size
    salesCanvas.width = salesCanvas.clientWidth;
    salesCanvas.height = 220;
    
    // Draw Sales Bar Graph
    const data = [45, 62, 55, 80, 95, 110];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const barWidth = 32;
    const spacing = 44;
    const startX = 40;
    const maxVal = 120;
    
    ctx.clearRect(0, 0, salesCanvas.width, salesCanvas.height);
    
    // Grid Lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
      const y = salesCanvas.height - 40 - (i * 35);
      ctx.beginPath();
      ctx.moveTo(StartX = 30, y);
      ctx.lineTo(salesCanvas.width - 20, y);
      ctx.stroke();
    }

    // Bars
    data.forEach((val, index) => {
      const x = startX + index * (barWidth + spacing);
      const barHeight = (val / maxVal) * (salesCanvas.height - 80);
      const y = salesCanvas.height - 40 - barHeight;
      
      // Gradient
      const grad = ctx.createLinearGradient(x, y, x, y + barHeight);
      grad.addColorStop(0, '#0ea5e9'); // sky-500
      grad.addColorStop(1, 'rgba(14, 165, 233, 0.15)');
      
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Labels
      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(labels[index], x + barWidth / 2, salesCanvas.height - 20);
      
      // Values on top
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(val, x + barWidth / 2, y - 8);
    });
  }

  // Distribution Chart (Donut)
  const distCanvas = document.getElementById('chart-distribution');
  if (distCanvas) {
    const ctx = distCanvas.getContext('2d');
    distCanvas.width = distCanvas.clientWidth;
    distCanvas.height = 220;
    
    const centerX = distCanvas.width / 2 - 50;
    const centerY = distCanvas.height / 2;
    const radius = 64;
    
    // Regions: NWE (42%), East Asian (28%), Scandinavian (18%), Baltic (12%)
    const regions = [
      { name: 'NWE', val: 0.42, color: '#c5a059' },
      { name: 'East Asian', val: 0.28, color: '#0ea5e9' },
      { name: 'Scandinavian', val: 0.18, color: '#06b6d4' },
      { name: 'Baltic', val: 0.12, color: '#a855f7' }
    ];
    
    let startAngle = -Math.PI / 2;
    
    regions.forEach(reg => {
      const sliceAngle = reg.val * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.strokeStyle = reg.color;
      ctx.lineWidth = 18;
      ctx.stroke();
      
      startAngle += sliceAngle;
    });

    // Donut hole
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#050814';
    ctx.fill();

    // Legends on the right
    regions.forEach((reg, index) => {
      const x = distCanvas.width - 150;
      const y = 50 + index * 32;
      
      // Legend color block
      ctx.fillStyle = reg.color;
      ctx.fillRect(x, y - 8, 12, 12);
      
      // Label text
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '11px Inter';
      ctx.textAlign = 'left';
      ctx.fillText(`${reg.name} (${Math.round(reg.val * 100)}%)`, x + 20, y);
    });
  }
}

// ==============================================
// 2. CUSTOMER MANAGEMENT DATA CONTROLLER
// ==============================================
let customers = [
  { id: '1', name: 'Alex Mercer', email: 'alex@mercer.com', date: 'Mar 02, 2026', role: 'Premium Member', barcode: 'VR-742918' },
  { id: '2', name: 'Sarah Miller', email: 'sarah@miller.com', date: 'Apr 12, 2026', role: 'Standard User', barcode: 'VR-218491' },
  { id: '3', name: 'Julian Reed', email: 'julian@reed.com', date: 'Apr 28, 2026', role: 'Premium Member', barcode: 'VR-504938' }
];

function initCustomersDirectory() {
  const tableBody = document.getElementById('customers-table-body');
  const searchInput = document.getElementById('customer-search-input');
  
  if (!tableBody) return;

  const renderTable = (filterText = '') => {
    tableBody.innerHTML = '';
    
    const filtered = customers.filter(c => 
      c.name.toLowerCase().includes(filterText.toLowerCase()) || 
      c.email.toLowerCase().includes(filterText.toLowerCase())
    );

    filtered.forEach(cust => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${cust.name}</strong></td>
        <td>${cust.email}</td>
        <td>${cust.date}</td>
        <td><span class="badge ${cust.role.includes('Premium') ? 'badge-gold' : 'badge-teal'}">${cust.role}</span></td>
        <td style="font-family: monospace;">${cust.barcode}</td>
        <td>
          <button class="btn btn-outline" style="padding:4px 10px; font-size:0.75rem; margin-right:8px;" onclick="openEditCustomer('${cust.id}')">Edit</button>
          <button class="btn btn-outline" style="padding:4px 10px; font-size:0.75rem; color:var(--danger); border-color:rgba(239,68,68,0.2);" onclick="deleteCustomer('${cust.id}')">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  };

  searchInput.addEventListener('input', (e) => {
    renderTable(e.target.value);
  });

  renderTable();

  // Bind edit form submit
  const editForm = document.getElementById('customer-edit-form');
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-cust-id').value;
      const name = document.getElementById('edit-cust-name').value;
      const email = document.getElementById('edit-cust-email').value;
      const role = document.getElementById('edit-cust-role').value;

      const custIndex = customers.findIndex(c => c.id === id);
      if (custIndex !== -1) {
        customers[custIndex].name = name;
        customers[custIndex].email = email;
        customers[custIndex].role = role;
        renderTable();
        closeAdminModal();
        alert('Customer credentials updated successfully!');
      }
    });
  }
}

window.openEditCustomer = function(id) {
  const cust = customers.find(c => c.id === id);
  if (cust) {
    document.getElementById('edit-cust-id').value = cust.id;
    document.getElementById('edit-cust-name').value = cust.name;
    document.getElementById('edit-cust-email').value = cust.email;
    document.getElementById('edit-cust-role').value = cust.role;
    
    document.getElementById('customer-edit-modal').classList.add('show');
  }
};

window.deleteCustomer = function(id) {
  if (confirm('Are you sure you want to permanently delete this customer profile? All DNA datasets will be wiped.')) {
    customers = customers.filter(c => c.id !== id);
    document.getElementById('customer-search-input').value = '';
    initCustomersDirectory(); // refresh
  }
};

// ==============================================
// 3. DNA UPLOADS MODULE
// ==============================================
let rawUploads = [
  { id: 'u1', user: 'Alex Mercer', file: 'mercer_23andme_export.txt', size: '4.8 MB', date: 'Jun 22, 2026', status: 'Pending Review' },
  { id: 'u2', user: 'Sarah Miller', file: 'miller_ancestry_raw.zip', size: '8.2 MB', date: 'Jun 24, 2026', status: 'Pending Review' }
];

function initDnaUploadsModule() {
  const body = document.getElementById('admin-uploads-body');
  if (!body) return;

  const renderUploads = () => {
    body.innerHTML = '';
    rawUploads.forEach(up => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${up.user}</strong></td>
        <td style="font-family: monospace;">${up.file}</td>
        <td>${up.size}</td>
        <td>${up.date}</td>
        <td><span class="badge ${up.status === 'Approved' ? 'badge-teal' : (up.status === 'Rejected' ? 'badge-danger' : 'badge-gold')}">${up.status}</span></td>
        <td>
          <button class="btn btn-outline" style="padding:4px 10px; font-size:0.75rem; margin-right:8px; border-color:var(--success); color:var(--success);" onclick="processUpload('${up.id}', 'Approved')">Approve</button>
          <button class="btn btn-outline" style="padding:4px 10px; font-size:0.75rem; color:var(--danger); border-color:rgba(239,68,68,0.2);" onclick="processUpload('${up.id}', 'Rejected')">Reject</button>
        </td>
      `;
      body.appendChild(tr);
    });
  };

  window.processUpload = function(id, status) {
    const up = rawUploads.find(u => u.id === id);
    if (up) {
      up.status = status;
      renderUploads();
      alert(`DNA Haplotype status updated: Sequence ${status === 'Approved' ? 'Appointed for microarray analysis' : 'Rejected'}.`);
    }
  };

  renderUploads();
}

// ==============================================
// 4. ORDERS & TRANSACTIONS
// ==============================================
const orders = [
  { id: 'ORD-9428', customer: 'Alex Mercer', item: 'Ancestry + Lineage kit', amount: '$149.00', address: 'Boston, MA, USA', date: 'May 15, 2026', status: 'Paid' },
  { id: 'ORD-2104', customer: 'Sarah Miller', item: 'Ancestry Essentials kit', amount: '$99.00', address: 'Los Angeles, CA, USA', date: 'Jun 02, 2026', status: 'Shipped' },
  { id: 'ORD-5093', customer: 'Julian Reed', item: 'Heritage Pro Membership', amount: '$149.00', address: 'London, UK', date: 'Jun 18, 2026', status: 'Paid' }
];

function initOrdersModule() {
  const body = document.getElementById('admin-orders-body');
  if (!body) return;

  body.innerHTML = '';
  orders.forEach(ord => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family: monospace; font-weight:700;">${ord.id}</td>
      <td><strong>${ord.customer}</strong></td>
      <td>${ord.item}</td>
      <td style="color:var(--accent-teal); font-weight:700;">${ord.amount}</td>
      <td>${ord.address}</td>
      <td><span class="badge ${ord.status === 'Paid' ? 'badge-teal' : 'badge-gold'}">${ord.status}</span></td>
      <td><button class="btn btn-outline" style="padding:4px 10px; font-size:0.75rem;" onclick="viewInvoiceDetails('${ord.id}')">Invoice</button></td>
    `;
    body.appendChild(tr);
  });
}

window.viewInvoiceDetails = function(id) {
  const ord = orders.find(o => o.id === id);
  if (ord) {
    document.getElementById('inv-id').textContent = `#${ord.id}`;
    document.getElementById('inv-name').textContent = ord.customer;
    document.getElementById('inv-date').textContent = ord.date;
    document.getElementById('inv-item').textContent = ord.item;
    document.getElementById('inv-amount').textContent = ord.amount;
    
    document.getElementById('invoice-modal').classList.add('show');
  }
};

// ==============================================
// 5. SUPPORT TICKETING QUEUE DUAL PANE CHAT
// ==============================================
let tickets = [
  { id: 't1', user: 'Alex Mercer', subject: 'Sequencing speed latency', status: 'Open', log: [
    { sender: 'user', text: 'Hello, how long does the sequencing process take? My sample arrived last Tuesday.' },
    { sender: 'agent', text: 'Hi Alex, standard sequencing takes 5-7 business days once received. Your sample is currently running on the microarrays.' }
  ]},
  { id: 't2', user: 'Sarah Miller', subject: 'Lineage Haplogroup listing issue', status: 'Closed', log: [
    { sender: 'user', text: 'The maternal haplogroup shows H1, but my grandmother was U5. Is there a lab anomaly?' },
    { sender: 'agent', text: 'Hello Sarah, we re-ran your sequencing file and verified that your specific SNP profile matches the H1 branch with 99.8% accuracy. We verified the sample integrity twice.' }
  ]}
];

let activeTicketId = 't1';

function initTicketingCenter() {
  const listWrapper = document.getElementById('tickets-list-wrapper');
  const chatContainer = document.getElementById('chat-messages-container');
  const replyForm = document.getElementById('ticket-reply-form');
  
  if (!listWrapper || !chatContainer) return;

  const renderTicketList = () => {
    listWrapper.innerHTML = '';
    tickets.forEach(ticket => {
      const div = document.createElement('div');
      div.className = `ticket-list-item ${ticket.id === activeTicketId ? 'active' : ''}`;
      
      div.innerHTML = `
        <div class="flex-between" style="margin-bottom:6px;">
          <strong style="font-size:0.9rem;">${ticket.user}</strong>
          <span class="badge ${ticket.status === 'Open' ? 'badge-gold' : 'badge-teal'}" style="font-size:0.65rem; padding:2px 8px;">${ticket.status}</span>
        </div>
        <div style="font-size:0.75rem; color:var(--text-secondary); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">${ticket.subject}</div>
      `;

      div.addEventListener('click', () => {
        activeTicketId = ticket.id;
        renderTicketList();
        renderChatLog();
      });

      listWrapper.appendChild(div);
    });
  };

  const renderChatLog = () => {
    chatContainer.innerHTML = '';
    const activeTicket = tickets.find(t => t.id === activeTicketId);
    if (!activeTicket) return;

    activeTicket.log.forEach(msg => {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${msg.sender === 'user' ? 'incoming' : 'outgoing'}`;
      bubble.textContent = msg.text;
      chatContainer.appendChild(bubble);
    });

    // Auto scroll chat to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
  };

  // Reply Form Composer hook
  if (replyForm) {
    // Clean old listeners
    const newForm = replyForm.cloneNode(true);
    replyForm.parentNode.replaceChild(newForm, replyForm);

    newForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputText = document.getElementById('reply-input-text');
      const textVal = inputText.value.trim();
      
      if (!textVal) return;

      const activeTicket = tickets.find(t => t.id === activeTicketId);
      if (activeTicket) {
        // Push message log
        activeTicket.log.push({ sender: 'agent', text: textVal });
        inputText.value = '';
        renderChatLog();
      }
    });
  }

  renderTicketList();
  renderChatLog();
}

// ==============================================
// 6. GLOBAL THEME AND RTL DIRECTION CONTROLLER
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

  const toggleTheme = () => {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
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
}
