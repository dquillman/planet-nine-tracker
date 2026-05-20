// Planet Nine Daily Tracker

// Static papers.xml is refreshed daily by .github/workflows/refresh-papers.yml.
// arXiv's API does not send CORS headers, so we cannot call it from the browser —
// the GitHub Action fetches it server-side and commits the result.
const PAPERS_URL = './papers.xml';

function setDateLabels() {
  const now = new Date();
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('today').textContent = now.toLocaleDateString(undefined, opts);
  document.getElementById('last-refreshed').textContent =
    now.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function truncate(s, n) {
  s = s.trim().replace(/\s+/g, ' ');
  return s.length > n ? s.slice(0, n).trim() + '…' : s;
}

function parseArxivFeed(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const entries = Array.from(doc.getElementsByTagName('entry'));
  return entries.map(entry => {
    const get = tag => {
      const el = entry.getElementsByTagName(tag)[0];
      return el ? el.textContent : '';
    };
    const links = Array.from(entry.getElementsByTagName('link'));
    const htmlLink = links.find(l => l.getAttribute('rel') === 'alternate') || links[0];
    const authors = Array.from(entry.getElementsByTagName('author')).map(a => {
      const n = a.getElementsByTagName('name')[0];
      return n ? n.textContent : '';
    }).filter(Boolean);
    return {
      title: get('title').trim(),
      summary: get('summary').trim(),
      published: get('published'),
      url: htmlLink ? htmlLink.getAttribute('href') : '#',
      authors,
    };
  });
}

function renderPapers(papers) {
  const container = document.getElementById('papers-list');
  if (!papers.length) {
    container.innerHTML = '<p class="loading">No recent papers found.</p>';
    return;
  }
  container.innerHTML = papers.map(p => {
    const date = p.published ? new Date(p.published).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    }) : '';
    const authorStr = p.authors.length
      ? (p.authors.slice(0, 3).join(', ') + (p.authors.length > 3 ? ' et al.' : ''))
      : 'Unknown authors';
    return `
      <article class="paper">
        <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener">${escapeHtml(p.title)}</a>
        <div class="meta">${escapeHtml(date)} — ${escapeHtml(authorStr)}</div>
        <p class="summary">${escapeHtml(truncate(p.summary, 280))}</p>
      </article>
    `;
  }).join('');
}

async function loadPapers() {
  const container = document.getElementById('papers-list');
  try {
    const resp = await fetch(PAPERS_URL, { cache: 'no-cache' });
    if (!resp.ok) throw new Error(`Could not load papers.xml (${resp.status})`);
    const xml = await resp.text();
    const papers = parseArxivFeed(xml);
    renderPapers(papers);
  } catch (err) {
    console.error(err);
    container.innerHTML =
      `<p class="error">Could not load arXiv papers: ${escapeHtml(err.message)}. ` +
      `<a href="https://arxiv.org/search/?searchtype=all&query=Planet+Nine" target="_blank" rel="noopener">Search arXiv directly</a>.</p>`;
  }
}

setDateLabels();
loadPapers();
