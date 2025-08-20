const gifBtn = document.getElementById('gif-btn');
const popup = document.getElementById('popup');
const searchForm = document.getElementById('search-form');
const searchInput = document.querySelector('.search-input');
const resultsDiv = document.getElementById('results');

const limits = 24;
const apiKey = 'AIzaSyBUZ5Z6Tx_Yeffgi9Jdd_elJ7gOcR8hPtY';

let currentQuery = '';
let nextPos = null;
let isLoading = false;

gifBtn.addEventListener('click', () => {
    popup.style.display = popup.style.display === 'flex' ? 'none' : 'flex';
});

async function fetchGIFs(append = false) {
    if (!currentQuery || isLoading) return;
    isLoading = true;

    let url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(currentQuery)}&key=${apiKey}&limit=${limits}&contentfilter=high`;
    if (nextPos) url += `&pos=${nextPos}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!append) resultsDiv.innerHTML = '';

        data.results.forEach((gif) => {
            const img = document.createElement('img');
            img.src = gif.media_formats.tinygif.url;
            img.alt = currentQuery;
            img.loading = 'lazy';
            resultsDiv.appendChild(img);
        });

        nextPos = data.next || null;
        isLoading = false;
    } catch (err) {
        console.error(err);
        isLoading = false;
    }
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentQuery = searchInput.value.trim();
    if (!currentQuery) return;
    resultsDiv.innerHTML = '';
    nextPos = null;
    fetchGIFs();
});

resultsDiv.addEventListener('scroll', () => {
    if (resultsDiv.scrollTop + resultsDiv.clientHeight >= resultsDiv.scrollHeight - 50 && nextPos) {
        fetchGIFs(true);
    }
});
