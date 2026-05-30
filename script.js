// Data anime dengan gambar dinamis (lebih mirip screenshot adegan)
// Setiap gambar diambil dari Unsplash dengan keyword spesifik sesuai judul
const animeList = [
    { id: 1, title: "Jujutsu Kaisen - Pertarungan Sukuna", genre: "action", episodes: 24, rating: 4.8, keyword: "jujutsu-kaisen-fight", desc: "Pertarungan epik melawan kutukan." },
    { id: 2, title: "Sousou no Frieren", genre: "fantasy", episodes: 28, rating: 4.9, keyword: "frieren-anime-magic", desc: "Perjalanan sang penyihir abadi." },
    { id: 3, title: "Mushoku Tensei S2", genre: "isekai", episodes: 12, rating: 4.7, keyword: "mushoku-tensei-adventure", desc: "Reinkarnasi ke dunia fantasi." },
    { id: 4, title: "Kaguya-sama: Love is War", genre: "romance", episodes: 37, rating: 4.8, keyword: "kaguya-sama-romance", desc: "Pertarungan cinta ala elit." },
    { id: 5, title: "One Piece - Egghead Arc", genre: "adventure", episodes: 999, rating: 4.9, keyword: "one-piece-pirate-battle", desc: "Petualangan bajak laut topi jerami." },
    { id: 6, title: "Spy x Family S2", genre: "comedy", episodes: 25, rating: 4.8, keyword: "spy-family-anime", desc: "Keluarga palsu penuh aksi lucu." },
    { id: 7, title: "Demon Slayer: Hashira Arc", genre: "action", episodes: 11, rating: 4.9, keyword: "demon-slayer-sword", desc: "Latihan pilar pembasmi iblis." },
    { id: 8, title: "Tensei Shitara Slime S3", genre: "isekai", episodes: 24, rating: 4.7, keyword: "rimuru-slime-anime", desc: "Negara monster dan diplomasi." },
    { id: 9, title: "Horimiya: Piece", genre: "romance", episodes: 13, rating: 4.6, keyword: "horimiya-school-anime", desc: "Kisah remaja penuh kehangatan." },
    { id: 10, title: "Bocchi The Rock!", genre: "comedy", episodes: 12, rating: 4.8, keyword: "bocchi-girl-band", desc: "Gadis introvert punya mimpi band." },
    { id: 11, title: "Vinland Saga S2", genre: "action", episodes: 24, rating: 4.8, keyword: "vinland-saga-viking", desc: "Era Viking yang epik." },
    { id: 12, title: "Sword Art Online Alicization", genre: "fantasy", episodes: 47, rating: 4.5, keyword: "sao-alicization-battle", desc: "VRMMO dunia underword." }
];

// Fungsi untuk mendapatkan URL gambar yang lebih mirip scene anime
function getAnimeSceneImage(keyword) {
    // Menggunakan Unsplash dengan keyword terkait adegan (battle, magic, action)
    // Resolusi 400x340 agar pas di card
    return `https://source.unsplash.com/400x340/?anime,${keyword}`;
}

// Fallback jika gambar gagal (gambar solid color + teks)
const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='340' viewBox='0 0 400 340'%3E%3Crect width='400' height='340' fill='%231e1f2c'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%23ff7b9c' text-anchor='middle' dy='.3em'%3EAnime Scene%3C/text%3E%3C/svg%3E";

let currentGenre = "all";
let searchTerm = "";

