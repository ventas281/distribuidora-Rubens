(function () {
  const KEYS = {
    products: 'rubensAdminProducts',
    banners: 'rubensAdminBanners',
    settings: 'rubensAdminSettings',
    metrics: 'rubensAdminMetrics',
  };

  const SUPABASE_REST_URL = 'https://jlxrrqjqqbbrzfzmlyuw.supabase.co/rest/v1/';
  const SUPABASE_URL = SUPABASE_REST_URL.replace(/\/rest\/v1\/?$/, '');
  const SUPABASE_KEY = 'sb_publishable_IPQVpAeDJwNh_bZ575tz5w_8hAUzsEL';
  const SUPABASE_PRODUCTS_TABLE = 'productos';
  const SUPABASE_ORDERS_TABLE = 'pedidos';
  const AUTHORIZED_ADMIN_EMAIL = 'ventas@rubensdistribuidora.com';
  const LOCAL_ADMIN_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);
  const isLocalAdminEnvironment = () => (
    window.location.protocol === 'file:' || LOCAL_ADMIN_HOSTS.has(window.location.hostname)
  );
  const getAdminAuthRedirectTo = () => {
    const adminPath = window.location.pathname.endsWith('/admin.html')
      ? window.location.pathname
      : '/admin.html';
    return `${window.location.origin}${adminPath}`;
  };

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
      { name: 'Impermeabilizante', value: 94 },
      { name: 'Madera', value: 72 },
      { name: 'Aplicadores', value: 58 },
      { name: 'Vinílica', value: 45 },
    ],
  };

  const defaultSettings = {
    whatsapp: '525539318779',
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

  const normalizeCategoryText = (value) => String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  const normalizeText = (text) => String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, ' ');

  const categoryAliases = {
    vinilica: 'Vinílica',
    'pintura vinilica': 'Vinílica',
    esmalte: 'Esmalte',
    esmaltes: 'Esmalte',
    'pintura de esmalte': 'Esmalte',
    epoxica: 'Impermeabilizante',
    impermeabilizante: 'Impermeabilizante',
    impermeabilizantes: 'Impermeabilizante',
    aerosoles: 'Aerosoles',
    aerosol: 'Aerosoles',
    madera: 'Madera',
    maderas: 'Madera',
    'productos para madera': 'Madera',
    aplicadores: 'Aplicadores',
    ferreteria: 'Aplicadores',
    selladores: 'Selladores y Adhesivos',
    'selladores y adhesivos': 'Selladores y Adhesivos',
    diluyentes: 'Diluyentes',
    complementos: 'Diluyentes',
    primarios: 'Primarios',
    primerarios: 'Primarios',
    industrial: 'Primarios',
  };

  const normalizeCategoryLabel = (category) => categoryAliases[normalizeCategoryText(category)] || String(category || '').trim();

  const duplicateProductKey = (product) => [
    normalizeText(product.name),
    normalizeText(product.brand),
    normalizeText(normalizeCategoryLabel(product.category)),
  ].join('|');

  const normalizeProduct = (product) => ({
    id: product.id ? String(product.id) : createId('product'),
    name: String(product.name || '').trim(),
    brand: String(product.brand || '').trim(),
    category: normalizeCategoryLabel(product.category),
    subcategory: String(product.subcategory || '').trim(),
    description: String(product.description || '').trim(),
    sizes: String(product.sizes || product.size || '').trim(),
    price: Number(product.price) || 0,
    image: String(product.image || '').trim(),
    imageData: String(product.imageData || '').trim(),
    imageName: String(product.imageName || '').trim(),
    source: String(product.source || 'admin').trim(),
    active: product.active !== false,
    featured: Boolean(product.featured),
    promo: Boolean(product.promo),
    updatedAt: product.updatedAt || new Date().toISOString(),
  });

  const productFromSupabaseRow = (row) => normalizeProduct({
    id: row.id,
    name: row.nombre,
    brand: row.marca,
    category: row.categoria,
    subcategory: row.subcategoria,
    description: row.descripcion,
    sizes: row.tamanos_precios,
    price: row.precio_base,
    image: String(row.imagen || '').startsWith('data:image/') ? '' : row.imagen,
    imageData: String(row.imagen || '').startsWith('data:image/') ? row.imagen : '',
    imageName: '',
    active: row.activo,
    featured: row.destacado,
    promo: row.promocion,
    source: 'supabase',
    updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
  });

  const productToSupabaseRow = (product) => {
    const normalized = normalizeProduct(product);
    return {
      nombre: normalized.name,
      marca: normalized.brand,
      categoria: normalized.category,
      subcategoria: normalized.subcategory,
      descripcion: normalized.description,
      tamanos_precios: normalized.sizes,
      precio_base: normalized.price,
      imagen: normalized.imageData || normalized.image,
      activo: normalized.active,
      destacado: normalized.featured,
      promocion: normalized.promo,
    };
  };

  const serializeSupabaseError = (error) => ({
    message: error?.message || String(error),
    details: error?.details || null,
    hint: error?.hint || null,
    code: error?.code || null,
    status: error?.status || null,
    name: error?.name || null,
  });

  const logSupabase = (label, payload = {}) => {
    console.log(`[Rubens Admin Supabase] ${label}`, payload);
  };

  const logSupabaseError = (label, error, payload = {}) => {
    console.error(`[Rubens Admin Supabase] ${label}`, {
      ...payload,
      error: serializeSupabaseError(error),
    });
  };

  const getSupabaseErrorMessage = (error) => {
    const serialized = serializeSupabaseError(error);
    return [
      serialized.message,
      serialized.details,
      serialized.hint,
      serialized.code ? `Codigo: ${serialized.code}` : '',
      serialized.status ? `HTTP: ${serialized.status}` : '',
    ].filter(Boolean).join(' | ');
  };

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
      const settings = { ...defaultSettings, ...readJson(KEYS.settings, {}, storage) };
      if (settings.whatsapp === '525510022372' || settings.whatsapp === '5255610015') {
        settings.whatsapp = defaultSettings.whatsapp;
        writeJson(KEYS.settings, settings, storage);
      }
      return settings;
    },
    saveSettings(settings, storage = getLocalStorage()) {
      return writeJson(KEYS.settings, { ...defaultSettings, ...settings }, storage);
    },
    loadMetrics(storage = getLocalStorage()) {
      return { ...defaultMetrics, ...readJson(KEYS.metrics, {}, storage) };
    },
    normalizeProduct,
    productFromSupabaseRow,
    productToSupabaseRow,
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
    googleLoginButton: $('#google-login-button'),
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
    syncCatalogProducts: $('#sync-catalog-products'),
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
    ordersEmpty: $('#orders-empty'),
    ordersStatus: $('#orders-status'),
    refreshOrders: $('#refresh-orders'),
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
  let orders = [];
  let productQuery = '';
  let currentProductImageData = '';
  let currentProductImageName = '';
  let currentEditingProductSource = '';
  let editingProductId = null;
  let supabaseClient = null;
  let supabaseEnabled = false;
  let pendingSignedOutMessage = '';

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

  const parseCurrencyValue = (value) => {
    const numeric = String(value || '').replace(/[^\d.]/g, '');
    return Number(numeric) || 0;
  };

  const isDataImage = (value) => String(value || '').trim().startsWith('data:image');
  const productCatalogKey = (product) => `${normalizeCategoryText(product.name)}|${normalizeCategoryText(normalizeCategoryLabel(product.category))}`;

  const mergeProductsWithoutDuplicates = (baseProducts, incomingProducts) => {
    const merged = [...baseProducts.map(normalizeProduct)];
    incomingProducts.map(normalizeProduct).forEach((product) => {
      const key = productCatalogKey(product);
      const existingIndex = merged.findIndex((item) => productCatalogKey(item) === key);
      if (existingIndex >= 0) {
        merged[existingIndex] = normalizeProduct({
          ...merged[existingIndex],
          ...product,
          id: merged[existingIndex].id,
          source: merged[existingIndex].source || product.source,
          active: merged[existingIndex].active,
          featured: merged[existingIndex].featured,
          promo: merged[existingIndex].promo,
        });
      } else {
        merged.push(product);
      }
    });
    return merged;
  };

  const getSupabaseClient = () => {
    if (supabaseClient) return supabaseClient;
    if (!window.supabase?.createClient) {
      logSupabaseError('createClient no disponible', new Error('Supabase CDN no cargo window.supabase.createClient'), {
        supabaseUrl: SUPABASE_URL,
        table: SUPABASE_PRODUCTS_TABLE,
      });
      return null;
    }
    logSupabase('Inicializando cliente', {
      supabaseUrl: SUPABASE_URL,
      table: SUPABASE_PRODUCTS_TABLE,
      hasPublishableKey: Boolean(SUPABASE_KEY),
      createClientAvailable: Boolean(window.supabase?.createClient),
    });
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return supabaseClient;
  };

  const supabaseRestRequest = async (pathAndQuery, options = {}) => {
    const url = `${SUPABASE_REST_URL}${pathAndQuery}`;
    const headers = {
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    logSupabase('REST request', {
      method: options.method || 'GET',
      url,
      headers: { ...headers, apikey: '[publishable key]' },
      body: options.body ? JSON.parse(options.body) : null,
    });
    const response = await fetch(url, {
      ...options,
      headers,
    });
    const responseText = await response.text();
    let responseData = null;
    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch (error) {
      responseData = responseText;
    }
    if (!response.ok) {
      const error = new Error(responseData?.message || response.statusText || 'Supabase REST error');
      error.status = response.status;
      error.details = responseData?.details || responseText;
      error.hint = responseData?.hint || null;
      error.code = responseData?.code || null;
      logSupabaseError('REST error response', error, {
        method: options.method || 'GET',
        url,
        response: responseData,
      });
      console.error('[Rubens Admin Supabase] Error Supabase', serializeSupabaseError(error));
      throw error;
    }
    console.log('[Rubens Admin Supabase] Respuesta Supabase', responseData);
    logSupabase('REST success', {
      method: options.method || 'GET',
      url,
      response: responseData,
    });
    return responseData;
  };

  const loadProductsFromSupabase = async () => {
    getSupabaseClient();
    logSupabase('SELECT productos', {
      table: SUPABASE_PRODUCTS_TABLE,
      columns: ['id', 'nombre', 'marca', 'categoria', 'subcategoria', 'descripcion', 'tamanos_precios', 'precio_base', 'imagen', 'activo', 'destacado', 'promocion', 'created_at'],
    });
    const data = await supabaseRestRequest(`${SUPABASE_PRODUCTS_TABLE}?select=*`);
    logSupabase('SELECT success', { count: data?.length || 0 });
    const loadedProducts = (data || []).map(productFromSupabaseRow);
    console.log('productos recibidos desde Supabase', loadedProducts);
    console.log('productos sin imagen detectados', loadedProducts.filter((product) => !getProductImageSource(product)));
    return loadedProducts;
  };

  const saveProductToSupabase = async (product, forcedEditingProductId = editingProductId) => {
    getSupabaseClient();
    const productIdForUpdate = forcedEditingProductId || null;
    const normalizedProduct = normalizeProduct(product);
    const payload = productToSupabaseRow(normalizedProduct);
    console.log('[Rubens Admin Supabase] Intentando guardar en Supabase', {
      table: SUPABASE_PRODUCTS_TABLE,
      operation: productIdForUpdate ? 'UPDATE' : 'INSERT',
      id: productIdForUpdate || null,
    });
    console.log('[Rubens Admin Supabase] Payload enviado', payload);

    if (productIdForUpdate) {
      console.log('Modo edición');
      console.log('EDITANDO PRODUCTO ID:', productIdForUpdate);
      console.log('HACIENDO UPDATE, NO INSERT');
      console.log('Payload update', payload);
      logSupabase('UPDATE payload', {
        table: SUPABASE_PRODUCTS_TABLE,
        id: productIdForUpdate,
        payload,
      });
      try {
        const data = await supabaseRestRequest(`${SUPABASE_PRODUCTS_TABLE}?id=eq.${encodeURIComponent(productIdForUpdate)}&select=*`, {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify(payload),
        });
        const row = Array.isArray(data) ? data[0] : data;
        console.log('UPDATE RESPONSE:', data, null);
        if (!row?.id) throw new Error('No se encontro el producto para actualizar en Supabase.');
        logSupabase('UPDATE success', { id: row?.id, row });
        return productFromSupabaseRow(row);
      } catch (error) {
        console.log('UPDATE RESPONSE:', null, error);
        throw error;
      }
    }

    const existingProducts = await loadProductsFromSupabase();
    const duplicate = existingProducts.find((item) => duplicateProductKey(item) === duplicateProductKey(normalizedProduct));
    if (duplicate?.id) {
      logSupabase('UPDATE por duplicado nombre/marca/categoria', {
        table: SUPABASE_PRODUCTS_TABLE,
        id: duplicate.id,
        payload,
      });
      const data = await supabaseRestRequest(`${SUPABASE_PRODUCTS_TABLE}?id=eq.${encodeURIComponent(duplicate.id)}&select=*`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(payload),
      });
      const row = Array.isArray(data) ? data[0] : data;
      logSupabase('UPDATE duplicate success', { id: row?.id, row });
      return productFromSupabaseRow(row);
    }

    console.log('HACIENDO INSERT NUEVO');
    logSupabase('INSERT payload', {
      table: SUPABASE_PRODUCTS_TABLE,
      payload,
    });
    const data = await supabaseRestRequest(`${SUPABASE_PRODUCTS_TABLE}?select=*`, {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(payload),
    });
    const row = Array.isArray(data) ? data[0] : data;
    logSupabase('INSERT success', { id: row?.id, row });
    return productFromSupabaseRow(row);
  };

  const updateProductBooleanInSupabase = async (productId, field, value) => {
    const allowedFields = ['destacado', 'promocion'];
    if (!allowedFields.includes(field)) {
      throw new Error(`Campo booleano no permitido: ${field}`);
    }
    const data = await supabaseRestRequest(`${SUPABASE_PRODUCTS_TABLE}?id=eq.${encodeURIComponent(productId)}&select=*`, {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ [field]: Boolean(value) }),
    });
    const row = Array.isArray(data) ? data[0] : data;
    if (!row?.id) throw new Error('No se encontro el producto para actualizar en Supabase.');
    const updatedProduct = productFromSupabaseRow(row);
    console.log('Producto actualizado:', updatedProduct);
    return updatedProduct;
  };

  const reloadAllAdminProductsAfterChange = async () => {
    const loadedProducts = await loadProductsFromSupabase();
    products = adminStore.saveProducts(loadedProducts);
    console.log('Productos cargados en admin después del cambio:', products);
    return products;
  };

  const deleteProductFromSupabase = async (product) => {
    getSupabaseClient();
    if (!product.id || product.source !== 'supabase') {
      logSupabase('DELETE omitido: producto local sin id remoto', { product });
      return;
    }
    logSupabase('DELETE payload', {
      table: SUPABASE_PRODUCTS_TABLE,
      id: product.id,
    });
    console.log('[Rubens Admin Supabase] Payload enviado', {
      id: product.id,
      table: SUPABASE_PRODUCTS_TABLE,
      operation: 'DELETE',
    });
    await supabaseRestRequest(`${SUPABASE_PRODUCTS_TABLE}?id=eq.${encodeURIComponent(product.id)}`, {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' },
    });
    logSupabase('DELETE success', { id: product.id });
  };

  const loadProductsWithFallback = async () => {
    try {
      const remoteProducts = await loadProductsFromSupabase();
      supabaseEnabled = true;
      products = adminStore.saveProducts(remoteProducts);
      setStatus(elements.productStatus, 'Productos cargados desde Supabase.');
    } catch (error) {
      logSupabaseError('SELECT fallback a localStorage', error, { table: SUPABASE_PRODUCTS_TABLE });
      supabaseEnabled = false;
      products = adminStore.loadProducts();
      setStatus(elements.productStatus, 'Supabase no disponible. Usando localStorage temporal.', true);
    }
    renderAll();
  };

  const orderFromSupabaseRow = (row) => ({
    id: String(row.id),
    customer: String(row.cliente_nombre || ''),
    phone: String(row.cliente_telefono || ''),
    email: String(row.cliente_correo || ''),
    address: String(row.direccion || ''),
    delivery: String(row.tipo_entrega || ''),
    payment: String(row.metodo_pago || ''),
    products: Array.isArray(row.productos) ? row.productos : [],
    total: Number(row.total) || 0,
    status: String(row.estado || 'Nuevo'),
    notes: String(row.notas || ''),
    createdAt: row.created_at || '',
  });

  const loadOrdersFromSupabase = async () => {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase no disponible.');
    const { data, error } = await client
      .from(SUPABASE_ORDERS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(orderFromSupabaseRow);
  };

  const loadOrders = async () => {
    setStatus(elements.ordersStatus, 'Cargando pedidos...', false, false);
    try {
      orders = await loadOrdersFromSupabase();
      setStatus(elements.ordersStatus, '', false);
    } catch (error) {
      orders = [];
      setStatus(elements.ordersStatus, `No se pudieron cargar los pedidos: ${getSupabaseErrorMessage(error)}`, true, false);
    }
    renderDashboard();
    renderOrders();
  };

  const updateOrderStatus = async (id, status) => {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase no disponible.');
    const { error } = await client
      .from(SUPABASE_ORDERS_TABLE)
      .update({ estado: status })
      .eq('id', id);
    if (error) throw error;
  };

  const persistProductsFallback = () => {
    products = adminStore.saveProducts(products);
  };

  const setStatus = (element, message, isError = false, autoClear = true) => {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('error', isError);
    if (message && autoClear) {
      window.setTimeout(() => {
        if (element.textContent === message) element.textContent = '';
      }, 3000);
    }
  };

  const isAuthorizedAdminEmail = (email) => String(email || '').trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL;

  // Iniciar sesión con Google mediante Supabase Auth OAuth.
  const signInWithGoogle = async () => {
    if (isLocalAdminEnvironment()) {
      showApp();
      return;
    }
    const client = getSupabaseClient();
    if (!client) {
      setStatus(elements.loginStatus, 'No se pudo iniciar Supabase Auth.', true, false);
      return;
    }
    const redirectTo = getAdminAuthRedirectTo();
    elements.googleLoginButton.disabled = true;
    setStatus(elements.loginStatus, 'Abriendo Google...', false, false);
    console.log('Iniciando login con Google');
    console.log('Redirect OAuth admin:', redirectTo);
    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });
      if (error) {
        console.error('Error al iniciar login con Google', error);
        elements.googleLoginButton.disabled = false;
        setStatus(elements.loginStatus, `Error al iniciar sesion: ${getSupabaseErrorMessage(error)}`, true, false);
      }
    } catch (error) {
      console.error('Error inesperado al iniciar login con Google', error);
      elements.googleLoginButton.disabled = false;
      setStatus(elements.loginStatus, `Error al iniciar sesion: ${getSupabaseErrorMessage(error)}`, true, false);
    }
  };

  // Cerrar sesión en Supabase Auth y mantener oculto el dashboard.
  const signOutAdmin = async (message = '') => {
    const client = getSupabaseClient();
    pendingSignedOutMessage = message;
    if (client) await client.auth.signOut();
    showLogin(message);
  };

  // Validar correo autorizado antes de permitir acceso al panel.
  const validateAdminSession = async (session) => {
    const email = session?.user?.email || '';
    if (!session?.user) {
      showLogin();
      return false;
    }
    if (!isAuthorizedAdminEmail(email)) {
      console.error('Acceso denegado al panel admin para el correo:', email);
      await signOutAdmin('No tienes permisos para acceder al panel administrativo.');
      return false;
    }
    showApp();
    return true;
  };

  // Obtener sesión actual al abrir admin.html y proteger el dashboard.
  const initializeAdminAuth = async () => {
    if (isLocalAdminEnvironment()) {
      showApp();
      return;
    }
    const client = getSupabaseClient();
    if (!client) {
      showLogin('No se pudo cargar Supabase Auth.');
      return;
    }
    elements.adminApp?.classList.add('hidden');
    elements.loginScreen?.classList.remove('hidden');
    setStatus(elements.loginStatus, 'Validando sesion...', false, false);
    const { data, error } = await client.auth.getSession();
    if (error) {
      console.error('Error al obtener sesion actual de Supabase Auth', error);
      showLogin(`Error al validar sesion: ${getSupabaseErrorMessage(error)}`);
      return;
    }
    setStatus(elements.loginStatus, '', false);
    await validateAdminSession(data.session);
  };

  const getProductImageSource = (product) => product.imageData || product.image || '';

  const getProductImageLabel = (product) => {
    if (product.imageName) return product.imageName;
    if (getProductImageSource(product)) return 'Imagen cargada';
    return 'Sin imagen';
  };

  const productThumbMarkup = (product) => {
    const source = getProductImageSource(product);
    return source
      ? `<span class="product-thumb"><img src="${escapeHtml(source)}" alt="${escapeHtml(product.name)}"></span>`
      : '<span class="product-thumb-placeholder">Sin imagen</span>';
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
    currentEditingProductSource = '';
    editingProductId = null;
    if (productFields.imageFile) productFields.imageFile.value = '';
    updateProductImagePreview('', '');
  };

  const waitForCatalogCards = (iframe) => new Promise((resolve) => {
    let attempts = 0;
    const check = () => {
      attempts += 1;
      const doc = iframe.contentDocument;
      const cards = doc ? Array.from(doc.querySelectorAll('.product-card')) : [];
      if (cards.length || attempts > 80) {
        resolve(cards);
        return;
      }
      window.setTimeout(check, 100);
    };
    check();
  });

  const readCatalogProductsFromIframe = async () => {
    const iframe = document.createElement('iframe');
    iframe.src = 'productos.html?catalogoLocal=1';
    iframe.title = 'Catalogo temporal para admin';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.position = 'fixed';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.left = '-9999px';
    document.body.appendChild(iframe);

    try {
      await new Promise((resolve, reject) => {
        iframe.onload = resolve;
        iframe.onerror = reject;
      });
      const cards = await waitForCatalogCards(iframe);
      return cards.map((card) => {
        const sizeButtons = Array.from(card.querySelectorAll('.size-option'));
        const sizeText = sizeButtons.length
          ? sizeButtons.map((button) => `${button.textContent.trim()}: ${formatCurrency(button.dataset.price)}`).join('\n')
          : (card.querySelector('.product-volume')?.textContent || '').replace(/^Contenido:\s*/i, '').trim();
        const priceText = card.querySelector('.product-price')?.textContent || '';
        const imageEl = card.querySelector('.product-image img');
        return normalizeProduct({
          id: card.dataset.productId || undefined,
          name: card.querySelector('h3')?.textContent || '',
          brand: '',
          category: card.querySelector('.product-tag')?.textContent || '',
          subcategory: card.querySelector('.product-subtag')?.textContent || '',
          description: card.querySelector('h3 + p')?.textContent || '',
          sizes: sizeText || 'Presentacion unica',
          price: sizeButtons.length
            ? Math.min(...sizeButtons.map((button) => Number(button.dataset.price) || 0).filter(Boolean))
            : parseCurrencyValue(priceText),
          image: imageEl?.getAttribute('src') || '',
          active: true,
          featured: false,
          promo: false,
          source: 'catalog',
        });
      }).filter((product) => product.name);
    } catch (error) {
      return [];
    } finally {
      iframe.remove();
    }
  };

  const seedProductsFromCatalogIfNeeded = async () => {
    if (products.length > 0) return;
    await syncProductsFromCatalog();
  };

  const syncProductsFromCatalog = async () => {
    setStatus(elements.productStatus, 'Importando catalogo actual...');
    const catalogProducts = await readCatalogProductsFromIframe();
    console.log('productos recibidos desde catálogo local', catalogProducts);
    console.log('productos sin imagen detectados', catalogProducts.filter((product) => !getProductImageSource(product)));
    if (!catalogProducts.length) {
      setStatus(elements.productStatus, 'No se pudo importar el catalogo actual.', true);
      return;
    }
    let previousProducts = products;
    if (supabaseEnabled) {
      try {
        previousProducts = adminStore.saveProducts(await loadProductsFromSupabase()).concat(
          products.filter((product) => product.source !== 'supabase')
        );
      } catch (error) {
        logSupabaseError('No se pudo precargar Supabase antes de sincronizar catalogo', error);
      }
    }
    const mergedProducts = mergeProductsWithoutDuplicates(previousProducts, catalogProducts);
    const importedCount = mergedProducts.length - previousProducts.length;
    products = mergedProducts;
    persistProductsFallback();
    if (supabaseEnabled) {
      try {
        for (const catalogProduct of catalogProducts) {
          const existing = previousProducts.find((item) => productCatalogKey(item) === productCatalogKey(catalogProduct));
          await saveProductToSupabase({
            ...catalogProduct,
            id: existing?.source === 'supabase' ? existing.id : '',
            source: existing?.source || catalogProduct.source,
          }, existing?.source === 'supabase' ? existing.id : '');
        }
        products = adminStore.saveProducts(await loadProductsFromSupabase());
        console.log('resultado de sincronizar catálogo', {
          revisados: catalogProducts.length,
          nuevos: Math.max(importedCount, 0),
          totalSupabase: products.length,
        });
        setStatus(elements.productStatus, `Catalogo sincronizado: ${catalogProducts.length} productos revisados, ${Math.max(importedCount, 0)} nuevos.`);
      } catch (error) {
        logSupabaseError('Sincronizar catalogo fallback a localStorage', error);
        supabaseEnabled = false;
        setStatus(elements.productStatus, `Catalogo importado localmente. Error Supabase: ${getSupabaseErrorMessage(error)}`, true);
      }
    } else {
      setStatus(elements.productStatus, `Catalogo actual importado: ${importedCount} productos.`);
      console.log('resultado de sincronizar catálogo', {
        revisados: catalogProducts.length,
        nuevos: Math.max(importedCount, 0),
        totalLocal: products.length,
      });
    }
    renderAll();
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
      'En preparación': 'pending',
      Enviado: 'paid',
      Entregado: 'delivered',
      Cancelado: 'cancelled',
    };
    return `<span class="pill ${classMap[status] || ''}">${escapeHtml(status)}</span>`;
  };

  // Proteger dashboard: solo se muestra despues de validar el correo autorizado.
  const showApp = () => {
    elements.loginScreen?.classList.add('hidden');
    elements.adminApp?.classList.remove('hidden');
    renderAll();
    loadProductsWithFallback().then(() => seedProductsFromCatalogIfNeeded());
    loadOrders();
  };

  const showLogin = (message = '') => {
    elements.adminApp?.classList.add('hidden');
    elements.loginScreen?.classList.remove('hidden');
    if (elements.googleLoginButton) {
      elements.googleLoginButton.disabled = false;
      elements.googleLoginButton.focus();
    }
    setStatus(elements.loginStatus, message, Boolean(message), !message);
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
    $('#stat-orders').textContent = String(orders.length);
    $('#stat-whatsapp').textContent = String(metrics.whatsappClicks);
    $('#stat-visits').textContent = String(metrics.visitsToday);
    $('#stat-featured').textContent = String(featuredProducts);

    const activeBanners = banners.filter((banner) => banner.active).length;
    $('#dashboard-summary').innerHTML = [
      `Productos guardados en admin: ${products.length}`,
      `Banners activos: ${activeBanners}`,
      `Pedidos pendientes de revision: ${orders.filter((order) => order.status === 'Nuevo' || order.status === 'Pendiente').length}`,
      `Configuracion cargada para WhatsApp: ${settings.whatsapp || 'Sin definir'}`,
    ].map((text) => `<div class="activity-item">${escapeHtml(text)}</div>`).join('');

    const recent = products.slice(0, 4);
    $('#recent-products').innerHTML = recent.length
      ? recent.map((product) => `<div class="compact-item"><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.category)} / ${escapeHtml(product.subcategory)}</small></div>`).join('')
      : '<div class="compact-item muted">Aun no hay productos agregados en el admin.</div>';
  };

  const renderProducts = () => {
    const visible = getFilteredProducts();
    console.log('productos después de filtros', visible);
    console.log('productos sin imagen detectados', visible.filter((product) => !getProductImageSource(product)));
    const rows = visible.map((product) => `
      <tr>
        <td>
          <div class="product-cell">
            ${productThumbMarkup(product)}
            <div>
              <strong>${escapeHtml(product.name)}</strong>
              <small>${escapeHtml(product.brand || 'Sin marca')} / ${escapeHtml(getProductImageLabel(product))}</small>
            </div>
          </div>
        </td>
        <td>${escapeHtml(product.category)}<br><small>${escapeHtml(product.subcategory)}</small></td>
        <td>${escapeHtml(product.sizes)}</td>
        <td>${product.price ? formatCurrency(product.price) : '<span class="muted">Sin precio</span>'}</td>
        <td>${statusPills(product)}</td>
        <td>
          <div class="row-actions">
            <button class="action-button action-primary" type="button" data-product-action="edit" data-id="${escapeHtml(product.id)}">Editar</button>
            <button class="action-button action-status" type="button" data-product-action="toggle-active" data-id="${escapeHtml(product.id)}">${product.active ? 'Desactivar' : 'Activar'}</button>
            <button class="action-button action-featured" type="button" data-product-action="toggle-featured" data-id="${escapeHtml(product.id)}">Destacado</button>
            <button class="action-button action-promo" type="button" data-product-action="toggle-promo" data-id="${escapeHtml(product.id)}">Promo</button>
            <button class="action-button action-danger" type="button" data-product-action="delete" data-id="${escapeHtml(product.id)}">Eliminar</button>
          </div>
        </td>
      </tr>
    `).join('');

    const cards = visible.map((product) => `
      <article class="mobile-card product-card">
        <div class="product-card-head">
          <div class="product-cell">
            ${productThumbMarkup(product)}
            <div>
              <small>${escapeHtml(product.brand || 'Sin marca')}</small>
              <strong>${escapeHtml(product.name)}</strong>
            </div>
          </div>
          <div class="product-card-status">${statusPills(product)}</div>
        </div>
        <div class="product-card-meta">
          <span><b>Categoria</b>${escapeHtml(product.category || 'Sin categoria')}</span>
          <span><b>Subcategoria</b>${escapeHtml(product.subcategory || 'Sin subcategoria')}</span>
          <span><b>Precio base</b>${product.price ? formatCurrency(product.price) : 'Sin precio'}</span>
        </div>
        <div class="product-card-section">
          <b>Tamanos y precios</b>
          <p>${escapeHtml(product.sizes || 'Sin tamanos registrados')}</p>
        </div>
        <p class="product-card-image-name">${escapeHtml(getProductImageLabel(product))}</p>
        <div class="product-card-actions row-actions">
          <button class="action-button action-primary" type="button" data-product-action="edit" data-id="${escapeHtml(product.id)}">Editar</button>
          <button class="action-button action-status" type="button" data-product-action="toggle-active" data-id="${escapeHtml(product.id)}">${product.active ? 'Desactivar' : 'Activar'}</button>
          <button class="action-button action-featured" type="button" data-product-action="toggle-featured" data-id="${escapeHtml(product.id)}">Destacado</button>
          <button class="action-button action-promo" type="button" data-product-action="toggle-promo" data-id="${escapeHtml(product.id)}">Promo</button>
          <button class="action-button action-danger" type="button" data-product-action="delete" data-id="${escapeHtml(product.id)}">Eliminar</button>
        </div>
      </article>
    `).join('');

    if (elements.productTable) elements.productTable.innerHTML = rows;
    if (elements.productMobile) elements.productMobile.innerHTML = cards;
    elements.productEmpty?.classList.toggle('hidden', visible.length > 0);
  };

  const ensureCategoryOption = (category) => {
    if (!category || !productFields.category) return;
    const exists = Array.from(productFields.category.options).some((option) => option.value === category);
    if (exists) return;
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    productFields.category.appendChild(option);
  };

  const renderOrders = () => {
    const statuses = ['Nuevo', 'Pendiente', 'Pagado', 'En preparación', 'Enviado', 'Entregado', 'Cancelado'];
    const formatDate = (value) => value
      ? new Intl.DateTimeFormat('es-MX', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
      : 'Sin fecha';
    const formatOrderProducts = (products) => products.map((product) => (
      `${product.quantity || 1} x ${product.name || 'Producto'}`
    )).join(', ');
    const whatsappPhone = (value) => {
      const digits = String(value || '').replace(/\D/g, '');
      return digits.length === 10 ? `52${digits}` : digits;
    };
    const statusSelect = (order) => `
      <select class="order-status-select" data-order-id="${escapeHtml(order.id)}" aria-label="Estado del pedido ${escapeHtml(order.id)}">
        ${statuses.map((status) => `<option value="${escapeHtml(status)}" ${order.status === status ? 'selected' : ''}>${escapeHtml(status)}</option>`).join('')}
      </select>
    `;
    const rows = orders.map((order) => {
      const message = encodeURIComponent(`Hola, te contactamos de Rubens Distribuidora para confirmar tu pedido #${order.id}.`);
      const phone = whatsappPhone(order.phone);
      const whatsAppUrl = `https://wa.me/${phone}?text=${message}`;
      return `
        <tr>
          <td><strong>#${escapeHtml(order.id)}</strong></td>
          <td>${escapeHtml(formatDate(order.createdAt))}</td>
          <td>${escapeHtml(order.customer)}</td>
          <td>${escapeHtml(order.phone)}</td>
          <td><a href="mailto:${escapeHtml(order.email)}">${escapeHtml(order.email)}</a></td>
          <td>${escapeHtml(formatOrderProducts(order.products))}</td>
          <td>${formatCurrency(order.total)}</td>
          <td>${escapeHtml(order.payment)}</td>
          <td>${statusSelect(order)}</td>
          <td><a class="whatsapp-button" href="${whatsAppUrl}" target="_blank" rel="noopener">Contactar cliente</a></td>
        </tr>
      `;
    }).join('');

    const cards = orders.map((order) => {
      const message = encodeURIComponent(`Hola, te contactamos de Rubens Distribuidora para confirmar tu pedido #${order.id}.`);
      const phone = whatsappPhone(order.phone);
      return `
        <article class="mobile-card">
          <strong>#${escapeHtml(order.id)} / ${escapeHtml(order.customer)}</strong>
          <small>${escapeHtml(formatDate(order.createdAt))} / ${escapeHtml(order.email)}</small>
          <small>${escapeHtml(formatOrderProducts(order.products))}</small>
          <p>${formatCurrency(order.total)} / ${escapeHtml(order.payment)}</p>
          <div>${orderPill(order.status)} ${statusSelect(order)}</div>
          <a class="whatsapp-button" href="https://wa.me/${phone}?text=${message}" target="_blank" rel="noopener">Contactar cliente</a>
        </article>
      `;
    }).join('');

    if (elements.ordersTable) elements.ordersTable.innerHTML = rows;
    if (elements.ordersMobile) elements.ordersMobile.innerHTML = cards;
    elements.ordersEmpty?.classList.toggle('hidden', orders.length > 0);
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

  const productFromForm = () => {
    const rawProduct = {
      id: editingProductId || '',
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
      source: currentEditingProductSource || 'admin',
      active: productFields.active.checked,
      featured: productFields.featured.checked,
      promo: productFields.promo.checked,
      updatedAt: new Date().toISOString(),
    };
    const normalized = normalizeProduct(rawProduct);
    if (!rawProduct.id) normalized.id = '';
    return normalized;
  };

  const fillProductForm = (product) => {
    editingProductId = product.id;
    console.log('Modo edición');
    console.log('EDITANDO PRODUCTO ID:', editingProductId);
    productFields.id.value = product.id;
    productFields.name.value = product.name;
    productFields.brand.value = product.brand;
    ensureCategoryOption(product.category);
    productFields.category.value = product.category;
    productFields.subcategory.value = product.subcategory;
    productFields.description.value = product.description;
    productFields.sizes.value = product.sizes;
    productFields.price.value = product.price || '';
    productFields.image.value = isDataImage(product.image) ? '' : product.image;
    currentProductImageData = product.imageData || '';
    currentProductImageName = product.imageName || '';
    currentEditingProductSource = product.source || '';
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

  elements.googleLoginButton?.addEventListener('click', () => {
    console.log('Click en Continuar con Google');
    signInWithGoogle();
  });

  elements.logoutButton?.addEventListener('click', () => {
    signOutAdmin();
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

  const guardarProducto = async () => {
    const product = productFromForm();
    const index = products.findIndex((item) => item.id === product.id);
    let savedToSupabase = false;

    try {
      const savedProduct = await saveProductToSupabase(product, editingProductId);
      savedToSupabase = true;
      supabaseEnabled = true;
      if (index >= 0) {
        products[index] = savedProduct;
        setStatus(elements.productStatus, 'Producto actualizado');
      } else {
        products.unshift(savedProduct);
        setStatus(elements.productStatus, 'Producto guardado en Supabase');
      }
      products = adminStore.saveProducts(await loadProductsFromSupabase());
      logSupabase('Reload despues de guardar/actualizar', { count: products.length });
    } catch (error) {
      if (savedToSupabase) {
        logSupabaseError('Reload despues de guardar/actualizar fallo; se conserva fila guardada', error, {
          product,
        });
        persistProductsFallback();
        resetProductForm();
        renderAll();
        return;
      }
      logSupabaseError('Guardar/actualizar fallback a localStorage', error, {
        product,
        payload: productToSupabaseRow(product),
      });
      supabaseEnabled = false;
      const exactError = getSupabaseErrorMessage(error);
      if (index >= 0) {
        products[index] = product;
        setStatus(elements.productStatus, `Error Supabase: ${exactError}. Producto actualizado en localStorage.`, true);
      } else {
        if (!product.id) product.id = createId('product');
        products.unshift(product);
        setStatus(elements.productStatus, `Error Supabase: ${exactError}. Producto guardado en localStorage.`, true);
      }
    }
    persistProductsFallback();
    resetProductForm();
    renderAll();
  };

  elements.productForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!elements.productForm.checkValidity()) {
      elements.productForm.reportValidity();
      return;
    }
    await guardarProducto();
  });

  elements.productForm?.addEventListener('reset', () => {
    window.setTimeout(() => resetProductForm(false), 0);
  });

  elements.cancelProductEdit?.addEventListener('click', () => resetProductForm());

  const handleProductAction = async (event) => {
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
      try {
        await deleteProductFromSupabase(product);
        supabaseEnabled = true;
        setStatus(elements.productStatus, 'Producto eliminado');
        products = adminStore.saveProducts(await loadProductsFromSupabase());
        logSupabase('Reload despues de eliminar', { count: products.length });
      } catch (error) {
        logSupabaseError('Eliminar fallback a localStorage', error, { product });
        supabaseEnabled = false;
        products = products.filter((item) => item.id !== product.id);
        persistProductsFallback();
        setStatus(elements.productStatus, `Error Supabase: ${getSupabaseErrorMessage(error)}. Producto eliminado de localStorage.`, true);
      }
      renderAll();
      return;
    }

    if (button.dataset.productAction === 'toggle-featured' || button.dataset.productAction === 'toggle-promo') {
      const isFeaturedToggle = button.dataset.productAction === 'toggle-featured';
      const field = isFeaturedToggle ? 'destacado' : 'promocion';
      const productField = isFeaturedToggle ? 'featured' : 'promo';
      const nextValue = !product[productField];

      if (isFeaturedToggle) {
        console.log('Toggle destacado ID:', product.id);
      } else {
        console.log('Toggle promo ID:', product.id);
      }

      try {
        const updatedProduct = await updateProductBooleanInSupabase(product.id, field, nextValue);
        const index = products.findIndex((item) => item.id === product.id);
        if (index >= 0) products[index] = updatedProduct;
        supabaseEnabled = true;
        setStatus(elements.productStatus, 'Producto actualizado');
        await reloadAllAdminProductsAfterChange();
      } catch (error) {
        logSupabaseError('Cambiar promo/destacado fallback a localStorage', error, {
          id: product.id,
          field,
          value: nextValue,
        });
        supabaseEnabled = false;
        product[productField] = nextValue;
        persistProductsFallback();
        console.log('Producto actualizado:', product);
        console.log('Productos cargados en admin después del cambio:', products);
        setStatus(elements.productStatus, `Error Supabase: ${getSupabaseErrorMessage(error)}. Producto actualizado en localStorage.`, true);
      }
      persistProductsFallback();
      renderAll();
      return;
    }

    if (button.dataset.productAction === 'toggle-active') product.active = !product.active;

    try {
      const savedProduct = await saveProductToSupabase(product, product.id);
      const index = products.findIndex((item) => item.id === product.id);
      if (index >= 0) products[index] = savedProduct;
      supabaseEnabled = true;
      setStatus(elements.productStatus, 'Producto actualizado');
      products = adminStore.saveProducts(await loadProductsFromSupabase());
      logSupabase('Reload despues de cambiar estado', { count: products.length });
    } catch (error) {
      logSupabaseError('Cambiar estado fallback a localStorage', error, {
        product,
        payload: productToSupabaseRow(product),
      });
      supabaseEnabled = false;
      persistProductsFallback();
      setStatus(elements.productStatus, `Error Supabase: ${getSupabaseErrorMessage(error)}. Producto actualizado en localStorage.`, true);
    }
    persistProductsFallback();
    renderAll();
  };

  elements.productTable?.addEventListener('click', handleProductAction);
  elements.productMobile?.addEventListener('click', handleProductAction);

  const handleOrderStatusChange = async (event) => {
    const select = event.target.closest('.order-status-select');
    if (!select) return;
    select.disabled = true;
    setStatus(elements.ordersStatus, 'Actualizando estado...', false, false);
    try {
      await updateOrderStatus(select.dataset.orderId, select.value);
      const order = orders.find((item) => item.id === select.dataset.orderId);
      if (order) order.status = select.value;
      setStatus(elements.ordersStatus, 'Estado actualizado.');
      renderDashboard();
      renderOrders();
    } catch (error) {
      setStatus(elements.ordersStatus, `No se pudo actualizar el estado: ${getSupabaseErrorMessage(error)}`, true, false);
      await loadOrders();
    }
  };

  elements.ordersTable?.addEventListener('change', handleOrderStatusChange);
  elements.ordersMobile?.addEventListener('change', handleOrderStatusChange);
  elements.refreshOrders?.addEventListener('click', loadOrders);

  elements.productSearch?.addEventListener('input', () => {
    productQuery = elements.productSearch.value;
    renderProducts();
  });

  elements.syncCatalogProducts?.addEventListener('click', () => {
    syncProductsFromCatalog();
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

  const authClient = getSupabaseClient();
  authClient?.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      validateAdminSession(session);
    }
    if (event === 'SIGNED_OUT') {
      showLogin(pendingSignedOutMessage);
      pendingSignedOutMessage = '';
    }
  });
  initializeAdminAuth();
}());
