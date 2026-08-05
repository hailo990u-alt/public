(() => {
  const STYLE_ID = 'krozo-live-six-categories-style';

  function makeCard({ href, image, title, blurb }) {
    const card = document.createElement('a');
    card.className = 'collection-card krozo-live-category-card';
    card.href = href;
    card.innerHTML = `
      <img src="${image}" loading="lazy" decoding="async" alt="${title} collection" width="900" height="900">
      <span class="collection-card__content">
        <strong>${title}</strong>
        <em>${blurb}</em>
        <small>Explore collection →</small>
      </span>`;
    return card;
  }

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #collections .collection-grid.krozo-live-six-fixed {
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 16px !important;
      }
      #collections .collection-grid.krozo-live-six-fixed > .collection-card {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }
      @media (max-width: 750px) {
        #collections .collection-grid.krozo-live-six-fixed {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 9px !important;
        }
      }`;
    document.head.appendChild(style);
  }

  function fixShopByNeed() {
    const grid = document.querySelector('#collections .collection-grid');
    if (!grid) return;

    installStyles();
    grid.classList.add('krozo-live-six-fixed');

    const travelCard = grid.querySelector('a[href*="/collections/travel-essentials"]');

    if (!grid.querySelector('a[href*="/collections/toys"]')) {
      const playCard = makeCard({
        href: '/collections/toys',
        image: 'https://krozostore.com/cdn/shop/collections/b90bb612-a2ad-41b6-b9a2-21cd4d497e24_trans.jpg?v=1784902641&width=900',
        title: 'Play & Enrichment',
        blurb: 'Made for happier, engaged pets'
      });
      grid.insertBefore(playCard, travelCard || null);
    }

    if (!grid.querySelector('a[href*="/collections/pure-care"]')) {
      const wellnessCard = makeCard({
        href: '/collections/pure-care',
        image: 'https://krozostore.com/cdn/shop/collections/3428635116715.jpg?v=1784901767&width=900',
        title: 'Wellness & Care',
        blurb: 'Thoughtful support for daily care'
      });
      grid.appendChild(wellnessCard);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixShopByNeed, { once: true });
  } else {
    fixShopByNeed();
  }

  window.addEventListener('load', fixShopByNeed, { once: true });
  setTimeout(fixShopByNeed, 500);
  setTimeout(fixShopByNeed, 1500);
})();
