// Ganti placeholder ini dengan Project URL & Anon Key asli dari Supabase lo
const supabaseUrl = "https://btzffoirbqazffbgmsnh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0emZmb2lyYnFhemZmYmdtc25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMDEwNTYsImV4cCI6MjA4NjU3NzA1Nn0.ban0dPbvGNDUJTJRwAp-EhlzXh3Uy_4dH4A43hw8Qbg";
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

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker terdaftar'))
    .catch(err => console.log('Error SW:', err));
}
