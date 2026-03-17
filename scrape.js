const { chromium } = require('playwright');
const { createClient } = require('@supabase/supabase-js');

// 🔥 GANTI INI
const SUPABASE_URL = "https://htynaxsqqzspuklhozmt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0eW5heHNxcXpzcHVrbGhvem10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MzcyMjEsImV4cCI6MjA4OTMxMzIyMX0.s_XzHlMgE32aMVmwm_qdGWw4Riey-tqSsXAxRMczO7c";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// convert image → base64
async function imageToBase64(page, url) {
  try {
    const response = await page.goto(url);
    const buffer = await response.body();
    const base64 = buffer.toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch (err) {
    console.log("❌ gagal convert image:", url);
    return null;
  }
}

(async () => {
  try {
    console.log("🚀 START FULL PIPELINE...");

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://cursors.info/', {
      waitUntil: 'networkidle'
    });

    // ========================
    // SCROLL (Tunggu semua data termuat)
    // ========================
    let lastHeight = 0;
    let sameCount = 0;

    console.log("🔄 Scrolling halaman untuk memuat semua cursor...");
    while (true) {
      const newHeight = await page.evaluate(() => document.body.scrollHeight);

      if (newHeight === lastHeight) {
        sameCount++;
        if (sameCount >= 3) break;
      } else {
        sameCount = 0;
      }

      lastHeight = newHeight;
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(1500);
    }

    // ========================
    // EKSTRAK DATA LANGSUNG
    // ========================
    console.log("🔍 Mengekstrak data cursor...");
    const rawCursors = await page.$$eval('.cursor-card', cards => {
      return cards.map(card => {
        const imgEl = card.querySelector('img.cursor-image');
        const imageUrl = imgEl ? imgEl.src : null;
        
        // Extract ID via regex: .../12345.png
        let imageId = null;
        if (imageUrl) {
          const match = imageUrl.match(/\/(\d+)\.(png|jpg|jpeg|webp)/);
          imageId = match ? match[1] : null;
        }

        const titleEl = card.querySelector('h2.cursor-title');
        const name = titleEl ? titleEl.innerText.trim() : "Unknown Cursor";

        const authorEl = card.querySelector('p.cursor-author');
        let creator = "Unknown";
        if (authorEl) {
           const text = authorEl.innerText.trim();
           // Remove "By " prefix if present
           creator = text.replace(/^By\s+/i, '');
        }

        const categoryEl = card.querySelector('p.cursor-type-pill');
        const categoryRaw = categoryEl ? categoryEl.innerText.trim() : "Misc";

        // Mapping raw category to our allowed categories: "Dot", "Cross", "Default", "Misc"
        let category = "Misc";
        const catLower = categoryRaw.toLowerCase();
        if (catLower.includes('dot') || catLower.includes('pixel')) category = "Dot";
        else if (catLower.includes('cross') || catLower.includes('aim')) category = "Cross";
        else if (catLower.includes('arrow') || catLower.includes('default') || catLower === 'classic') category = "Default";

        // Set warna berdasarkan nama (default White, jika ada unsur black menjadi Black)
        let color = "White";
        if (name.toLowerCase().includes('black')) {
          color = "Black";
        }

        return {
          name,
          imageUrl,
          imageId: imageId ? `rbxassetid://${imageId}` : `rbxassetid://${Date.now()}`,
          creator,
          category,
          color
        };
      }).filter(c => c.imageUrl); // Hanya ambil yang beneran ada gambarnya
    });

    console.log(`📄 Ditemukan Total Cursor di halaman: ${rawCursors.length}`);

    // Batasi 40 data dulu agar process tidak terlalu lama untuk batching pertama
    const cursorsToProcess = rawCursors.slice(0, 181);
    console.log(`⚡ Mengambil base64 & Uploading ${cursorsToProcess.length} cursors pertama...`);

    const imagePage = await browser.newPage(); // Pakai satu page bantuan buat load image buffer

    for (let i = 0; i < cursorsToProcess.length; i++) {
      const data = cursorsToProcess[i];
      console.log(`➡️ (${i + 1}/${cursorsToProcess.length}) ${data.name}`);

      try {
        const base64 = await imageToBase64(imagePage, data.imageUrl);

        if (!base64) continue;

        // Insert ke Supabase
        const { error } = await supabase.from('cursors').insert([
          {
            name: data.name,
            image: base64,
            imageId: data.imageId, // match db schema
            category: data.category,
            color: data.color,
            creator: data.creator
          }
        ]);

        if (error) {
          console.log("❌ DB ERROR:", error.message);
        } else {
          console.log("✅ Inserted:", data.name);
        }
      } catch (err) {
        console.log("❌ ERROR MEMPROSES ITEM:", data.name);
      }
      
      await new Promise(res => setTimeout(res, 500)); // Delay antar operasi supaya smooth
    }

    await browser.close();
    console.log("🎉 DONE FULL PIPELINE!");

  } catch (err) {
    console.error("❌ FATAL ERROR:", err);
  }
})();