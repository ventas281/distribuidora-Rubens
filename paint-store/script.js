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
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  const categoryFilter = document.getElementById('category-filter');
  const subcategoryFilter = document.getElementById('subcategory-filter');
  const productSearch = document.getElementById('product-search');
  const sortOrderSelect = document.getElementById('sort-order');
  let selectedCategory = 'all';

  const categoryItems = document.querySelectorAll('.category-item');
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
  };

  const subcategories = {
    vinilica: ['Económica', 'Media', 'Mediana-Alta', 'Alta'],
    esmalte: ['Base Agua', 'Base Solvente'],
    epoxica: ['Pisos', 'Industrial', 'Alto Tráfico'],
    aerosoles: ['Normal', 'Metálico', 'Neón', 'Alta Temperatura'],
    madera: ['Tintas', 'Barnices base agua', 'Barnices base esmalte', 'Lacas', 'Nitrocelulosas', 'Selladores', 'Resanadores', 'Aditivos'],
  }; 

  const counts = {
    vinilica: 100,
    esmalte: 100,
    epoxica: 100,
    aerosoles: 60,
    madera: 140,
  };

  const prices = {
    vinilica: 420,
    esmalte: 520,
    epoxica: 680,
    aerosoles: 140,
    madera: 560,
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
      epoxica: 6,
      aerosoles: 3,
      madera: 7,
    };
    const recommendedRules = {
      vinilica: 9,
      esmalte: 8,
      epoxica: 5,
      aerosoles: 4,
      madera: 6,
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
        return a.name.localeCompare(b.name);
      });
    } else {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
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

  if (categoryItems.length > 0) {
    categoryItems.forEach((button) => {
      button.addEventListener('click', () => {
        categoryItems.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
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
