require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const items = [
  { name: "Dry Red Chilli", price: 150, category: "Spices", image: "/redchilli.jpg", description: "Pahadi dry red chilli" },
  { name: "Hara Namak", price: 80, category: "Spices", image: "/haranamak.jpg", description: "Natural green salt" },
  { name: "Bhatt ki Daal", price: 200, category: "Pulses", image: "/bhattdaal.jpg", description: "Protein rich daal" },
  { name: "Gahat ki Daal", price: 180, category: "Pulses", image: "/gahatdaal.jpg", description: "Healthy traditional daal" },
  { name: "Organic Honey", price: 350, category: "Honey", image: "/honey.jpg", description: "Pure Pahadi honey" },
  { name: "Red Rice", price: 200, category: "Grains", image: "/rice.jpg", description: "Nutritious red rice" },
  { name: "Ragi (Manduwa)", price: 100, category: "Grains", image: "/ragi.jpg", description: "Gluten-free grain" },
  { name: "Mango Pickle", price: 180, category: "Pickles", image: "/pickle.jpg", description: "Tangy and spicy" },
  { name: "Malta Juice", price: 150, category: "Juices", image: "/orange.jpg", description: "Fresh citrus juice" },
  { name: "Green Chilli Pickle", price: 180, category: "Pickles", image: "/chilli.jpg", description: "Hot & spicy" },
  { name: "Rajma", price: 200, category: "Pulses", image: "/rajma.jpg", description: "Protein rich kidney beans" },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Product.deleteMany({});       // Clear old products
    await Product.insertMany(items);    // Insert new products
    console.log('✅ Seeded products with categories');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
