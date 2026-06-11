const fs = require('fs');
const https = require('https');

// Script to convert a Roblox asset URL to a base64 data URI

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function fetchImageBase64(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer.toString('base64'));
      });
    }).on('error', reject);
  });
}

async function convertRobloxLinkToBase64(robloxUrl) {
  try {
    // 1. Extract Asset ID from URL
    // e.g. https://create.roblox.com/store/asset/114680270414449/Frost-Cursor-Neutral
    const match = robloxUrl.match(/asset\/(\d+)/);
    if (!match) {
      throw new Error("Could not find an asset ID in the provided URL.");
    }
    const assetId = match[1];
    console.log(`[INFO] Extracted Asset ID: ${assetId}`);

    // 2. Fetch thumbnail URL from Roblox API
    const apiUrl = `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`;
    console.log(`[INFO] Fetching image info from Roblox API...`);
    const apiResponse = await fetchJson(apiUrl);
    
    if (!apiResponse.data || apiResponse.data.length === 0) {
      throw new Error("No data returned from Roblox Thumbnails API.");
    }
    
    const imageUrl = apiResponse.data[0].imageUrl;
    if (!imageUrl) {
      throw new Error("Image URL not found in API response.");
    }
    console.log(`[INFO] Found Image URL: ${imageUrl}`);

    // 3. Fetch the actual image and convert to Base64
    console.log(`[INFO] Downloading image and converting to Base64...`);
    const base64Data = await fetchImageBase64(imageUrl);
    const dataUri = `data:image/png;base64,${base64Data}`;
    
    console.log('\n=== RESULT ===\n');
    console.log(dataUri);
    console.log('\n==============\n');
    
    return dataUri;

  } catch (error) {
    console.error(`[ERROR] ${error.message}`);
  }
}

// Get URL from command line argument
const inputUrl = process.argv[2];

if (!inputUrl) {
  console.log('Usage: node convertRobloxAsset.js <roblox_store_url>');
  console.log('Example: node convertRobloxAsset.js https://create.roblox.com/store/asset/114680270414449/Frost-Cursor-Neutral');
  process.exit(1);
}

convertRobloxLinkToBase64(inputUrl);
