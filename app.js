const supabaseUrl = "https://btzffoirbqazffbgmsnh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0emZmb2lyYnFhemZmYmdtc25oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMDEwNTYsImV4cCI6MjA4NjU3NzA1Nn0.ban0dPbvGNDUJTJRwAp-EhlzXh3Uy_4dH4A43hw8Qbg";

const { createClient } = supabase;
const db = createClient(supabaseUrl, supabaseKey);

async function getArticles() {
  const { data, error } = await db
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error("ERROR:", error);
    return;
  }

  const container = document.getElementById('articles');
  container.innerHTML = '';

  data.forEach(a => {
    container.innerHTML += `
      <article>
        <h2>${a.title}</h2>
        <p>${a.content}</p>
        <small>${a.category}</small>
      </article>
    `;
  });
}

getArticles();
