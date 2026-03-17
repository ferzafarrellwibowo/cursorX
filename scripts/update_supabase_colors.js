const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://htynaxsqqzspuklhozmt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0eW5heHNxcXpzcHVrbGhvem10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MzcyMjEsImV4cCI6MjA4OTMxMzIyMX0.s_XzHlMgE32aMVmwm_qdGWw4Riey-tqSsXAxRMczO7c';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const colorCandidates = [
  { name: 'Red', r: 255, g: 0, b: 0 },
  { name: 'Green', r: 0, g: 255, b: 0 },
  { name: 'Blue', r: 0, g: 0, b: 255 },
  { name: 'Yellow', r: 255, g: 255, b: 0 },
  { name: 'Purple', r: 128, g: 0, b: 128 },
  { name: 'Pink', r: 255, g: 192, b: 203 },
  { name: 'White', r: 255, g: 255, b: 255 },
  { name: 'Black', r: 0, g: 0, b: 0 }
];

async function getDominantColorName(buffer) {
  const { data } = await sharp(buffer)
    .resize(48, 48, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const counts = new Map();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 50) continue;
    const r = data[i] >> 4;
    const g = data[i + 1] >> 4;
    const b = data[i + 2] >> 4;
    const key = (r << 8) | (g << 4) | b;
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  if (counts.size === 0) return 'Black'; // Fallback
  
  let maxK = null, maxC = 0;
  for (const [k, v] of counts) {
    if (v > maxC) { maxC = v; maxK = k; }
  }
  const r = (maxK >> 8) << 4;
  const g = ((maxK >> 4) & 15) << 4;
  const b = (maxK & 15) << 4;

  let minDist = Infinity;
  let best = 'Black';
  for (const c of colorCandidates) {
    const dist = Math.pow(c.r - r, 2) + Math.pow(c.g - g, 2) + Math.pow(c.b - b, 2);
    if (dist < minDist) {
      minDist = dist;
      best = c.name;
    }
  }
  return best;
}

async function processBatch(offset) {
  const { data: rows, error } = await supabase
    .from('cursors')
    .select('id, image, color')
    .range(offset, offset + 49);

  if (error) throw error;
  if (!rows || rows.length === 0) return 0;

  for (const row of rows) {
    const id = row.id;
    const url = row.image;
    if (!url) continue;

    try {
      let buf;
      if (url.startsWith('data:image')) {
        const base64Data = url.split(',')[1];
        buf = Buffer.from(base64Data, 'base64');
      } else {
        const fetch = require('node-fetch');
        const r = await fetch(url);
        buf = await r.buffer();
      }

      const newColor = await getDominantColorName(buf);

      // Save if diff
      if (row.color !== newColor) {
        const { error: upErr } = await supabase
          .from('cursors')
          .update({ color: newColor })
          .eq('id', id);
        if (upErr) console.error(`Failed ${id}: `, upErr.message);
        else console.log(`Updated ${id} from ${row.color} => ${newColor}`);
      } else {
        console.log(`Skipped ${id} - already ${newColor}`);
      }
    } catch (e) {
      console.error(`Error ${id}: `, e.message);
    }
  }
  return rows.length;
}

(async () => {
  try {
    let offset = 0;
    while (true) {
      const n = await processBatch(offset);
      if (n === 0) break;
      offset += n;
    }
    console.log('Complete!');
  } catch (e) {
    console.error('Fatal Error:', e);
  }
})();
