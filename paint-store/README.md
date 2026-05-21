# 🎨 ColorMaster Paint Store

A professional, fully-functional web application for an online paint store featuring 500+ paint products with easy navigation and shopping capabilities.

## Features

✨ **Core Features:**
- **500+ Paint Products** - Dynamically generated with realistic paint data
- **Advanced Filtering** - Filter by category, price range, color family, and brand
- **Search Functionality** - Search across product names, brands, and colors
- **Color Swatches** - Visual color representations for each paint product
- **Product Details** - Comprehensive product information with specs and reviews
- **Shopping Cart** - Full shopping cart with quantity management
- **Persistent Cart** - Cart data saved using browser localStorage
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices

## Getting Started

### 1. **Open the Web Page**
   - Navigate to the folder: `c:\Users\marti\.vscode\paint-store\`
   - Open `index.html` in any web browser
   - Alternatively, right-click `index.html` and select "Open with" → your preferred browser

### 2. **Files Included**
   - `index.html` - Main HTML structure
   - `style.css` - Responsive styling
   - `script.js` - All functionality and product data
   - `README.md` - This file

## Navigation Guide

### Top Navigation Bar
- **Logo** - ColorMaster Paint Store branding
- **Menu Links** - Home, Products, About, Contact
- **Search Icon** - Toggle search bar
- **Cart Button** - View and manage shopping cart

### Left Sidebar Filters
- **Category** - Filter by paint type (Interior, Exterior, Specialty, Primer, Stain)
- **Price Range** - Slider to set maximum price ($5-$100)
- **Color Family** - Multi-select color filters (Red, Blue, Green, Yellow, Neutral, White)
- **Brand** - Filter by manufacturer
- **Reset Filters** - Clear all filters instantly

### Product Grid
- Displays filtered products with color swatches
- Each card shows: name, brand, price, rating, and reviews
- **View Button** - See detailed product information
- **Add Button** - Quickly add items to cart

### Shopping Cart
- Click cart button to open modal
- Adjust quantities with +/- buttons
- Remove items individually
- See real-time total price
- Proceed to checkout

## Using the Features

### 🔍 Search
1. Click the search icon (🔍) in the top right
2. Type product name, brand, or color
3. Results filter in real-time

### 🎨 Filter by Color
1. Check boxes in the "Color Family" section
2. Select multiple colors to see products in those color families
3. Mix with other filters for precise results

### 💰 Set Price Range
1. Use the price slider in the sidebar
2. Drag to set maximum price
3. Products update automatically

### 🛒 Add to Cart
1. Click **Add** button on product card for quick add (qty: 1)
2. Or click **View** for detailed info and custom quantity
3. Set quantity (1-10) and click "Add to Cart"
4. View cart anytime with cart button

### 📋 Manage Cart
1. Click cart icon to open cart modal
2. Adjust quantities with +/- buttons
3. Click "Remove" to delete items
4. "Proceed to Checkout" to complete purchase
5. "Continue Shopping" to keep browsing

## Product Information

Each product includes:
- **Name** - Brand + Color + Type + Reference number
- **Brand** - One of 5 quality paint brands
- **Category** - Interior, Exterior, Specialty, Primer, or Stain
- **Color** - One of 6 color families
- **Price** - Realistic pricing based on product type ($25-$75)
- **Type** - Matte, Gloss, Semi-gloss, Satin, or Eggshell
- **Size** - 1 Gallon, 2.5 Gallon, or 5 Gallon
- **Rating** - Customer rating (3.5-5.0 stars)
- **Reviews** - Number of customer reviews

## Browser Compatibility

✅ Chrome/Edge (Latest)
✅ Firefox (Latest)
✅ Safari (Latest)
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Technical Details

- **Data Storage**: Products generated dynamically, cart saved to localStorage
- **No Backend Required**: Pure client-side application
- **No External Dependencies**: Uses only vanilla HTML/CSS/JavaScript
- **Performance**: Optimized for 500 products with instant filtering

## Tips for Best Experience

1. **On Mobile** - Tap the menu icon (doesn't appear in this version as all nav is visible)
2. **Responsive** - Resize browser to see responsive layout
3. **Color Swatches** - Colors are accurately mapped to product categories
4. **Cart Persistence** - Close browser and reopen - cart will still be there!
5. **Multiple Filters** - Combine filters for best results

## Customization

You can easily customize the store:
- **Change Store Name** - Edit `<h1>` in navbar section
- **Add/Modify Brands** - Update `paintBrands` array in `script.js`
- **Adjust Number of Products** - Change the loop in `generateProducts()` function
- **Modify Colors** - Update `colorHexMap` in `script.js`
- **Change Styling** - Edit color variables in `:root` in `style.css`

## Support

For questions or issues, check:
1. Browser console for any errors (F12 → Console tab)
2. Ensure all three files are in the same directory
3. Try refreshing the page (F5)
4. Clear cache if products don't load properly (Ctrl+Shift+Delete)

---

**Happy shopping at ColorMaster Paint Store! 🎨**
