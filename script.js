document.addEventListener('DOMContentLoaded', () => {
    const starContainer = document.getElementById('star-container');
    const postsGrid = document.getElementById('postsGrid');
    const tagFiltersDiv = document.getElementById('tagFilters');
    const mainTitle = document.getElementById('mainTitle');
    const postDetailView = document.getElementById('postDetailView');
    const postOverlay = document.getElementById('postOverlay');
    const detailTitle = document.getElementById('detailTitle');
    const detailContent = document.getElementById('detailContent');
    const detailTags = document.getElementById('detailTags');
    const detailDate = document.getElementById('detailDate');
    const closeDetailViewButton = document.getElementById('closeDetailView');

    let allPostCards = [];

    const numberOfParticles = 60; // Paper dust particles instead of stars
    const particleSize = 2;

    let lastSelectedTag = 'main';
    let filterBeforeDetail = 'main';

    const postsData = [
        {
            id: 'post-poartable',
            title: 'poartable',
            fullContent: `<p class='text-gray-700 text-sm'>created an accessible oar-carrying device for pararowers and the MIT rowing team. check out the project <a href='https://poartable200.cargo.site/'>website</a>! <img src='poartable.png' alt='oar-carrying device' class='w-full mt-4 rounded-lg shadow-lg'> <p class='text-gray-700 text-sm'> <img src='poarcads.png' alt='cad models of oar carrier product' class='w-full mt-4 rounded-lg shadow-lg'></p>`,
            date: 'may 22, 2025',
            tags: ['mech-e']
        },
        {
            id: 'post-loading',
            title: 'loading...',
            fullContent: `<p class='text-gray-700 text-sm'>launch screen I made for a game</p><img src='pixilart-drawing.gif' alt='pixel gif' class='w-full mt-4 rounded-lg shadow-lg'><br>`,
            date: 'june 10, 2022',
            tags: ['CS']
        },
        {
            id: 'post-webdev',
            title: 'web dev',
            fullContent: `<p class='text-gray-700 text-sm'>i made everything on this website!</p><img src='webdevlol.png' alt='screenshot of website cover' class='w-full mt-4 rounded-lg shadow-lg'><br>`,
            date: 'june 20, 2025',
            tags: ['CS']
        },
        {
            id: 'post-maslab',
            title: 'rack-and-pinion',
            fullContent: `<p class='text-gray-700 text-sm'>this was mounted to a DC motor for an autonomous robot to pick up multicolored blocks.<br></p><img src='maslabpinion.gif' alt='rack and pinion design' class='w-full mt-4 rounded-lg shadow-lg'><br><p class='text-gray-700 text-sm'></p>`,
            date: 'jan 30, 2025',
            tags: ['mech-e']
        },
        {
            id: 'post-beerbot',
            title: 'beerbot in process',
            fullContent: `<p class='text-gray-700 text-sm'>a cad model (in Fusion) for a project coming up..</p><img src='beerbotcad.gif' alt='cad of a robot' class='w-full mt-4 rounded-lg shadow-lg'><br>`,
            date: 'june 10, 2022',
            tags: ['mech-e']
        },
        {
            id: 'post-game-dev',
            title: 'game dev',
            fullContent: `<p class='text-gray-700 text-sm'>I've done a few start-to-finish pixel games in Unity. Through these projects I've produced a lot of tilemaps, backgrounds, and programming in C#. <br></p><img src='ghost game.png' alt='pixel gif' class='w-full mt-4 rounded-lg shadow-lg'><br><p class='text-gray-700 text-sm'></p>`,
            date: 'September 16, 2021',
            tags: ['CS']
        },
        {
            id: 'post-mulberry-lamp',
            title: 'mulberry lamp',
            fullContent: `<p class='text-gray-700 text-sm'>a weekend project gift for my dad :)</p><img src='raspilamp.png' alt='stained glass lamp' class='w-full mt-4 rounded-lg shadow-lg'><br>`,
            date: 'April 23, 2025',
            tags: ['personal']
        },
        {
            id: 'post-hackathon',
            title: "baby's first hackathon",
            fullContent: `<p class='text-gray-700 text-sm'>I competed in my first <a href='https://github.com/samyok/cine.stream'>hackathon</a> in 2021 with my brother! we made an online 3D movie-watching arena made entirely from CSS. <br></p><img src='cinestream.png' alt='pixel graphic' class='w-full mt-4 rounded-lg shadow-lg'><br><p class='text-gray-700 text-sm'>winning this hackathon was very inspiring and exciting for me and led to a lot of other random projects I did that year. </p>`,
            date: 'april 16, 2021',
            tags: ['CS']
        }
    ];

    function createPaperParticle(size, duration, delay) {
        const particle = document.createElement('span');
        particle.classList.add('star'); // Reusing the star class but with different styling
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        return particle;
    }

    function initPaperParticles(count, size) {
        for (let i = 0; i < count; i++) {
            starContainer.appendChild(createPaperParticle(size + Math.random(), Math.random() * 6 + 4, Math.random() * 4));
        }
    }

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        let truncated = text.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace !== -1) {
            truncated = truncated.substring(0, lastSpace);
        }
        return truncated + '...';
    }

    function createTagSpan(tag) {
        const tagSpan = document.createElement('span');
        tagSpan.classList.add('tag-button', '!cursor-default');
        tagSpan.setAttribute('data-tag', tag);
        tagSpan.textContent = tag;
        return tagSpan;
    }

    function generatePostCards() {
        postsGrid.innerHTML = '';
        postsData.forEach((post, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.id = post.id;
            card.setAttribute('data-title', post.title);
            card.setAttribute('data-full-content', post.fullContent);
            card.setAttribute('data-date', post.date);
            if (post.tags.length > 0) {
                card.setAttribute('data-tags', post.tags.join(','));
            }

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.fullContent;
            const paragraphElement = tempDiv.querySelector('p');
            const paragraphText = paragraphElement ? paragraphElement.textContent : '';
            const truncatedText = truncateText(paragraphText, 150);

            const imageMatch = post.fullContent.match(/<img src=["'](.*?)["']/);
            const imageHtml = imageMatch ? `<img src="${imageMatch[1]}" alt="" class="w-full mt-4 rounded-lg shadow-lg">` : '';

            const tagSpansHtml = post.tags.map(tag => createTagSpan(tag).outerHTML).join('');

            card.innerHTML = `
                <div class="card-content">
                    <h2 class="text-2xl font-bold mb-2">${post.title}</h2>
                    <p class="text-sm">${truncatedText}</p>
                    ${imageHtml}
                </div>
                <div class="mt-4 flex justify-between items-center">
                    <div class="flex flex-wrap gap-1">
                        ${tagSpansHtml}
                    </div>
                    <p class="text-xs card-date-display">${post.date}</p>
                </div>
            `;
            postsGrid.appendChild(card);
        });
        allPostCards = Array.from(postsGrid.querySelectorAll('.card'));
        addCardClickListeners();
        lowerCaseCardDates();
    }

    function addCardClickListeners() {
        postsGrid.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', (event) => {
                if (event.target.closest('.tag-button')) {
                    return;
                }
                showPostDetail(card);
            });
        });
    }

    function lowerCaseCardDates() {
        document.querySelectorAll('.card .card-date-display').forEach(dateElement => {
            dateElement.textContent = dateElement.textContent.toLowerCase();
        });
    }

    function setMainVisibility(displayStyle, filterStyle, pointerEventsStyle) {
        postsGrid.style.display = displayStyle === 'grid' ? 'grid' : 'block';
        tagFiltersDiv.style.display = displayStyle;
        mainTitle.style.display = displayStyle;

        postsGrid.style.pointerEvents = pointerEventsStyle;
        postsGrid.style.filter = filterStyle;
        tagFiltersDiv.style.pointerEvents = pointerEventsStyle;
        tagFiltersDiv.style.filter = filterStyle;
        mainTitle.style.filter = filterStyle;
    }

    function showPostsGrid() {
        setMainVisibility('block', 'none', 'auto');
        postDetailView.style.display = 'none';
        postOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function showPostDetail(cardElement) {
        filterBeforeDetail = lastSelectedTag;
        setMainVisibility('none', 'blur(2px) brightness(0.7)', 'none');
        document.body.style.overflow = 'hidden';

        // Remove highlight from all cards and reset to default color
        document.querySelectorAll('.card').forEach(card => {
            card.style.backgroundColor = '#faf7f0';
            card.style.borderColor = '#d4c4a0';
        });
        // Highlight the clicked card
        cardElement.style.backgroundColor = '#f5f1e8';
        cardElement.style.borderColor = '#b8a88a';
        cardElement.classList.add('active-detail');

        detailTitle.textContent = cardElement.dataset.title;
        detailContent.innerHTML = cardElement.dataset.fullContent;

        detailTags.innerHTML = '';
        const tags = cardElement.dataset.tags ? cardElement.dataset.tags.split(',') : [];
        tags.forEach(tag => {
            detailTags.appendChild(createTagSpan(tag));
        });

        detailDate.textContent = cardElement.dataset.date.toLowerCase();
        postDetailView.style.display = 'flex';
        postOverlay.style.display = 'block';
        window.scrollTo(0, 0);
    }

    function applyFilter(selectedTag) {
        allPostCards.forEach(card => {
            const cardTags = card.dataset.tags ? card.dataset.tags.split(',') : [];
            if (selectedTag === 'main') {
                if (card.id === 'post-intro' || cardTags.includes('mech-e') || cardTags.includes('CS')) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            } else if (cardTags.includes(selectedTag)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    tagFiltersDiv.querySelectorAll('.tag-button').forEach(button => {
        button.addEventListener('click', () => {
            const selectedTag = button.dataset.tag;

            lastSelectedTag = selectedTag;

            tagFiltersDiv.querySelectorAll('.tag-button').forEach(btn => {
                btn.classList.remove('active');
            });

            button.classList.add('active');
            applyFilter(selectedTag);

            // Hide or show the header trio and posts section title based on tag
            const trio = document.querySelector('.trio-cards-container');
            const postsTitle = document.querySelector('.posts-section-title');
            if (trio) {
                if (selectedTag === 'main') {
                    trio.style.display = '';
                    if (postsTitle) postsTitle.style.display = '';
                } else {
                    trio.style.display = 'none';
                    if (postsTitle) postsTitle.style.display = 'none';
                }
            }
        });
    });

    // Close detail view when clicking the overlay
    postOverlay.addEventListener('click', function(e) {
        if (e.target === postOverlay) {
            showPostsGrid();
            document.body.style.overflow = 'auto';
            document.querySelectorAll('.card').forEach(card => {
                card.style.backgroundColor = '#faf7f0';
                card.style.borderColor = '#d4c4a0';
                card.classList.remove('active-detail');
            });
            const lastButton = tagFiltersDiv.querySelector(`[data-tag="${filterBeforeDetail}"]`);
            if (lastButton) {
                lastButton.click();
            }
        }
    });

    // Close detail view with close button
    closeDetailViewButton.addEventListener('click', () => {
        showPostsGrid();
        document.body.style.overflow = 'auto';
        document.querySelectorAll('.card').forEach(card => {
            card.style.backgroundColor = '#faf7f0';
            card.style.borderColor = '#d4c4a0';
            card.classList.remove('active-detail');
        });
        const lastButton = tagFiltersDiv.querySelector(`[data-tag="${filterBeforeDetail}"]`);
        if (lastButton) {
            lastButton.click();
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const initialTag = urlParams.get('tag');

    const initialFilterButton = initialTag ?
        tagFiltersDiv.querySelector(`.tag-button[data-tag="${initialTag}"]`) :
        tagFiltersDiv.querySelector('[data-tag="main"]');

    initPaperParticles(numberOfParticles, particleSize);
    generatePostCards();

    if (initialFilterButton) {
        initialFilterButton.click();
    } else {
        tagFiltersDiv.querySelector('[data-tag="main"]').click();
    }
});