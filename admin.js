(function () {
  const KEYS = {
    products: 'rubensAdminProducts',
    banners: 'rubensAdminBanners',
    settings: 'rubensAdminSettings',
    metrics: 'rubensAdminMetrics',
    session: 'rubensAdminSession',
  };

  const LOGIN_USER = 'admin';
  const LOGIN_PASSWORD = 'rubens2026';

  const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const defaultMetrics = {
    visitsToday: 248,
    whatsappClicks: 37,
    mercadoPagoClicks: 12,
    mostViewedProducts: [
      { name: 'Fester Acriton PS Max 8 Anos', value: 92 },
      { name: 'Thermotek 5 Anos', value: 78 },
      { name: 'Brochas Perfect', value: 64 },
      { name: 'Pasta Texturizada', value: 51 },
    ],
    topCategories: [
      { name: 'Impermeabilizantes', value: 94 },
      { name: 'Maderas', value: 72 },
      { name: 'Aplicadores', value: 58 },
      { name: 'Vinilica', value: 45 },
    ],
  };

  const sampleOrders = [
    {
      id: 'RB-1001',
      customer: 'Carlos Mendoza',
      phone: '525510022372',
      products: 'Thermotek 5 Anos, Membrana reforzada',
      total: 3200,
      payment: 'Transferencia SPEI',
      status: 'Nuevo',
    },
    {
      id: 'RB-1002',
      customer: 'Laura Hernandez',
      phone: '5255610015',
      products: 'Barniz Marino Brillante 4 Litros',
      total: 1915,
      payment: 'Mercado Pago',
      status: 'Pagado',
    },
    {
      id: 'RB-1003',
      customer: 'Jorge Ramirez',
      phone: '525500000000',
      products: 'Brochas Perfect, Masking Tape Azul',
      total: 315,
      payment: 'Efectivo en tienda',
      status: 'Pendiente',
    },
    {
      id: 'RB-1004',
      customer: 'Ana Lopez',
      phone: '525511112222',
      products: 'Sikaflex 1A Purform',
      total: 300,
      payment: 'Transferencia SPEI',
      status: 'Entregado',
    },
  ];

  const defaultSettings = {
    whatsapp: '525510022372',
    email: 'ventas@rubensdistribuidora.com',
    address: 'Av. Azcapotzalco 756, Col. Los Reyes, CDMX',
    hours: 'Lunes a viernes 9:00 a 18:00\nSabado 9:00 a 14:00',
    maps: 'https://maps.google.com/',
    social: 'Facebook: Ruben\'s Distribuidora\nInstagram: @rubensdistribuidora',
  };

  const defaultBanner = {
    id: 'banner-temporada-lluvias',
    title: 'Temporada de lluvias',
    subtitle: 'Impermeabilizantes y complementos',
    secondary: 'Encuentra productos Fester, Thermotek, membranas y selladores para proteger techos y fachadas.',
    image: 'season-rain-waterproofing.jpg',
    button: 'Ver impermeabilizantes',
    link: 'productos.html?categoria=epoxica',
    active: true,
    updatedAt: new Date().toISOString(),
  };

  const readJson = (key, fallback, storage) => {
    try {
      const raw = storage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  };

  const writeJson = (key, value, storage) => {
    storage.setItem(key, JSON.stringify(value));
    return value;
  };

  const normalizeProduct = (product) => ({
    id: product.id || createId('product'),
    name: String(product.name || '').trim(),
    brand: String(product.brand || '').trim(),
    category: String(product.category || '').trim(),
    subcategory: String(product.subcategory || '').trim(),
    description: String(product.description || '').trim(),
    sizes: String(product.sizes || product.size || '').trim(),
    price: Number(product.price) || 0,
    image: String(product.image || '').trim(),
    imageData: String(product.imageData || '').trim(),
    imageName: String(product.imageName || '').trim(),
    active: product.active !== false,
    featured: Boolean(product.featured),
    promo: Boolean(product.promo),
    updatedAt: product.updatedAt || new Date().toISOString(),
  });

  const normalizeBanner = (banner) => ({
    id: banner.id || createId('banner'),
    title: String(banner.title || '').trim(),
    subtitle: String(banner.subtitle || '').trim(),
    secondary: String(banner.secondary || '').trim(),
    image: String(banner.image || '').trim(),
    button: String(banner.button || '').trim(),
    link: String(banner.link || '').trim(),
    active: banner.active !== false,
    updatedAt: banner.updatedAt || new Date().toISOString(),
  });

  const getLocalStorage = () => window.localStorage;
  const getSessionStorage = () => window.sessionStorage;

  const adminStore = {
    KEYS,
    loadProducts(storage = getLocalStorage()) {
      return readJson(KEYS.products, [], storage).map(normalizeProduct);
    },
    saveProducts(products, storage = getLocalStorage()) {
      return writeJson(KEYS.products, products.map(normalizeProduct), storage);
    },
    loadBanners(storage = getLocalStorage()) {
      const saved = readJson(KEYS.banners, null, storage);
      if (!saved) {
        const seeded = [defaultBanner];
        writeJson(KEYS.banners, seeded, storage);
        return seeded.map(normalizeBanner);
      }
      return Array.isArray(saved) ? saved.map(normalizeBanner) : [];
    },
    saveBanners(banners, storage = getLocalStorage()) {
      return writeJson(KEYS.banners, banners.map(normalizeBanner), storage);
    },
    loadSettings(storage = getLocalStorage()) {
      return { ...defaultSettings, ...readJson(KEYS.settings, {}, storage) };
    },
    saveSettings(settings, storage = getLocalStorage()) {
      return writeJson(KEYS.settings, { ...defaultSettings, ...settings }, storage);
    },
    loadMetrics(storage = getLocalStorage()) {
      return { ...defaultMetrics, ...readJson(KEYS.metrics, {}, storage) };
    },
    login(user, password, sessionStorageRef = getSessionStorage()) {
      const ok = user === LOGIN_USER && password === LOGIN_PASSWORD;
      if (ok) {
        sessionStorageRef.setItem(KEYS.session, JSON.stringify({ loggedIn: true, at: new Date().toISOString() }));
      }
      return ok;
    },
    logout(sessionStorageRef = getSessionStorage()) {
      sessionStorageRef.removeItem(KEYS.session);
    },
    isLoggedIn(sessionStorageRef = getSessionStorage()) {
      return Boolean(readJson(KEYS.session, null, sessionStorageRef)?.loggedIn);
    },
    normalizeProduct,
    normalizeBanner,
  };

  if (typeof window !== 'undefined') {
    window.RubensAdmin = adminStore;
  }

  if (typeof document === 'undefined') return;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const elements = {
    loginScreen: $('#login-screen'),
    adminApp: $('#admin-app'),
    loginForm: $('#login-form'),
    loginUser: $('#login-user'),
    loginPassword: $('#login-password'),
    loginStatus: $('#login-status'),
    logoutButton: $('#logout-button'),
    menuToggle: $('#menu-toggle'),
    sidebar: $('.sidebar'),
    navItems: $$('.nav-item'),
    pageTitle: $('#page-title'),
    productForm: $('#product-form'),
    productStatus: $('#product-status'),
    productTable: $('#products-table'),
    productMobile: $('#products-mobile'),
    productEmpty: $('#products-empty'),
    productSearch: $('#product-search'),
    productFormTitle: $('#product-form-title'),
    productSubmitButton: $('#product-submit-button'),
    cancelProductEdit: $('#cancel-product-edit'),
    bannerForm: $('#banner-form'),
    bannerStatus: $('#banner-status'),
    bannerList: $('#banner-list'),
    bannerEmpty: $('#banners-empty'),
    bannerFormTitle: $('#banner-form-title'),
    cancelBannerEdit: $('#cancel-banner-edit'),
    ordersTable: $('#orders-table'),
    ordersMobile: $('#orders-mobile'),
    settingsForm: $('#settings-form'),
    settingsStatus: $('#settings-status'),
  };

  const productFields = {
    id: $('#product-id'),
    name: $('#product-name'),
    brand: $('#product-brand'),
    category: $('#product-category'),
    subcategory: $('#product-subcategory'),
    description: $('#product-description'),
    sizes: $('#product-sizes'),
    price: $('#product-price'),
    image: $('#product-image'),
    imageFile: $('#product-image-file'),
    imageFileName: $('#product-image-file-name'),
    imagePreviewWrap: $('#product-image-preview-wrap'),
    imagePreview: $('#product-image-preview'),
    active: $('#product-active'),
    featured: $('#product-featured'),
    promo: $('#product-promo'),
  };

  const bannerFields = {
    id: $('#banner-id'),
    title: $('#banner-title'),
    subtitle: $('#banner-subtitle'),
    secondary: $('#banner-secondary'),
    image: $('#banner-image'),
    button: $('#banner-button'),
    link: $('#banner-link'),
    active: $('#banner-active'),
  };

  const settingFields = {
    whatsapp: $('#setting-whatsapp'),
    email: $('#setting-email'),
    address: $('#setting-address'),
    hours: $('#setting-hours'),
    maps: $('#setting-maps'),
    social: $('#setting-social'),
  };

  let products = adminStore.loadProducts();
  let banners = adminStore.loadBanners();
  let settings = adminStore.loadSettings();
  let metrics = adminStore.loadMetrics();
  let productQuery = '';
  let currentProductImageData = '';
  let currentProductImageName = '';

  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const formatCurrency = (value) => new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

  const setStatus = (element, message, isError = false) => {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('error', isError);
    if (message) {
      window.setTimeout(() => {
        if (element.textContent === message) element.textContent = '';
      }, 3000);
    }
  };

  const getProductImageSource = (product) => product.imageData || product.image || '';

  const productThumbMarkup = (product) => {
    const source = getProductImageSource(product);
    return source
      ? `<span class="product-thumb"><img src="${escapeHtml(source)}" alt="${escapeHtml(product.name)}"></span>`
      : '<span class="product-thumb-placeholder">IMG</span>';
  };

  const updateProductImagePreview = (source = '', fileName = '') => {
    currentProductImageData = source && source.startsWith('data:image/') ? source : currentProductImageData;
    currentProductImageName = fileName || currentProductImageName;
    if (productFields.imageFileName) {
      productFields.imageFileName.textContent = currentProductImageName || 'Sin archivo seleccionado';
    }
    if (!productFields.imagePreview || !productFields.imagePreviewWrap) return;
    const previewSource = source || productFields.image.value.trim();
    productFields.imagePreviewWrap.classList.toggle('hidden', !previewSource);
    if (previewSource) {
      productFields.imagePreview.src = previewSource;
    } else {
      productFields.imagePreview.removeAttribute('src');
    }
  };

  const clearProductImagePreview = () => {
    currentProductImageData = '';
    currentProductImageName = '';
    if (productFields.imageFile) productFields.imageFile.value = '';
    updateProductImagePreview('', '');
  };

  const statusPills = (item) => `
    <span class="pill ${item.active ? 'active' : 'inactive'}">${item.active ? 'Activo' : 'Inactivo'}</span>
    ${item.featured ? '<span class="pill featured">Destacado</span>' : ''}
    ${item.promo ? '<span class="pill promo">Promocion</span>' : ''}
  `;

  const orderPill = (status) => {
    const classMap = {
      Nuevo: 'new',
      Pendiente: 'pending',
      Pagado: 'paid',
      Entregado: 'delivered',
      Cancelado: 'cancelled',
    };
    return `<span class="pill ${classMap[status] || ''}">${escapeHtml(status)}</span>`;
  };

  const showApp = () => {
    elements.loginScreen?.classList.add('hidden');
    elements.adminApp?.classList.remove('hidden');
    renderAll();
  };

  const showLogin = () => {
    elements.adminApp?.classList.add('hidden');
    elements.loginScreen?.classList.remove('hidden');
    elements.loginUser?.focus();
  };

  const switchSection = (section) => {
    $$('.section-view').forEach((view) => view.classList.toggle('active', view.id === `section-${section}`));
    elements.navItems.forEach((item) => item.classList.toggle('active', item.dataset.section === section));
    if (elements.pageTitle) {
      const activeButton = elements.navItems.find((item) => item.dataset.section === section);
      elements.pageTitle.textContent = activeButton ? activeButton.textContent : 'Dashboard';
    }
    elements.sidebar?.classList.remove('open');
    elements.menuToggle?.setAttribute('aria-expanded', 'false');
  };

  const getFilteredProducts = () => {
    const term = productQuery.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) => [
      product.name,
      product.brand,
      product.category,
      product.subcategory,
      product.description,
      product.sizes,
      String(product.price || ''),
      product.image,
      product.imageName,
    ].some((value) => value.toLowerCase().includes(term)));
  };

  const renderDashboard = () => {
    const activeProducts = products.filter((product) => product.active).length;
    const featuredProducts = products.filter((product) => product.featured).length;
    $('#stat-active-products').textContent = String(activeProducts);
    $('#stat-orders').textContent = String(sampleOrders.length);
    $('#stat-whatsapp').textContent = String(metrics.whatsappClicks);
    $('#stat-visits').textContent = String(metrics.visitsToday);
    $('#stat-featured').textContent = String(featuredProducts);

    const activeBanners = banners.filter((banner) => banner.active).length;
    $('#dashboard-summary').innerHTML = [
      `Productos guardados en admin: ${products.length}`,
      `Banners activos: ${activeBanners}`,
      `Pedidos simulados listos para revision: ${sampleOrders.length}`,
      `Configuracion cargada para WhatsApp: ${settings.whatsapp || 'Sin definir'}`,
    ].map((text) => `<div class="activity-item">${escapeHtml(text)}</div>`).join('');

    const recent = products.slice(0, 4);
    $('#recent-products').innerHTML = recent.length
      ? recent.map((product) => `<div class="compact-item"><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.category)} / ${escapeHtml(product.subcategory)}</small></div>`).join('')
      : '<div class="compact-item muted">Aun no hay productos agregados en el admin.</div>';
  };

  const renderProducts = () => {
    const visible = getFilteredProducts();
    const rows = visible.map((product) => `
      <tr>
        <td>
          <div class="product-cell">
            ${productThumbMarkup(product)}
            <div>
              <strong>${escapeHtml(product.name)}</strong>
              <small>${escapeHtml(product.brand || 'Sin marca')}${product.imageName ? ` / ${escapeHtml(product.imageName)}` : product.image ? ` / ${escapeHtml(product.image)}` : ''}</small>
            </div>
          </div>
        </td>
        <td>${escapeHtml(product.category)}<br><small>${escapeHtml(product.subcategory)}</small></td>
        <td>${escapeHtml(product.sizes)}</td>
        <td>${product.price ? formatCurrency(product.price) : '<span class="muted">Sin precio</span>'}</td>
        <td>${statusPills(product)}</td>
        <td>
          <div class="row-actions">
            <button class="action-button" type="button" data-product-action="edit" data-id="${escapeHtml(product.id)}">Editar</button>
            <button class="action-button" type="button" data-product-action="toggle-active" data-id="${escapeHtml(product.id)}">${product.active ? 'Desactivar' : 'Activar'}</button>
            <button class="action-button" type="button" data-product-action="toggle-featured" data-id="${escapeHtml(product.id)}">Destacado</button>
            <button class="action-button" type="button" data-product-action="toggle-promo" data-id="${escapeHtml(product.id)}">Promo</button>
            <button class="action-button" type="button" data-product-action="delete" data-id="${escapeHtml(product.id)}">Eliminar</button>
          </div>
        </td>
      </tr>
    `).join('');

    const cards = visible.map((product) => `
      <article class="mobile-card">
        <div class="product-cell">
          ${productThumbMarkup(product)}
          <div>
            <strong>${escapeHtml(product.name)}</strong>
            <small>${escapeHtml(product.brand || 'Sin marca')} / ${escapeHtml(product.category)}</small>
          </div>
        </div>
        <p class="muted">${escapeHtml(product.sizes)}</p>
        <p>${product.price ? formatCurrency(product.price) : '<span class="muted">Sin precio</span>'}</p>
        <div>${statusPills(product)}</div>
        <div class="row-actions">
          <button class="action-button" type="button" data-product-action="edit" data-id="${escapeHtml(product.id)}">Editar</button>
          <button class="action-button" type="button" data-product-action="toggle-active" data-id="${escapeHtml(product.id)}">${product.active ? 'Desactivar' : 'Activar'}</button>
          <button class="action-button" type="button" data-product-action="delete" data-id="${escapeHtml(product.id)}">Eliminar</button>
        </div>
      </article>
    `).join('');

    if (elements.productTable) elements.productTable.innerHTML = rows;
    if (elements.productMobile) elements.productMobile.innerHTML = cards;
    elements.productEmpty?.classList.toggle('hidden', visible.length > 0);
  };

  const renderOrders = () => {
    const rows = sampleOrders.map((order) => {
      const message = encodeURIComponent(`Hola ${order.customer}, te contactamos de Ruben's Distribuidora sobre tu pedido ${order.id}.`);
      const whatsAppUrl = `https://wa.me/${order.phone}?text=${message}`;
      return `
        <tr>
          <td><strong>${escapeHtml(order.id)}</strong></td>
          <td>${escapeHtml(order.customer)}</td>
          <td>${escapeHtml(order.phone)}</td>
          <td>${escapeHtml(order.products)}</td>
          <td>${formatCurrency(order.total)}</td>
          <td>${escapeHtml(order.payment)}</td>
          <td>${orderPill(order.status)}</td>
          <td><a class="whatsapp-button" href="${whatsAppUrl}" target="_blank" rel="noopener">Contactar</a></td>
        </tr>
      `;
    }).join('');

    const cards = sampleOrders.map((order) => {
      const message = encodeURIComponent(`Hola ${order.customer}, te contactamos de Ruben's Distribuidora sobre tu pedido ${order.id}.`);
      return `
        <article class="mobile-card">
          <strong>${escapeHtml(order.id)} / ${escapeHtml(order.customer)}</strong>
          <small>${escapeHtml(order.products)}</small>
          <p>${formatCurrency(order.total)} / ${escapeHtml(order.payment)}</p>
          <div>${orderPill(order.status)}</div>
          <a class="whatsapp-button" href="https://wa.me/${order.phone}?text=${message}" target="_blank" rel="noopener">Contactar por WhatsApp</a>
        </article>
      `;
    }).join('');

    if (elements.ordersTable) elements.ordersTable.innerHTML = rows;
    if (elements.ordersMobile) elements.ordersMobile.innerHTML = cards;
  };

  const renderBanners = () => {
    if (elements.bannerList) {
      elements.bannerList.innerHTML = banners.map((banner) => `
        <article class="banner-card">
          <div>
            <strong>${escapeHtml(banner.title)}</strong>
            <small>${escapeHtml(banner.subtitle || 'Sin subtitulo')}</small>
          </div>
          <p class="muted">${escapeHtml(banner.secondary || 'Sin texto secundario')}</p>
          <div>
            <span class="pill ${banner.active ? 'active' : 'inactive'}">${banner.active ? 'Activo' : 'Inactivo'}</span>
            ${banner.image ? `<span class="pill">${escapeHtml(banner.image)}</span>` : ''}
          </div>
          <div class="row-actions">
            <button class="action-button" type="button" data-banner-action="edit" data-id="${escapeHtml(banner.id)}">Editar</button>
            <button class="action-button" type="button" data-banner-action="toggle-active" data-id="${escapeHtml(banner.id)}">${banner.active ? 'Desactivar' : 'Activar'}</button>
            <button class="action-button" type="button" data-banner-action="delete" data-id="${escapeHtml(banner.id)}">Eliminar</button>
          </div>
        </article>
      `).join('');
    }
    elements.bannerEmpty?.classList.toggle('hidden', banners.length > 0);
  };

  const renderMetrics = () => {
    $('#metric-visits').textContent = String(metrics.visitsToday);
    $('#metric-whatsapp').textContent = String(metrics.whatsappClicks);
    $('#metric-mercado').textContent = String(metrics.mercadoPagoClicks);
    $('#most-viewed-products').innerHTML = renderRankList(metrics.mostViewedProducts);
    $('#top-categories').innerHTML = renderRankList(metrics.topCategories);
  };

  const renderRankList = (items) => items.map((item) => `
    <div class="rank-item">
      <span>${escapeHtml(item.name)}</span>
      <div class="rank-bar"><span style="width:${Math.min(Number(item.value) || 0, 100)}%"></span></div>
      <strong>${Number(item.value) || 0}</strong>
    </div>
  `).join('');

  const fillSettingsForm = () => {
    Object.entries(settingFields).forEach(([key, field]) => {
      if (field) field.value = settings[key] || '';
    });
  };

  const renderAll = () => {
    renderDashboard();
    renderProducts();
    renderOrders();
    renderBanners();
    renderMetrics();
    fillSettingsForm();
  };

  const resetProductForm = (resetFields = true) => {
    if (resetFields) elements.productForm.reset();
    productFields.id.value = '';
    productFields.active.checked = true;
    productFields.featured.checked = false;
    productFields.promo.checked = false;
    clearProductImagePreview();
    elements.productFormTitle.textContent = 'Agregar producto';
    elements.productSubmitButton.textContent = 'Guardar producto';
    elements.cancelProductEdit.classList.add('hidden');
  };

  const resetBannerForm = (resetFields = true) => {
    if (resetFields) elements.bannerForm.reset();
    bannerFields.id.value = '';
    bannerFields.active.checked = true;
    elements.bannerFormTitle.textContent = 'Agregar banner';
    elements.cancelBannerEdit.classList.add('hidden');
  };

  const productFromForm = () => normalizeProduct({
    id: productFields.id.value || undefined,
    name: productFields.name.value,
    brand: productFields.brand.value,
    category: productFields.category.value,
    subcategory: productFields.subcategory.value,
    description: productFields.description.value,
    sizes: productFields.sizes.value,
    price: productFields.price.value,
    image: productFields.image.value,
    imageData: currentProductImageData,
    imageName: currentProductImageName,
    active: productFields.active.checked,
    featured: productFields.featured.checked,
    promo: productFields.promo.checked,
    updatedAt: new Date().toISOString(),
  });

  const fillProductForm = (product) => {
    productFields.id.value = product.id;
    productFields.name.value = product.name;
    productFields.brand.value = product.brand;
    productFields.category.value = product.category;
    productFields.subcategory.value = product.subcategory;
    productFields.description.value = product.description;
    productFields.sizes.value = product.sizes;
    productFields.price.value = product.price || '';
    productFields.image.value = product.image;
    currentProductImageData = product.imageData || '';
    currentProductImageName = product.imageName || '';
    updateProductImagePreview(product.imageData || product.image || '', product.imageName || '');
    productFields.active.checked = product.active;
    productFields.featured.checked = product.featured;
    productFields.promo.checked = product.promo;
    elements.productFormTitle.textContent = 'Editar producto';
    elements.productSubmitButton.textContent = 'Actualizar producto';
    elements.cancelProductEdit.classList.remove('hidden');
    productFields.name.focus();
  };

  const bannerFromForm = () => normalizeBanner({
    id: bannerFields.id.value || undefined,
    title: bannerFields.title.value,
    subtitle: bannerFields.subtitle.value,
    secondary: bannerFields.secondary.value,
    image: bannerFields.image.value,
    button: bannerFields.button.value,
    link: bannerFields.link.value,
    active: bannerFields.active.checked,
    updatedAt: new Date().toISOString(),
  });

  const fillBannerForm = (banner) => {
    bannerFields.id.value = banner.id;
    bannerFields.title.value = banner.title;
    bannerFields.subtitle.value = banner.subtitle;
    bannerFields.secondary.value = banner.secondary;
    bannerFields.image.value = banner.image;
    bannerFields.button.value = banner.button;
    bannerFields.link.value = banner.link;
    bannerFields.active.checked = banner.active;
    elements.bannerFormTitle.textContent = 'Editar banner';
    elements.cancelBannerEdit.classList.remove('hidden');
    bannerFields.title.focus();
  };

  elements.loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const ok = adminStore.login(elements.loginUser.value.trim(), elements.loginPassword.value);
    if (!ok) {
      setStatus(elements.loginStatus, 'Usuario o contrasena incorrectos.', true);
      return;
    }
    elements.loginPassword.value = '';
    showApp();
  });

  elements.logoutButton?.addEventListener('click', () => {
    adminStore.logout();
    showLogin();
  });

  elements.menuToggle?.addEventListener('click', () => {
    const isOpen = elements.sidebar.classList.toggle('open');
    elements.menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  elements.navItems.forEach((item) => {
    item.addEventListener('click', () => switchSection(item.dataset.section));
  });

  productFields.imageFile?.addEventListener('change', () => {
    const file = productFields.imageFile.files?.[0];
    if (!file) {
      clearProductImagePreview();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      currentProductImageData = String(reader.result || '');
      currentProductImageName = file.name;
      updateProductImagePreview(currentProductImageData, currentProductImageName);
    };
    reader.readAsDataURL(file);
  });

  productFields.image?.addEventListener('input', () => {
    if (productFields.image.value.trim()) {
      currentProductImageData = '';
      currentProductImageName = '';
      if (productFields.imageFile) productFields.imageFile.value = '';
      updateProductImagePreview(productFields.image.value.trim(), '');
    } else {
      clearProductImagePreview();
    }
  });

  elements.productForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!elements.productForm.checkValidity()) {
      elements.productForm.reportValidity();
      return;
    }
    const product = productFromForm();
    const index = products.findIndex((item) => item.id === product.id);
    if (index >= 0) {
      products[index] = product;
      setStatus(elements.productStatus, 'Producto actualizado correctamente');
    } else {
      products.unshift(product);
      setStatus(elements.productStatus, 'Producto guardado correctamente');
    }
    products = adminStore.saveProducts(products);
    resetProductForm();
    renderAll();
  });

  elements.productForm?.addEventListener('reset', () => {
    window.setTimeout(() => resetProductForm(false), 0);
  });

  elements.cancelProductEdit?.addEventListener('click', () => resetProductForm());

  const handleProductAction = (event) => {
    const button = event.target.closest('[data-product-action]');
    if (!button) return;
    const product = products.find((item) => item.id === button.dataset.id);
    if (!product) return;

    if (button.dataset.productAction === 'edit') {
      fillProductForm(product);
      return;
    }

    if (button.dataset.productAction === 'delete') {
      if (!window.confirm(`Eliminar "${product.name}" del admin local?`)) return;
      products = products.filter((item) => item.id !== product.id);
      setStatus(elements.productStatus, 'Producto eliminado correctamente');
    }

    if (button.dataset.productAction === 'toggle-active') product.active = !product.active;
    if (button.dataset.productAction === 'toggle-featured') product.featured = !product.featured;
    if (button.dataset.productAction === 'toggle-promo') product.promo = !product.promo;

    products = adminStore.saveProducts(products);
    renderAll();
  };

  elements.productTable?.addEventListener('click', handleProductAction);
  elements.productMobile?.addEventListener('click', handleProductAction);

  elements.productSearch?.addEventListener('input', () => {
    productQuery = elements.productSearch.value;
    renderProducts();
  });

  elements.bannerForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!elements.bannerForm.checkValidity()) {
      elements.bannerForm.reportValidity();
      return;
    }
    const banner = bannerFromForm();
    const index = banners.findIndex((item) => item.id === banner.id);
    if (index >= 0) {
      banners[index] = banner;
      setStatus(elements.bannerStatus, 'Banner actualizado en localStorage.');
    } else {
      banners.unshift(banner);
      setStatus(elements.bannerStatus, 'Banner agregado en localStorage.');
    }
    banners = adminStore.saveBanners(banners);
    resetBannerForm();
    renderAll();
  });

  elements.bannerForm?.addEventListener('reset', () => {
    window.setTimeout(() => resetBannerForm(false), 0);
  });

  elements.cancelBannerEdit?.addEventListener('click', () => resetBannerForm());

  elements.bannerList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-banner-action]');
    if (!button) return;
    const banner = banners.find((item) => item.id === button.dataset.id);
    if (!banner) return;

    if (button.dataset.bannerAction === 'edit') {
      fillBannerForm(banner);
      return;
    }

    if (button.dataset.bannerAction === 'delete') {
      if (!window.confirm(`Eliminar "${banner.title}" del admin local?`)) return;
      banners = banners.filter((item) => item.id !== banner.id);
    }

    if (button.dataset.bannerAction === 'toggle-active') banner.active = !banner.active;
    banners = adminStore.saveBanners(banners);
    renderAll();
  });

  elements.settingsForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    settings = adminStore.saveSettings({
      whatsapp: settingFields.whatsapp.value,
      email: settingFields.email.value,
      address: settingFields.address.value,
      hours: settingFields.hours.value,
      maps: settingFields.maps.value,
      social: settingFields.social.value,
    });
    setStatus(elements.settingsStatus, 'Configuracion guardada en localStorage.');
    renderDashboard();
  });

  if (adminStore.isLoggedIn()) {
    showApp();
  } else {
    showLogin();
  }
}());
