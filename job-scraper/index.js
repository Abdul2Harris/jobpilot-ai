import app from './src/api/server.js'

const PORT = process.env.PORT || 8001;

app.start = () => app.listen(PORT, () => {
  console.log(`🚀 Scraper API running on http://localhost:${PORT}`);
  console.log(`📖 Test endpoint: POST http://localhost:${PORT}/scrape`);
});

app.start()