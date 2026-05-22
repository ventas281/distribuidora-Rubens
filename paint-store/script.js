// Script ligero para Ruben's Distribuidora

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
  const checkoutButton = document.getElementById('checkout');
  const cartDeliverySummaryEl = document.getElementById('cart-delivery-summary');
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

  const categoryLabels = {
    vinilica: 'Pintura Vinílica',
    esmalte: 'Pintura de Esmalte',
    epoxica: 'Impermeabilizante',
    aerosoles: 'Aerosoles',
    madera: 'Productos para Madera',
    aplicadores: 'Aplicadores',
    diluyentes: 'Diluyentes',
    primerarios: 'Primerarios',
  };

  const subcategories = {
    vinilica: ['Económica', 'Media', 'Mediana-Alta', 'Alta'],
    esmalte: ['Base Agua', 'Base Solvente', 'Esmalte Industrial'],
    epoxica: ['Pisos', 'Industrial', 'Alto Tráfico'],
    aerosoles: ['Normal', 'Metálico', 'Neón', 'Alta Temperatura'],
    madera: ['Tintas', 'Barnices entintados', 'Barnices base agua', 'Barnices base esmalte', 'Lacas', 'Nitrocelulosas', 'Selladores', 'Primer para Madera', 'Poliuretanos', 'Resanadores', 'Aditivos'],
    aplicadores: ['Brochas', 'Rodillos'],
    diluyentes: ['Alberca y Tráfico'],
    primerarios: ['Primerarios'],
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
    fee: 0,
    note: 'Recoger en tienda',
  };
  const flashDeliveryFee = 80;
  const freeDeliveryMin = 500;

  const savedCart = localStorage.getItem('rubensCart');
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (error) {
      cart = [];
    }
  }

  const formatCurrency = (value) => `MXN ${value.toFixed(2)}`;

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
      subcategory: 'Primerarios',
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
      subcategory: 'Primerarios',
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

  const getDeliveryEstimate = (postalCode) => {
    const code = String(postalCode).trim();
    const numeric = Number(code.replace(/\D/g, '').slice(0, 5));
    if (!numeric || code.length < 4) {
      return { valid: false, message: 'Ingresa un código postal válido para ver la disponibilidad.', sameDay: false, eta: '' };
    }
    if (numeric >= 54000 && numeric <= 54150) {
      return { valid: true, message: 'Entrega dentro de 15 km: mismo día disponible.', sameDay: true, eta: 'Mismo día' };
    }
    return { valid: true, message: 'Fuera del rango de 15 km: entrega estimada en 1-2 días.', sameDay: false, eta: '1-2 días' };
  };

  const updateDeliverySummary = () => {
    if (!cartDeliverySummaryEl) return;
    if (deliveryState.type === 'pickup') {
      cartDeliverySummaryEl.textContent = 'Recogida en tienda seleccionada. Sin costo adicional.';
      cartDeliverySummaryEl.classList.remove('hidden');
      return;
    }
    if (deliveryState.type === 'delivery') {
      cartDeliverySummaryEl.innerHTML = `Entrega a domicilio: ${deliveryState.note}${deliveryState.fee ? ` — Costo adicional: ${formatCurrency(deliveryState.fee)}` : ''}`;
      cartDeliverySummaryEl.classList.remove('hidden');
      return;
    }
    cartDeliverySummaryEl.classList.add('hidden');
  };

  const setDeliveryState = (state) => {
    Object.assign(deliveryState, state);
    if (deliveryState.type === 'pickup') {
      deliveryState.fee = 0;
      deliveryState.note = 'Recoger en tienda';
    }
    updateDeliverySummary();
    renderCart();
  };

  const showDeliveryModal = () => {
    if (!deliveryModal) return;
    deliveryModal.classList.remove('hidden');
    const radio = document.querySelector(`input[name="delivery-type"][value="${deliveryState.type}"]`);
    if (radio) radio.checked = true;
    if (deliveryState.type === 'delivery') {
      if (deliveryPostalInput) deliveryPostalInput.value = deliveryState.postalCode || '';
      if (deliveryFlashCheckbox) deliveryFlashCheckbox.checked = deliveryState.flash;
      if (deliveryPostalRow) deliveryPostalRow.classList.remove('hidden');
      if (deliveryFlashRow) deliveryFlashRow.classList.remove('hidden');
    } else {
      if (deliveryPostalRow) deliveryPostalRow.classList.add('hidden');
      if (deliveryFlashRow) deliveryFlashRow.classList.add('hidden');
    }
    if (deliveryResult) {
      deliveryResult.textContent = deliveryState.type === 'delivery' ? deliveryState.note : 'Elige entrega o recogida.';
    }
  };

  const hideDeliveryModal = () => {
    if (!deliveryModal) return;
    deliveryModal.classList.add('hidden');
  };

  const refreshDeliveryResult = () => {
    if (!deliveryResult) return;
    if (deliveryState.type === 'pickup') {
      deliveryResult.textContent = 'Recoger en tienda seleccionado. No es necesario código postal ni entrega flash para esta opción.';
      return;
    }
    const postal = deliveryPostalInput ? deliveryPostalInput.value.trim() : '';
    const estimate = getDeliveryEstimate(postal);
    if (!estimate.valid) {
      deliveryResult.textContent = estimate.message;
      return;
    }
    const fee = deliveryState.flash ? flashDeliveryFee : 0;
    deliveryResult.textContent = `${estimate.message} ETA: ${estimate.eta}.${deliveryState.flash ? ` Entrega flash activada (+${formatCurrency(fee)}).` : ''}`;
  };

  const applyDeliverySelection = () => {
    const deliveryTypeInput = document.querySelector('input[name="delivery-type"]:checked');
    const selectedType = deliveryTypeInput ? deliveryTypeInput.value : 'pickup';
    const postal = deliveryPostalInput ? deliveryPostalInput.value.trim() : '';
    const flash = deliveryFlashCheckbox ? deliveryFlashCheckbox.checked : false;
    const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (selectedType === 'delivery') {
      const estimate = getDeliveryEstimate(postal);
      if (!estimate.valid) {
        if (deliveryResult) deliveryResult.textContent = estimate.message;
        return false;
      }
      deliveryState.type = 'delivery';
      deliveryState.postalCode = postal;
      deliveryState.sameDay = estimate.sameDay;
      deliveryState.flash = flash;
      deliveryState.fee = flash ? flashDeliveryFee : 0;
      deliveryState.note = `${estimate.message}${flash ? ' Con entrega flash.' : ''}`;
      if (!flash && itemsTotal < freeDeliveryMin) {
        alert(`El envío sin costo aplica a partir de MXN ${freeDeliveryMin}. Agrega algún producto más si quieres cumplir con la cantidad mínima para entrega gratis.`);
      }
    } else {
      deliveryState.type = 'pickup';
      deliveryState.postalCode = '';
      deliveryState.sameDay = false;
      deliveryState.flash = false;
      deliveryState.fee = 0;
      deliveryState.note = 'Recoger en tienda';
    }
    return true;
  };

  const toggleDeliveryMode = (mode) => {
    if (!deliveryPostalRow || !deliveryFlashRow) return;
    if (mode === 'delivery') {
      deliveryPostalRow.classList.remove('hidden');
      deliveryFlashRow.classList.remove('hidden');
    } else {
      deliveryPostalRow.classList.add('hidden');
      deliveryFlashRow.classList.add('hidden');
    }
  };

  const updateCartTotalWithDelivery = () => {
    if (!cartTotalEl) return;
    const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = itemsTotal + deliveryState.fee;
    cartTotalEl.textContent = formatCurrency(total);
  };

  const renderCartWithDelivery = () => {
    renderCart();
    updateDeliverySummary();
  };

  const checkoutOrder = () => {
    const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = itemsTotal + deliveryState.fee;
    const deliveryText = deliveryState.type === 'pickup'
      ? 'Recoger en tienda'
      : `Entrega a domicilio (${deliveryState.postalCode || 'sin código postal'}) ${deliveryState.flash ? 'con entrega flash' : ''}`;
    alert(`Gracias por tu pedido. Total: ${formatCurrency(total)}. ${deliveryText}. Pronto nos pondremos en contacto.`);
    cart = [];
    saveCart();
    updateCartCount();
    renderCartWithDelivery();
    if (cartModal) cartModal.classList.add('hidden');
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

  const createProductCard = (product) => {
    const card = document.createElement('article');
    card.className = 'product-card reveal';
    card.dataset.productId = product.id;
    const stars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
    let imageMarkup = '';
    if (product.category === 'aerosoles' && product.image) {
      imageMarkup = `
        <div class="aerosol-image-wrapper">
          <img src="${product.image}" alt="${product.name}" class="aerosol-bg-image">
          <div class="swatch-circle" style="background:${product.colorSwatch};"></div>
        </div>
      `;
    } else if (product.image) {
      imageMarkup = `<img src="${product.image}" alt="${product.name}">`;
    } else if (product.colorSwatch) {
      imageMarkup = `<div class="swatch-circle" style="background:${product.colorSwatch};"></div>`;
    } else {
      imageMarkup = 'Imagen';
    }

    const sizeSelectorMarkup = product.sizeOptions ? `
      <div class="size-selector">
        ${product.sizeOptions.map((option) => `
          <button type="button" class="size-option" data-size="${option.id}" data-price="${option.price}">${option.label}</button>
        `).join('')}
      </div>
    ` : '';

    const initialPriceText = product.sizeOptions ? 'Seleccione tamaño' : formatCurrency(product.price);
    const selectedColorText = product.selectedPaletteColor ? ` - ${product.selectedPaletteColor.name}` : '';
    const priceMarkup = `<span class="product-price">${initialPriceText}${selectedColorText}</span>`;
    const addButtonText = product.selectedPaletteColor ? `Agregar ${product.selectedPaletteColor.name}` : 'Agregar';
    const volumeMarkup = product.sizeOptions
      ? '<p class="product-volume">Contenido: Seleccione tamaño</p>'
      : (product.cantidad ? `<p class="product-volume">Contenido: ${product.cantidad}</p>` : '');
    const paletteButtonMarkup = product.palette ? `<button class="btn btn-secondary view-palette" type="button" data-palette-id="${product.id}">Ver muestario</button>` : '';

    card.innerHTML = `
      <div class="product-image">${imageMarkup}</div>
      <div class="product-card-top">
        <div class="product-tag">${product.categoryLabel}</div>
        <div class="product-subtag">${product.subcategory}</div>
      </div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      ${sizeSelectorMarkup}
      ${volumeMarkup}
      <div class="product-rating">${stars} <span>(${product.rating}.0)</span></div>
      <div class="product-footer">
        ${priceMarkup}
        <div class="product-actions">
          <button class="btn btn-primary view-detail" type="button" data-detail-id="${product.id}">Ver detalle</button>
          ${paletteButtonMarkup}
          <button class="btn btn-secondary add-to-cart" data-product-id="${product.id}">${addButtonText}</button>
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
    const card = document.querySelector(`.product-card[data-product-id="${product.id}"]`);
    if (!card) return;
    const priceEl = card.querySelector('.product-price');
    if (priceEl) {
      const baseText = priceEl.textContent.replace(/\s*-\s*[^-]+$/, '').trim();
      priceEl.textContent = product.selectedPaletteColor ? `${baseText} - ${product.selectedPaletteColor.name}` : baseText;
    }
    const addButton = card.querySelector('.add-to-cart');
    if (addButton) {
      addButton.textContent = product.selectedPaletteColor ? `Agregar ${product.selectedPaletteColor.name}` : 'Agregar';
    }
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

  const getProductCardError = (product, selectedSize) => {
    const needsSize = product.sizeOptions && !selectedSize;
    const needsColor = product.palette && !product.selectedPaletteColor;
    if (needsSize && needsColor) {
      return 'Aún no has agregado nada al carrito. Por favor selecciona color y tamaño que deseas agregar al carrito.';
    }
    if (needsSize) {
      return 'Aún no has agregado nada al carrito. Por favor selecciona tamaño que deseas agregar al carrito.';
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

  const addProductToCart = (productId, selectedSize = null) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    const errorMessage = getProductCardError(product, selectedSize);
    if (errorMessage) {
      showProductCardError(productId, errorMessage);
      return;
    }

    let price = product.price;
    let name = product.name;
    let sizeKey = '';
    let colorKey = '';
    let description = product.detailText || product.description || '';

    if (product.selectedPaletteColor) {
      name = `${name} - ${product.selectedPaletteColor.name}`;
      colorKey = `-${product.selectedPaletteColor.name.replace(/\s+/g, '-')}`;
      description = `Color: ${product.selectedPaletteColor.name}`;
    }

    if (product.sizeOptions) {
      const option = selectedSize ? product.sizeOptions.find((opt) => opt.id === selectedSize) : null;
      const selectedOption = option || product.sizeOptions[0];
      if (selectedOption) {
        price = selectedOption.price;
        name = `${product.name} - ${product.selectedPaletteColor ? product.selectedPaletteColor.name + ' ' : ''}(${selectedOption.label})`;
        sizeKey = `-${selectedOption.id}`;
        description = `${description}${description ? ' · ' : ''}Tamaño: ${selectedOption.label}`;
      }
    }

    const cartId = `${product.id}${colorKey}${sizeKey}`;
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

    if (cartDeliverySummaryEl) {
      if (deliveryState.type === 'pickup') {
        cartDeliverySummaryEl.textContent = 'Recogida en tienda seleccionada. Sin costo adicional.';
        cartDeliverySummaryEl.classList.remove('hidden');
      } else if (deliveryState.type === 'delivery') {
        cartDeliverySummaryEl.innerHTML = `Entrega a domicilio: ${deliveryState.note}${deliveryState.fee ? ` — Costo adicional: ${formatCurrency(deliveryState.fee)}` : ''}`;
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
    renderSubcategoryOptions('all');
    renderProducts();
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
    const addButton = event.target.closest('.add-to-cart');
    if (addButton && addButton.dataset.productId) {
      const card = addButton.closest('.product-card');
      const selectedSize = card ? card.dataset.selectedSize : null;
      addProductToCart(addButton.dataset.productId, selectedSize);
      return;
    }
    const addPaletteColorButton = event.target.closest('.add-palette-color');
    if (addPaletteColorButton && detailModal && detailModal.contains(addPaletteColorButton)) {
      const productId = addPaletteColorButton.dataset.paletteId || detailModal.dataset.activeProductId;
      const product = products.find((item) => item.id === productId);
      if (!product) return;
      const selectedName = addPaletteColorButton.dataset.name || 'Color';
      const selectedColor = addPaletteColorButton.dataset.color || '';
      product.selectedPaletteColor = { name: selectedName, color: selectedColor };
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
        const paletteTitle = product.name.toLowerCase().includes('viniplax')
        ? 'Muestrario Viniplax'
        : product.name.toLowerCase().includes('alvacolor')
          ? 'Muestrario Alvacolor'
          : product.name.toLowerCase().includes('alvaflex')
            ? 'Muestrario Alvaflex Master'
            : product.name.toLowerCase().includes('alvacril')
              ? 'Muestrario Alvacril GOLD'
              : 'Muestrario de colores';
      detailModal.dataset.activeProductId = product.id;
      detailModal.dataset.view = 'palette';

      detailModalTitle.textContent = `${product.name} - ${paletteTitle}`;
      detailModalBody.innerHTML = `
        <p>${product.detailText || 'Producto con características especiales.'}</p>
        <p class="selected-color-label">Color seleccionado: Ninguno</p>
        <div class="palette-section">
          <h4>${paletteTitle}</h4>
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
      const paletteSubtitle = product.palette && product.name.toLowerCase().includes('viniplax')
        ? '<p class="palette-subtitle">Muestrario Viniplax</p>'
        : product.palette
          ? '<p class="palette-subtitle">Muestrario de colores</p>'
          : '';

      const paletteMarkup = product.palette ? `
        <div class="palette-section">
          ${paletteSubtitle}
          <h4>Colores disponibles</h4>
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
      ` : '';

      detailModal.dataset.activeProductId = product.id;
      detailModal.dataset.view = 'detail';
      detailModalTitle.textContent = product.name;
      detailModalBody.innerHTML = `
        <p>${product.detailText || 'Producto con características especiales.'}</p>
        <p><strong>Precio:</strong> ${formatCurrency(product.price)}</p>
        ${product.cantidad ? `<p><strong>Contenido:</strong> ${product.cantidad}</p>` : ''}
        ${paletteMarkup}
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
      showDeliveryModal();
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
    saveDeliverySelectionButton.addEventListener('click', () => {
      if (!applyDeliverySelection()) return;
      updateDeliverySummary();
      renderCart();
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
      refreshDeliveryResult();
    });
  }

  if (deliveryFlashCheckbox) {
    deliveryFlashCheckbox.addEventListener('change', () => {
      deliveryState.flash = deliveryFlashCheckbox.checked;
      refreshDeliveryResult();
    });
  }

  document.body.addEventListener('change', (event) => {
    const radio = event.target;
    if (radio && radio.name === 'delivery-type') {
      toggleDeliveryMode(radio.value);
      if (radio.value === 'pickup') {
        deliveryState.type = 'pickup';
        deliveryState.postalCode = '';
        deliveryState.flash = false;
        refreshDeliveryResult();
      } else {
        deliveryState.type = 'delivery';
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
      if (deliveryState.type === 'delivery' && !deliveryState.postalCode) {
        showDeliveryModal();
        return;
      }
      const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      if (deliveryState.type === 'delivery' && !deliveryState.flash && itemsTotal < freeDeliveryMin) {
        alert(`El envío sin costo aplica a partir de MXN ${freeDeliveryMin}. Agrega algún producto más si quieres cumplir con la cantidad mínima para entrega gratis.`);
      }
      checkoutOrder();
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
});