// Render anime ke grid
function renderAnime() {
    const container = document.getElementById("animeContainer");
    if (!container) return;

    const filtered = animeList.filter(anime => {
        const genreMatch = currentGenre === "all" || anime.genre === currentGenre;
        const searchMatch = anime.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            anime.desc.toLowerCase().includes(searchTerm.toLowerCase());
        return genreMatch && searchMatch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:50px;"><i class="fas fa-dragon"></i> <h3>Tidak ada anime ditemukan</h3><p>Coba ubah kata kunci atau genre</p></div>`;
        return;
    }

    container.innerHTML = filtered.map(anime => {
        const imgUrl = getAnimeSceneImage(anime.keyword);
        let genreText = "";
        switch(anime.genre) {
            case "action": genreText = "Action"; break;
            case "adventure": genreText = "Petualangan"; break;
            case "isekai": genreText = "Isekai"; break;
            case "romance": genreText = "Romance"; break;
            case "comedy": genreText = "Comedy"; break;
            case "fantasy": genreText = "Fantasy"; break;
            default: genreText = anime.genre;
        }
        // bintang rating
        const fullStars = Math.floor(anime.rating);
        let starHtml = '';
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) starHtml += '<i class="fas fa-star"></i>';
            else if (i === fullStars && anime.rating % 1 >= 0.5) starHtml += '<i class="fas fa-star-half-alt"></i>';
            else starHtml += '<i class="far fa-star"></i>';
        }
        return `
            <div class="anime-card" data-id="${anime.id}" data-title="${anime.title}">
                <img class="anime-img" src="${imgUrl}" alt="${anime.title} scene" loading="lazy" onerror="this.src='${fallbackImage}'">
                <div class="anime-info">
                    <span class="anime-genre">${genreText}</span>
                    <h3>${anime.title}</h3>
                    <div class="episode"><i class="fas fa-video"></i> ${anime.episodes} Episode</div>
                    <div class="rating">${starHtml} <span style="color:#aaa;">(${anime.rating})</span></div>
                    <div class="btn-watch" data-watch-id="${anime.id}"><i class="fas fa-play-circle"></i> Tonton Sekarang</div>
                </div>
            </div>
        `;
    }).join('');

    // Event listener tombol tonton
    document.querySelectorAll('.btn-watch').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-watch-id'));
            const anime = animeList.find(a => a.id === id);
            if (anime) openStreamModal(anime.title);
        });
    });

    // Klik card
    document.querySelectorAll('.anime-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-watch')) return;
            const idAttr = card.getAttribute('data-id');
            if (idAttr) {
                const anime = animeList.find(a => a.id == idAttr);
                if (anime) openStreamModal(anime.title);
            }
        });
    });
}

// Modal streaming (sama seperti sebelumnya)
const streamModal = document.getElementById("streamModal");
const modalTitleSpan = document.getElementById("modalAnimeTitle");
const closeModalBtn = document.getElementById("closeModalBtn");

function openStreamModal(title) {
    modalTitleSpan.innerText = title + " - Episode 1 (Sub Indo)";
    streamModal.style.display = "flex";
    const videoDiv = document.getElementById("videoPlaceholder");
    videoDiv.innerHTML = `
        <i class="fas fa-play-circle" style="font-size: 70px;"></i>
        <p style="font-weight: 600; margin-top: 16px;">▶️ ${title} Sedang Tayang ◀️</p>
        <p style="font-size: 0.85rem; background: #1a1e2c; padding: 6px 16px; border-radius: 50px; margin-top: 12px;">Demo Player - Anime streaming (simulasi)</p>
        <div style="margin-top: 18px; font-size:0.7rem; color:#ffb6c1;"><i class="fas fa-compact-disc"></i> Server drive video tersedia untuk pelanggan premium</div>
    `;
}

function closeModal() {
    streamModal.style.display = "none";
}

// Filter & search
function initFilters() {
    const genreBtns = document.querySelectorAll('.genre-btn');
    genreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            genreBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGenre = btn.getAttribute('data-genre');
            renderAnime();
        });
    });

    const searchInput = document.getElementById('searchAnimeInput');
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderAnime();
    });
}

// Tombol explore
const exploreBtn = document.getElementById('exploreAnimeBtn');
if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
        document.querySelector('.anime-grid').scrollIntoView({ behavior: 'smooth' });
    });
}

// Login simulasi
const loginBtn = document.getElementById('btnLoginSimulasi');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        alert("✨ Fitur login: Simulasi AniStream. Silakan nikmati anime favoritmu.");
    });
}

// Modal close
closeModalBtn.onclick = closeModal;
window.onclick = function(e) {
    if (e.target === streamModal) closeModal();
};

// Jalankan
renderAnime();
initFilters();