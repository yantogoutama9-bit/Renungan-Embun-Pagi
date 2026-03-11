const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));

// Scrape Renungan ROC dari alkitab.mobi
app.get('/api/renungan/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const [year, month, day] = date.split('-');
        
        // ROC menggunakan format tanggal sederhana
        const url = `https://alkitab.mobi/renungan/roc`;
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);
        
        // Extract data dari HTML alkitab.mobi
        const title = $('h1.entry-title, .renungan-title, h2').first().text().trim() || 
                      $('title').text().replace(' - Alkitab', '').trim();
        
        const content = $('.entry-content, .renungan-content, .post-content').first();
        
        // Cari ayat
        const verseText = content.find('p').first().text().trim();
        const verseMatch = verseText.match(/\(([^)]+)\)$/) || verseText.match(/^([A-Za-z\s]+\d+:\d+)/);
        const verse = verseMatch ? verseMatch[1] : '';
        
        // Cari intro (biasanya paragraf kedua dengan style italic atau class intro)
        const intro = content.find('p').eq(1).text().trim();
        
        // Content utama
        const mainContent = content.find('p').slice(2).map((i, el) => $(el).text().trim()).get().join('\n\n');
        
        res.json({
            title: title || 'Renungan Oswald Chambers',
            verse: verse || '2 Timotius 4:2',
            verseText: verseText,
            intro: intro,
            content: mainContent || content.text().trim(),
            date: date,
            source: 'alkitab.mobi/renungan/roc'
        });
        
    } catch (error) {
        console.error('Error scraping renungan:', error.message);
        res.status(500).json({ error: 'Gagal mengambil data renungan' });
    }
});

// Scrape Quotes dari rehobot.org
app.get('/api/quotes/:date', async (req, res) => {
    try {
        const url = 'https://rehobot.org/category/quote/';
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);
        const quotes = [];
        
        // Extract quotes dari rehobot
        $('.quote, .entry-content p, .post-content p, blockquote').each((i, el) => {
            const text = $(el).text().trim();
            if (text.length > 20 && text.length < 300 && !text.includes('http')) {
                quotes.push({
                    text: text,
                    author: 'Rehobot Church'
                });
            }
        });
        
        // Ambil 3 quotes pertama
        const selectedQuotes = quotes.slice(0, 3);
        
        res.json({
            quotes: selectedQuotes.length > 0 ? selectedQuotes : [
                { text: "Tuhan itu terlalu mulia untuk dibandingkan dengan apa pun.", author: "Rehobot Church" },
                { text: "Mukjizat dilakukan untuk mengenal Sang Pembuat.", author: "Rehobot Church" },
                { text: "Kristen militan bersemangat tinggi dan penuh gairah.", author: "Rehobot Church" }
            ],
            date: req.params.date,
            source: 'rehobot.org/category/quote/'
        });
        
    } catch (error) {
        console.error('Error scraping quotes:', error.message);
        res.status(500).json({ error: 'Gagal mengambil data quotes' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`API Renungan: http://localhost:${PORT}/api/renungan/2025-03-11`);
    console.log(`API Quotes: http://localhost:${PORT}/api/quotes/2025-03-11`);
});
