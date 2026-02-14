// Ganti dengan Supabase lo
const supabaseUrl = "https://YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function getArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error("Supabase error:", error);
    return;
  }

  const container = document.getElementById('articles');
  container.innerHTML = ''; // clear dulu
  data.forEach(a => {
    const article = document.createElement('article');
    article.innerHTML = `
      <h2>${a.title}</h2>
      <p>${a.content}</p>
      <small>Sumber: <a href="${a.link}" target="_blank">${a.source}</a></small>
    `;
    container.appendChild(article);
  });
}

getArticles();

// Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker terdaftar'))
    .catch(err => console.log('Error SW:', err));
}
