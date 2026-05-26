// Script ligero para Ruben's Distribuidora

const MERCADO_PAGO_CHECKOUT_URL = window.MERCADO_PAGO_CHECKOUT_URL || "";
const MERCADO_PAGO_PUBLIC_KEY_TEST = "APP_USR-1d421fc6-735f-4f5b-ac51-a5912edb29de";
const MERCADO_PAGO_PREFERENCE_ID_TEST = window.MERCADO_PAGO_PREFERENCE_ID || "PEGAR_AQUI_EL_PREFERENCE_ID_DE_PRUEBA";

const loadMercadoPagoSdkGlobal = () => new Promise((resolve, reject) => {
  if (window.MercadoPago) {
    resolve(window.MercadoPago);
    return;
  }

  const existingScript = document.querySelector('script[src="https://sdk.mercadopago.com/js/v2"]');
  if (existingScript) {
    existingScript.addEventListener('load', () => resolve(window.MercadoPago), { once: true });
    existingScript.addEventListener('error', () => reject(new Error('No se pudo cargar Mercado Pago.')), { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = 'https://sdk.mercadopago.com/js/v2';
  script.onload = () => resolve(window.MercadoPago);
  script.onerror = () => reject(new Error('No se pudo cargar Mercado Pago.'));
  document.head.appendChild(script);
});

async function abrirMercadoPago() {
  const preferenceId = MERCADO_PAGO_PREFERENCE_ID_TEST;
  const hasPreferenceId = preferenceId && preferenceId !== "PEGAR_AQUI_EL_PREFERENCE_ID_DE_PRUEBA";

  if (!hasPreferenceId) {
    alert("Mercado Pago de prueba aún no configurado");
    return false;
  }

  try {
    const MercadoPagoSdk = await loadMercadoPagoSdkGlobal();
    const mp = new MercadoPagoSdk(MERCADO_PAGO_PUBLIC_KEY_TEST, {
      locale: "es-MX",
    });

    mp.checkout({
      preference: {
        id: preferenceId,
      },
      autoOpen: true,
    });
    return true;
  } catch (error) {
    if (MERCADO_PAGO_CHECKOUT_URL) {
      window.open(MERCADO_PAGO_CHECKOUT_URL, "_blank");
      return true;
    }
    alert("Mercado Pago de prueba aún no configurado");
    return false;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((element) => observer.observe(element));

  const navLinks = document.querySelectorAll('.main-nav a');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const closeMobileMenu = () => {
    if (!mobileMenuToggle || !mainNav) return;
    mobileMenuToggle.classList.remove('is-open');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
  };

  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      mobileMenuToggle.classList.toggle('is-open', isOpen);
      mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) {
        closeMobileMenu();
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
      closeMobileMenu();
    });
  });

  const categoryFilter = document.getElementById('category-filter');
  const subcategoryFilter = document.getElementById('subcategory-filter');
  const productSearch = document.getElementById('product-search');
  const sortOrderSelect = document.getElementById('sort-order');
  let selectedCategory = 'all';

  const categoryItems = document.querySelectorAll('.category-item');
  const allCategoryButton = document.querySelector('.category-item[data-category="all"]');
  const categoryList = document.getElementById('category-list');
  const toggleFiltersButton = document.getElementById('toggle-filters');
  const filterControls = document.getElementById('filter-controls');
  const productGeneralListEl = document.getElementById('product-general-list');
  const productPopularListEl = document.getElementById('product-popular-list');
  const productRecommendedListEl = document.getElementById('product-recommended-list');
  const productCountEl = document.getElementById('product-count');
  const cartCountEl = document.getElementById('cart-count');
  const viewCartButton = document.getElementById('view-cart');
  const cartModal = document.getElementById('cart-modal');
  const closeCartModal = document.getElementById('close-cart-modal');
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartTotalBreakdownEl = document.getElementById('cart-total-breakdown');
  const checkoutButton = document.getElementById('checkout');
  const cartDeliverySummaryEl = document.getElementById('cart-delivery-summary');
  const pickupOptionButton = document.getElementById('pickup-option');
  const deliveryOptionsButton = document.getElementById('delivery-options-button');
  const detailModal = document.getElementById('detail-modal');
  const closeDetailModal = document.getElementById('close-detail-modal');
  const detailModalTitle = document.getElementById('detail-modal-title');
  const detailModalBody = document.getElementById('detail-modal-body');
  const deliveryModal = document.getElementById('delivery-modal');
  const closeDeliveryModal = document.getElementById('close-delivery-modal');
  const deliveryPostalRow = document.getElementById('delivery-postal-row');
  const deliveryPostalInput = document.getElementById('delivery-postal');
  const deliveryFlashRow = document.getElementById('delivery-flash-row');
  const deliveryFlashCheckbox = document.getElementById('delivery-flash');
  const deliveryResult = document.getElementById('delivery-result');
  const saveDeliverySelectionButton = document.getElementById('save-delivery-selection');
  const acceptDeliverySelectionButton = document.getElementById('accept-delivery-selection');
  const paymentModal = document.getElementById('payment-modal');
  const closePaymentModal = document.getElementById('close-payment-modal');
  const paymentSummaryEl = document.getElementById('payment-summary');
  const paymentCustomerNameInput = document.getElementById('payment-customer-name');
  const paymentCustomerPhoneInput = document.getElementById('payment-customer-phone');
  const paymentCustomerEmailInput = document.getElementById('payment-customer-email');
  const paymentCustomerAddressInput = document.getElementById('payment-customer-address');
  const paymentFormStatusEl = document.getElementById('payment-form-status');
  const paymentMethodButtons = document.querySelectorAll('.payment-method-button');
  const cashPaymentOption = document.getElementById('cash-payment-option');
  const paymentTransferPanel = document.getElementById('payment-transfer-panel');
  const paymentMercadoPanel = document.getElementById('payment-mercado-panel');
  const paymentCashPanel = document.getElementById('payment-cash-panel');
  const paymentBankInput = document.getElementById('payment-bank');
  const paymentBeneficiaryInput = document.getElementById('payment-beneficiary');
  const paymentAccountInput = document.getElementById('payment-account');
  const paymentClabeInput = document.getElementById('payment-clabe');
  const paymentConceptInput = document.getElementById('payment-concept');
  const sendTransferWhatsappButton = document.getElementById('send-transfer-whatsapp');
  const speiCopyButtons = document.querySelectorAll('.spei-copy-button');
  const speiCopyStatus = document.getElementById('spei-copy-status');
  const payInStoreWhatsappButton = document.getElementById('pay-in-store-whatsapp');
  const orderEmailStatusEl = document.getElementById('order-email-status');
  const mercadoPagoButton = document.getElementById('mercadoPagoBtn');
  const mercadoWhatsappFallbackButton = document.getElementById('mercado-whatsapp-fallback');
  const rainSeasonBanner = document.getElementById('temporada-lluvias');
  const closeRainBannerButtons = document.querySelectorAll('[data-close-rain-banner]');

  const categoryLabels = {
    vinilica: 'Pintura Vinílica',
    esmalte: 'Pintura de Esmalte',
    epoxica: 'Impermeabilizante',
    aerosoles: 'Aerosoles',
    madera: 'Productos para Madera',
    aplicadores: 'Aplicadores',
    selladores: 'Selladores y Adhesivos',
    diluyentes: 'Diluyentes',
    primerarios: 'Primarios',
  };

  const subcategories = {
    vinilica: ['Sayer', 'Económica', 'Media', 'Mediana-Alta', 'Alta', 'Texturizados'],
    esmalte: ['Base Agua', 'Base Solvente', 'Esmalte Industrial'],
    epoxica: ['Fester', 'Acrílico', 'Membranas', 'Complementos', 'Pisos', 'Industrial', 'Alto Tráfico'],
    aerosoles: ['Normal', 'Metálico', 'Neón', 'Alta Temperatura'],
    madera: ['Tintas', 'Barniz Marino', 'Barnices entintados', 'Barnices base agua', 'Barnices base esmalte', 'Lacas', 'Nitrocelulosas', 'Selladores', 'Primer para Madera', 'Poliuretanos', 'Polyform', 'Protectores para Madera', 'Removedores y Preparación', 'Resanadores', 'Aditivos'],
    aplicadores: ['Brochas', 'Brochas para Madera', 'Cintas', 'Cintas Especializadas', 'Espátulas', 'Rodillos', 'Repuestos para Rodillo'],
    selladores: ['Selladores Elásticos'],
    diluyentes: ['Alberca y Tráfico'],
    primerarios: ['Primarios'],
  }; 

  const counts = {
    vinilica: 100,
    esmalte: 100,
    aerosoles: 60,
  };

  const prices = {
    vinilica: 420,
    esmalte: 520,
    aerosoles: 140,
  };

  let products = [];
  let filteredProducts = [];
  let cart = [];

  const deliveryState = {
    type: 'pickup',
    postalCode: '',
    sameDay: false,
    flash: false,
    fastDelivery: false,
    baseFee: 0,
    fastFee: 0,
    fee: 0,
    distanceKm: 0,
    durationText: '',
    deliveryWindow: '',
    pickupConfirmed: false,
    note: 'Recoger en tienda',
  };
  const GOOGLE_MAPS_API_KEY = window.GOOGLE_MAPS_API_KEY || '';
  const storeAddress = 'Rubens Distribuidora, Av. Azcapotzalco 756, Col. Los Reyes, CDMX, C.P. 02010, México';
  const deliveryCoverageKm = 15;
  const scheduledDeliveryLimitKm = 25;
  const paidDeliveryFee = 200;
  const fastDeliveryExtraFee = 150;
  const paymentWhatsappNumber = '525510022372';
  const mercadoPagoPublicKey = window.MERCADO_PAGO_PUBLIC_KEY || 'APP_USR-1d421fc6-735f-4f5b-ac51-a5912edb29de';
  const mercadoPagoPreferenceId = window.MERCADO_PAGO_PREFERENCE_ID || '';
  const mercadoPagoLink = MERCADO_PAGO_CHECKOUT_URL || window.MERCADO_PAGO_LINK || '';
  const mercadoPagoPendingOrderKey = 'rubensMercadoPagoPendingOrder';
  const orderEmailConfig = {
    provider: 'none',
    formspreeEndpoint: '',
    emailjsPublicKey: '',
    emailjsServiceId: '',
    emailjsCustomerTemplateId: '',
    emailjsStoreTemplateId: '',
    storeEmail: 'ventas@rubensdistribuidora.com',
    ...(window.ORDER_EMAIL_CONFIG || {}),
  };
  let latestDeliveryEstimate = null;
  const deliveryDebugEnabled = Boolean(window.DEBUG_DELIVERY);
  const debugDelivery = (...args) => {
    if (deliveryDebugEnabled) {
      console.log('[delivery-debug]', ...args);
    }
  };

  if (rainSeasonBanner) {
    rainSeasonBanner.classList.remove('is-hidden');
    document.body.classList.add('rain-popup-open');
  }

  const closeRainBanner = () => {
    if (!rainSeasonBanner) return;
    rainSeasonBanner.classList.add('is-hidden');
    document.body.classList.remove('rain-popup-open');
  };

  closeRainBannerButtons.forEach((button) => {
    button.addEventListener('click', closeRainBanner);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeRainBanner();
    }
  });

  const savedCart = localStorage.getItem('rubensCart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (error) {
      cart = [];
    }
  }

  const formatCurrency = (value) => `MXN ${Number(value || 0).toFixed(2)}`;
  const formatDeliveryFee = (value) => Number(value || 0) === 0 ? 'GRATIS' : formatCurrency(value);
  const getShippingSummaryRows = () => {
    if (deliveryState.type !== 'delivery') {
      return [{ label: 'Pick Up', value: 'Sin costo' }];
    }
    if (deliveryState.baseFee === 0 && deliveryState.fee === 0) {
      return [{ label: 'Envío', value: 'GRATIS', free: true }];
    }
    const rows = [{
      label: deliveryState.distanceKm > deliveryCoverageKm ? 'Envío fuera de zona gratis' : 'Envío',
      value: formatCurrency(deliveryState.baseFee || deliveryState.fee),
    }];
    if (deliveryState.fastFee > 0) {
      rows.push({ label: 'Entrega flash', value: `+${formatCurrency(deliveryState.fastFee)}` });
    }
    return rows;
  };

  const generateProducts = () => {

    products = [];
    const popularRules = {
      vinilica: 5,
      esmalte: 4,
      aerosoles: 3,
    };
    const recommendedRules = {
      vinilica: 9,
      esmalte: 8,
      aerosoles: 4,
    };

    products.push({
      id: 'aerosol-alvamex',
      category: 'aerosoles',
      categoryLabel: categoryLabels['aerosoles'],
      subcategory: 'Normal',
      name: 'Aerosol Alvamex',
      description: 'Aerosol Alvamex de secado rápido, ideal para detalles metálicos e industriales.',
      detailText: 'Aerosol de alta cobertura y secado rápido, perfecto para interiores y exteriores con acabado resistente.',
      price: 79,
      cantidad: '400 ml',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#d7d7d7',
      image: '',
      palette: [
        { name: 'Oro', color: '#bfa14a' },
        { name: 'Blanco Antiguo', color: '#f3e7c7' },
        { name: 'Amarillo Limón', color: '#ffd600' },
        { name: 'Azul Francia', color: '#0d1a4a' },
        { name: 'Azul Holandés', color: '#1e3a5c' },
        { name: 'Amarillo Seguridad', color: '#ffb300' },
        { name: 'Azul Naval', color: '#0a183d' },
        { name: 'Verde Ecológico', color: '#2e7d32' },
        { name: 'Naranja', color: '#ff6d00' },
        { name: 'Marfil', color: '#ede7d0' },
        { name: 'Rojo', color: '#a31515' },
        { name: 'Rosa', color: '#e573b7' },
        { name: 'Verde Pino', color: '#1b5e20' },
        { name: 'Café', color: '#4e342e' },
        { name: 'Gris Claro', color: '#bdbdbd' },
        { name: 'Gris Oscuro', color: '#424242' },
        { name: 'Verde Metálico', color: '#009688' },
        { name: 'Cobre', color: '#b87333' },
        { name: 'Azul Metálico', color: '#1976d2' },
        { name: 'Lila Metálico', color: '#a259c4' },
        { name: 'Aluminio', color: '#b0b0b0' },
        { name: 'Rojo Metálico', color: '#b71c1c' },
        { name: 'Gris Anodizado', color: '#757575' },
        { name: 'Transparente', color: 'rgba(255,255,255,0.25)' },
        { name: 'Primer Rojo Óxido', color: '#a31515' },
        { name: 'Primer Gris Claro', color: '#bdbdbd' },
      ],
    });

    products.push({
      id: 'aerosol-cromo',
      category: 'aerosoles',
      categoryLabel: categoryLabels['aerosoles'],
      subcategory: 'Metálico',
      name: 'Aerosol Cromo',
      description: 'Aerosol Cromo con acabado metálico intenso.',
      detailText: 'Aerosol cromado de alto brillo y rápida aplicación; perfecto para remates y acentos especiales.',
      price: 103,
      cantidad: '400 ml',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#b0b0b0',
      image: '',
    });

    products.push({
      id: 'aerosol-oro',
      category: 'aerosoles',
      categoryLabel: categoryLabels['aerosoles'],
      subcategory: 'Metálico',
      name: 'Aerosol Oro',
      description: 'Aerosol Oro metálico para acabados decorativos.',
      detailText: 'Aerosol color oro con excelente cobertura y brillo metálico.',
      price: 103,
      cantidad: '400 ml',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#b69038',
      image: '',
    });

    products.push({
      id: 'aerosol-alta-temperatura',
      category: 'aerosoles',
      categoryLabel: categoryLabels['aerosoles'],
      subcategory: 'Alta Temperatura',
      name: 'Aerosol Alta Temperatura',
      description: 'Aerosol resistente a altas temperaturas con acabados negro y aluminio.',
      detailText: 'Incluye los colores Negro Alta Temperatura y Aluminio para aplicaciones en superficies expuestas al calor.',
      price: 103,
      cantidad: '400 ml',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#0f0f0d',
      image: '',
      palette: [
        { name: 'Negro Alta Temperatura', color: '#111111' },
        { name: 'Aluminio', color: '#b0b0b0' },
      ],
    });

    products.push({
      id: 'aerosol-neon',
      category: 'aerosoles',
      categoryLabel: categoryLabels['aerosoles'],
      subcategory: 'Neón',
      name: 'Aerosol Neón',
      description: 'Aerosol Neón con colores vibrantes en presentación de 400 ml.',
      detailText: 'Colores neón agrupados en un solo producto para acabados brillantes y llamativos.',
      price: 79,
      cantidad: '400 ml',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#d4ff00',
      image: '',
      palette: [
        { name: 'Limón Neón', color: '#d4ff00' },
        { name: 'Magenta Neón', color: '#ff00b0' },
        { name: 'Mandarina Neón', color: '#ff6d00' },
        { name: 'Verde Neón', color: '#00ff00' },
      ],
    });

    const sayerUltraPalette = [
      { name: 'Blanco Ostión VU-022', color: '#ece3d4' },
      { name: 'Marfil VU-077', color: '#f4edc4' },
      { name: 'Amarillo Colonial VU-0713', color: '#efa429' },
      { name: 'Amarillo Limón VU-0700', color: '#f4e31e' },
      { name: 'Amarillo Óxido VU-0775', color: '#b27629' },
      { name: 'Champagne VU-0511', color: '#f2e3d3' },
      { name: 'Beige VU-0776', color: '#d7bea1' },
      { name: 'Mandarina VU-0678', color: '#ed914f' },
      { name: 'Naranja Fuego VU-0600', color: '#e73520' },
      { name: 'Rojo Chino VU-0500', color: '#e1211b' },
      { name: 'Rojo Óxido VU-0555', color: '#7f241d' },
      { name: 'Rosa Mexicano VU-0504', color: '#d92f62' },
      { name: 'Violeta Intenso VU-0800', color: '#261071' },
      { name: 'Azul Infinito VU-0307', color: '#5b88d6' },
      { name: 'Azul Colonial VU-0333', color: '#0034bb' },
      { name: 'Azul Trafalgar VU-0300', color: '#0a2f8f' },
      { name: 'Turmalina VU-0317', color: '#4c9aa3' },
      { name: 'Verde Limón VU-0415', color: '#8cc95f' },
      { name: 'Verde Esmeralda VU-0400', color: '#164f2d' },
      { name: 'Chocolate VU-0582', color: '#1f1714' },
      { name: 'Negro VU-0100', color: '#050505' },
      { name: 'Blanco Satinado VU-0200', color: '#f7f7f2' },
      { name: 'Blanco Mate VU-1200', color: '#f3f1eb' },
    ];

    const sayerMaximaPalette = [
      { name: 'Naranja Fuego VX-0600', color: '#ed4c3f' },
      { name: 'Rojo Chino VX-0500', color: '#dd3328' },
      { name: 'Rojo Óxido VX-0555', color: '#7d2b28' },
      { name: 'Café Óxido VX-0527', color: '#5a4542' },
      { name: 'Negro VX-0100', color: '#272727' },
      { name: 'Blanco VX-0200', color: '#ffffff' },
      { name: 'Blanco Semibrillante VX-5200', color: '#f3f3f1' },
      { name: 'Amarillo Verano VX-0779', color: '#f0ad5f' },
      { name: 'Blanco Ostión VX-0229', color: '#efe4d6' },
      { name: 'Manzana Verde VX-0413', color: '#bdd26b' },
      { name: 'Amarillo Óxido VX-0775', color: '#b78641' },
      { name: 'Amarillo Limón VX-0700', color: '#f5ee35' },
      { name: 'Verde Esmeralda VX-0400', color: '#28474d' },
      { name: 'Azul Trafalgar VX-0300', color: '#2c285e' },
      { name: 'Violeta Intenso VX-0800', color: '#6d4c91' },
    ];

    const sayerProMasterPalette = [
      { name: 'Azul Cielo VP-0304', color: '#b8e7f7' },
      { name: 'Azul Horizonte VP-0306', color: '#9fb5d8' },
      { name: 'Azul Trafalgar VP-0300', color: '#073aaf' },
      { name: 'Verde Pradera VP-0406', color: '#d8ec65' },
      { name: 'Verde Natural VP-0403', color: '#b7d957' },
      { name: 'Verde Claro VP-0441', color: '#b9f1ce' },
      { name: 'Verde Esmeralda VP-0400', color: '#145932' },
      { name: 'Amarillo Limón VP-0700', color: '#f2f02c' },
      { name: 'Blanco Ostión VP-0229', color: '#f4f0e2' },
      { name: 'Arena VP-0703', color: '#f0e7d5' },
      { name: 'Trigo', color: '#f3efbd' },
      { name: 'Crema', color: '#f5edaa' },
      { name: 'Marfil', color: '#f1dd8c' },
      { name: 'Amarillo Napolitano', color: '#e9c66a' },
      { name: 'Amarillo Verano', color: '#e79e43' },
      { name: 'Amarillo Óxido', color: '#a96c27' },
      { name: 'Melón VP-0603', color: '#f1c29d' },
      { name: 'Mandarina VP-0678', color: '#e8824b' },
      { name: 'Naranja Fuego VP-0600', color: '#e42f1e' },
      { name: 'Rosa Tierno VP-0513', color: '#f1d8df' },
      { name: 'Rojo Chino VP-0500', color: '#ac1d17' },
      { name: 'Rojo Óxido VP-0555', color: '#7a2b1f' },
      { name: 'Orquídea VP-0805', color: '#d6b4f2' },
      { name: 'Violeta Intenso VP-0800', color: '#2a176d' },
      { name: 'Negro VP-0100', color: '#050505' },
      { name: 'Blanco Mate VP-0200', color: '#ffffff' },
      { name: 'Blanco Satinado VP-3200', color: '#f7f7f4' },
      { name: 'Blanco Semibrillante VP-5200', color: '#f4f4f2' },
    ];

    const sayerMagicolorPalette = [
      { name: 'Rojo Chino VG-0500', color: '#f2383d' },
      { name: 'Naranja Fuego VG-0600', color: '#f24a2e' },
      { name: 'Rojo Flamingo VG-0503', color: '#ef6f75' },
      { name: 'Blanco Ostión VG-0229', color: '#f7f5e5' },
      { name: 'Magnolia VG-0274', color: '#f7f3d8' },
      { name: 'Rojo Óxido VG-0555', color: '#7f2118' },
      { name: 'Mandarina VG-0678', color: '#ef7846' },
      { name: 'Amarillo Verano VG-0779', color: '#f0b262' },
      { name: 'Salmón VG-0551', color: '#f4c2a2' },
      { name: 'Verde Natural VG-0403', color: '#addc5e' },
      { name: 'Pistache VG-0448', color: '#98ec98' },
      { name: 'Turquesa VG-0442', color: '#5ccfa5' },
      { name: 'Verde Esmeralda VG-0400', color: '#125f3d' },
      { name: 'Violeta Intenso VG-0800', color: '#2e1f8c' },
      { name: 'Azul Riviera VG-0302', color: '#9fd9ec' },
      { name: 'Mediterráneo VG-0303', color: '#32a4b4' },
      { name: 'Azul Paraíso VG-0339', color: '#2d99d2' },
      { name: 'Azul Trafalgar VG-0300', color: '#04349f' },
      { name: 'Mango', color: '#f1ce25' },
      { name: 'Amarillo Limón VG-0700', color: '#eff22d' },
      { name: 'Amarillo Canario', color: '#f1ef7f' },
      { name: 'Marfil', color: '#f2edbd' },
      { name: 'Amarillo Pérsico', color: '#f3e59e' },
      { name: 'Piñón', color: '#f0c3a7' },
      { name: 'Amarillo Óxido VG-0775', color: '#c46f25' },
      { name: 'Blanco VG-0200', color: '#ffffff' },
      { name: 'Negro VG-0100', color: '#050505' },
    ];

    const sayerContractorPalette = [
      { name: 'Blanco Ostión VC-0229', color: '#e8e0d6' },
      { name: 'Capuchino VC-0567', color: '#a78f7a' },
      { name: 'Crema VC-0772', color: '#e5d57a' },
      { name: 'Amarillo Canario', color: '#e7ed62' },
      { name: 'Amarillo Napolitano VC-0777', color: '#e8ce72' },
      { name: 'Blanco VC-0200', color: '#ffffff' },
      { name: 'Salmón VC-0551', color: '#e3a27b' },
      { name: 'Durazno VC-0566', color: '#de936a' },
      { name: 'Mandarina VC-0678', color: '#ef6b3f' },
      { name: 'Rojo Óxido VC-0555', color: '#802318' },
      { name: 'Violeta VC-0588', color: '#9a6a9f' },
      { name: 'Turquesa VC-0444', color: '#55bfa4' },
      { name: 'Fucsia VC-0572', color: '#c65f8a' },
      { name: 'Azul Celeste VC-0304', color: '#87cfe1' },
      { name: 'Azul Caribe VC-0318', color: '#0e9cc7' },
      { name: 'Verde Natural VC-0403', color: '#a9d066' },
      { name: 'Verde Alpino VC-0401', color: '#a7cfae' },
    ];

    products.push({
      id: 'vinilica-ultra-sayer',
      category: 'vinilica',
      categoryLabel: categoryLabels['vinilica'],
      subcategory: 'Sayer',
      name: 'Ultra Sayer',
      description: 'Pintura vinílica premium de máxima calidad, con gran cubrimiento, alta durabilidad y excelente resistencia al lavado.',
      detailText: 'Pintura vinílica premium de máxima calidad, diseñada para ofrecer el mejor cubrimiento, alta durabilidad y excelente resistencia al lavado. Ideal para proyectos residenciales y comerciales donde se busca un acabado superior y de larga duración.',
      price: 295,
      sizeOptions: [
        { id: '1lt', label: '1 Litro', price: 295 },
        { id: '4lts', label: '4 Litros', price: 1095 },
        { id: '19lts', label: '19 Litros', price: 4390 },
      ],
      cantidad: '1 litro / 4 litros / 19 litros',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#f4edc4',
      image: '',
      palette: sayerUltraPalette,
    });

    products.push({
      id: 'vinilica-maxima-sayer',
      category: 'vinilica',
      categoryLabel: categoryLabels['vinilica'],
      subcategory: 'Sayer',
      name: 'Máxima Sayer',
      description: 'Pintura vinílica de alta calidad con excelente cubrimiento y gran durabilidad para interiores y exteriores.',
      detailText: 'Pintura vinílica de alta calidad con excelente cubrimiento y gran durabilidad, ideal para interiores y exteriores. Ofrece uniformidad y gran rendimiento para acabados profesionales.',
      price: 245,
      sizeOptions: [
        { id: '1lt', label: '1 Litro', price: 245 },
        { id: '4lts', label: '4 Litros', price: 865 },
        { id: '19lts', label: '19 Litros', price: 3690 },
      ],
      cantidad: '1 litro / 4 litros / 19 litros',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#f0ad5f',
      image: '',
      palette: sayerMaximaPalette,
    });

    products.push({
      id: 'vinilica-pro-master-sayer',
      category: 'vinilica',
      categoryLabel: categoryLabels['vinilica'],
      subcategory: 'Sayer',
      name: 'Pro Master Sayer',
      description: 'Pintura vinílica profesional con excelente rendimiento y cubrimiento para acabados uniformes y duraderos.',
      detailText: 'Pintura vinílica profesional con excelente rendimiento y cubrimiento. Ideal para hogares, oficinas y proyectos donde se busca un acabado uniforme y duradero a un excelente costo-beneficio.',
      price: 195,
      sizeOptions: [
        { id: '1lt', label: '1 Litro', price: 195 },
        { id: '4lts', label: '4 Litros', price: 715 },
        { id: '19lts', label: '19 Litros', price: 2950 },
      ],
      cantidad: '1 litro / 4 litros / 19 litros',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#b8e7f7',
      image: '',
      palette: sayerProMasterPalette,
    });

    products.push({
      id: 'vinilica-magicolor-sayer',
      category: 'vinilica',
      categoryLabel: categoryLabels['vinilica'],
      subcategory: 'Sayer',
      name: 'Magicolor Sayer',
      description: 'Pintura vinílica de gran desempeño y excelente relación calidad-precio para interiores y exteriores.',
      detailText: 'Pintura vinílica de gran desempeño y excelente relación calidad-precio, ideal para interiores y exteriores con buena adherencia y rendimiento uniforme.',
      price: 170,
      sizeOptions: [
        { id: '1lt', label: '1 Litro', price: 170 },
        { id: '4lts', label: '4 Litros', price: 625 },
        { id: '19lts', label: '19 Litros', price: 2450 },
      ],
      cantidad: '1 litro / 4 litros / 19 litros',
      popular: true,
      recommended: false,
      rating: 4,
      colorSwatch: '#f2383d',
      image: '',
      palette: sayerMagicolorPalette,
    });

    products.push({
      id: 'vinilica-contractor-sayer',
      category: 'vinilica',
      categoryLabel: categoryLabels['vinilica'],
      subcategory: 'Sayer',
      name: 'Contractor Sayer',
      description: 'Pintura vinílica económica para mantenimiento, obra y grandes superficies con precio accesible.',
      detailText: 'Pintura vinílica económica diseñada para proyectos de mantenimiento, obra y grandes superficies, ofreciendo rendimiento y practicidad a un precio accesible.',
      price: 425,
      sizeOptions: [
        { id: '4lts', label: '4 Litros', price: 425 },
        { id: '19lts', label: '19 Litros', price: 1695 },
      ],
      cantidad: '4 litros / 19 litros',
      popular: false,
      recommended: false,
      rating: 4,
      colorSwatch: '#e8e0d6',
      image: '',
      palette: sayerContractorPalette,
    });

    const precioVinilicaGalon = 160;
    const precioVinilicaCubeta = 640;
    products.push({
      id: 'vinilica-alvacolor',
      category: 'vinilica',
      categoryLabel: categoryLabels['vinilica'],
      subcategory: 'Económica',
      name: 'Alvacolor',
      description: 'Vinílica Alvacolor - pintura económica en galón y cubeta.',
      detailText: 'Es una pintura en un porcentaje lavable, se puede aplicar al exterior e interior con una duración máxima de 2 años al exterior.',
      price: precioVinilicaGalon,
      sizeOptions: [
        { id: '4lts', label: '4 Lts', price: precioVinilicaGalon },
        { id: '19lts', label: '19 Lts', price: precioVinilicaCubeta },
      ],
      cantidad: '1 galón / cubeta 4 galones',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#f7f1e4',
      image: '',
      palette: [
        { name: 'Durazno', color: '#f4b697' },
        { name: 'Marfil', color: '#f5e5c4' },
        { name: 'Menta', color: '#dcebcf' },
        { name: 'Lila', color: '#d9c2e0' },
        { name: 'Salmón Claro', color: '#f6b5ad' },
        { name: 'Crema', color: '#f9e3b4' },
        { name: 'Verde Suave', color: '#afd4b0' },
        { name: 'Rosa Mexicano', color: '#f7a8c5' },
        { name: 'Coral', color: '#f08b67' },
        { name: 'Amarillo', color: '#f7d36b' },
        { name: 'Verde Tierno', color: '#96c468' },
        { name: 'Azul Verde', color: '#49bdc0' },
        { name: 'Amarillo Óxido', color: '#d28b38' },
        { name: 'Naranja', color: '#f38c34' },
        { name: 'Verde Claro', color: '#9fcc8f' },
        { name: 'Azul Capri', color: '#6fb9df' },
        { name: 'Rojo Óxido', color: '#a24b45' },
        { name: 'Napolitano', color: '#f1a45c' },
        { name: 'Turquesa', color: '#40b8b3' },
        { name: 'Azul Griego', color: '#3b7bb8' },
        { name: 'Blanco', color: '#ffffff' },
        { name: 'Negro', color: '#1a1a1a' },
        { name: 'Piñón', color: '#ac8c79' },
        { name: 'Capuchino', color: '#9e7f68' },
        { name: 'Rojo Básico', color: '#d92134' },
        { name: 'Naranja Básico', color: '#f16c2a' },
        { name: 'Amarillo Básico', color: '#f8d208' },
        { name: 'Verde Básico', color: '#2f913c' },
        { name: 'Azul Básico', color: '#2e60c4' },
        { name: 'Violeta Básico', color: '#7b3cc3' },
      ],
    });

    const precioVinilicaMediaGalon = 310;
    const precioVinilicaMediaCubeta = 1609;
    const precioVinilicaMedia1Lt = 76;
    products.push({
      id: 'vinilica-alvaflex-master',
      category: 'vinilica',
      categoryLabel: categoryLabels['vinilica'],
      subcategory: 'Media',
      name: 'Alvaflex Master',
      description: 'Vinílica Alvaflex Master - pintura de calidad media en galón y cubeta.',
      detailText: 'Es una pintura en un porcentaje lavable, se puede aplicar al exterior e interior con una duración máxima de 2 años al exterior.',
      price: precioVinilicaMedia1Lt,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: precioVinilicaMedia1Lt },
        { id: '4lts', label: '4 Lts', price: precioVinilicaMediaGalon },
        { id: '19lts', label: '19 Lts', price: precioVinilicaMediaCubeta },
      ],
      cantidad: '1 lt / 4 Lts / 19 Lts',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#d3e0e9',
      image: '',
      palette: [ 
        { name: 'Mamey', color: '#ee8a7a' },
        { name: 'Monarca', color: '#f2aa4b' },
        { name: 'Blanco Menta', color: '#e1f1e3' },
        { name: 'Blanco Ostión', color: '#f4e7d7' },
        { name: 'Amarillo California', color: '#f8c95c' },
        { name: 'Amarillo Intenso', color: '#f7bf2d' },
        { name: 'Verde Locura', color: '#e5f4c3' },
        { name: 'Azul Cielo', color: '#5bb8d6' },
        { name: 'Mango', color: '#f2a537' },
        { name: 'Salmón Fresco', color: '#f6b8ae' },
        { name: 'Verde Reflexión', color: '#9ca677' },
        { name: 'Azul Rey', color: '#1f4d96' },
        { name: 'Naranja', color: '#f06f34' },
        { name: 'Arena Orgánica', color: '#edbe9f' },
        { name: 'Verde Tierno', color: '#93c364' },
        { name: 'Rosa Mexicano', color: '#e462a5' },
        { name: 'Rojo Cardenal', color: '#bf312d' },
        { name: 'Amarillo Óxido', color: '#cc8f39' },
        { name: 'Turquesa', color: '#42b0ae' },
        { name: 'Violeta', color: '#8a4bb3' },
        { name: 'Rojo Óxido', color: '#7e2d28' },
        { name: 'Capuchino', color: '#9b7963' },
        { name: 'Verde Básico', color: '#1d6d4d' },
        { name: 'Negro', color: '#101112' },
        { name: 'Blanco Semi-Gloss', color: '#f8f8f7' },
        { name: 'Blanco Mate', color: '#f2f2f1' },
        { name: 'Marfil', color: '#eee3cd' },
      ],
    });

    products.push({
      id: 'vinilica-alvacril-gold',
      category: 'vinilica',
      categoryLabel: categoryLabels['vinilica'],
      subcategory: 'Alta',
      name: 'Alvacril GOLD',
      description: 'Pintura 100% lavable ideal para exterior e interior con una durabilidad hasta 12 años.',
      detailText: 'Pintura 100% lavable ideal para exterior e interior con una durabilidad hasta 12 años.',
      price: 116,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 116 },
        { id: '4lts', label: '4 Lts', price: 415 },
        { id: '19lts', label: '19 Lts', price: 1580 },
      ],
      cantidad: '1 lt / 4 Lts / 19 Lts',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#edf2f0',
      image: '',
      palette: [ 
        { name: 'Coral', color: '#f16d64' },
        { name: 'Champaña', color: '#f4dfab' },
        { name: 'Paja', color: '#f7dd9a' },
        { name: 'Blanco Amanecer', color: '#eef7f5' },
        { name: 'Blanco', color: '#ffffff' },
        { name: 'Tangerina', color: '#f08a3f' },
        { name: 'Crema', color: '#f4d8a5' },
        { name: 'Olivo', color: '#7f8668' },
        { name: 'Celeste', color: '#7fc5e0' },
        { name: 'Blanco Ostión', color: '#ede4d5' },
        { name: 'Mango', color: '#f3a34f' },
        { name: 'Durazno', color: '#f2af8f' },
        { name: 'Verde Tierno', color: '#79b551' },
        { name: 'Azul Griego', color: '#2a5ca3' },
        { name: 'Gris Sombra', color: '#9e9e9e' },
        { name: 'Naranja', color: '#f05f2d' },
        { name: 'Amarillo Napolitano', color: '#f8ce47' },
        { name: 'Verde Arruba', color: '#5a8d63' },
        { name: 'Azul Rey', color: '#203f7e' },
        { name: 'Rosa Mexicano', color: '#d63d88' },
        { name: 'Rojo', color: '#c72d2d' },
        { name: 'Amarillo Limón', color: '#f7e242' },
        { name: 'Verde Córdova', color: '#2c7f65' },
        { name: 'Azul Intenso', color: '#1c4e8c' },
        { name: 'Uva', color: '#7c3a8d' },
        { name: 'Red Barón', color: '#8c2f2f' },
        { name: 'Mostaza', color: '#a77a2b' },
        { name: 'Turquesa', color: '#2f9fab' },
        { name: 'Azul Colonial', color: '#224d8c' },
        { name: 'Negro', color: '#101010' },
      ],
    });

    const precioVinilicaMediaAltaGalon = 469;
    const precioVinilicaMediaAltaCubeta = 1179;
    products.push({
      id: 'vinilica-viniplax',
      category: 'vinilica',
      categoryLabel: categoryLabels['vinilica'],
      subcategory: 'Mediana-Alta',
      name: 'Viniplax',
      description: 'Vinílica Viniplax - pintura premium en galón y cubeta.',
      detailText: 'Es una pintura en un porcentaje lavable, se puede aplicar al exterior e interior con una duración máxima de 2 años al exterior.',
      price: precioVinilicaMediaAltaGalon,
      sizeOptions: [
        { id: '4lts', label: '4 Lts', price: precioVinilicaMediaAltaGalon },
        { id: '19lts', label: '19 Lts', price: precioVinilicaMediaAltaCubeta },
      ],
      cantidad: '1 galón / cubeta 4 galones',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#c4d5b6',
      image: '',
      palette: [
        { name: 'Blanco Perla', color: '#f7f3ee' },
        { name: 'Marfil Suave', color: '#f2e0c9' },
        { name: 'Durazno Claro', color: '#f1c7a7' },
        { name: 'Coral Pastel', color: '#f2a587' },
        { name: 'Rosa Empolvado', color: '#e9b8c0' },
        { name: 'Rosa Nude', color: '#deb0a4' },
        { name: 'Amarillo Pálido', color: '#f8e7a2' },
        { name: 'Mostaza Suave', color: '#d7b35a' },
        { name: 'Terracota Claro', color: '#d18e5f' },
        { name: 'Naranja Crema', color: '#efb67c' },
        { name: 'Verde Menta', color: '#c9dbb8' },
        { name: 'Verde Pasto', color: '#9bbd94' },
        { name: 'Verde Musgo', color: '#7b8f60' },
        { name: 'Verde Oliva Claro', color: '#9fae74' },
        { name: 'Azul Cielo', color: '#a8c7d8' },
        { name: 'Azul Polvo', color: '#94adc2' },
        { name: 'Azul Grisáceo', color: '#7d8ca0' },
        { name: 'Azul Marino', color: '#3d5570' },
        { name: 'Lavanda', color: '#c9bbc8' },
        { name: 'Lila Suave', color: '#b89fb5' },
        { name: 'Violeta Claro', color: '#9b86a1' },
        { name: 'Gris Perla', color: '#d7d9da' },
        { name: 'Gris Claro', color: '#b7b8bb' },
        { name: 'Gris Medio', color: '#8c8e91' },
        { name: 'Café Claro', color: '#c4a48f' },
        { name: 'Café Madera', color: '#9e6f55' },
        { name: 'Rojo Suave', color: '#c96f6f' },
        { name: 'Rojo Profundo', color: '#8f3232' },
      ],
    });

    // Generar productos normales para las demás categorías (esmaltes se agregan manualmente)
    Object.keys(counts).forEach((category) => {
      if (category === 'aerosoles' || category === 'vinilica' || category === 'esmalte') return;
      const categoryLabel = categoryLabels[category];
      const categorySubs = subcategories[category];
      const total = counts[category];
      for (let i = 1; i <= total; i += 1) {
        const subcategory = categorySubs[i % categorySubs.length];
        products.push({
          id: `${category}-${i}`,
          category,
          categoryLabel,
          subcategory,
          name: `${categoryLabel} ${subcategory} #${i}`,
          description: `Producto ${i} de ${categoryLabel} en la subcategoría ${subcategory}`,
          price: prices[category] + Math.floor(Math.random() * 120),
          popular: i % popularRules[category] === 0,
          recommended: i % recommendedRules[category] === 0,
          rating: Math.floor(Math.random() * 3) + 3,
        });
      }
    });

    const festerProducts = [
      {
        id: 'fester-acriton-ps-max-8',
        name: 'FESTER ACRITON PS MAX 8 AÑOS',
        description: 'Impermeabilizante acrílico premium de secado extra rápido y alta durabilidad, ideal para techos con alta exposición al sol, lluvia y cambios climáticos.',
        variants: [
          {
            name: 'Blanco',
            color: '#f7f7f2',
            description: 'Impermeabilizante acrílico premium de secado extra rápido ideal para techos con alta exposición al sol, lluvia y cambios climáticos.',
            sizes: [
              { id: '4lts', label: '4 Lts', price: 1053 },
              { id: '19lts', label: '19 Lts', price: 4458 },
            ],
          },
          {
            name: 'Rojo Terracota',
            color: '#a94835',
            description: 'Impermeabilizante elastomérico premium de alta durabilidad ideal para protección extrema de techos y azoteas.',
            sizes: [
              { id: '4lts', label: '4 Lts', price: 1046 },
              { id: '19lts', label: '19 Lts', price: 4405 },
            ],
          },
        ],
      },
      {
        id: 'fester-acriton-ps-max-6',
        name: 'FESTER ACRITON PS MAX 6 AÑOS',
        description: 'Impermeabilizante acrílico profesional con excelente balance entre costo, rendimiento y protección prolongada.',
        variants: [
          {
            name: 'Blanco',
            color: '#f7f7f2',
            description: 'Impermeabilizante acrílico profesional con excelente balance entre costo y rendimiento.',
            sizes: [
              { id: '19lts', label: '19 Lts', price: 3840 },
            ],
          },
          {
            name: 'Rojo Terracota',
            color: '#a94835',
            description: 'Impermeabilizante acrílico de alto desempeño ideal para mantenimiento preventivo y protección prolongada.',
            sizes: [
              { id: '19lts', label: '19 Lts', price: 3790 },
            ],
          },
        ],
      },
      {
        id: 'fester-acriton-ps-max-4',
        name: 'FESTER ACRITON PS MAX 4 AÑOS',
        description: 'Impermeabilizante acrílico de excelente adherencia para proyectos residenciales y mantenimiento preventivo.',
        variants: [
          {
            name: 'Blanco',
            color: '#f7f7f2',
            description: 'Impermeabilizante acrílico de excelente adherencia ideal para proyectos residenciales y mantenimiento preventivo.',
            sizes: [
              { id: '4lts', label: '4 Lts', price: 954 },
              { id: '19lts', label: '19 Lts', price: 3311 },
            ],
          },
          {
            name: 'Rojo Terracota',
            color: '#a94835',
            description: 'Impermeabilizante acrílico económico con buena resistencia al agua y rayos UV.',
            sizes: [
              { id: '4lts', label: '4 Lts', price: 941 },
              { id: '19lts', label: '19 Lts', price: 3257 },
            ],
          },
        ],
      },
      {
        id: 'fester-a-7',
        name: 'FESTER A 7 AÑOS',
        description: 'Impermeabilizante con excelente relación calidad-precio para protección prolongada.',
        variants: [
          {
            name: 'Blanco',
            color: '#f7f7f2',
            description: 'Impermeabilizante acrílico de gran rendimiento ideal para hogares y pequeños proyectos.',
            sizes: [
              { id: '19lts', label: '19 Lts', price: 2712 },
            ],
          },
          {
            name: 'Rojo Terracota',
            color: '#a94835',
            description: 'Impermeabilizante con excelente relación calidad-precio para protección prolongada.',
            sizes: [
              { id: '19lts', label: '19 Lts', price: 2712 },
            ],
          },
        ],
      },
      {
        id: 'fester-a-5',
        name: 'FESTER A 5 AÑOS',
        description: 'Impermeabilizante ideal para mantenimiento preventivo, protección confiable y costo accesible.',
        variants: [
          {
            name: 'Blanco',
            color: '#f7f7f2',
            description: 'Impermeabilizante ideal para mantenimiento preventivo y protección confiable.',
            sizes: [
              { id: '4lts', label: '4 Lts', price: 552 },
              { id: '19lts', label: '19 Lts', price: 2329 },
            ],
          },
          {
            name: 'Rojo Terracota',
            color: '#a94835',
            description: 'Impermeabilizante acrílico de excelente desempeño y costo accesible.',
            sizes: [
              { id: '4lts', label: '4 Lts', price: 552 },
              { id: '19lts', label: '19 Lts', price: 2329 },
            ],
          },
        ],
      },
      {
        id: 'fester-a-3',
        name: 'FESTER A 3 AÑOS',
        description: 'Impermeabilizante económico ideal para mantenimiento básico, protección temporal y proyectos residenciales.',
        variants: [
          {
            name: 'Blanco',
            color: '#f7f7f2',
            description: 'Impermeabilizante económico ideal para mantenimiento básico y proyectos residenciales.',
            sizes: [
              { id: '4lts', label: '4 Lts', price: 476 },
              { id: '19lts', label: '19 Lts', price: 2025 },
            ],
          },
          {
            name: 'Rojo Terracota',
            color: '#a94835',
            description: 'Impermeabilizante de entrada ideal para protección temporal y mantenimiento preventivo.',
            sizes: [
              { id: '4lts', label: '4 Lts', price: 476 },
              { id: '19lts', label: '19 Lts', price: 2025 },
            ],
          },
        ],
      },
      {
        id: 'fester-vaportite-550',
        name: 'FESTER VAPORTITE 550',
        description: 'Impermeabilizante asfáltico base solvente ideal para cimentaciones, jardineras, techos, baños y superficies con humedad extrema.',
        finish: 'Negro Asfáltico',
        color: '#111111',
        sizes: [
          { id: '1lt', label: '1 Lt', price: 329 },
          { id: '4lts', label: '4 Lts', price: 882 },
          { id: '19lts', label: '19 Lts', price: 3403 },
        ],
      },
      {
        id: 'fester-plastic-cement',
        name: 'FESTER PLASTIC CEMENT',
        description: 'Sellador y resanador profesional para grietas, fisuras y puntos críticos antes de impermeabilizar.',
        finish: 'Negro Asfáltico',
        color: '#111111',
        sizes: [
          { id: '1lt', label: '1 Lt', price: 245 },
          { id: '4lts', label: '4 Lts', price: 773 },
          { id: '19lts', label: '19 Lts', price: 3118 },
        ],
      },
      {
        id: 'fester-integral-a-z',
        name: 'FESTER INTEGRAL A-Z',
        description: 'Tratamiento especializado contra humedad y salitre para muros interiores y exteriores.',
        finish: 'Transparente / Tratamiento',
        color: '#d8dde2',
        sizes: [
          { id: '1lt', label: '1 Lt', price: 455 },
          { id: '4lts', label: '4 Lts', price: 1169 },
          { id: '19lts', label: '19 Lts', price: 4732 },
        ],
      },
      {
        id: 'festermicide',
        name: 'FESTERMICIDE',
        description: 'Tratamiento especializado para eliminar hongos, algas, moho y microorganismos antes de pintar o impermeabilizar.',
        finish: 'Tratamiento Fungicida',
        color: '#dfe8dc',
        sizes: [
          { id: '4lts', label: '4 Lts', price: 1240 },
          { id: '19lts', label: '19 Lts', price: 5044 },
        ],
      },
    ];

    festerProducts.forEach((item) => {
      const palette = item.variants
        ? item.variants.map((variant) => ({
          name: variant.name,
          color: variant.color,
          description: variant.description,
          sizeOptions: variant.sizes,
        }))
        : [{ name: item.finish, color: item.color }];
      const defaultSizes = item.variants ? item.variants[0].sizes : item.sizes;
      const detailFinish = item.variants
        ? `Colores disponibles: ${item.variants.map((variant) => variant.name).join(' y ')}.`
        : `Acabado: ${item.finish}.`;

      products.push({
        id: item.id,
        category: 'epoxica',
        categoryLabel: categoryLabels['epoxica'],
        subcategory: 'Fester',
        name: item.name,
        description: item.description,
        detailText: `${item.description} ${detailFinish}`,
        price: Math.min(...palette.flatMap((variant) => (variant.sizeOptions || defaultSizes).map((size) => size.price))),
        sizeOptions: defaultSizes,
        cantidad: defaultSizes.map((size) => size.label.toLowerCase()).join(' / '),
        popular: item.name.includes('8 AÑOS') || item.id === 'fester-vaportite-550',
        recommended: true,
        rating: 4,
        colorSwatch: palette[0].color,
        image: '',
        palette,
      });
    });

    products.push({
      id: 'esmalte-alva-fast',
      category: 'esmalte',
      categoryLabel: categoryLabels['esmalte'],
      subcategory: 'Base Solvente',
      name: 'Alva fast',
      description: 'Esmalte industrial de secado rápido, resistente a la intemperie y a la corrosión.',
      detailText: 'Esmalte Alva fast disponible en 1, 4 y 19 litros. Ideal para interiores y exteriores, con gran resistencia y secado rápido.',
      price: 189,
      sizeOptions: [
        { id: '1lt', label: '1 Lts', price: 189 },
        { id: '4lts', label: '4 Lts', price: 689 },
        { id: '19lts', label: '19 Lts', price: 3129 },
      ],
      cantidad: '1 lt / 4 lts / 19 lts',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#dad3c8',
      image: '',
      palette: [
        { name: 'Naranja', color: '#ea5135' },
        { name: 'Blanco Ostra', color: '#e9e0d6' },
        { name: 'Verde Confort', color: '#2a5b33' },
        { name: 'Rojo Cereza', color: '#921c20' },
        { name: 'Amarillo Limón', color: '#f7dd4f' },
        { name: 'Verde Orgánico', color: '#267b3a' },
        { name: 'Rojo Cardenal', color: '#8f1d26' },
        { name: 'Amarillo Canario', color: '#f4a322' },
        { name: 'Atlántida', color: '#1f5275' },
        { name: 'Rojo Óxido', color: '#7d3221' },
        { name: 'Amarillo Caterpillar', color: '#d88f1c' },
        { name: 'Azul Alvamax', color: '#185895' },
        { name: 'Marrón', color: '#591f1c' },
        { name: 'Amarillo Cromo', color: '#f09610' },
        { name: 'Azul Prusia', color: '#0f316a' },
        { name: 'Gris', color: '#8d8e90' },
        { name: 'Chocolate', color: '#3e1f16' },
        { name: 'Chocolate Mate', color: '#3a1c14' },
        { name: 'Azul Astral', color: '#122952' },
        { name: 'Verde John Deere', color: '#27592f' },
        { name: 'Verde Zintro', color: '#1a8571' },
        { name: 'Oro', color: '#b69038' },
        { name: 'Aluminio', color: '#9ca0a6' },
        { name: 'Anodizado', color: '#0f0f0d' },
      ],
    });

    products.push({
      id: 'esmalte-rocket-secado-rapido',
      category: 'esmalte',
      categoryLabel: categoryLabels['esmalte'],
      subcategory: 'Base Solvente',
      name: 'Rocket Secado Rápido',
      description: 'Esmalte de secado rápido ideal para aplicaciones donde se requiere rapidez y excelente acabado.',
      detailText: 'Esmalte Rocket Secado Rápido disponible en 1, 4 y 19 litros. Ideal para aplicaciones donde se requiere rapidez y excelente acabado.',
      price: 449,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 449 },
        { id: '4lts', label: '4 Lts', price: 1616 },
        { id: '19lts', label: '19 Lts', price: 7070 },
      ],
      cantidad: '1 lt / 4 lts / 19 lts',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#f6f4ef',
      image: '',
      palette: [
        { name: 'Blanco', color: '#f6f4ef' },
        { name: 'Negro', color: '#171717' },
      ],
    });

    products.push({
      id: 'esmalte-esmalack',
      category: 'esmalte',
      categoryLabel: categoryLabels['esmalte'],
      subcategory: 'Base Solvente',
      name: 'Esmalack',
      description: 'Esmalte alquidálico de excelente acabado y resistencia, ideal para herrería, metal, madera y acabados decorativos.',
      detailText: 'Esmalack es un esmalte alquidálico de excelente acabado y resistencia, ideal para herrería, metal, madera y acabados decorativos.',
      price: 310,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 310 },
      ],
      cantidad: '1 lt',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#fff8df',
      image: '',
      palette: [
        { name: 'Oro', color: '#7e8370' },
        { name: 'Cobre', color: '#79575a' },
        { name: 'Aluminio', color: '#9ca6b3' },
        { name: 'Café Anodizado', color: '#2d2b2d' },
      ],
    });

    products.push({
      id: 'esmalte-xtrong',
      category: 'esmalte',
      categoryLabel: categoryLabels['esmalte'],
      subcategory: 'Base Solvente',
      name: 'Xtrong',
      description: 'Esmalte de alta resistencia para acabados durables en metal y madera, con buena cobertura y brillo uniforme.',
      detailText: 'Esmalte Xtrong de alta resistencia para acabados durables en metal y madera, con buena cobertura, brillo uniforme y amplia gama de colores.',
      price: 226,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 226 },
        { id: '4lts', label: '4 Lts', price: 732 },
        { id: '19lts', label: '19 Lts', price: 3203 },
      ],
      cantidad: '1 lt / 4 lts / 19 lts',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#f7f3dd',
      image: '',
      palette: [
        { name: 'Blanco Ostión - EX-0229', color: '#f7f3dd' },
        { name: 'Marfil - EX-0773', color: '#f8f5c8' },
        { name: 'Amarillo Sol - EX-0777', color: '#f4b84a' },
        { name: 'Amarillo Limón - EX-0700', color: '#eee84f' },
        { name: 'Beige - EX-0778', color: '#d5c2aa' },
        { name: 'Crema - EX-0772', color: '#f8f3b7' },
        { name: 'Naranja Fuego - EX-0600', color: '#df4a36' },
        { name: 'Amarillo Óxido - EX-0775', color: '#a98245' },
        { name: 'Roble - EX-0658', color: '#947363' },
        { name: 'Gris Perla - EX-0113', color: '#9fa2a5' },
        { name: 'Rojo Chino - EX-0500', color: '#a72e33' },
        { name: 'Rojo Óxido - EX-0555', color: '#86392f' },
        { name: 'Café Óxido - EX-0557', color: '#49332b' },
        { name: 'Azul Fino - EX-0337', color: '#8bc4df' },
        { name: 'Azul Tráfico - EX-3300', color: '#272a65' },
        { name: 'Verde Océano - EX-0443', color: '#2f5a48' },
        { name: 'Verde Claro - EX-0441', color: '#bde9c7' },
        { name: 'Azul Holandés - EX-0335', color: '#5389bd' },
        { name: 'Verde Industrial - 30GG 18450', color: '#3a8a75' },
        { name: 'Verde Fresco - 94YY 48629', color: '#96cd66' },
        { name: 'Turquesa - EX-0442', color: '#5fb1a9' },
        { name: 'Azul Modelo - EX-0384', color: '#293d85' },
      ],
    });

    products.push({
      id: 'esmalte-industrial-pintura-alberca',
      category: 'esmalte',
      categoryLabel: categoryLabels['esmalte'],
      subcategory: 'Esmalte Industrial',
      name: 'Pintura para Alberca',
      description: 'Pintura especializada para albercas con excelente resistencia al agua y químicos.',
      detailText: 'Pintura especializada para albercas con excelente resistencia al agua y químicos. Disponible en presentaciones de 4 y 19 litros.',
      price: 2227,
      sizeOptions: [
        { id: '4lts', label: '4 Lts', price: 2227 },
        { id: '19lts', label: '19 Lts', price: 9745 },
      ],
      cantidad: '4 lts / 19 lts',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#128bc5',
      image: '',
      palette: [
        { name: 'Blanco', color: '#f7f7f5' },
        { name: 'Azul Holandés', color: '#128bc5' },
        { name: 'Azul Avándaro', color: '#6bb8df' },
        { name: 'Turquesa', color: '#12a79b' },
        { name: 'Verde Vallarta', color: '#9acdc9' },
      ],
    });

    products.push({
      id: 'esmalte-industrial-pintura-trafico',
      category: 'esmalte',
      categoryLabel: categoryLabels['esmalte'],
      subcategory: 'Esmalte Industrial',
      name: 'Pintura para Tráfico',
      description: 'Pintura de alto desempeño para señalamiento vial y tráfico.',
      detailText: 'Pintura de alto desempeño para señalamiento vial y tráfico. Disponible en presentaciones de 4 y 19 litros.',
      price: 1640,
      sizeOptions: [
        { id: '4lts', label: '4 Lts', price: 1640 },
        { id: '19lts', label: '19 Lts', price: 7177 },
      ],
      cantidad: '4 lts / 19 lts',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#ffffff',
      image: '',
      palette: [
        { name: 'Blanco Tráfico SCT', color: '#ffffff' },
        { name: 'Amarillo Tráfico SCT', color: '#f5c400' },
      ],
    });

    products.push({
      id: 'diluyente-alberca-trafico',
      category: 'diluyentes',
      categoryLabel: categoryLabels['diluyentes'],
      subcategory: 'Alberca y Tráfico',
      name: 'Diluyente para Pintura de Alberca y Tráfico',
      description: 'Diluyente para pintura de alberca y tráfico.',
      detailText: 'Diluyente para pintura de alberca y tráfico disponible en presentaciones de 4 y 19 litros.',
      price: 551,
      sizeOptions: [
        { id: '4lts', label: '4 Lts', price: 551 },
        { id: '19lts', label: '19 Lts', price: 2437 },
      ],
      cantidad: '4 lts / 19 lts',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#d7dde3',
      image: '',
    });

    products.push({
      id: 'primario-anticorrosivo',
      category: 'primerarios',
      categoryLabel: categoryLabels['primerarios'],
      subcategory: 'Primarios',
      name: 'Primario Anticorrosivo',
      description: 'Primario protector para superficies metálicas con excelente adherencia y protección anticorrosiva.',
      detailText: 'Primario protector para superficies metálicas con excelente adherencia y protección anticorrosiva. Disponible en 1, 4 y 19 litros.',
      price: 362,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 362 },
        { id: '4lts', label: '4 Lts', price: 1302 },
        { id: '19lts', label: '19 Lts', price: 5695 },
      ],
      cantidad: '1 lt / 4 lts / 19 lts',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#cfd2d4',
      image: '',
      palette: [
        { name: 'Gris claro', color: '#cfd2d4' },
        { name: 'Blanco', color: '#ffffff' },
        { name: 'Rojo óxido', color: '#8b352c' },
      ],
    });

    products.push({
      id: 'primario-anticorrosivo-zinc',
      category: 'primerarios',
      categoryLabel: categoryLabels['primerarios'],
      subcategory: 'Primarios',
      name: 'Primario Anticorrosivo de Zinc',
      description: 'Protección industrial reforzada contra corrosión para superficies metálicas.',
      detailText: 'Protección industrial reforzada contra corrosión para superficies metálicas. Disponible en 1, 4 y 19 litros.',
      price: 579,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 579 },
        { id: '4lts', label: '4 Lts', price: 2087 },
        { id: '19lts', label: '19 Lts', price: 9129 },
      ],
      cantidad: '1 lt / 4 lts / 19 lts',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#9fa7ad',
      image: '',
      palette: [
        { name: 'Zinc', color: '#9fa7ad' },
      ],
    });

    products.push({
      id: 'madera-tintas-base-aceite',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Tintas',
      name: 'Mancha Sayer',
      description: 'Tinta base aceite universal compatible con procesos de barnizado, ideal para entintar madera, resaltar la veta natural y lograr acabados decorativos profesionales.',
      detailText: 'Tinta base aceite universal compatible con procesos de barnizado, ideal para entintar madera, resaltar la veta natural y lograr acabados decorativos profesionales.',
      price: 67,
      sizeOptions: [
        { id: 'cuarto-lt', label: '1/4 Lt', price: 67 },
        { id: '1lt', label: '1 Lt', price: 224 },
      ],
      cantidad: '1/4 lt / 1 lt',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#c58423',
      image: '',
      palette: [
        { name: 'Blanco - TS-6101', color: '#f7f4e8' },
        { name: 'Negro - TS-6102', color: '#171513' },
        { name: 'Amarillo Ocre - TS-6103', color: '#c68d2b' },
        { name: 'Amarillo Oro - TS-6105', color: '#f2b21d' },
        { name: 'Rojo Colonial - TS-6106', color: '#b84b35' },
        { name: 'Rojo Vivo - TS-6107', color: '#d9282e' },
        { name: 'Naranja - TS-6108', color: '#db6f21' },
        { name: 'Azul - TS-6109', color: '#12619b' },
        { name: 'Verde - TS-6110', color: '#00a66a' },
        { name: 'Royal Marrón - TS-6111', color: '#8f345f' },
        { name: 'Early American - TS-6112', color: '#8c6a3d' },
        { name: 'Verde Ficus - TS-6113', color: '#334d2b' },
        { name: 'Nogal Americano - TS-6114', color: '#7d6132' },
        { name: 'Nogal Clásico - TS-6115', color: '#7a5428' },
        { name: 'Maple - TS-6116', color: '#c37034' },
        { name: 'Caoba Inglés - TS-6117', color: '#9a3150' },
        { name: 'Caoba Comercial - TS-6118', color: '#8d3424' },
        { name: 'Caoba Clásico - TS-6119', color: '#a04d28' },
        { name: 'Roble - TS-6120', color: '#9b6a35' },
        { name: 'Arce - TS-6121', color: '#d87520' },
        { name: 'Cedro - TS-6122', color: '#d36f22' },
        { name: 'Olmo - TS-6123', color: '#9d7a39' },
        { name: 'Oyamel - TS-6124', color: '#9b4a37' },
        { name: 'Magnolia - TS-6125', color: '#b68d42' },
        { name: 'Ciprés - TS-6126', color: '#d99a22' },
        { name: 'Amaranto - TS-6127', color: '#8c2245' },
        { name: 'Palo de Rosa - TS-6128', color: '#80365e' },
        { name: 'Chocolate - TS-6129', color: '#3d1916' },
        { name: 'Avellana - TS-6130', color: '#7b3422' },
        { name: 'Cherry - TS-6131', color: '#8f1f46' },
        { name: 'Nogal Claro - TS-6132', color: '#986235' },
        { name: 'Encino Americano - TS-6133', color: '#8a5b2c' },
        { name: 'Gris Perla - TS-6134', color: '#a6acb1' },
        { name: 'Gris Titanio - TS-6135', color: '#667081' },
        { name: 'Gris Grafito - TS-6136', color: '#323333' },
        { name: 'Álamo - TS-6137', color: '#eadab8' },
        { name: 'Cacao - TS-6138', color: '#8b5d35' },
        { name: 'Abeto - TS-6139', color: '#a76431' },
      ],
    });

    products.push({
      id: 'madera-entona-sayer',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Tintas',
      name: 'Entona Sayer',
      description: 'Tinta base alcohol de secado rápido ideal para acabados profesionales sobre madera. Excelente penetración, color uniforme y gran compatibilidad con procesos de barnizado.',
      detailText: 'Tinta base alcohol de secado rápido ideal para acabados profesionales sobre madera. Excelente penetración, color uniforme y gran compatibilidad con procesos de barnizado.',
      price: 67,
      sizeOptions: [
        { id: 'cuarto-lt', label: '1/4 Lt', price: 67 },
        { id: '1lt', label: '1 Lt', price: 224 },
      ],
      cantidad: '1/4 lt / 1 lt',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#a04d28',
      image: '',
      palette: [
        { name: 'Blanco TS-6601 - 250 ml: TS660110 / 1 lt: TS660130', color: '#f4ead0' },
        { name: 'Negro TS-6602 - 250 ml: TS660210 / 1 lt: TS660230', color: '#2a2928' },
        { name: 'Amarillo Limón TS-6604 - 1 lt: TS660430', color: '#e0d91c' },
        { name: 'Amarillo Oro TS-6605 - 1 lt: TS660530', color: '#f0af1a' },
        { name: 'Café TS-6606 - 250 ml: TS660610 / 1 lt: TS660630', color: '#5a2d15' },
        { name: 'Rojo Vivo TS-6607 - 1 lt: TS660730', color: '#e8262b' },
        { name: 'Naranja TS-6608 - 1 lt: TS660830', color: '#e45f20' },
        { name: 'Azul TS-6609 - 1 lt: TS660930', color: '#1261a0' },
        { name: 'Verde TS-6610 - 1 lt: TS661030', color: '#0cad73' },
        { name: 'Royal Marrón TS-6611 - 1 lt: TS661130', color: '#8c2f5d' },
        { name: 'Early American TS-6612 - 250 ml: TS661210 / 1 lt: TS661230', color: '#806333' },
        { name: 'Verde Ficus TS-6613 - 1 lt: TS661330', color: '#35472a' },
        { name: 'Nogal Americano TS-6614 - 250 ml: TS661410 / 1 lt: TS661430', color: '#80612d' },
        { name: 'Nogal Clásico TS-6615 - 250 ml: TS661510 / 1 lt: TS661530', color: '#735016' },
        { name: 'Maple TS-6616 - 250 ml: TS661610 / 1 lt: TS661630', color: '#c26739' },
        { name: 'Caoba Inglés TS-6617 - 250 ml: TS661710 / 1 lt: TS661730', color: '#9a3150' },
        { name: 'Caoba Comercial TS-6618 - 250 ml: TS661810 / 1 lt: TS661830', color: '#8d3424' },
        { name: 'Caoba Clásico TS-6619 - 250 ml: TS661910 / 1 lt: TS661930', color: '#864126' },
        { name: 'Roble TS-6620 - 250 ml: TS662010 / 1 lt: TS662030', color: '#8c5f32' },
        { name: 'Arce TS-6621 - 1 lt: TS662130', color: '#d97818' },
        { name: 'Cedro TS-6622 - 250 ml: TS662210 / 1 lt: TS662230', color: '#d06c1f' },
        { name: 'Olmo TS-6623 - 250 ml: TS662310 / 1 lt: TS662330', color: '#9a7936' },
        { name: 'Oyamel TS-6624 - 250 ml: TS662410 / 1 lt: TS662430', color: '#9c4635' },
        { name: 'Magnolia TS-6625 - 250 ml: TS662510 / 1 lt: TS662530', color: '#ca8425' },
        { name: 'Ciprés TS-6626 - 250 ml: TS662610 / 1 lt: TS662630', color: '#8a6736' },
        { name: 'Amaranto TS-6627 - 250 ml: TS662710 / 1 lt: TS662730', color: '#9b3945' },
        { name: 'Palo de Rosa TS-6628 - 1 lt: TS662830 / 19 lts: TS662850', color: '#8b2053' },
        { name: 'Chocolate TS-6629 - 250 ml: TS662910 / 1 lt: TS662930', color: '#321917' },
        { name: 'Avellana TS-6630 - 250 ml: TS663010 / 1 lt: TS663030', color: '#7b3422' },
        { name: 'Cherry TS-6631 - 250 ml: TS663110 / 1 lt: TS663130', color: '#8f1f46' },
      ],
    });

    products.push({
      id: 'madera-barnices-entintados',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Barnices entintados',
      name: 'Barnices Entintados',
      description: 'Barniz entintado de acabado profesional para madera, diseñado para proteger, decorar y resaltar la veta natural con excelente adherencia y durabilidad.',
      detailText: 'Barniz entintado de acabado profesional para madera, diseñado para proteger, decorar y resaltar la veta natural con excelente adherencia y durabilidad.',
      price: 285,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 285 },
        { id: '4lts', label: '4 Lts', price: 1128 },
      ],
      cantidad: '1 lt / 4 lts',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#8f1f46',
      image: '',
      palette: [
        { name: 'Transparente - LT-0100', color: '#f6efe2' },
        { name: 'Amaranto - LT-012730', color: '#8f1f46' },
        { name: 'Arce - LT-012130', color: '#d97818' },
        { name: 'Caoba Clásico - LT-011930', color: '#864126' },
        { name: 'Caoba Inglés - LT-011730', color: '#9a3150' },
        { name: 'Chocolate - LT-012930', color: '#321917' },
        { name: 'Early American - LT-011230', color: '#806333' },
        { name: 'Magnolia - LT-012530', color: '#ca8425' },
        { name: 'Maple - LT-011630', color: '#c26739' },
        { name: 'Nogal Americano - LT-011430', color: '#80612d' },
        { name: 'Nogal Clásico - LT-011530', color: '#735016' },
        { name: 'Roble - LT-012030', color: '#8c5f32' },
      ],
    });

    products.push({
      id: 'madera-barniz-marino-transparente-brillante',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Barniz Marino',
      name: 'Barniz Marino Transparente Brillante',
      description: 'Barniz marino transparente brillante para proteger y embellecer superficies de madera expuestas a humedad, sol y exteriores.',
      detailText: 'Clave: HI-0900. Barniz marino transparente brillante diseñado para proteger y embellecer superficies de madera expuestas a humedad, sol y condiciones exteriores. Ideal para muebles de exterior, puertas, ventanas, embarcaciones y proyectos de carpintería donde se requiere alta resistencia y acabado brillante.',
      price: 489,
      sizeOptions: [
        { id: '1lt', label: '1 Litro', price: 489 },
        { id: '4lts', label: '4 Litros', price: 1915 },
        { id: '19lts', label: '19 Litros', price: 7817 },
      ],
      cantidad: '1 litro / 4 litros / 19 litros',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#f1dfb8',
      image: '',
    });

    products.push({
      id: 'madera-barniz-marino-transparente-semi-mate',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Barniz Marino',
      name: 'Barniz Marino Transparente Semi Mate',
      description: 'Barniz marino transparente semi mate para proteger madera expuesta al exterior con acabado elegante de bajo brillo.',
      detailText: 'Clave: HI-0940. Barniz marino transparente semi mate ideal para proteger superficies de madera expuestas al exterior, proporcionando resistencia a humedad y desgaste con un acabado elegante de bajo brillo.',
      price: 489,
      sizeOptions: [
        { id: '1lt', label: '1 Litro', price: 489 },
        { id: '4lts', label: '4 Litros', price: 1915 },
        { id: '19lts', label: '19 Litros', price: 7817 },
      ],
      cantidad: '1 litro / 4 litros / 19 litros',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#e6d3aa',
      image: '',
    });

    products.push({
      id: 'madera-sellalack-profesional',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Selladores',
      name: 'Sellalack Profesional',
      description: 'Sellador nitro profesional de excelente lijado y adherencia.',
      detailText: 'Clave: NS-0270. Sellador nitro profesional de excelente lijado y adherencia.',
      price: 161,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 161 },
        { id: '4lts', label: '4 Lts', price: 627 },
        { id: '19lts', label: '19 Lts', price: 2900 },
      ],
      cantidad: '1 lt / 4 lts / 19 lts',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#eadbc3',
      image: '',
    });

    products.push({
      id: 'madera-sellalack-directo',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Selladores',
      name: 'Sellalack Directo',
      description: 'Sellador nitrocelulosa directo de aplicación profesional para madera.',
      detailText: 'Clave: NS-1000. Sellador nitrocelulosa directo de aplicación profesional para madera.',
      price: 228,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 228 },
        { id: '4lts', label: '4 Lts', price: 895 },
      ],
      cantidad: '1 lt / 4 lts',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#e4d4bb',
      image: '',
    });

    products.push({
      id: 'madera-sellalack-cristal',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Selladores',
      name: 'Sellalack Cristal',
      description: 'Sellador transparente cristalino para acabados premium en madera.',
      detailText: 'Clave: NS-1200. Sellador transparente cristalino para acabados premium en madera.',
      price: 237,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 237 },
      ],
      cantidad: '1 lt',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#f2eadb',
      image: '',
    });

    products.push({
      id: 'madera-sellalack-altos-solidos',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Selladores',
      name: 'Sellalack Altos Sólidos',
      description: 'Sellador nitro de alta concentración y excelente cobertura.',
      detailText: 'Clave: NS-44/300. Sellador nitro de alta concentración y excelente cobertura.',
      price: 233,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 233 },
        { id: '4lts', label: '4 Lts', price: 913 },
      ],
      cantidad: '1 lt / 4 lts',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#dfcfb8',
      image: '',
    });

    products.push({
      id: 'madera-primer-nitro-blanco',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Primer para Madera',
      name: 'Primer Nitro Blanco',
      description: 'Primer para madera color blanco.',
      detailText: 'Clave: PN-0010. Primer para madera color blanco.',
      price: 283,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 283 },
        { id: '4lts', label: '4 Lts', price: 1110 },
      ],
      cantidad: '1 lt / 4 lts',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#ffffff',
      image: '',
      palette: [
        { name: 'Blanco - PN-0010', color: '#ffffff' },
      ],
    });

    products.push({
      id: 'madera-primer-chocolate',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Primer para Madera',
      name: 'Primer Chocolate',
      description: 'Primer para madera color chocolate.',
      detailText: 'Clave: PN-0082. Primer para madera color chocolate.',
      price: 300,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 300 },
        { id: '4lts', label: '4 Lts', price: 1177 },
      ],
      cantidad: '1 lt / 4 lts',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#3a2118',
      image: '',
      palette: [
        { name: 'Chocolate - PN-0082', color: '#3a2118' },
      ],
    });

    products.push({
      id: 'madera-primer-blanco',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Primer para Madera',
      name: 'Primer Blanco',
      description: 'Primer para madera color blanco.',
      detailText: 'Clave: PN-0100. Primer para madera color blanco.',
      price: 311,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 311 },
        { id: '4lts', label: '4 Lts', price: 1219 },
      ],
      cantidad: '1 lt / 4 lts',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#ffffff',
      image: '',
      palette: [
        { name: 'Blanco - PN-0100', color: '#ffffff' },
      ],
    });

    products.push({
      id: 'madera-uresayer-ultra-brillante',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Poliuretanos',
      name: 'Uresayer Ultra Brillante',
      description: 'Poliuretano transparente brillante de alta resistencia para acabados premium en madera.',
      detailText: 'Clave: UB-0005. Poliuretano transparente brillante de alta resistencia para acabados premium en madera. Acabado: Brillante. Catalizador recomendado: UC-1000 Enduresayer.',
      price: 189,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 189 },
      ],
      cantidad: '1 lt',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#f4ead6',
      image: '',
      palette: [
        { name: 'Transparente brillante - UB-0005', color: '#f4ead6' },
      ],
    });

    products.push({
      id: 'madera-t-0028-a-brillo-directo',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Poliuretanos',
      name: 'T-0028/A Brillo Directo',
      description: 'Poliuretano brillo directo para acabados profesionales en madera.',
      detailText: 'T-0028/A Brillo Directo. Requiere catalizador T-0028/B para Brillo Directo.',
      price: 311,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 311 },
        { id: '4lts', label: '4 Lts', price: 1220 },
      ],
      cantidad: '1 lt / 4 lts',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#f3e6cf',
      image: '',
    });

    products.push({
      id: 'madera-t-0028-b-catalizador',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Poliuretanos',
      name: 'T-0028/B Catalizador para Brillo Directo',
      description: 'Catalizador para Brillo Directo recomendado para T-0028/A y T-0030/A.',
      detailText: 'T-0028/B Catalizador para Brillo Directo. Recomendado para T-0028/A y T-0030/A.',
      price: 311,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 311 },
        { id: '4lts', label: '4 Lts', price: 1220 },
      ],
      cantidad: '1 lt / 4 lts',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#e2d5bc',
      image: '',
    });

    products.push({
      id: 'madera-t-0030-a-brillo-directo-negro',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Poliuretanos',
      name: 'T-0030/A Brillo Directo Negro',
      description: 'Poliuretano brillo directo negro para acabados profesionales en madera.',
      detailText: 'T-0030/A Brillo Directo Negro. Catalizador recomendado: T-0028/B.',
      price: 338,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 338 },
      ],
      cantidad: '1 lt',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#111111',
      image: '',
      palette: [
        { name: 'Negro - T-0030/A', color: '#111111' },
      ],
    });

    products.push({
      id: 'madera-t-0031-a-brillo-directo-blanco',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Poliuretanos',
      name: 'T-0031/A Brillo Directo Blanco',
      description: 'Poliuretano brillo directo blanco para acabados profesionales en madera.',
      detailText: 'T-0031/A Brillo Directo Blanco. Catalizador recomendado: TW-0028/B.',
      price: 386,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 386 },
        { id: '4lts', label: '4 Lts', price: 1513 },
      ],
      cantidad: '1 lt / 4 lts',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#ffffff',
      image: '',
      palette: [
        { name: 'Blanco - T-0031/A', color: '#ffffff' },
      ],
    });

    products.push({
      id: 'madera-tw-0028-b-catalizador',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Poliuretanos',
      name: 'TW-0028/B Catalizador para Brillo Directo',
      description: 'Catalizador para Brillo Directo recomendado para T-0031/A.',
      detailText: 'TW-0028/B Catalizador para Brillo Directo. Recomendado para T-0031/A.',
      price: 311,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 311 },
        { id: '4lts', label: '4 Lts', price: 1220 },
      ],
      cantidad: '1 lt / 4 lts',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#e2d5bc',
      image: '',
    });

    products.push({
      id: 'madera-uc-1000-enduresayer',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Poliuretanos',
      name: 'UC-1000 Enduresayer',
      description: 'Catalizador recomendado para poliuretanos de madera.',
      detailText: 'UC-1000 Enduresayer. Catalizador recomendado para Uresayer Ultra Brillante y sistemas de poliuretano.',
      price: 334,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 334 },
        { id: '4lts', label: '4 Lts', price: 1635 },
      ],
      cantidad: '1 lt / 4 lts',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#d8cab0',
      image: '',
    });

    products.push({
      id: 'madera-uresayer-top-mate-profesional',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Poliuretanos',
      name: 'Uresayer Top Mate Profesional',
      description: 'Poliuretano profesional mate ideal para acabados de alta calidad.',
      detailText: 'Clave: UM-1015. Poliuretano profesional mate ideal para acabados de alta calidad. Acabado: Mate.',
      price: 280,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 280 },
        { id: '4lts', label: '4 Lts', price: 1097 },
      ],
      cantidad: '1 lt / 4 lts',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#eadcc8',
      image: '',
      palette: [
        { name: 'Mate - UM-1015', color: '#eadcc8' },
      ],
    });

    products.push({
      id: 'madera-uresayer-top-semi-mate-profesional',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Poliuretanos',
      name: 'Uresayer Top Semi-Mate Profesional',
      description: 'Poliuretano profesional semi-mate ideal para acabados de alta calidad.',
      detailText: 'Clave: UM-1030. Poliuretano profesional semi-mate ideal para acabados de alta calidad. Acabado: Mate.',
      price: 280,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 280 },
        { id: '4lts', label: '4 Lts', price: 1097 },
      ],
      cantidad: '1 lt / 4 lts',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#e5d5bf',
      image: '',
      palette: [
        { name: 'Semi-Mate - UM-1030', color: '#e5d5bf' },
      ],
    });

    products.push({
      id: 'madera-uc-1010-catalizador-enduresayer',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Poliuretanos',
      name: 'Catalizador Enduresayer',
      description: 'Catalizador para poliuretano.',
      detailText: 'Clave: UC-1010. Catalizador para poliuretano.',
      price: 357,
      sizeOptions: [
        { id: '1lt', label: '1 Lt', price: 357 },
        { id: '5lts', label: '5 Lts', price: 1748 },
      ],
      cantidad: '1 lt / 5 lts',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#d8cab0',
      image: '',
    });

    products.push({
      id: 'madera-polyform-3000',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Polyform',
      name: 'Polyform 3000',
      description: 'Acabado profesional para madera ideal para muebles, carpintería y superficies que requieren protección, durabilidad y excelente presentación.',
      detailText: 'Acabado profesional para madera Polyform 3000 ideal para muebles, carpintería y superficies de madera que requieren protección, durabilidad y excelente presentación. Proporciona una apariencia uniforme, buena adherencia y acabado de alta calidad para proyectos residenciales o profesionales.',
      price: 185,
      sizeOptions: [
        { id: '500ml', label: '500 ml', price: 185 },
        { id: '1lt', label: '1 Litro', price: 325 },
        { id: '4lts', label: '4 Litros', price: 1350 },
      ],
      finishOptions: ['Brillante', 'Mate', 'Semi Mate'],
      cantidad: '500 ml / 1 litro / 4 litros',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#d9b26c',
      image: '',
    });

    products.push({
      id: 'madera-polyform-11000-brillante',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Polyform',
      name: 'Polyform 11000 Brillante',
      description: 'Barniz brillante diseñado para proteger y embellecer superficies de madera, resaltando el color natural con larga duración.',
      detailText: 'Barniz Polyform 11000 brillante diseñado para proteger y embellecer superficies de madera, resaltando el color natural y proporcionando un acabado brillante de larga duración. Ideal para muebles, carpintería y acabados finos.',
      price: 550,
      sizeOptions: [
        { id: '1lt', label: '1 Litro', price: 550 },
        { id: '4lts', label: '4 Litros', price: 1850 },
      ],
      finishOptions: ['Brillante'],
      cantidad: '1 litro / 4 litros',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#e7c987',
      image: '',
    });

    products.push({
      id: 'madera-primer-chocolate-polyform',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Polyform',
      name: 'Primer Chocolate Polyform',
      description: 'Primer color chocolate para preparación de superficies de madera antes de aplicar lacas o acabados finales.',
      detailText: 'Primer color chocolate para preparación de superficies de madera antes de aplicar lacas o acabados finales. Mejora la adherencia, uniformidad y apariencia profesional del acabado.',
      price: 230,
      sizeOptions: [
        { id: '1lt', label: '1 Litro', price: 230 },
        { id: '4lts', label: '4 Litros', price: 850 },
      ],
      cantidad: '1 litro / 4 litros',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#3d2118',
      image: '',
    });

    products.push({
      id: 'madera-laca-chocolate-polyform',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Polyform',
      name: 'Laca Chocolate Polyform',
      description: 'Laca color chocolate especializada para acabados decorativos sobre madera y muebles.',
      detailText: 'Laca color chocolate especializada para acabados decorativos sobre madera y muebles. Proporciona uniformidad, buena cobertura y excelente apariencia estética.',
      price: 230,
      sizeOptions: [
        { id: '1lt', label: '1 Litro', price: 230 },
        { id: '4lts', label: '4 Litros', price: 850 },
      ],
      cantidad: '1 litro / 4 litros',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#4a2519',
      image: '',
    });

    products.push({
      id: 'madera-diluyente-pet-polyform',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Polyform',
      name: 'Diluyente PET Polyform',
      description: 'Diluyente especializado para productos Polyform, diseñado para mejorar la viscosidad y facilitar la aplicación.',
      detailText: 'Diluyente especializado para productos Polyform, diseñado para mejorar la viscosidad, facilitar la aplicación y optimizar acabados en sistemas para madera.',
      price: 95,
      sizeOptions: [
        { id: '500ml', label: '500 ml', price: 95 },
        { id: '1lt', label: '1 Litro', price: 170 },
        { id: '4lts', label: '4 Litros', price: 680 },
      ],
      cantidad: '500 ml / 1 litro / 4 litros',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#e8e1d1',
      image: '',
    });

    products.push({
      id: 'madera-pegamento-blanco-polyform',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Polyform',
      name: 'Pegamento Blanco Polyform',
      description: 'Pegamento blanco de alto rendimiento para carpintería, ensamblado, MDF y aplicaciones sobre madera.',
      detailText: 'Pegamento blanco de alto rendimiento para trabajos de carpintería, ensamblado, MDF y aplicaciones sobre madera de uso profesional o doméstico. Ofrece excelente adherencia y resistencia.',
      price: 70,
      sizeOptions: [
        { id: '1lt', label: '1 Litro', price: 70 },
        { id: '4lts', label: '4 Litros', price: 240 },
        { id: 'cubeta', label: 'Cubeta', price: 1075 },
      ],
      cantidad: '1 litro / 4 litros / cubeta',
      popular: true,
      recommended: true,
      rating: 4,
      colorSwatch: '#ffffff',
      image: '',
    });

    products.push({
      id: 'madera-s270-polyform',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Polyform',
      name: 'S270 Polyform',
      description: 'Sellador para preparación de madera antes del acabado final.',
      detailText: 'Sellador Polyform S270 para preparación de madera antes del acabado final. Ayuda a sellar poros, mejorar adherencia y optimizar el rendimiento del barniz o laca.',
      price: 150,
      sizeOptions: [
        { id: '1lt', label: '1 Litro', price: 150 },
        { id: '4lts', label: '4 Litros', price: 600 },
      ],
      cantidad: '1 litro / 4 litros',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#eadcc8',
      image: '',
    });

    products.push({
      id: 'madera-antiparasitos-sayer-lack',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Protectores para Madera',
      name: 'Antiparásitos para Madera Sayer Lack',
      description: 'Antiparásitos para madera Sayer Lack diseñado para proteger contra plagas, hongos, termitas y humedad.',
      detailText: 'Clave: AD-0051. Antiparásitos para madera Sayer Lack diseñado para proteger superficies de madera contra plagas, hongos, termitas y deterioro causado por humedad o agentes biológicos. Ideal para preparación y mantenimiento de madera en interiores y exteriores.',
      price: 270,
      sizeOptions: [
        { id: '1lt', label: '1 Litro', price: 270 },
        { id: '4lts', label: '4 Litros', price: 1055 },
        { id: '19lts', label: '19 Litros', price: 4301 },
      ],
      cantidad: '1 litro / 4 litros / 19 litros',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#cfa46b',
      image: '',
    });

    products.push({
      id: 'madera-removedor-pintura',
      category: 'madera',
      categoryLabel: categoryLabels['madera'],
      subcategory: 'Removedores y Preparación',
      name: 'Removedor de Pintura',
      description: 'Removedor de pintura de alto desempeño para eliminar recubrimientos viejos, esmaltes, barnices y acabados deteriorados.',
      detailText: 'Clave: AR-0001. Removedor de pintura de alto desempeño ideal para eliminar recubrimientos viejos, esmaltes, barnices y acabados deteriorados sobre distintas superficies. Facilita trabajos de restauración y preparación antes de volver a pintar.',
      price: 271,
      sizeOptions: [
        { id: '1lt', label: '1 Litro', price: 271 },
        { id: '4lts', label: '4 Litros', price: 1062 },
        { id: '19lts', label: '19 Litros', price: 4336 },
      ],
      cantidad: '1 litro / 4 litros / 19 litros',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#b98a45',
      image: '',
    });

    products.push({
      id: 'esmalte-oro-1lt',
      category: 'esmalte',
      categoryLabel: categoryLabels['esmalte'],
      subcategory: 'Base Solvente',
      name: 'Esmalte Oro 1 Lts',
      description: 'Esmalte color oro en presentación de 1 litro.',
      detailText: 'Esmalte metálico color oro, ideal para acabados decorativos y detalles en 1 litro.',
      price: 239,
      cantidad: '1 lt',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#cba93e',
      image: '',
    });

    products.push({
      id: 'esmalte-plata-1lt',
      category: 'esmalte',
      categoryLabel: categoryLabels['esmalte'],
      subcategory: 'Base Solvente',
      name: 'Esmalte Plata 1 Lts',
      description: 'Esmalte color plata en presentación de 1 litro.',
      detailText: 'Esmalte metálico color plata, ideal para acabados brillantes y detalles en 1 litro.',
      price: 239,
      cantidad: '1 lt',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#b1b5ba',
      image: '',
    });

    products.push({
      id: 'esmalte-bronce-1lt',
      category: 'esmalte',
      categoryLabel: categoryLabels['esmalte'],
      subcategory: 'Base Solvente',
      name: 'Esmalte Bronce 1 Lts',
      description: 'Esmalte color bronce en presentación de 1 litro.',
      detailText: 'Esmalte metálico color bronce, ideal para acabados cálidos y detalles en 1 litro.',
      price: 269,
      cantidad: '1 lt',
      popular: false,
      recommended: true,
      rating: 4,
      colorSwatch: '#a56f38',
      image: '',
    });

    const newVariantProducts = [
      {
        id: 'thermotek-3-anos',
        category: 'epoxica',
        subcategory: 'Acrílico',
        name: 'Thermotek 3 Años',
        description: 'Impermeabilizante acrílico Thermotek 3 años para protección básica de techos y superficies expuestas a lluvia y humedad.',
        detailText: 'Impermeabilizante acrílico Thermotek 3 años ideal para protección básica de techos y superficies expuestas a lluvia y humedad. Disponible en color rojo o blanco, recomendado para mantenimiento preventivo y aplicación residencial.',
        price: 400,
        sizeOptions: [
          { id: '4lts', label: '4 Litros', price: 400 },
          { id: '19lts', label: '19 Litros', price: 1150 },
        ],
        cantidad: '4 litros / 19 litros',
        popular: true,
        recommended: true,
        rating: 4,
        colorSwatch: '#b94735',
        palette: [
          {
            name: 'Rojo',
            color: '#b94735',
            description: 'Color rojo. Impermeabilizante acrílico Thermotek 3 años.',
            sizeOptions: [
              { id: '4lts', label: '4 Litros', price: 400 },
              { id: '19lts', label: '19 Litros', price: 1150 },
            ],
          },
          {
            name: 'Blanco',
            color: '#f7f7f2',
            description: 'Color blanco. Impermeabilizante acrílico Thermotek 3 años.',
            sizeOptions: [
              { id: '4lts', label: '4 Litros', price: 400 },
              { id: '19lts', label: '19 Litros', price: 1150 },
            ],
          },
        ],
      },
      {
        id: 'thermotek-5-anos',
        category: 'epoxica',
        subcategory: 'Acrílico',
        name: 'Thermotek 5 Años',
        description: 'Impermeabilizante acrílico Thermotek 5 años para proteger techos, losas y superficies exteriores contra filtraciones.',
        detailText: 'Impermeabilizante acrílico Thermotek 5 años de mayor durabilidad, diseñado para proteger techos, losas y superficies exteriores contra filtraciones, humedad y desgaste por intemperie. Disponible en color rojo o blanco.',
        price: 450,
        sizeOptions: [
          { id: '4lts', label: '4 Litros', price: 450 },
          { id: '19lts', label: '19 Litros', price: 1450 },
        ],
        cantidad: '4 litros / 19 litros',
        popular: true,
        recommended: true,
        rating: 4,
        colorSwatch: '#b94735',
        palette: [
          {
            name: 'Rojo',
            color: '#b94735',
            description: 'Color rojo. Impermeabilizante acrílico Thermotek 5 años.',
            sizeOptions: [
              { id: '4lts', label: '4 Litros', price: 450 },
              { id: '19lts', label: '19 Litros', price: 1450 },
            ],
          },
          {
            name: 'Blanco',
            color: '#f7f7f2',
            description: 'Color blanco. Impermeabilizante acrílico Thermotek 5 años.',
            sizeOptions: [
              { id: '4lts', label: '4 Litros', price: 450 },
              { id: '19lts', label: '19 Litros', price: 1450 },
            ],
          },
        ],
      },
      {
        id: 'membrana-rollo-sencilla',
        category: 'epoxica',
        subcategory: 'Membranas',
        name: 'Membrana Rollo Sencilla',
        description: 'Membrana sencilla en rollo ideal como refuerzo para sistemas de impermeabilización.',
        detailText: 'Membrana sencilla en rollo ideal como refuerzo para sistemas de impermeabilización. Ayuda a mejorar la resistencia del impermeabilizante en zonas críticas, grietas, juntas y superficies con movimiento.',
        price: 700,
        cantidad: 'Rollo 100 metros',
        popular: false,
        recommended: true,
        rating: 4,
        colorSwatch: '#eeeeee',
      },
      {
        id: 'membrana-rollo-reforzada',
        category: 'epoxica',
        subcategory: 'Membranas',
        name: 'Membrana Rollo Reforzada',
        description: 'Membrana reforzada en rollo para impermeabilización que requiere mayor resistencia y durabilidad.',
        detailText: 'Membrana reforzada en rollo para trabajos de impermeabilización que requieren mayor resistencia y durabilidad. Recomendada para techos, losas, juntas, grietas y áreas con mayor exposición a humedad.',
        price: 1750,
        cantidad: 'Rollo 100 metros',
        popular: false,
        recommended: true,
        rating: 4,
        colorSwatch: '#d7d7d7',
      },
      {
        id: 'aplicadores-brochas-perfect',
        category: 'aplicadores',
        subcategory: 'Brochas',
        name: 'Brochas Perfect',
        description: 'Brochas marca Perfect ideales para aplicación de pintura vinílica y esmaltes base aceite.',
        detailText: 'Brochas marca Perfect ideales para pintura vinílica, pintura base aceite, esmaltes, selladores y mantenimiento general. Diseñadas para brindar excelente absorción y distribución uniforme de pintura, ofreciendo acabados limpios y profesionales en interiores y exteriores.',
        price: 13,
        sizeOptions: [
          { id: '6in', label: '6 pulgadas', price: 70 },
          { id: '5in', label: '5 pulgadas', price: 65 },
          { id: '4in', label: '4 pulgadas', price: 55 },
          { id: '3in', label: '3 pulgadas', price: 45 },
          { id: '2-5in', label: '2 1/2 pulgadas', price: 35 },
          { id: '2in', label: '2 pulgadas', price: 30 },
          { id: '1-5in', label: '1 1/2 pulgadas', price: 25 },
          { id: '1in', label: '1 pulgada', price: 20 },
          { id: '0-5in', label: '1/2 pulgada', price: 13 },
        ],
        cantidad: '1/2 a 6 pulgadas',
        popular: true,
        recommended: true,
        rating: 4,
        colorSwatch: '#c88b45',
      },
      {
        id: 'aplicadores-brochas-pelo-camello',
        category: 'aplicadores',
        subcategory: 'Brochas para Madera',
        name: 'Brochas Pelo de Camello',
        description: 'Brochas de pelo de camello recomendadas para acabados sobre madera, barnices, lacas y selladores.',
        detailText: 'Brochas de pelo de camello especialmente recomendadas para acabados sobre madera, barnices, lacas, selladores, Polyform y trabajos de carpintería fina. Su suavidad permite una mejor distribución del producto y acabados más uniformes.',
        price: 30,
        sizeOptions: [
          { id: '4in', label: '4 pulgadas', price: 105 },
          { id: '3in', label: '3 pulgadas', price: 98 },
          { id: '2in', label: '2 pulgadas', price: 60 },
          { id: '1-5in', label: '1 1/2 pulgadas', price: 47 },
          { id: '1in', label: '1 pulgada', price: 35 },
          { id: '0-5in', label: '1/2 pulgada', price: 30 },
        ],
        cantidad: '1/2 a 4 pulgadas',
        popular: false,
        recommended: true,
        rating: 4,
        colorSwatch: '#d8b676',
      },
      {
        id: 'aplicadores-masking-tape',
        category: 'aplicadores',
        subcategory: 'Cintas',
        name: 'Masking Tape',
        description: 'Masking tape de uso general ideal para delimitar áreas y proteger superficies durante trabajos de pintura.',
        detailText: 'Masking tape de uso general ideal para pintura vinílica, esmaltes, delimitación de áreas y protección de molduras, proporcionando acabados limpios y profesionales.',
        price: 22,
        sizeOptions: [
          { id: '2in', label: '2 pulgadas', price: 90 },
          { id: '1-5in', label: '1 1/2 pulgadas', price: 65 },
          { id: '1in', label: '1 pulgada', price: 42 },
          { id: '0-75in', label: '3/4 pulgada', price: 32 },
          { id: '0-5in', label: '1/2 pulgada', price: 22 },
        ],
        cantidad: '1/2 a 2 pulgadas',
        popular: true,
        recommended: true,
        rating: 4,
        colorSwatch: '#efe0a5',
      },
      {
        id: 'aplicadores-masking-tape-azul',
        category: 'aplicadores',
        subcategory: 'Cintas Especializadas',
        name: 'Masking Tape Azul',
        description: 'Masking tape azul de alta precisión para aplicaciones automotrices y acabados delicados.',
        detailText: 'Masking tape azul de alta precisión, recomendado para aplicación automotriz, delimitación precisa, trabajos delicados y acabados finos. Ofrece excelente adherencia y remoción limpia sin dañar superficies.',
        price: 48,
        sizeOptions: [
          { id: '2in', label: '2 pulgadas', price: 200 },
          { id: '1-5in', label: '1 1/2 pulgadas', price: 170 },
          { id: '1in', label: '1 pulgada', price: 112 },
          { id: '0-75in', label: '3/4 pulgada', price: 78 },
          { id: '0-5in', label: '1/2 pulgada', price: 48 },
        ],
        cantidad: '1/2 a 2 pulgadas',
        popular: false,
        recommended: true,
        rating: 4,
        colorSwatch: '#256fc8',
      },
      {
        id: 'aplicadores-espatulas',
        category: 'aplicadores',
        subcategory: 'Espátulas',
        name: 'Espátulas',
        description: 'Espátulas resistentes ideales para resanado, aplicación de pastas, selladores y preparación de superficies.',
        detailText: 'Espátulas resistentes ideales para resanadores, pastas, selladores y preparación de superficies antes de pintar.',
        price: 25,
        sizeOptions: [
          { id: '5in', label: '5 pulgadas', price: 42 },
          { id: '4in', label: '4 pulgadas', price: 38 },
          { id: '3in', label: '3 pulgadas', price: 35 },
          { id: '2in', label: '2 pulgadas', price: 30 },
          { id: '1in', label: '1 pulgada', price: 25 },
        ],
        cantidad: '1 a 5 pulgadas',
        popular: false,
        recommended: true,
        rating: 4,
        colorSwatch: '#9aa3ad',
      },
      {
        id: 'aplicadores-rodillo-truper-9',
        category: 'aplicadores',
        subcategory: 'Rodillos',
        name: 'Rodillo Truper 9 Pulgadas',
        description: 'Rodillo Truper de 9 pulgadas para pintura vinílica, impermeabilizantes y recubrimientos.',
        detailText: 'Rodillo Truper de 9 pulgadas ideal para aplicación de pintura vinílica, impermeabilizantes y recubrimientos en superficies lisas, rugosas o extra rugosas, dependiendo del tipo de felpa seleccionada.',
        price: 60,
        sizeOptions: [
          { id: 'liso', label: 'Liso', price: 60 },
          { id: 'rugoso', label: 'Rugoso', price: 75 },
          { id: 'extra-rugoso', label: 'Extra rugoso', price: 77 },
        ],
        cantidad: '9 pulgadas',
        popular: true,
        recommended: true,
        rating: 4,
        colorSwatch: '#f0f0f0',
      },
      {
        id: 'aplicadores-repuesto-rodillo-truper-9',
        category: 'aplicadores',
        subcategory: 'Repuestos para Rodillo',
        name: 'Repuesto para Rodillo Truper 9 Pulgadas',
        description: 'Repuesto para rodillo Truper de 9 pulgadas para pintura, impermeabilización y mantenimiento.',
        detailText: 'Repuesto para rodillo Truper de 9 pulgadas, ideal para renovar el aplicador y obtener mejor cobertura en trabajos de pintura, impermeabilización y mantenimiento.',
        price: 35,
        sizeOptions: [
          { id: 'liso', label: 'Liso', price: 35 },
          { id: 'rugoso', label: 'Rugoso', price: 40 },
          { id: 'extra-rugoso', label: 'Extra rugoso', price: 45 },
        ],
        cantidad: '9 pulgadas',
        popular: false,
        recommended: true,
        rating: 4,
        colorSwatch: '#f3f3f3',
      },
      {
        id: 'aplicadores-rodillo-truper-4-nylon',
        category: 'aplicadores',
        subcategory: 'Rodillos',
        name: 'Rodillo Truper 4 Pulgadas Nylon',
        description: 'Rodillo Truper de 4 pulgadas con felpa de nylon para retoques y superficies pequeñas.',
        detailText: 'Rodillo Truper de 4 pulgadas con felpa de nylon, ideal para trabajos detallados, retoques y aplicación en superficies pequeñas. Recomendado para pinturas de esmalte y pintura vinílica.',
        price: 45,
        cantidad: '4 pulgadas',
        popular: false,
        recommended: true,
        rating: 4,
        colorSwatch: '#e9e9e9',
      },
      {
        id: 'aplicadores-rodillo-truper-4-esponja',
        category: 'aplicadores',
        subcategory: 'Rodillos',
        name: 'Rodillo Truper 4 Pulgadas Esponja',
        description: 'Rodillo Truper de 4 pulgadas de esponja para pintura vinílica, retoques y acabados uniformes.',
        detailText: 'Rodillo Truper de 4 pulgadas de esponja, ideal para aplicación de pintura vinílica en superficies pequeñas, retoques y acabados uniformes.',
        price: 45,
        cantidad: '4 pulgadas',
        popular: false,
        recommended: true,
        rating: 4,
        colorSwatch: '#f1d36f',
      },
      {
        id: 'fester-espuma-poliuretano-750g',
        category: 'epoxica',
        subcategory: 'Complementos',
        name: 'Espuma de Poliuretano Fester',
        description: 'Espuma de poliuretano Fester de alto desempeño ideal para rellenar, sellar y aislar espacios, grietas y cavidades.',
        detailText: 'Espuma de poliuretano Fester de alto desempeño ideal para rellenar, sellar y aislar espacios, grietas y cavidades. Excelente para trabajos de impermeabilización y construcción.',
        price: 274,
        cantidad: '750 gramos',
        popular: false,
        recommended: true,
        rating: 4,
        colorSwatch: '#f2d184',
      },
      {
        id: 'sika-sikaflex-1a-purform',
        category: 'selladores',
        subcategory: 'Selladores Elásticos',
        name: 'Sellador Elástico Sikaflex 1A Purform',
        description: 'Sellador elástico de poliuretano Sikaflex 1A Purform de alta resistencia para juntas, grietas y sellados en construcción.',
        detailText: 'Sellador elástico de poliuretano Sikaflex 1A Purform de alta resistencia, ideal para juntas de expansión, grietas, sellado impermeable y construcción. Excelente adherencia, elasticidad y durabilidad.',
        price: 300,
        cantidad: 'Pieza',
        popular: true,
        recommended: true,
        rating: 4,
        colorSwatch: '#d3412c',
      },
      {
        id: 'vinilica-pasta-texturizada',
        category: 'vinilica',
        subcategory: 'Texturizados',
        name: 'Pasta Texturizada',
        description: 'Pasta texturizada para acabados decorativos en muros interiores y exteriores.',
        detailText: 'Pasta texturizada ideal para acabados decorativos en muros interiores y exteriores. Disponible en textura fina, media y gruesa, permite crear acabados con relieve y apariencia profesional.',
        price: 650,
        sizeOptions: [
          { id: '19lts', label: '19 Litros', price: 650 },
        ],
        finishOptions: ['Fino', 'Medio', 'Grueso'],
        cantidad: '19 litros',
        popular: true,
        recommended: true,
        rating: 4,
        colorSwatch: '#e5dfd2',
      },
    ];

    newVariantProducts.forEach((product) => {
      products.push({
        categoryLabel: categoryLabels[product.category],
        image: '',
        ...product,
      });
    });

    filteredProducts = [...products];
  };

  const updateCartCount = () => {
    if (!cartCountEl) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
  };

  const saveCart = () => {
    localStorage.setItem('rubensCart', JSON.stringify(cart));
  };

  const getDeliveryFee = (distanceKm) => {
    if (distanceKm <= deliveryCoverageKm) return 0;
    return paidDeliveryFee;
  };

  const getCartSubtotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getMexicoCityHour = () => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Mexico_City',
      hour: 'numeric',
      hour12: false,
      hourCycle: 'h23',
    }).formatToParts(new Date());
    return Number(parts.find((part) => part.type === 'hour')?.value || 0);
  };

  const getDeliverySchedule = (distanceKm) => {
    const beforeCutoff = getMexicoCityHour() < 13;
    if (distanceKm <= deliveryCoverageKm) {
      return {
        sameDay: beforeCutoff,
        window: beforeCutoff ? 'Entrega disponible hoy' : 'Entrega programada para mañana',
        type: 'Zona local',
        caption: 'Entrega sin costo dentro de 15 km alrededor de la tienda.',
      };
    }
    if (distanceKm <= scheduledDeliveryLimitKm) {
      return {
        sameDay: beforeCutoff,
        window: beforeCutoff ? 'Entrega disponible hoy' : 'Entrega programada para el siguiente día disponible',
        type: 'Área metropolitana',
        caption: beforeCutoff
          ? 'Pedido generado antes de la 1 PM. Aplica costo de envío de MXN 200.'
          : 'Pedido generado después de la 1 PM. Aplica costo de envío de MXN 200.',
      };
    }
    return {
      sameDay: false,
      window: 'Entrega sujeta a disponibilidad',
      type: 'Fuera de área metropolitana',
      caption: 'Checaremos disponibilidad de entrega rápida con un asesor.',
    };
  };

  const getPostalCodeCandidates = (postalCode) => {
    const stateHint = postalCode.startsWith('0') ? 'Ciudad de México' : 'Estado de México';
    const candidates = [
      `${postalCode}, ${stateHint}, México`,
      `${postalCode}, México`,
    ];

    if (postalCode === '57100') {
      candidates.unshift('57100, Nezahualcóyotl, Estado de México, México');
    }

    return [...new Set(candidates)];
  };

  const getDeliveryDestinationCandidates = (destination) => {
    const value = String(destination || '').trim();
    if (/^\d{5}$/.test(value)) {
      return getPostalCodeCandidates(value);
    }
    return value ? [value] : [];
  };

  const withTimeout = (promise, timeoutMs, message) => new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(message));
    }, timeoutMs);

    promise
      .then((value) => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        window.clearTimeout(timer);
        reject(error);
      });
  });

  const getGoogleMapsErrorMessage = (status) => {
    const messages = {
      REQUEST_DENIED: 'Hubo un problema validando la cobertura. Intenta escribir dirección completa con colonia y alcaldía/municipio.',
      OVER_QUERY_LIMIT: 'Google Maps alcanzó el límite de consultas. Intenta nuevamente más tarde.',
      INVALID_REQUEST: 'Hubo un problema validando la cobertura. Intenta escribir dirección completa con colonia y alcaldía/municipio.',
      UNKNOWN_ERROR: 'Hubo un problema validando la cobertura. Intenta escribir dirección completa con colonia y alcaldía/municipio.',
      ZERO_RESULTS: 'Código postal inválido.',
      NOT_FOUND: 'Código postal inválido.',
    };
    return messages[status] || 'Hubo un problema validando la cobertura. Intenta escribir dirección completa con colonia y alcaldía/municipio.';
  };

  const loadGoogleMapsApi = () => new Promise((resolve, reject) => {
    if (window.google?.maps?.DistanceMatrixService && window.google?.maps?.Geocoder) {
      resolve(window.google.maps);
      return;
    }
    if (!GOOGLE_MAPS_API_KEY) {
      reject(new Error('Falta agregar la variable GOOGLE_MAPS_API_KEY.'));
      return;
    }
    window.gm_authFailure = () => {
      window.__googleMapsAuthFailed = true;
      debugDelivery('Error exacto de Google Maps:', 'gm_authFailure: API key rechazada o dominio no autorizado.');
    };
    const existingScript = document.getElementById('google-maps-api');
    if (existingScript) {
      if (window.__googleMapsAuthFailed) {
        reject(new Error('Hubo un problema validando la cobertura. Intenta escribir dirección completa con colonia y alcaldía/municipio.'));
        return;
      }
      if (existingScript.dataset.loaded === 'true' && window.google?.maps) {
        resolve(window.google.maps);
        return;
      }
      existingScript.addEventListener('load', () => {
        existingScript.dataset.loaded = 'true';
        if (window.__googleMapsAuthFailed) {
          reject(new Error('Hubo un problema validando la cobertura. Intenta escribir dirección completa con colonia y alcaldía/municipio.'));
          return;
        }
        if (window.google?.maps?.DistanceMatrixService && window.google?.maps?.Geocoder) {
          resolve(window.google.maps);
        } else {
          reject(new Error('Google Maps cargó incompleto. Revisa la API key y las restricciones de dominio.'));
        }
      }, { once: true });
      existingScript.addEventListener('error', () => reject(new Error('No se pudo cargar Google Maps.')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-maps-api';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_API_KEY)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      if (window.__googleMapsAuthFailed) {
        reject(new Error('Hubo un problema validando la cobertura. Intenta escribir dirección completa con colonia y alcaldía/municipio.'));
        return;
      }
      if (window.google?.maps?.DistanceMatrixService && window.google?.maps?.Geocoder) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps cargó incompleto. Revisa la API key y las restricciones de dominio.'));
      }
    };
    script.onerror = () => reject(new Error('No se pudo cargar Google Maps.'));
    document.head.appendChild(script);
  });

  const geocodeDeliveryDestination = (maps, destination) => withTimeout(new Promise((resolve, reject) => {
    const geocoder = new maps.Geocoder();
    debugDelivery('Código postal/dirección ingresado:', destination);
    geocoder.geocode({
      address: destination,
      region: 'MX',
      componentRestrictions: { country: 'MX' },
    }, (results, status) => {
      debugDelivery('Respuesta del geocoder:', { status, results });
      if (status !== 'OK' || !results?.length) {
        reject(new Error(getGoogleMapsErrorMessage(status)));
        return;
      }

      const location = results[0].geometry?.location;
      if (!location) {
        reject(new Error('Código postal inválido.'));
        return;
      }

      debugDelivery('Coordenadas obtenidas:', { lat: location.lat(), lng: location.lng() });
      resolve({
        formattedAddress: results[0].formatted_address,
        location,
        lat: location.lat(),
        lng: location.lng(),
      });
    });
  }), 12000, 'Hubo un problema validando la cobertura. Intenta escribir dirección completa con colonia y alcaldía/municipio.');

  const geocodeDeliveryWithFallback = async (maps, destinations) => {
    let lastError = null;

    for (const destination of destinations) {
      try {
        return await geocodeDeliveryDestination(maps, destination);
      } catch (error) {
        lastError = error;
        debugDelivery('Falló geocoding, probando siguiente candidato:', {
          destination,
          error: error.message,
        });
      }
    }

    throw lastError || new Error('Código postal inválido.');
  };

  const calculateRouteDistance = (maps, destinationLocation) => withTimeout(new Promise((resolve, reject) => {
    const service = new maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [storeAddress],
      destinations: [destinationLocation],
      travelMode: maps.TravelMode.DRIVING,
      unitSystem: maps.UnitSystem.METRIC,
      region: 'MX',
    }, (result, status) => {
      debugDelivery('Respuesta Distance Matrix:', { status, result });
      if (status !== 'OK') {
        reject(new Error(getGoogleMapsErrorMessage(status)));
        return;
      }

      const element = result.rows?.[0]?.elements?.[0];
      if (!element || element.status !== 'OK') {
        reject(new Error(getGoogleMapsErrorMessage(element?.status)));
        return;
      }

      debugDelivery('Distancia calculada:', {
        text: element.distance?.text,
        meters: element.distance?.value,
        duration: element.duration?.text,
      });
      resolve(element);
    });
  }), 15000, 'Hubo un problema validando la cobertura. Intenta escribir dirección completa con colonia y alcaldía/municipio.');

  const calculateRouteDistanceWithFallback = async (maps, geocodedDestination) => {
    const destinations = [
      geocodedDestination.location,
      geocodedDestination.formattedAddress,
    ].filter(Boolean);
    let lastError = null;

    for (const destination of destinations) {
      try {
        return await calculateRouteDistance(maps, destination);
      } catch (error) {
        lastError = error;
        debugDelivery('Falló Distance Matrix, probando siguiente destino:', {
          destination,
          error: error.message,
        });
      }
    }

    throw lastError || new Error('Hubo un problema validando la cobertura. Intenta escribir dirección completa con colonia y alcaldía/municipio.');
  };

  const calculateDeliveryEstimate = async (destinationInput) => {
    const destinations = getDeliveryDestinationCandidates(destinationInput);
    if (!destinations.length) {
      return { valid: false, message: 'Ingresa un código postal o dirección completa para calcular la entrega.' };
    }

    try {
      const maps = await withTimeout(loadGoogleMapsApi(), 12000, 'No se pudo cargar Google Maps. Revisa conexión, API key y restricciones de dominio.');
      const geocodedDestination = await geocodeDeliveryWithFallback(maps, destinations);
      const element = await calculateRouteDistanceWithFallback(maps, geocodedDestination);
      const distanceKm = element.distance.value / 1000;
      const fee = getDeliveryFee(distanceKm);
      const schedule = getDeliverySchedule(distanceKm);
      const isPaidDelivery = distanceKm > deliveryCoverageKm;
      const isLongRange = distanceKm > scheduledDeliveryLimitKm;
      return {
        valid: true,
        sameDay: schedule.sameDay,
        paidDelivery: isPaidDelivery,
        longRange: isLongRange,
        allowFastDelivery: isPaidDelivery,
        distanceKm,
        durationText: element.duration.text,
        fee,
        address: geocodedDestination.formattedAddress,
        deliveryWindow: schedule.window,
        deliveryType: schedule.type,
        deliveryCaption: schedule.caption,
        message: 'Sí realizamos entregas en tu zona.',
      };
    } catch (error) {
      debugDelivery('Error exacto al calcular entrega:', error);
      return {
        valid: false,
        message: error.message || 'Hubo un problema validando la cobertura. Intenta escribir dirección completa con colonia y alcaldía/municipio.',
      };
    }
  };

  const renderDeliveryResult = (estimate) => {
    if (!deliveryResult) return;
    latestDeliveryEstimate = estimate.valid ? estimate : null;
    if (acceptDeliverySelectionButton) {
      acceptDeliverySelectionButton.classList.toggle('hidden', !estimate.valid);
    }
    if (deliveryFlashRow) {
      deliveryFlashRow.classList.toggle('hidden', !estimate.valid || !estimate.allowFastDelivery);
    }
    if (deliveryFlashCheckbox && (!estimate.valid || !estimate.allowFastDelivery)) {
      deliveryFlashCheckbox.checked = false;
    }
    if (!estimate.valid) {
      const isCoverageValidationError = estimate.message.includes('Hubo un problema validando la cobertura');
      deliveryResult.innerHTML = `
        <div class="delivery-status-card delivery-status-card-error">
          <div class="delivery-result-heading">
            <span class="delivery-result-icon">!</span>
            <div>
              <strong>${estimate.noCoverage ? 'Por el momento no tenemos cobertura' : estimate.message === 'Código postal inválido.' ? 'Código postal inválido' : estimate.minimumRequired ? 'Pedido mínimo requerido' : isCoverageValidationError ? 'Hubo un problema validando la cobertura' : 'No se pudo calcular la ruta'}</strong>
              <p>${estimate.message}</p>
            </div>
          </div>
          ${estimate.distanceKm ? `<div class="delivery-info-grid"><span><em>📍</em><small>Distancia estimada</small><b>${estimate.distanceKm.toFixed(1)} km</b></span></div>` : ''}
        </div>
      `;
      return;
    }
    const wantsFastDelivery = Boolean(deliveryFlashCheckbox?.checked && estimate.allowFastDelivery);
    const displayedDeliveryFee = estimate.fee + (wantsFastDelivery ? fastDeliveryExtraFee : 0);
    const baseFeeIsFree = estimate.fee === 0;
    const feeBadgeClass = baseFeeIsFree ? 'delivery-badge-free' : 'delivery-badge-paid';
    const feeBadgeText = baseFeeIsFree ? 'Envío GRATIS' : 'Envío $200 MXN';
    const mainIcon = wantsFastDelivery ? '⚡' : baseFeeIsFree ? '✅' : '🚚';
    const displayedType = wantsFastDelivery ? 'Entrega flash' : (estimate.deliveryType || 'Envío');
    deliveryResult.innerHTML = `
      <div class="delivery-status-card delivery-status-card-ok">
        <div class="delivery-result-heading">
          <span class="delivery-result-icon">${mainIcon}</span>
          <div>
            <strong>Entrega disponible</strong>
            <p>${estimate.address || 'Zona validada para entrega'}</p>
          </div>
          <span class="delivery-badge ${feeBadgeClass}">${feeBadgeText}</span>
        </div>
        <div class="delivery-info-grid">
          <span><em>📍</em><small>Distancia</small><b>${estimate.distanceKm.toFixed(1)} km</b></span>
          <span><em>🚚</em><small>Tipo de entrega</small><b>${displayedType}</b></span>
          <span><em>⏰</em><small>Programación</small><b>${estimate.deliveryWindow}</b></span>
          <span><em>💰</em><small>Costo de envío</small><b>${formatDeliveryFee(estimate.fee)}</b></span>
        </div>
        ${wantsFastDelivery ? `
          <div class="delivery-fast-note">
            <div class="delivery-info-grid delivery-info-grid-compact">
              <span><em>⚡</em><small>Entrega flash</small><b>+${formatCurrency(fastDeliveryExtraFee)}</b></span>
              <span><em>🧾</em><small>Total envío</small><b>${formatCurrency(displayedDeliveryFee)}</b></span>
            </div>
            <p>Checaremos disponibilidad de entrega rápida con un asesor.</p>
          </div>
        ` : ''}
      </div>
    `;
  };

  const updateDeliverySummary = () => {
    if (!cartDeliverySummaryEl) return;
    if (deliveryState.type === 'pickup') {
      cartDeliverySummaryEl.textContent = 'Recogida en tienda seleccionada. Sin costo adicional.';
      cartDeliverySummaryEl.classList.remove('hidden');
      return;
    }
    if (deliveryState.type === 'delivery') {
      cartDeliverySummaryEl.innerHTML = `Entrega a domicilio: ${deliveryState.note}`;
      cartDeliverySummaryEl.classList.remove('hidden');
      return;
    }
    cartDeliverySummaryEl.classList.add('hidden');
  };

  const setDeliveryState = (state) => {
    Object.assign(deliveryState, state);
    if (deliveryState.type === 'pickup') {
      deliveryState.baseFee = 0;
      deliveryState.fastFee = 0;
      deliveryState.fee = 0;
      deliveryState.note = 'Recoger en tienda';
    }
    updateDeliverySummary();
    renderCart();
  };

  const showDeliveryModal = ({ payOnly = false } = {}) => {
    if (!deliveryModal) return;
    deliveryModal.dataset.mode = payOnly ? 'pay' : 'delivery';
    deliveryState.type = 'delivery';
    deliveryState.pickupConfirmed = false;
    deliveryModal.classList.remove('hidden');
    const radio = document.querySelector(`input[name="delivery-type"][value="${deliveryState.type}"]`);
    if (radio) radio.checked = true;
    if (deliveryState.type === 'delivery') {
      if (deliveryPostalInput) deliveryPostalInput.value = deliveryState.postalCode || '';
      if (deliveryPostalRow) deliveryPostalRow.classList.remove('hidden');
      if (deliveryFlashRow) {
        deliveryFlashRow.classList.toggle('hidden', !latestDeliveryEstimate?.allowFastDelivery);
      }
    } else {
      if (deliveryPostalRow) deliveryPostalRow.classList.add('hidden');
      if (deliveryFlashRow) deliveryFlashRow.classList.add('hidden');
    }
    if (deliveryResult) {
      deliveryResult.innerHTML = deliveryState.type === 'delivery'
        ? `<div class="delivery-status-card"><p>${deliveryState.note}</p></div>`
        : '<div class="delivery-status-card"><p>Elige entrega a domicilio para calcular cobertura, distancia, tiempo y costo.</p></div>';
    }
    if (acceptDeliverySelectionButton) {
      acceptDeliverySelectionButton.classList.toggle('hidden', !deliveryState.postalCode || !deliveryState.durationText);
    }
    if (deliveryFlashCheckbox) deliveryFlashCheckbox.checked = deliveryState.fastDelivery;
  };

  const hideDeliveryModal = () => {
    if (!deliveryModal) return;
    deliveryModal.classList.add('hidden');
  };

  const refreshDeliveryResult = () => {
    if (!deliveryResult) return;
    if (deliveryState.type === 'pickup') {
      deliveryResult.innerHTML = '<div class="delivery-status-card"><p>Recoger en tienda seleccionado. Sin costo adicional.</p></div>';
      return;
    }
    if (deliveryFlashRow) deliveryFlashRow.classList.add('hidden');
    if (acceptDeliverySelectionButton) acceptDeliverySelectionButton.classList.add('hidden');
    deliveryResult.innerHTML = '<div class="delivery-status-card"><p>Ingresa tu código postal o dirección y presiona Calcular entrega.</p></div>';
  };

  const applyDeliverySelection = async () => {
    const deliveryTypeInput = document.querySelector('input[name="delivery-type"]:checked');
    const selectedType = deliveryTypeInput ? deliveryTypeInput.value : 'pickup';
    const destination = deliveryPostalInput ? deliveryPostalInput.value.trim() : '';
    if (selectedType === 'delivery') {
      if (deliveryResult) {
        deliveryResult.innerHTML = '<div class="delivery-status-card"><p>Calculando ruta con Google Maps...</p></div>';
      }
      const estimate = await calculateDeliveryEstimate(destination);
      renderDeliveryResult(estimate);
      if (!estimate.valid) {
        return false;
      }
      const wantsFastDelivery = Boolean(deliveryFlashCheckbox?.checked && estimate.allowFastDelivery);
      const deliveryFee = estimate.fee + (wantsFastDelivery ? fastDeliveryExtraFee : 0);
      const deliveryFeeText = formatDeliveryFee(deliveryFee);
      deliveryState.type = 'delivery';
      deliveryState.postalCode = destination;
      deliveryState.sameDay = estimate.sameDay;
      deliveryState.flash = wantsFastDelivery;
      deliveryState.fastDelivery = wantsFastDelivery;
      deliveryState.baseFee = estimate.fee;
      deliveryState.fastFee = wantsFastDelivery ? fastDeliveryExtraFee : 0;
      deliveryState.fee = deliveryFee;
      deliveryState.distanceKm = estimate.distanceKm;
      deliveryState.durationText = estimate.durationText;
      deliveryState.deliveryWindow = estimate.deliveryWindow;
      deliveryState.pickupConfirmed = false;
      if (pickupOptionButton) pickupOptionButton.classList.remove('is-selected');
      if (deliveryOptionsButton) deliveryOptionsButton.classList.add('is-selected');
      deliveryState.note = `${estimate.message}. ${wantsFastDelivery ? 'Entrega flash solicitada' : estimate.deliveryWindow}. Distancia: ${estimate.distanceKm.toFixed(1)} km. Envío: ${deliveryFeeText}${wantsFastDelivery ? '. Un asesor validará disponibilidad.' : '.'}`;
    } else {
      deliveryState.type = 'pickup';
      deliveryState.postalCode = '';
      deliveryState.sameDay = false;
      deliveryState.flash = false;
      deliveryState.fastDelivery = false;
      deliveryState.baseFee = 0;
      deliveryState.fastFee = 0;
      deliveryState.fee = 0;
      deliveryState.distanceKm = 0;
      deliveryState.durationText = '';
      deliveryState.deliveryWindow = '';
      deliveryState.pickupConfirmed = true;
      deliveryState.note = 'Recoger en tienda';
      latestDeliveryEstimate = null;
      refreshDeliveryResult();
    }
    return true;
  };

  const toggleDeliveryMode = (mode) => {
    if (!deliveryPostalRow) return;
    if (mode === 'delivery') {
      deliveryPostalRow.classList.remove('hidden');
      if (deliveryFlashRow) deliveryFlashRow.classList.add('hidden');
    } else {
      deliveryPostalRow.classList.add('hidden');
      if (deliveryFlashRow) deliveryFlashRow.classList.add('hidden');
    }
  };

  const updateCartTotalWithDelivery = () => {
    if (!cartTotalEl) return;
    const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = itemsTotal + deliveryState.fee;
    cartTotalEl.textContent = formatCurrency(total);
  };

  const renderCartTotalBreakdown = (itemsTotal) => {
    if (!cartTotalBreakdownEl) return;
    if (cart.length === 0) {
      cartTotalBreakdownEl.innerHTML = '';
      return;
    }
    const rows = [
      { label: 'Subtotal', value: formatCurrency(itemsTotal) },
      ...getShippingSummaryRows(),
      { label: 'Total', value: formatCurrency(itemsTotal + deliveryState.fee), total: true },
    ];
    cartTotalBreakdownEl.innerHTML = rows.map((row) => `
      <div class="cart-total-row ${row.total ? 'cart-total-row-strong' : ''}">
        <span>${row.label}</span>
        <b class="${row.free ? 'delivery-free-text' : ''}">${row.value}</b>
      </div>
    `).join('');
  };

  const renderCartWithDelivery = () => {
    renderCart();
    updateDeliverySummary();
  };

  const getCartSummaryText = () => cart.map((item) => (
    `${item.quantity} x ${item.name}${item.description ? ` (${item.description})` : ''} - ${formatCurrency(item.price * item.quantity)}`
  )).join('\n');

  const getDeliveryLineForSummary = () => {
    if (deliveryState.type === 'pickup') return 'Pick Up: Sin costo';
    if (deliveryState.fee === 0) return 'Envío: GRATIS';
    const rows = getShippingSummaryRows().map((row) => `${row.label}: ${row.value}`);
    return rows.join('\n');
  };

  const paymentMethodLabels = {
    transfer: 'Transferencia',
    mercado: 'Mercado Pago',
    cash: 'Efectivo en tienda',
  };

  const getSelectedPaymentMethod = () => {
    const selectedButton = Array.from(paymentMethodButtons).find((button) => button.classList.contains('is-selected'));
    return selectedButton?.dataset.paymentMethod || 'transfer';
  };

  const getOrderDiscount = () => Number(window.ORDER_DISCOUNT_AMOUNT || 0);

  const getCustomerData = () => ({
    name: paymentCustomerNameInput?.value.trim() || '',
    phone: getPhoneDigits(paymentCustomerPhoneInput?.value || ''),
    email: paymentCustomerEmailInput?.value.trim() || '',
    address: paymentCustomerAddressInput?.value.trim() || '',
  });

  const getDeliveryMethodLabel = () => deliveryState.type === 'delivery' ? 'Envío' : 'Pick up';

  const getOrderTotals = () => {
    const subtotal = getCartSubtotal();
    const shipping = Number(deliveryState.fee || 0);
    const discount = getOrderDiscount();
    return {
      subtotal,
      shipping,
      discount,
      total: Math.max(0, subtotal + shipping - discount),
    };
  };

  const buildOrderSummaryData = () => {
    const customer = getCustomerData();
    const totals = getOrderTotals();
    const paymentMethod = getSelectedPaymentMethod();
    const fallbackAddress = deliveryState.type === 'pickup'
      ? storeAddress
      : (deliveryState.postalCode || deliveryPostalInput?.value.trim() || 'Dirección pendiente de confirmar');

    return {
      customer: {
        ...customer,
        name: customer.name || 'Cliente',
        phone: customer.phone || 'Teléfono pendiente',
        email: customer.email || 'Correo pendiente',
        address: customer.address || fallbackAddress,
      },
      deliveryMethod: getDeliveryMethodLabel(),
      deliveryDetails: deliveryState.note || getDeliveryLineForSummary(),
      paymentMethod: paymentMethodLabels[paymentMethod] || paymentMethodLabels.transfer,
      products: cart.map((item) => ({
        name: item.name,
        description: item.description || '',
        quantity: item.quantity,
        unitPrice: item.price,
        lineTotal: item.price * item.quantity,
      })),
      totals,
    };
  };

  const buildOrderSummaryText = (intro = 'Nuevo pedido Ruben\'s Distribuidora') => {
    const order = buildOrderSummaryData();
    const productLines = order.products.map((item) => (
      `- ${item.quantity} x ${item.name}${item.description ? ` (${item.description})` : ''} | ${formatCurrency(item.lineTotal)}`
    )).join('\n');

    return `${intro}

Datos del cliente:
Nombre: ${order.customer.name}
Teléfono: ${order.customer.phone}
Correo: ${order.customer.email}
Dirección: ${order.customer.address}

Entrega: ${order.deliveryMethod}
Detalle de entrega: ${order.deliveryDetails}
Método de pago: ${order.paymentMethod}

Productos:
${productLines}

Subtotal: ${formatCurrency(order.totals.subtotal)}
Envío: ${formatCurrency(order.totals.shipping)}
Descuento: ${formatCurrency(order.totals.discount)}
Total final: ${formatCurrency(order.totals.total)}`;
  };

  const openOrderWhatsapp = (orderText) => {
    window.open(`https://wa.me/${paymentWhatsappNumber}?text=${encodeURIComponent(orderText)}`, '_blank');
  };

  const getCustomerConfirmationMessage = () => (
    `Gracias por tu compra. Recibimos tu pedido y en breve confirmaremos disponibilidad y detalles de entrega.\n\n${buildOrderSummaryText('Resumen de pedido')}`
  );

  const setPaymentFieldError = (input, message = '') => {
    if (!input) return;
    input.classList.toggle('field-invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    const feedback = document.getElementById(`${input.id}-error`);
    if (feedback) {
      feedback.textContent = message;
    }
  };

  const clearPaymentValidation = () => {
    [paymentCustomerNameInput, paymentCustomerPhoneInput, paymentCustomerEmailInput, paymentCustomerAddressInput]
      .forEach((input) => setPaymentFieldError(input));
    if (paymentFormStatusEl) {
      paymentFormStatusEl.textContent = '';
      paymentFormStatusEl.classList.remove('is-error');
    }
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  const getPhoneDigits = (value) => value.replace(/\D/g, '');
  const getMexicanPhoneDigits = (value) => getPhoneDigits(value).slice(0, 10);
  const isValidMexicanPhone = (value) => getMexicanPhoneDigits(value).length === 10;
  const phoneValidationMessage = 'Ingresa un número válido de 10 dígitos';
  const requiredPaymentMessage = 'Llena los campos obligatorios';
  let paymentStatusTimeout = null;

  const sanitizePaymentPhoneInput = () => {
    if (!paymentCustomerPhoneInput) return '';
    const sanitizedValue = getMexicanPhoneDigits(paymentCustomerPhoneInput.value);
    if (paymentCustomerPhoneInput.value !== sanitizedValue) {
      paymentCustomerPhoneInput.value = sanitizedValue;
    }
    return sanitizedValue;
  };

  const validatePaymentPhoneField = ({ showEmpty = false } = {}) => {
    if (!paymentCustomerPhoneInput) return true;
    const phoneDigits = sanitizePaymentPhoneInput();
    const shouldShowError = (showEmpty || phoneDigits.length > 0) && phoneDigits.length !== 10;
    setPaymentFieldError(paymentCustomerPhoneInput, shouldShowError ? phoneValidationMessage : '');
    return phoneDigits.length === 10;
  };

  const updatePaymentActionState = () => {
    const nameIsValid = (paymentCustomerNameInput?.value.trim() || '').length >= 2;
    const emailIsValid = isValidEmail(paymentCustomerEmailInput?.value.trim() || '');
    const phoneIsValid = isValidMexicanPhone(paymentCustomerPhoneInput?.value || '');
    const paymentDataIsValid = nameIsValid && emailIsValid && phoneIsValid;
    [sendTransferWhatsappButton, mercadoPagoButton, mercadoWhatsappFallbackButton, payInStoreWhatsappButton]
      .forEach((button) => {
        if (!button) return;
        button.setAttribute('aria-disabled', String(!paymentDataIsValid));
        button.classList.toggle('is-payment-blocked', !paymentDataIsValid);
      });
  };

  const showPaymentRequiredNotice = () => {
    if (!paymentFormStatusEl) return;
    clearTimeout(paymentStatusTimeout);
    paymentFormStatusEl.textContent = requiredPaymentMessage;
    paymentFormStatusEl.classList.add('is-error');
    paymentFormStatusEl.classList.add('is-floating');
    paymentStatusTimeout = setTimeout(() => {
      paymentFormStatusEl.textContent = '';
      paymentFormStatusEl.classList.remove('is-error');
      paymentFormStatusEl.classList.remove('is-floating');
    }, 3000);
  };

  const validateOrderCustomerData = () => {
    const customer = getCustomerData();
    clearPaymentValidation();
    const validationMessages = [];

    if (!customer.name || customer.name.length < 2) {
      setPaymentFieldError(paymentCustomerNameInput, 'Ingresa tu nombre');
      validationMessages.push('nombre');
    }

    if (!customer.phone || customer.phone.length !== 10) {
      setPaymentFieldError(paymentCustomerPhoneInput, phoneValidationMessage);
      validationMessages.push('teléfono');
    }

    if (!customer.email) {
      setPaymentFieldError(paymentCustomerEmailInput, 'Ingresa un correo válido');
      validationMessages.push('correo');
    } else if (!isValidEmail(customer.email)) {
      setPaymentFieldError(paymentCustomerEmailInput, 'Ingresa un correo válido');
      validationMessages.push('correo válido');
    }

    if (deliveryState.type === 'delivery' && !customer.address && !deliveryState.postalCode) {
      setPaymentFieldError(paymentCustomerAddressInput, 'Comparte tu dirección para calcular y confirmar la entrega.');
      validationMessages.push('dirección');
    }

    if (validationMessages.length) {
      showPaymentRequiredNotice();
      const firstInvalidField = [paymentCustomerNameInput, paymentCustomerPhoneInput, paymentCustomerEmailInput, paymentCustomerAddressInput]
        .find((input) => input?.classList.contains('field-invalid'));
      firstInvalidField?.focus({ preventScroll: true });
      firstInvalidField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }

    return true;
  };

  const setOrderEmailStatus = (message, isError = false) => {
    if (!orderEmailStatusEl) return;
    orderEmailStatusEl.textContent = message;
    orderEmailStatusEl.classList.toggle('is-error', isError);
  };

  const loadEmailJsSdk = () => new Promise((resolve, reject) => {
    if (window.emailjs) {
      resolve(window.emailjs);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => resolve(window.emailjs);
    script.onerror = () => reject(new Error('No se pudo cargar EmailJS.'));
    document.head.appendChild(script);
  });

  const sendOrderEmailsWithEmailJs = async (orderText) => {
    const emailjsClient = await loadEmailJsSdk();
    const {
      emailjsPublicKey,
      emailjsServiceId,
      emailjsCustomerTemplateId,
      emailjsStoreTemplateId,
      storeEmail,
    } = orderEmailConfig;
    const order = buildOrderSummaryData();
    emailjsClient.init({ publicKey: emailjsPublicKey });
    const templateParams = {
      customer_name: order.customer.name,
      customer_phone: order.customer.phone,
      customer_email: order.customer.email,
      customer_address: order.customer.address,
      delivery_method: order.deliveryMethod,
      delivery_details: order.deliveryDetails,
      payment_method: order.paymentMethod,
      products: order.products.map((item) => `${item.quantity} x ${item.name} - ${formatCurrency(item.lineTotal)}`).join('\n'),
      subtotal: formatCurrency(order.totals.subtotal),
      shipping: formatCurrency(order.totals.shipping),
      discount: formatCurrency(order.totals.discount),
      total: formatCurrency(order.totals.total),
      order_summary: orderText,
      customer_subject: 'Confirmación de pedido - Ruben’s Distribuidora',
      store_subject: 'Nuevo pedido recibido - Ruben’s Distribuidora',
      customer_message: getCustomerConfirmationMessage(),
      store_email: storeEmail,
      to_email: order.customer.email,
      reply_to: order.customer.email,
    };

    await Promise.all([
      emailjsClient.send(emailjsServiceId, emailjsCustomerTemplateId, templateParams),
      emailjsClient.send(emailjsServiceId, emailjsStoreTemplateId, {
        ...templateParams,
        to_email: storeEmail,
      }),
    ]);
  };

  const sendOrderEmailsWithFormspree = async (orderText) => {
    const order = buildOrderSummaryData();
    const response = await fetch(orderEmailConfig.formspreeEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: 'Nuevo pedido recibido - Ruben’s Distribuidora',
        customer_subject: 'Confirmación de pedido - Ruben’s Distribuidora',
        customer_message: getCustomerConfirmationMessage(),
        store_message: orderText,
        name: order.customer.name,
        phone: order.customer.phone,
        email: order.customer.email,
        _replyto: order.customer.email,
        store_email: orderEmailConfig.storeEmail,
      }),
    });

    if (!response.ok) {
      throw new Error('Formspree no pudo recibir el pedido.');
    }
  };

  const sendOrderEmails = async (orderText) => {
    const provider = (orderEmailConfig.provider || 'none').toLowerCase();
    const hasEmailJsConfig = orderEmailConfig.emailjsPublicKey
      && orderEmailConfig.emailjsServiceId
      && orderEmailConfig.emailjsCustomerTemplateId
      && orderEmailConfig.emailjsStoreTemplateId;
    const hasFormspreeConfig = Boolean(orderEmailConfig.formspreeEndpoint);

    if (provider === 'emailjs' && hasEmailJsConfig) {
      await sendOrderEmailsWithEmailJs(orderText);
      return 'Correos de confirmación enviados.';
    }
    if (provider === 'formspree' && hasFormspreeConfig) {
      await sendOrderEmailsWithFormspree(orderText);
      return 'Pedido enviado por correo mediante Formspree.';
    }
    return 'Correo listo para configurar: agrega EmailJS o Formspree en ORDER_EMAIL_CONFIG.';
  };

  const sendOrderByWhatsapp = (intro = 'Hola, quiero confirmar este pedido en Ruben\'s Distribuidora') => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío. Agrega productos para continuar.');
      return;
    }
    if (!validateOrderCustomerData()) return;

    const orderText = buildOrderSummaryText(intro);
    openOrderWhatsapp(orderText);

    setOrderEmailStatus('Preparando confirmación por correo...');
    sendOrderEmails(orderText)
      .then((message) => setOrderEmailStatus(message))
      .catch(() => {
        setOrderEmailStatus('No se pudo enviar el correo automático. El pedido por WhatsApp sí quedó preparado.', true);
      });
  };

  const renderPaymentSummary = () => {
    if (!paymentSummaryEl) return;
    const totals = getOrderTotals();
    const shippingRows = getShippingSummaryRows();
    paymentSummaryEl.innerHTML = `
      <strong>Resumen de compra</strong>
      <div class="payment-summary-list">
        <span>Subtotal</span><b>${formatCurrency(totals.subtotal)}</b>
        ${shippingRows.map((row) => `<span>${row.label}</span><b class="${row.free ? 'delivery-free-text' : ''}">${row.value}</b>`).join('')}
        <span>Descuento</span><b>${formatCurrency(totals.discount)}</b>
        <span>Total</span><b>${formatCurrency(totals.total)}</b>
      </div>
    `;
  };

  const selectPaymentMethod = (method) => {
    paymentMethodButtons.forEach((button) => {
      button.classList.toggle('is-selected', button.dataset.paymentMethod === method);
    });
    if (paymentTransferPanel) paymentTransferPanel.classList.toggle('hidden', method !== 'transfer');
    if (paymentMercadoPanel) paymentMercadoPanel.classList.toggle('hidden', method !== 'mercado');
    if (paymentCashPanel) paymentCashPanel.classList.toggle('hidden', method !== 'cash');
    if (method !== 'mercado' && mercadoWhatsappFallbackButton) {
      mercadoWhatsappFallbackButton.classList.add('hidden');
    }
  };

  const showPaymentModal = () => {
    if (!paymentModal) return;
    if (paymentCustomerAddressInput && !paymentCustomerAddressInput.value.trim()) {
      paymentCustomerAddressInput.value = deliveryState.type === 'delivery'
        ? (deliveryState.postalCode || deliveryPostalInput?.value.trim() || '')
        : storeAddress;
    }
    setOrderEmailStatus('');
    renderPaymentSummary();
    const cashAllowed = deliveryState.type === 'pickup' && deliveryState.pickupConfirmed;
    if (cashPaymentOption) cashPaymentOption.classList.toggle('hidden', !cashAllowed);
    selectPaymentMethod('transfer');
    sanitizePaymentPhoneInput();
    validatePaymentPhoneField({ showEmpty: true });
    updatePaymentActionState();
    paymentModal.classList.remove('hidden');
  };

  const hidePaymentModal = () => {
    if (paymentModal) paymentModal.classList.add('hidden');
  };

  const getTransferBankText = () => {
    const bankData = [
      ['Banco', paymentBankInput?.value.trim()],
      ['Beneficiario', paymentBeneficiaryInput?.value.trim()],
      ['Cuenta', paymentAccountInput?.value.trim()],
      ['CLABE', paymentClabeInput?.value.trim()],
      ['Concepto', paymentConceptInput?.value.trim()],
    ].filter(([, value]) => value);
    return bankData.length
      ? `\nDatos SPEI capturados:\n${bankData.map(([label, value]) => `${label}: ${value}`).join('\n')}`
      : '';
  };

  const buildTransferWhatsappMessage = () => {
    const orderText = buildOrderSummaryText('Confirmo este pedido en Ruben\'s Distribuidora');
    return `Hola, adjunto mi comprobante de transferencia SPEI para validar mi pedido.\n\n${orderText}${getTransferBankText()}`;
  };

  const openTransferWhatsapp = () => {
    if (!validateOrderCustomerData()) return;
    const message = encodeURIComponent(buildTransferWhatsappMessage());
    window.open(`https://wa.me/${paymentWhatsappNumber}?text=${message}`, '_blank');
  };

  const stopPaymentActionIfInvalid = (event) => {
    const target = event.target?.closest?.('#send-transfer-whatsapp, #mercadoPagoBtn, #mercado-whatsapp-fallback, #pay-in-store-whatsapp');
    if (!target) return false;
    if (validateOrderCustomerData()) return false;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    return true;
  };

  const copyTextToClipboard = async (text) => {
    if (!text) return false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const showSpeiCopyStatus = (message) => {
    if (!speiCopyStatus) return;
    speiCopyStatus.textContent = message;
    setTimeout(() => {
      if (speiCopyStatus.textContent === message) {
        speiCopyStatus.textContent = '';
      }
    }, 2500);
  };

  const loadMercadoPagoSdk = () => new Promise((resolve, reject) => {
    if (window.MercadoPago) {
      resolve(window.MercadoPago);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => resolve(window.MercadoPago);
    script.onerror = () => reject(new Error('No se pudo cargar Mercado Pago.'));
    document.head.appendChild(script);
  });

  const openMercadoPagoCheckout = async (preferenceId) => {
    if (!preferenceId) {
      throw new Error('Falta configurar el preferenceId de Mercado Pago.');
    }
    const MercadoPagoSdk = await loadMercadoPagoSdk();
    const mercadoPago = new MercadoPagoSdk(mercadoPagoPublicKey, { locale: 'es-MX' });
    mercadoPago.checkout({
      preference: { id: preferenceId },
      autoOpen: true,
    });
  };

  const createMercadoPagoPreference = async () => {
    /*
      Mercado Pago Checkout Pro requiere crear una preference_id en un backend.
      La Public Key puede estar en frontend, pero el Access Token NO debe exponerse
      en GitHub Pages ni en ningún archivo público.

      Netlify ejecuta /.netlify/functions/createPreference en servidor.
      Ahí debe configurarse MERCADO_PAGO_ACCESS_TOKEN como variable de entorno.
    */
    const order = buildOrderSummaryData();
    const response = await fetch('/.netlify/functions/createPreference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cart,
        shippingCost: deliveryState.type === 'delivery' ? deliveryState.fee : 0,
        deliveryMethod: order.deliveryMethod,
        customer: order.customer,
        total: order.totals.total,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || data.error || 'No se pudo crear la preferencia de Mercado Pago.');
    }

    if (data.init_point || data.sandbox_init_point) {
      window.MERCADO_PAGO_CHECKOUT_URL = data.sandbox_init_point || data.init_point;
    }

    return data.preference_id || data.id || null;
  };

  const buildMercadoPagoValidationMessage = () => (
    `${buildOrderSummaryText('Hola, quiero pagar con Mercado Pago este pedido en Ruben\'s Distribuidora')}\n\nPago con Mercado Pago en validación.`
  );

  const openMercadoPagoFallbackWhatsapp = () => {
    const message = encodeURIComponent(buildMercadoPagoValidationMessage());
    window.open(`https://wa.me/${paymentWhatsappNumber}?text=${message}`, '_blank');
    setOrderEmailStatus('Mercado Pago queda en validación por WhatsApp hasta conectar el backend seguro.');
  };

  const showMercadoPagoSetupMessage = () => {
    setOrderEmailStatus('Mercado Pago aún está en configuración. Puedes enviar tu pedido por WhatsApp mientras habilitamos el pago en línea.');
    if (mercadoWhatsappFallbackButton) {
      mercadoWhatsappFallbackButton.classList.remove('hidden');
    }
  };

  const handleMercadoPagoPayment = async () => {
    if (!validateOrderCustomerData()) return;
    if (mercadoWhatsappFallbackButton) {
      mercadoWhatsappFallbackButton.classList.add('hidden');
    }

    try {
      const createdPreferenceId = await createMercadoPagoPreference();
      const preferenceId = createdPreferenceId || mercadoPagoPreferenceId;

      if (preferenceId) {
        rememberMercadoPagoOrder();
        try {
          await openMercadoPagoCheckout(preferenceId);
        } catch (error) {
          const checkoutUrl = window.MERCADO_PAGO_CHECKOUT_URL || mercadoPagoLink;
          if (checkoutUrl) {
            window.open(checkoutUrl, '_blank');
            return;
          }
          throw error;
        }
        return;
      }

      const checkoutUrl = window.MERCADO_PAGO_CHECKOUT_URL || mercadoPagoLink;
      if (checkoutUrl) {
        rememberMercadoPagoOrder();
        window.open(checkoutUrl, '_blank');
        return;
      }

      await abrirMercadoPago();
    } catch (error) {
      await abrirMercadoPago();
    }
  };

  const isMercadoPagoApprovedReturn = () => {
    const params = new URLSearchParams(window.location.search);
    const successValues = ['approved', 'success', 'accredited'];
    return successValues.includes((params.get('status') || '').toLowerCase())
      || successValues.includes((params.get('collection_status') || '').toLowerCase())
      || successValues.includes((params.get('payment_status') || '').toLowerCase());
  };

  const rememberMercadoPagoOrder = () => {
    const orderText = buildOrderSummaryText('Pago aprobado por Mercado Pago. Confirmo este pedido en Ruben\'s Distribuidora');
    localStorage.setItem(mercadoPagoPendingOrderKey, JSON.stringify({
      orderText,
      createdAt: Date.now(),
    }));
  };

  const sendPendingMercadoPagoOrder = () => {
    if (!isMercadoPagoApprovedReturn()) return;
    const savedOrder = localStorage.getItem(mercadoPagoPendingOrderKey);
    if (!savedOrder) return;

    try {
      const pendingOrder = JSON.parse(savedOrder);
      if (pendingOrder?.orderText) {
        openOrderWhatsapp(pendingOrder.orderText);
        localStorage.removeItem(mercadoPagoPendingOrderKey);
      }
    } catch (error) {
      localStorage.removeItem(mercadoPagoPendingOrderKey);
    }
  };

  const renderSubcategoryOptions = (category) => {
    if (!subcategoryFilter) return;
    subcategoryFilter.innerHTML = '<option value="all">Todas</option>';

    if (!category || category === 'all') {
      subcategoryFilter.disabled = true;
      return;
    }

    subcategories[category].forEach((sub) => {
      const option = document.createElement('option');
      option.value = sub.toLowerCase().replace(/\s+/g, '-');
      option.textContent = sub;
      subcategoryFilter.appendChild(option);
    });
    subcategoryFilter.disabled = false;
  };

  const normalizeSubcategory = (value) => value.toLowerCase().replace(/\s+/g, '-');
  const getEffectiveSizeOptions = (product) => product.selectedPaletteColor?.sizeOptions || product.sizeOptions;

  const createProductCard = (product) => {
    const card = document.createElement('article');
    card.className = 'product-card reveal';
    card.dataset.productId = product.id;
    const ratingValue = Math.max(0, Math.min(5, Number(product.rating) || 0));
    const ratingVotes = Number(product.ratingVotes) || 0;
    const stars = Array.from({ length: 5 }, (_, index) => {
      const value = index + 1;
      const isActive = value <= ratingValue ? ' active' : '';
      return `<button class="rating-star${isActive}" type="button" data-product-id="${product.id}" data-rating="${value}" aria-label="Calificar ${value} de 5">&#9733;</button>`;
    }).join('');
    let imageMarkup = '';
    if (product.category === 'aerosoles' && product.image) {
      imageMarkup = `
        <div class="aerosol-image-wrapper">
          <img src="${product.image}" alt="${product.name}" class="aerosol-bg-image">
          <div class="swatch-circle" style="background:${product.colorSwatch};"></div>
        </div>
      `;
    } else if (product.image) {
      imageMarkup = `<img src="${product.image}" alt="${product.name}" class="${product.imageFit === 'contain' ? 'product-image-contain' : ''}">`;
    } else if (product.colorSwatch) {
      imageMarkup = `<div class="swatch-circle" style="background:${product.colorSwatch};"></div>`;
    } else {
      imageMarkup = 'Imagen';
    }

    const sizeOptions = getEffectiveSizeOptions(product);
    const sizeSelectorMarkup = sizeOptions ? `
      <div class="size-selector">
        ${sizeOptions.map((option) => `
          <button type="button" class="size-option" data-size="${option.id}" data-price="${option.price}">${option.label}</button>
        `).join('')}
      </div>
    ` : '<div class="size-selector size-selector-placeholder" aria-hidden="true"></div>';
    const finishSelectorMarkup = product.finishOptions ? `
      <div class="size-selector finish-selector" aria-label="Selecciona acabado">
        ${product.finishOptions.map((finish) => `
          <button type="button" class="finish-option" data-finish="${finish}">${finish}</button>
        `).join('')}
      </div>
    ` : '';

    const initialPriceText = sizeOptions ? 'Seleccione tamaño' : formatCurrency(product.price);
    const selectedColorText = product.selectedPaletteColor ? ` - ${product.selectedPaletteColor.name}` : '';
    const priceMarkup = `<span class="product-price">${initialPriceText}${selectedColorText}</span>`;
    const addButtonText = 'Agregar';
    const volumeMarkup = sizeOptions
      ? '<p class="product-volume">Contenido: Seleccione tamaño</p>'
      : (product.cantidad ? `<p class="product-volume">Contenido: ${product.cantidad}</p>` : '');
    const paletteButtonMarkup = product.palette ? `<button class="btn btn-primary view-palette product-action-main" type="button" data-palette-id="${product.id}">Colores</button>` : '';

    card.innerHTML = `
      <div class="product-image">${imageMarkup}</div>
      <div class="product-card-top">
        <div class="product-tag">${product.categoryLabel}</div>
        <div class="product-subtag">${product.subcategory}</div>
      </div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      ${finishSelectorMarkup}
      ${sizeSelectorMarkup}
      ${volumeMarkup}
      <div class="product-rating" aria-label="Calificación actual ${ratingValue} de 5">
        ${stars}
        <span class="rating-score">${ratingValue}.0</span>
        <span class="rating-feedback">${ratingVotes} votos</span>
      </div>
      <div class="product-footer">
        ${priceMarkup}
        <div class="product-actions">
          ${paletteButtonMarkup}
          <div class="product-action-row">
            <button class="btn btn-secondary add-to-cart product-action-small" data-product-id="${product.id}">${addButtonText}</button>
            <button class="btn btn-secondary view-detail product-action-small" type="button" data-detail-id="${product.id}">Detalle</button>
          </div>
        </div>
      </div>
      <p class="product-error hidden"></p>
      <p class="product-sku">CLAVE: ${product.id.toUpperCase()}</p>
    `;
    return card;
  };

  const renderProductGrid = (container, products, emptyMessage) => {
    if (!container) return;
    container.innerHTML = '';

    if (products.length === 0) {
      container.innerHTML = `<p class="no-results">${emptyMessage}</p>`;
      return;
    }

    products.forEach((product) => container.appendChild(createProductCard(product)));
  };

  const updateProductCardSelection = (product) => {
    document.querySelectorAll(`.product-card[data-product-id="${product.id}"]`).forEach((card) => {
      const priceEl = card.querySelector('.product-price');
      if (priceEl) {
        priceEl.textContent = product.sizeOptions
          ? `Seleccione tamaño - ${product.selectedPaletteColor.name}`
          : `${formatCurrency(product.price)} - ${product.selectedPaletteColor.name}`;
      }
      const sizeOptions = getEffectiveSizeOptions(product);
      const sizeSelector = card.querySelector('.size-selector');
      if (sizeSelector && sizeOptions) {
        sizeSelector.innerHTML = sizeOptions.map((option) => `
          <button type="button" class="size-option" data-size="${option.id}" data-price="${option.price}">${option.label}</button>
        `).join('');
        card.dataset.selectedSize = '';
      }
      const volumeEl = card.querySelector('.product-volume');
      if (volumeEl && sizeOptions) {
        volumeEl.textContent = 'Contenido: Seleccione tamaño';
      }
      const addButton = card.querySelector('.add-to-cart');
      if (addButton) {
        addButton.textContent = 'Agregar';
      }
    });
  };

  const renderProducts = () => {
    if (!productGeneralListEl || !productPopularListEl || !productRecommendedListEl || !productCountEl) return;

    const generalProducts = filteredProducts;
    const popularProducts = filteredProducts.filter((product) => product.popular);
    const recommendedProducts = filteredProducts.filter((product) => product.recommended);

    renderProductGrid(productGeneralListEl, generalProducts, 'No hay productos generales para esta combinación.');
    renderProductGrid(productPopularListEl, popularProducts, 'No hay productos populares para esta búsqueda.');
    renderProductGrid(productRecommendedListEl, recommendedProducts, 'No hay recomendaciones para esta fecha.');

    productCountEl.textContent = `Mostrando ${generalProducts.length} productos generales`;
  };

  const productDisplayPriority = {
    'esmalte-rocket-secado-rapido': 1,
    'esmalte-alva-fast': 2,
    'esmalte-esmalack': 3,
    'esmalte-xtrong': 4,
    'esmalte-industrial-pintura-alberca': 5,
    'esmalte-industrial-pintura-trafico': 6,
  };

  const sortByDisplayPriority = (a, b) => {
    const priorityA = productDisplayPriority[a.id] || 99;
    const priorityB = productDisplayPriority[b.id] || 99;
    if (priorityA !== priorityB) return priorityA - priorityB;
    return a.name.localeCompare(b.name);
  };

  const applyFilters = () => {
    const categoryValue = selectedCategory;
    const subcategoryValue = subcategoryFilter ? subcategoryFilter.value : 'all';
    const priceInput = document.getElementById('price-filter');
    const maxPrice = priceInput && priceInput.value.trim() !== '' ? parseFloat(priceInput.value) : null;
    const searchTerm = productSearch ? productSearch.value.trim().toLowerCase() : '';
    const sortOrder = sortOrderSelect ? sortOrderSelect.value : 'default';

    filteredProducts = products.filter((product) => {
      const categoryMatch = categoryValue === 'all' || product.category === categoryValue;
      const subcategoryMatch = subcategoryValue === 'all' || normalizeSubcategory(product.subcategory) === subcategoryValue;
      const priceMatch = maxPrice === null || product.price <= maxPrice;
      const searchMatch = !searchTerm || [product.name, product.description, product.categoryLabel, product.subcategory]
        .some((text) => text.toLowerCase().includes(searchTerm));
      return categoryMatch && subcategoryMatch && priceMatch && searchMatch;
    });

    if (sortOrder === 'price-asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (categoryValue !== 'all' && subcategories[categoryValue]) {
      const order = subcategories[categoryValue];
      filteredProducts.sort((a, b) => {
        const indexA = order.indexOf(a.subcategory);
        const indexB = order.indexOf(b.subcategory);
        if (indexA !== indexB) return indexA - indexB;
        return sortByDisplayPriority(a, b);
      });
    } else {
      filteredProducts.sort(sortByDisplayPriority);
    }

    renderProducts();
  };

  const getProductCardError = (product, selectedSize, selectedFinish) => {
    const needsSize = product.sizeOptions && !selectedSize;
    const needsColor = product.palette && !product.selectedPaletteColor;
    const needsFinish = product.finishOptions && product.finishOptions.length > 1 && !selectedFinish;
    const missing = [];
    if (needsColor) missing.push('color');
    if (needsFinish) missing.push('acabado');
    if (needsSize) missing.push('tamaño');
    if (missing.length > 1) {
      return `Aún no has agregado nada al carrito. Por favor selecciona ${missing.join(' y ')} que deseas agregar al carrito.`;
    }
    if (needsSize) {
      return 'Aún no has agregado nada al carrito. Por favor selecciona tamaño que deseas agregar al carrito.';
    }
    if (needsFinish) {
      return 'Aún no has agregado nada al carrito. Por favor selecciona acabado que deseas agregar al carrito.';
    }
    if (needsColor) {
      return 'Aún no has agregado nada al carrito. Por favor selecciona color que deseas agregar al carrito.';
    }
    return '';
  };

  const showProductCardError = (productId, message) => {
    const card = document.querySelector(`.product-card[data-product-id="${productId}"]`);
    if (!card) return;
    const errorEl = card.querySelector('.product-error');
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    setTimeout(() => {
      errorEl.classList.add('hidden');
    }, 5000);
  };

  const addProductToCart = (productId, selectedSize = null, selectedFinish = null) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    const finish = selectedFinish || (product.finishOptions && product.finishOptions.length === 1 ? product.finishOptions[0] : null);
    const errorMessage = getProductCardError(product, selectedSize, finish);
    if (errorMessage) {
      showProductCardError(productId, errorMessage);
      return;
    }

    let price = product.price;
    let name = product.name;
    let sizeKey = '';
    let colorKey = '';
    let finishKey = '';
    let description = product.detailText || product.description || '';

    if (product.selectedPaletteColor) {
      name = `${name} - ${product.selectedPaletteColor.name}`;
      colorKey = `-${product.selectedPaletteColor.name.replace(/\s+/g, '-')}`;
      description = product.selectedPaletteColor.description || `Color: ${product.selectedPaletteColor.name}`;
    }

    if (finish) {
      name = `${name} - ${finish}`;
      finishKey = `-${finish.replace(/\s+/g, '-')}`;
      description = `${description}${description ? ' · ' : ''}Acabado: ${finish}`;
    }

    const sizeOptions = getEffectiveSizeOptions(product);
    if (sizeOptions) {
      const option = selectedSize ? sizeOptions.find((opt) => opt.id === selectedSize) : null;
      const selectedOption = option || sizeOptions[0];
      if (selectedOption) {
        price = selectedOption.price;
        const selectedVariant = [product.selectedPaletteColor?.name, finish].filter(Boolean).join(' ');
        name = `${product.name}${selectedVariant ? ` - ${selectedVariant}` : ''} (${selectedOption.label})`;
        sizeKey = `-${selectedOption.id}`;
        description = `${description}${description ? ' · ' : ''}Tamaño: ${selectedOption.label}`;
      }
    }

    const cartId = `${product.id}${colorKey}${finishKey}${sizeKey}`;
    const existing = cart.find((item) => item.id === cartId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: cartId,
        name,
        price,
        description,
        color: product.selectedPaletteColor?.color || null,
        quantity: 1,
        size: selectedSize,
        finish,
      });
    }

    saveCart();
    updateCartCount();
    renderCart();
  };

  const renderCart = () => {
    if (!cartItemsEl || !cartTotalEl) return;
    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p>Aún no has agregado nada al carrito. Por favor selecciona color y tamaño que deseas agregar al carrito.</p>';
      cartTotalEl.textContent = formatCurrency(0);
      if (cartTotalBreakdownEl) cartTotalBreakdownEl.innerHTML = '';
      if (cartDeliverySummaryEl) cartDeliverySummaryEl.classList.add('hidden');
      return;
    }

    cart.forEach((item) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <div>
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-meta">${item.quantity} x ${formatCurrency(item.price)}</p>
          ${item.description ? `<p class="cart-item-description">${item.description}</p>` : ''}
        </div>
        ${item.color ? `<div class="cart-item-swatch" style="background:${item.color};"></div>` : ''}
        <div class="cart-item-actions">
          <button class="btn btn-secondary" data-action="decrease" data-cart-id="${item.id}">-</button>
          <button class="btn btn-secondary" data-action="increase" data-cart-id="${item.id}">+</button>
          <button class="btn btn-secondary" data-action="remove" data-cart-id="${item.id}">Quitar</button>
        </div>
      `;
      cartItemsEl.appendChild(itemEl);
    });

    const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = itemsTotal + deliveryState.fee;
    cartTotalEl.textContent = formatCurrency(total);
    renderCartTotalBreakdown(itemsTotal);

    if (cartDeliverySummaryEl) {
      if (deliveryState.type === 'pickup') {
        cartDeliverySummaryEl.textContent = 'Recogida en tienda seleccionada. Sin costo adicional.';
        cartDeliverySummaryEl.classList.remove('hidden');
      } else if (deliveryState.type === 'delivery') {
        cartDeliverySummaryEl.innerHTML = `Entrega a domicilio: ${deliveryState.note}`;
        cartDeliverySummaryEl.classList.remove('hidden');
      } else {
        cartDeliverySummaryEl.classList.add('hidden');
      }
    }
  };

  const handleCartAction = (event) => {
    const button = event.target.closest('button');
    if (!button || !button.dataset.action) return;
    const cartId = button.dataset.cartId;
    const action = button.dataset.action;
    const itemIndex = cart.findIndex((item) => item.id === cartId);
    if (itemIndex === -1) return;

    if (action === 'increase') {
      cart[itemIndex].quantity += 1;
    } else if (action === 'decrease') {
      cart[itemIndex].quantity -= 1;
      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
      }
    } else if (action === 'remove') {
      cart.splice(itemIndex, 1);
    }

    saveCart();
    updateCartCount();
    renderCart();
  };

  if (productGeneralListEl) {
    generateProducts();
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get('categoria') || params.get('category');
    if (requestedCategory && subcategories[requestedCategory]) {
      selectedCategory = requestedCategory;
      categoryItems.forEach((item) => {
        item.classList.toggle('active', item.dataset.category === requestedCategory);
      });
      const requestedButton = document.querySelector(`.category-item[data-category="${requestedCategory}"]`);
      if (requestedButton && allCategoryButton) {
        allCategoryButton.textContent = requestedButton.textContent;
      }
      renderSubcategoryOptions(requestedCategory);
      applyFilters();
      document.querySelector('.catalog-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      renderSubcategoryOptions('all');
      renderProducts();
    }
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      renderSubcategoryOptions(categoryFilter.value);
      if (subcategoryFilter) {
        subcategoryFilter.value = 'all';
      }
      applyFilters();
    });
  }

  if (subcategoryFilter) {
    subcategoryFilter.addEventListener('change', applyFilters);
  }

  if (productSearch) {
    productSearch.addEventListener('input', applyFilters);
  }

  if (sortOrderSelect) {
    sortOrderSelect.addEventListener('change', applyFilters);
  }

  if (toggleFiltersButton && filterControls) {
    toggleFiltersButton.addEventListener('click', () => {
      const isExpanded = toggleFiltersButton.getAttribute('aria-expanded') === 'true';
      toggleFiltersButton.setAttribute('aria-expanded', String(!isExpanded));
      toggleFiltersButton.setAttribute('aria-label', isExpanded ? 'Mostrar filtros' : 'Ocultar filtros');
      filterControls.classList.toggle('is-collapsed', isExpanded);
    });
  }

  const updateCompactCategoryLabel = (button) => {
    if (!allCategoryButton) return;
    if (button.dataset.category !== 'all') {
      allCategoryButton.textContent = button.textContent;
    } else {
      allCategoryButton.textContent = 'Todos los productos';
    }
  };

  if (categoryItems.length > 0) {
    categoryItems.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.dataset.category === 'all' && categoryList && selectedCategory !== 'all' && categoryList.classList.contains('is-collapsed')) {
          categoryList.classList.remove('is-collapsed');
          allCategoryButton.textContent = 'Todos los productos';
          return;
        }

        if (button.dataset.category === 'all' && categoryList) {
          categoryList.classList.toggle('is-collapsed');
        } else if (categoryList) {
          categoryList.classList.add('is-collapsed');
        }
        categoryItems.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        updateCompactCategoryLabel(button);
        selectedCategory = button.dataset.category;
        renderSubcategoryOptions(button.dataset.category);
        if (subcategoryFilter) {
          subcategoryFilter.value = 'all';
        }
        applyFilters();
      });
    });
  }

  const priceFilter = document.getElementById('price-filter');
  if (priceFilter) {
    priceFilter.addEventListener('input', (e) => {
      applyFilters();
    });
  }

  const applyPriceFilterBtn = document.getElementById('apply-price-filter');
  if (applyPriceFilterBtn) {
    applyPriceFilterBtn.addEventListener('click', () => {
      applyFilters();
    });
  }

  document.body.addEventListener('click', (event) => {
    const ratingButton = event.target.closest('.rating-star');
    if (ratingButton) {
      const product = products.find((item) => item.id === ratingButton.dataset.productId);
      if (!product) return;
      const rating = Number(ratingButton.dataset.rating);
      product.rating = rating;
      product.ratingVotes = (Number(product.ratingVotes) || 0) + 1;
      const ratingEl = ratingButton.closest('.product-rating');
      if (ratingEl) {
        ratingEl.setAttribute('aria-label', `Calificación actual ${rating} de 5`);
        ratingEl.querySelectorAll('.rating-star').forEach((star) => {
          star.classList.toggle('active', Number(star.dataset.rating) <= rating);
        });
        const ratingText = ratingEl.querySelector('.rating-score');
        if (ratingText) {
          ratingText.textContent = `${rating}.0`;
        }
        const feedbackText = ratingEl.querySelector('.rating-feedback');
        if (feedbackText) {
          feedbackText.textContent = `${product.ratingVotes} votos`;
        }
      }
      return;
    }

    const sizeButton = event.target.closest('.size-option');
    if (sizeButton) {
      const card = sizeButton.closest('.product-card');
      if (!card) return;
      const selectedSize = sizeButton.dataset.size;
      const price = Number(sizeButton.dataset.price);
      card.dataset.selectedSize = selectedSize;
      const priceEl = card.querySelector('.product-price');
      if (priceEl) {
        const selectedProduct = products.find((item) => item.id === card.dataset.productId);
        priceEl.textContent = formatCurrency(price) + (selectedProduct?.selectedPaletteColor ? ` - ${selectedProduct.selectedPaletteColor.name}` : '');
      }
      const volumeEl = card.querySelector('.product-volume');
      if (volumeEl) {
        volumeEl.textContent = `Contenido: ${sizeButton.textContent}`;
      }
      card.querySelectorAll('.size-option').forEach((btn) => btn.classList.toggle('active', btn === sizeButton));
      return;
    }
    const finishButton = event.target.closest('.finish-option');
    if (finishButton) {
      const card = finishButton.closest('.product-card');
      if (!card) return;
      card.dataset.selectedFinish = finishButton.dataset.finish;
      card.querySelectorAll('.finish-option').forEach((btn) => btn.classList.toggle('active', btn === finishButton));
      return;
    }
    const addButton = event.target.closest('.add-to-cart');
    if (addButton && addButton.dataset.productId) {
      const card = addButton.closest('.product-card');
      const selectedSize = card ? card.dataset.selectedSize : null;
      const selectedFinish = card ? card.dataset.selectedFinish : null;
      addProductToCart(addButton.dataset.productId, selectedSize, selectedFinish);
      return;
    }
    const addPaletteColorButton = event.target.closest('.add-palette-color');
    if (addPaletteColorButton && detailModal && detailModal.contains(addPaletteColorButton)) {
      const productId = addPaletteColorButton.dataset.paletteId || detailModal.dataset.activeProductId;
      const product = products.find((item) => item.id === productId);
      if (!product) return;
      const selectedName = addPaletteColorButton.dataset.name || 'Color';
      const selectedColor = addPaletteColorButton.dataset.color || '';
      const selectedSwatch = product.palette.find((swatch) => swatch.name === selectedName);
      product.selectedPaletteColor = {
        name: selectedName,
        color: selectedColor,
        description: selectedSwatch?.description || '',
        sizeOptions: selectedSwatch?.sizeOptions || null,
      };
      const selectedLabel = detailModal.querySelector('.selected-color-label');
      if (selectedLabel) {
        selectedLabel.textContent = `Color seleccionado: ${selectedName}`;
      }
      updateProductCardSelection(product);
      detailModal.classList.add('hidden');
      return;
    }

    const paletteButton = event.target.closest('.view-palette');
    if (paletteButton && paletteButton.dataset.paletteId) {
      const product = products.find((item) => item.id === paletteButton.dataset.paletteId);
      if (!product || !product.palette || !detailModal || !detailModalTitle || !detailModalBody) return;
      detailModal.dataset.activeProductId = product.id;
      detailModal.dataset.view = 'palette';

      detailModalTitle.textContent = 'Colores';
      detailModalBody.innerHTML = `
        <div class="palette-section">
          <div class="palette-grid">
            ${product.palette.map((swatch) => `
              <div class="palette-item" data-name="${swatch.name}" data-color="${swatch.color}">
                <span class="palette-swatch" style="background:${swatch.color};"></span>
                <small>${swatch.name}</small>
                <button class="btn btn-primary add-palette-color" type="button" data-palette-id="${product.id}" data-name="${swatch.name}" data-color="${swatch.color}">Seleccionar</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      detailModal.classList.remove('hidden');
      return;
    }

    const detailButton = event.target.closest('.view-detail');
    if (detailButton && detailButton.dataset.detailId) {
      const product = products.find((item) => item.id === detailButton.dataset.detailId);
      if (!product || !detailModal || !detailModalTitle || !detailModalBody) return;
      detailModal.dataset.activeProductId = product.id;
      detailModal.dataset.view = 'detail';
      detailModalTitle.textContent = 'Detalle';
      detailModalBody.innerHTML = `
        <p>${product.detailText || product.description || 'Producto con características especiales.'}</p>
      `;
      detailModal.classList.remove('hidden');
      return;
    }
  });

  if (viewCartButton) {
    viewCartButton.addEventListener('click', () => {
      if (!cartModal) return;
      cartModal.classList.remove('hidden');
      renderCart();
    });
  }

  if (deliveryOptionsButton) {
    deliveryOptionsButton.addEventListener('click', () => {
      deliveryState.type = 'delivery';
      deliveryState.pickupConfirmed = false;
      if (pickupOptionButton) pickupOptionButton.classList.remove('is-selected');
      if (deliveryOptionsButton) deliveryOptionsButton.classList.add('is-selected');
      showDeliveryModal();
    });
  }

  if (pickupOptionButton) {
    pickupOptionButton.addEventListener('click', () => {
      deliveryState.type = 'pickup';
      deliveryState.postalCode = '';
      deliveryState.sameDay = false;
      deliveryState.flash = false;
      deliveryState.fastDelivery = false;
      deliveryState.baseFee = 0;
      deliveryState.fastFee = 0;
      deliveryState.fee = 0;
      deliveryState.distanceKm = 0;
      deliveryState.durationText = '';
      deliveryState.deliveryWindow = '';
      deliveryState.pickupConfirmed = true;
      deliveryState.note = 'Recoger en tienda';
      latestDeliveryEstimate = null;
      if (pickupOptionButton) pickupOptionButton.classList.add('is-selected');
      if (deliveryOptionsButton) deliveryOptionsButton.classList.remove('is-selected');
      updateDeliverySummary();
      renderCart();
    });
  }

  if (closeCartModal) {
    closeCartModal.addEventListener('click', () => {
      cartModal.classList.add('hidden');
    });
  }

  if (closeDeliveryModal) {
    closeDeliveryModal.addEventListener('click', () => {
      hideDeliveryModal();
    });
  }

  if (saveDeliverySelectionButton) {
    saveDeliverySelectionButton.addEventListener('click', async () => {
      const originalText = saveDeliverySelectionButton.textContent;
      saveDeliverySelectionButton.disabled = true;
      saveDeliverySelectionButton.textContent = 'Calculando...';
      try {
        if (!await applyDeliverySelection()) return;
        updateDeliverySummary();
        renderCart();
      } finally {
        saveDeliverySelectionButton.disabled = false;
        saveDeliverySelectionButton.textContent = originalText;
      }
    });
  }

  if (acceptDeliverySelectionButton) {
    acceptDeliverySelectionButton.addEventListener('click', () => {
      hideDeliveryModal();
    });
  }

  if (deliveryModal) {
    deliveryModal.addEventListener('click', (e) => {
      if (e.target === deliveryModal.querySelector('.modal-overlay')) {
        hideDeliveryModal();
      }
    });
  }

  if (deliveryPostalInput) {
    deliveryPostalInput.addEventListener('input', () => {
      deliveryState.postalCode = deliveryPostalInput.value.trim();
      deliveryState.baseFee = 0;
      deliveryState.fastFee = 0;
      deliveryState.fee = 0;
      deliveryState.distanceKm = 0;
      deliveryState.durationText = '';
      latestDeliveryEstimate = null;
      refreshDeliveryResult();
    });
  }

  if (deliveryFlashCheckbox) {
    deliveryFlashCheckbox.addEventListener('change', () => {
      if (!latestDeliveryEstimate || !latestDeliveryEstimate.allowFastDelivery || deliveryState.type !== 'delivery') {
        deliveryState.flash = false;
        deliveryState.fastDelivery = false;
        deliveryState.fastFee = 0;
        refreshDeliveryResult();
        return;
      }
      const wantsFastDelivery = deliveryFlashCheckbox.checked;
      const deliveryFee = latestDeliveryEstimate.fee + (wantsFastDelivery ? fastDeliveryExtraFee : 0);
      const deliveryFeeText = formatDeliveryFee(deliveryFee);
      deliveryState.flash = wantsFastDelivery;
      deliveryState.fastDelivery = wantsFastDelivery;
      deliveryState.baseFee = latestDeliveryEstimate.fee;
      deliveryState.fastFee = wantsFastDelivery ? fastDeliveryExtraFee : 0;
      deliveryState.fee = deliveryFee;
      if (pickupOptionButton) pickupOptionButton.classList.remove('is-selected');
      if (deliveryOptionsButton) deliveryOptionsButton.classList.add('is-selected');
      deliveryState.note = `${latestDeliveryEstimate.message}. ${wantsFastDelivery ? 'Entrega flash solicitada' : latestDeliveryEstimate.deliveryWindow}. Distancia: ${latestDeliveryEstimate.distanceKm.toFixed(1)} km. Envío: ${deliveryFeeText}${wantsFastDelivery ? '. Un asesor validará disponibilidad.' : '.'}`;
      renderDeliveryResult(latestDeliveryEstimate);
      updateDeliverySummary();
      renderCart();
    });
  }

  document.body.addEventListener('change', (event) => {
    const radio = event.target;
    if (radio && radio.name === 'delivery-type') {
      toggleDeliveryMode(radio.value);
      if (radio.value === 'pickup') {
        if (deliveryModal?.dataset.mode === 'pay') return;
        deliveryState.type = 'pickup';
        deliveryState.postalCode = '';
        deliveryState.flash = false;
        deliveryState.fastDelivery = false;
        deliveryState.baseFee = 0;
        deliveryState.fastFee = 0;
        deliveryState.fee = 0;
        deliveryState.pickupConfirmed = true;
        latestDeliveryEstimate = null;
        if (pickupOptionButton) pickupOptionButton.classList.add('is-selected');
        if (deliveryOptionsButton) deliveryOptionsButton.classList.remove('is-selected');
        refreshDeliveryResult();
      } else {
        deliveryState.type = 'delivery';
        deliveryState.pickupConfirmed = false;
        if (pickupOptionButton) pickupOptionButton.classList.remove('is-selected');
        if (deliveryOptionsButton) deliveryOptionsButton.classList.add('is-selected');
        refreshDeliveryResult();
      }
    }
  });

  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos para continuar.');
        return;
      }
      if (!deliveryState.pickupConfirmed && (!deliveryState.postalCode || !deliveryState.durationText)) {
        showDeliveryModal({ payOnly: true });
        return;
      }
      showPaymentModal();
    });
  }

  if (closePaymentModal) {
    closePaymentModal.addEventListener('click', hidePaymentModal);
  }

  if (paymentModal) {
    paymentModal.addEventListener('click', (e) => {
      if (e.target === paymentModal.querySelector('.modal-overlay')) {
        hidePaymentModal();
      }
    });
    paymentModal.addEventListener('click', stopPaymentActionIfInvalid, true);
  }

  [paymentCustomerNameInput, paymentCustomerPhoneInput, paymentCustomerEmailInput, paymentCustomerAddressInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      if (input === paymentCustomerPhoneInput) {
        validatePaymentPhoneField();
      } else {
        setPaymentFieldError(input);
      }
      updatePaymentActionState();
      if (paymentFormStatusEl) {
        paymentFormStatusEl.textContent = '';
        paymentFormStatusEl.classList.remove('is-error');
        paymentFormStatusEl.classList.remove('is-floating');
        clearTimeout(paymentStatusTimeout);
      }
    });
  });

  if (paymentCustomerPhoneInput) {
    paymentCustomerPhoneInput.addEventListener('beforeinput', (event) => {
      if (event.inputType && !event.inputType.startsWith('insert')) return;
      if (event.data && /\D/.test(event.data)) {
        event.preventDefault();
      }
      const currentDigits = getMexicanPhoneDigits(paymentCustomerPhoneInput.value);
      const selectionLength = Math.max(0, paymentCustomerPhoneInput.selectionEnd - paymentCustomerPhoneInput.selectionStart);
      if (event.data && /\d/.test(event.data) && currentDigits.length >= 10 && selectionLength === 0) {
        event.preventDefault();
      }
    });

    paymentCustomerPhoneInput.addEventListener('paste', () => {
      setTimeout(() => {
        validatePaymentPhoneField();
        updatePaymentActionState();
      }, 0);
    });

    paymentCustomerPhoneInput.addEventListener('blur', () => {
      validatePaymentPhoneField({ showEmpty: true });
      updatePaymentActionState();
    });
  }

  paymentMethodButtons.forEach((button) => {
    button.addEventListener('click', () => {
      selectPaymentMethod(button.dataset.paymentMethod);
    });
  });

  if (sendTransferWhatsappButton) {
    sendTransferWhatsappButton.addEventListener('click', openTransferWhatsapp);
  }

  speiCopyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const copied = await copyTextToClipboard(button.dataset.copyValue || '');
      showSpeiCopyStatus(copied ? 'Dato copiado al portapapeles.' : 'No se pudo copiar. Puedes seleccionarlo manualmente.');
    });
  });

  if (payInStoreWhatsappButton) {
    payInStoreWhatsappButton.addEventListener('click', () => {
      sendOrderByWhatsapp('Hola, quiero pagar en tienda y confirmar este pedido en Ruben\'s Distribuidora');
    });
  }

  document.addEventListener('click', async (event) => {
    const mercadoButton = event.target && event.target.closest ? event.target.closest('#mercadoPagoBtn') : null;
    if (mercadoButton) {
      event.preventDefault();
      console.log('Click Mercado Pago detectado');

      if (!validateOrderCustomerData()) return;

      try {
        const hasCartItems = Array.isArray(cart) && cart.length > 0;
        const mercadoPagoPayload = hasCartItems ? {
          cart,
          shippingCost: deliveryState.type === 'delivery' ? deliveryState.fee : 0,
          customer: getCustomerData(),
          deliveryMethod: getDeliveryMethodLabel(),
        } : {
          title: 'Compra Rubens Distribuidora',
          quantity: 1,
          unit_price: 100,
          customer: getCustomerData(),
          deliveryMethod: getDeliveryMethodLabel(),
        };

        const res = await fetch('/.netlify/functions/createPreference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mercadoPagoPayload),
        });

        const data = await res.json();
        console.log('Respuesta createPreference:', data);

        if (!data.preference_id && !data.id && !data.init_point && !data.sandbox_init_point) {
          alert('No se pudo crear la preferencia de Mercado Pago');
          return;
        }

        const preferenceId = data.preference_id || data.id;
        const initPoint = data.sandbox_init_point || data.init_point;

        if (preferenceId) {
          try {
            const MercadoPagoSdk = window.MercadoPago || await loadMercadoPagoSdkGlobal();
            const mp = new MercadoPagoSdk('APP_USR-1d421fc6-735f-4f5b-ac51-a5912edb29de', {
              locale: 'es-MX',
            });

            mp.checkout({
              preference: {
                id: preferenceId,
              },
              autoOpen: true,
            });
            return;
          } catch (checkoutError) {
            console.error('Error abriendo Checkout Pro:', checkoutError);
            if (initPoint) {
              window.open(initPoint, '_blank');
              return;
            }
            throw checkoutError;
          }
        }

        if (initPoint) {
          window.open(initPoint, '_blank');
          return;
        }

        alert('No se pudo crear la preferencia de Mercado Pago');
      } catch (error) {
        console.error('Error Mercado Pago:', error);
        alert('Error al abrir Mercado Pago. Revisa consola.');
      }
    }
  });

  if (mercadoWhatsappFallbackButton) {
    mercadoWhatsappFallbackButton.addEventListener('click', () => {
      if (!validateOrderCustomerData()) return;
      openMercadoPagoFallbackWhatsapp();
    });
  }

  if (closeDetailModal) {
    closeDetailModal.addEventListener('click', () => {
      if (detailModal) detailModal.classList.add('hidden');
    });
  }

  // Cerrar modal al hacer click en overlay
  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal.querySelector('.modal-overlay')) {
        cartModal.classList.add('hidden');
      }
    });
  }

  if (detailModal) {
    detailModal.addEventListener('click', (e) => {
      if (e.target === detailModal.querySelector('.modal-overlay')) {
        detailModal.classList.add('hidden');
      }
    });
  }


  if (cartItemsEl) {
    cartItemsEl.addEventListener('click', handleCartAction);
  }

  updateCartCount();
  renderCart();
  sendPendingMercadoPagoOrder();
});

