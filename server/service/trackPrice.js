const axios = require('axios');
const cheerio = require('cheerio');


async function trackPrice(url, targetPrice) {
  try {
    const { data } = await axios.get(url); // Fetch the page HTML
    const $ = cheerio.load(data); // Load HTML into Cheerio

    // Extract the price from the target element (e.g., span.a-price-whole)
    const priceText = $('span.a-price-whole').first().text().replace(',', '').trim();
    const price = parseFloat(priceText); // Convert the price to a float

    console.log(`Current Price: ${price}`);

    // Check if the price is below or equal to the target
    if (price <= targetPrice) {
      console.log("The price is below or equal to your target!");
    }
  } catch (error) {
    console.error('Error fetching the page:', error);
  }
}

//
//   Function to repeatedly check the price every 5 minutes (300,000 ms)
//   @param {string} url - The product page URL
//   @param {number} targetPrice - The target price to track
//  
function startPriceTracking(url, targetPrice) {
  // Call trackPrice immediately, then every 5 minutes
  trackPrice(url, targetPrice);
  setInterval(() => trackPrice(url, targetPrice), 300000); // 5 minutes in ms
}

module.exports = startPriceTracking;