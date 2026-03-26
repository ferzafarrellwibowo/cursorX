  # Feedback System Setup Guide

  ## 1. Database Schema (Supabase SQL)

  Jalankan SQL ini di Supabase SQL Editor:

  ```sql
  -- Create feedback table
  CREATE TABLE IF NOT EXISTS feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text TEXT NOT NULL CHECK (char_length(text) >= 1 AND char_length(text) <= 500),
    type TEXT NOT NULL DEFAULT 'feedback' CHECK (type IN ('feedback', 'report', 'bug')),
    cursor_id TEXT DEFAULT NULL,
    ip_hash TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create index for faster queries
  CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);
  CREATE INDEX idx_feedback_type ON feedback(type);
  CREATE INDEX idx_feedback_ip_hash ON feedback(ip_hash);

  -- Enable Row Level Security
  ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

  -- Policy: Allow anonymous INSERT (public can submit feedback)
  CREATE POLICY "Allow anonymous insert" ON feedback
    FOR INSERT
    TO anon
    WITH CHECK (
      char_length(text) >= 1
      AND char_length(text) <= 500
      AND type IN ('feedback', 'report', 'bug')
    );

  -- Policy: Only authenticated users (admin) can SELECT
  CREATE POLICY "Admin can read" ON feedback
    FOR SELECT
    TO authenticated
    USING (true);

  -- Policy: Only authenticated users (admin) can DELETE
  CREATE POLICY "Admin can delete" ON feedback
    FOR DELETE
    TO authenticated
    USING (true);
  ```

  ## 2. Rate Limiting Table (Opsional tapi Direkomendasikan)

  ```sql
  -- Rate limiting table
  CREATE TABLE IF NOT EXISTS rate_limits (
    ip_hash TEXT PRIMARY KEY,
    last_request TIMESTAMPTZ DEFAULT NOW(),
    request_count INTEGER DEFAULT 1
  );

  -- Auto-cleanup old rate limits (jalankan via Supabase Edge Function/Cron)
  -- DELETE FROM rate_limits WHERE last_request < NOW() - INTERVAL '1 hour';
  ```

  ## 3. Environment Variables

  Pastikan `.env.local` memiliki:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  ```

  ## 4. Security Best Practices

  1. **Tidak ada SQL Injection** - Menggunakan Supabase Query Builder
  2. **Rate Limiting** - 1 request per 30 detik per IP
  3. **Input Validation** - Server-side validation wajib
  4. **IP Hashing** - IP disimpan sebagai hash (privasi)
  5. **RLS Enabled** - Row Level Security aktif
  6. **API Route** - Frontend tidak langsung ke Supabase
