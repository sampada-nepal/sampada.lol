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

    const numberOfStars = 100;
    const starSize = 2;

    let lastSelectedTag = 'main';
    let filterBeforeDetail = 'main';

    const postsData = [
        {
            id: 'post-intro',
            title: 'intro',
            fullContent: `<p class='text-gray-300 text-sm'>I'm Sampada, a rising sophomore at MIT studying Mechanical Engineering with a concentration in robotics (2A-6). <br></p><img src='me.png' alt='sampada nepal' class='w-full mt-4 rounded-lg shadow-lg'> <br><p class='text-gray-300 text-sm'>This summer, I'll be in San Francisco working on a personal robotics project. If that sounds interesting or if you'd like to meet, reach out to me at sampada@mit.edu</p>`,
            date: 'may 30, 2025',
            tags: []
        },
        {
            id: 'post-poartable',
            title: 'poartable',
            fullContent: `<p class='text-gray-300 text-sm'>created an accessible oar-carrying device for pararowers and the MIT rowing team. check out the project <a href='https://poartable200.cargo.site/'>website</a>! <img src='poartable.png' alt='oar-carrying device' class='w-full mt-4 rounded-lg shadow-lg'> <p class='text-gray-300 text-sm'> <img src='poarcads.png' alt='cad models of oar carrier product' class='w-full mt-4 rounded-lg shadow-lg'></p>`,
            date: 'may 22, 2025',
            tags: ['mech-e']
        },
        {
            id: 'post-loading',
            title: 'loading...',
            fullContent: `<p class='text-gray-300 text-sm'>launch screen I made for a game</p><img src='pixilart-drawing.gif' alt='pixel gif' class='w-full mt-4 rounded-lg shadow-lg'><br>`,
            date: 'june 10, 2022',
            tags: ['CS']
        },
        {
            id: 'post-maslab',
            title: 'rack-and-pinion',
            fullContent: `<p class='text-gray-300 text-sm'>this was mounted to a DC motor for an autonomous robot to pick up multicolored blocks.<br></p><img src='maslabpinion.gif' alt='rack and pinion design' class='w-full mt-4 rounded-lg shadow-lg'><br><p class='text-gray-300 text-sm'></p>`,
            date: 'jan 30, 2025',
            tags: ['mech-e']
        },
        {
            id: 'post-beerbot',
            title: 'beerbot in process',
            fullContent: `<p class='text-gray-300 text-sm'>a cad model (in Fusion) for a project coming up..</p><img src='beerbotcad.gif' alt='cad of a robot' class='w-full mt-4 rounded-lg shadow-lg'><br>`,
            date: 'june 10, 2022',
            tags: ['mech-e']
        },
        {
            id: 'post-game-dev',
            title: 'game dev',
            fullContent: `<p class='text-gray-300 text-sm'>I've done a few start-to-finish pixel games in Unity. Through these projects I've produced a lot of tilemaps, backgrounds, and programming in C# for video games. <br></p><img src='ghost game.png' alt='pixel gif' class='w-full mt-4 rounded-lg shadow-lg'><br><p class='text-gray-300 text-sm'>halloween game objective: collect lots of candy and escape the evil jack-o-lantern</p>`,
            date: 'September 16, 2021',
            tags: ['CS']
        },
        {
            id: 'post-mulberry-lamp',
            title: 'mulberry lamp',
            fullContent: `<p class='text-gray-300 text-sm'>a weekend project gift for my dad :)</p><img src='raspilamp.png' alt='stained glass lamp' class='w-full mt-4 rounded-lg shadow-lg'><br>`,
            date: 'April 23, 2025',
            tags: ['personal']
        },
        {
            id: 'post-hackathon',
            title: "baby's first hackathon",
            fullContent: `<p class='text-gray-300 text-sm'>I competed in my first <a href='https://github.com/samyok/cine.stream'>hackathon</a> in 2021 with my brother! we made an online 3D movie-watching arena made entirely from CSS. <br></p><img src='cinestream.png' alt='pixel graphic' class='w-full mt-4 rounded-lg shadow-lg'><br><p class='text-gray-300 text-sm'>winning this hackathon was very inspiring and exciting for me and led to a lot of other random projects I did that year. </p>`,
            date: 'april 16, 2021',
            tags: ['CS']
        }
    ];

    function createStar(size, duration, delay) {
        const star = document.createElement('span');
        star.classList.add('star');
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;
        return star;
    }

    function initStars(count, size) {
        for (let i = 0; i < count; i++) {
            starContainer.appendChild(createStar(size, Math.random() * 2 + 1, Math.random() * 2));
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
        postsData.forEach(post => {
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
            const paragraphElement = tempDiv.querySelector('p.text-gray-300');
            const paragraphText = paragraphElement ? paragraphElement.textContent : '';
            const truncatedText = truncateText(paragraphText, 150);

            const imageMatch = post.fullContent.match(/<img src=["'](.*?)["']/);
            const imageHtml = imageMatch ? `<img src="${imageMatch[1]}" alt="" class="w-full mt-4 rounded-lg shadow-lg">` : '';

            const tagSpansHtml = post.tags.map(tag => createTagSpan(tag).outerHTML).join('');

            card.innerHTML = `
                <div class="card-content">
                    <h2 class="text-2xl font-bold mb-2">${post.title}</h2>
                    <p class="text-gray-300 text-sm">${truncatedText}</p>
                    ${imageHtml}
                </div>
                <div class="mt-4 flex justify-between items-center">
                    <div class="flex flex-wrap gap-1">
                        ${tagSpansHtml}
                    </div>
                    <p class="text-xs text-gray-500 card-date-display">${post.date}</p>
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
        setMainVisibility('none', 'blur(3px) brightness(0.5)', 'none');
        document.body.style.overflow = 'hidden';

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
        });
    });

    closeDetailViewButton.addEventListener('click', () => {
        showPostsGrid();
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

    initStars(numberOfStars, starSize);
    generatePostCards();

    if (initialFilterButton) {
        initialFilterButton.click();
    } else {
        tagFiltersDiv.querySelector('[data-tag="main"]').click();
    }
});
