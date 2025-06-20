document.addEventListener('DOMContentLoaded', () => {
    const starContainer = document.getElementById('star-container');
    const numberOfStars = 150;
    const starSize = 2;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('span');
        star.classList.add('star');

        star.style.width = `${starSize}px`;
        star.style.height = `${starSize}px`;

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        star.style.left = `${x}vw`;
        star.style.top = `${y}vh`;

        const duration = Math.random() * 2 + 1;
        const delay = Math.random() * 2;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;

        starContainer.appendChild(star);
    }

    const postsData = [
        {
            id: 'post-intro',
            title: 'intro',
            fullContent: `<p class='text-gray-300 text-sm'>I'm Sampada, a rising sophomore at MIT studying Mechanical Engineering with a concentration in robotics (2A-6). <br></p><img src='me.png' alt='sampada nepal' class='w-full mt-4 rounded-lg shadow-lg'> <br><p class='text-gray-300 text-sm'>This summer, I'll be in San Francisco working on a personal robotics project. If that sounds interesting or if you'd like to meet, reach out to me at sampada@mit.edu</p>`,
            date: 'may 30, 2025',
            tags: []
        },
        {
            id: 'post-loading',
            title: 'loading...',
            fullContent: `<p class='text-gray-300 text-sm'>launch screen I made for a game</p><img src='pixilart-drawing.gif' alt='pixel gif' class='w-full mt-4 rounded-lg shadow-lg'><br>`,
            date: 'june 10, 2022',
            tags: ['projects']
        },
        {
            id: 'post-maslab',
            title: 'maslab',
            fullContent: `<p class='text-gray-300 text-sm'>This January I participated in Mobile Autonomous Systems Laboratory (MASLAB), a month-long course at MIT designed to give an introduction to autonomous robotics. I learned how to use ROS2 and computer vision for carrying out tasks. It was really enjoyable and it made me want to experiment more on my own.<br></p><img src='maslabpinion.gif' alt='rack and pinion design' class='w-full mt-4 rounded-lg shadow-lg'><br><p class='text-gray-300 text-sm'>I did a lot of hardware design, CAD, and prototyping as well; this rack and pinion design was mounted to a DC motor to pick up multicolored blocks.</p>`,
            date: 'jan 30, 2025',
            tags: ['update', 'projects']
        },
        {
            id: 'post-beerbot',
            title: 'beerbot in process',
            fullContent: `<p class='text-gray-300 text-sm'>a CAD model for a project coming up..</p><img src='beerbotcad.gif' alt='cad of a robot' class='w-full mt-4 rounded-lg shadow-lg'><br>`,
            date: 'june 10, 2022',
            tags: ['update', 'projects']
        },
        {
            id: 'post-game-dev',
            title: 'game dev',
            fullContent: `<p class='text-gray-300 text-sm'>I’ve done a few start-to-finish pixel games in Unity. Through these projects I’ve produced a lot of tilemaps, backgrounds, and programming in C# for video games. <br></p><img src='ghost game.png' alt='pixel gif' class='w-full mt-4 rounded-lg shadow-lg'><br><p class='text-gray-300 text-sm'>halloween game objective: collect lots of candy and escape the evil jack-o-lantern</p>`,
            date: 'September 16, 2021',
            tags: ['projects']
        },
        {
            id: 'post-mulberry-lamp',
            title: 'mulberry lamp',
            fullContent: `<p class='text-gray-300 text-sm'>This was a weekend project gift for my dad :)</p><img src='raspilamp.png' alt='stained glass lamp' class='w-full mt-4 rounded-lg shadow-lg'><br>`,
            date: 'April 23, 2025',
            tags: ['projects']
        },
        {
            id: 'post-hackathon',
            title: 'baby’s first hackathon',
            fullContent: `<p class='text-gray-300 text-sm'>I competed in my first <a href='https://github.com/samyok/cine.stream'>hackathon</a> in 2021 with my brother! we made an online 3D movie-watching arena made entirely from CSS. <br></p><img src='cinestream.png' alt='pixel graphic' class='w-full mt-4 rounded-lg shadow-lg'><br><p class='text-gray-300 text-sm'>winning this hackathon was very inspiring and exciting for me and led to a lot of other random projects I did that year. </p>`,
            date: 'april 16, 2021',
            tags: ['projects']
        }
    ];

    const tagFiltersDiv = document.getElementById('tagFilters');
    const postsGrid = document.getElementById('postsGrid');
    let allPostCards = [];

    const postDetailView = document.getElementById('postDetailView');
    const postOverlay = document.getElementById('postOverlay');
    const detailTitle = document.getElementById('detailTitle');
    const detailContent = document.getElementById('detailContent');
    const detailTags = document.getElementById('detailTags');
    const detailDate = document.getElementById('detailDate');
    const closeDetailViewButton = document.getElementById('closeDetailView');

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

            let cardContentHtml = `<h2 class="text-2xl font-bold mb-2">${post.title}</h2>`;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.fullContent;
            const paragraphText = tempDiv.querySelector('p.text-gray-300')?.textContent || '';
            const truncatedText = truncateText(paragraphText, 150);

            cardContentHtml += `<p class="text-gray-300 text-sm">${truncatedText}</p>`;

            const imageSrcMatch = post.fullContent.match(/<img src=["'](.*?)["']/);
            if (imageSrcMatch && imageSrcMatch[1]) {
                cardContentHtml += `<img src="${imageSrcMatch[1]}" alt="" class="w-full mt-4 rounded-lg shadow-lg">`;
            }

            card.innerHTML = `
                <div class="card-content">
                    ${cardContentHtml}
                </div>
                <div class="mt-4 flex justify-between items-center">
                    <div class="flex flex-wrap gap-1">
                        ${post.tags.map(tag => `<span class="tag-button !cursor-default" data-tag="${tag}">${tag}</span>`).join('')}
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

    function showPostsGrid() {
        postsGrid.style.display = 'block';
        tagFiltersDiv.style.display = 'block';
        document.getElementById('mainTitle').style.display = 'block';
        postDetailView.style.display = 'none';
        postOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';

        postsGrid.style.pointerEvents = 'auto';
        postsGrid.style.filter = 'none';
        tagFiltersDiv.style.pointerEvents = 'auto';
        tagFiltersDiv.style.filter = 'none';
        document.getElementById('mainTitle').style.filter = 'none';
    }

    function showPostDetail(cardElement) {
        postsGrid.style.pointerEvents = 'none';
        postsGrid.style.filter = 'blur(3px) brightness(0.5)';
        tagFiltersDiv.style.pointerEvents = 'none';
        tagFiltersDiv.style.filter = 'blur(3px) brightness(0.5)';
        document.getElementById('mainTitle').style.filter = 'blur(3px) brightness(0.5)';

        document.body.style.overflow = 'hidden';

        detailTitle.textContent = cardElement.dataset.title;
        detailContent.innerHTML = cardElement.dataset.fullContent;

        detailTags.innerHTML = '';
        const tags = cardElement.dataset.tags ? cardElement.dataset.tags.split(',') : [];
        tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.classList.add('tag-button', '!cursor-default');
            tagSpan.setAttribute('data-tag', tag);
            tagSpan.textContent = tag;
            detailTags.appendChild(tagSpan);
        });

        detailDate.textContent = cardElement.dataset.date.toLowerCase();
        postDetailView.style.display = 'flex';
        postOverlay.style.display = 'block';
        window.scrollTo(0, 0);
    }

    function applyFilter(selectedTag) {
        allPostCards.forEach(card => {
            const cardTags = card.dataset.tags ? card.dataset.tags.split(',') : [];
            if (selectedTag === 'all' || cardTags.includes(selectedTag)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    tagFiltersDiv.querySelectorAll('.tag-button').forEach(button => {
        button.addEventListener('click', () => {
            const selectedTag = button.dataset.tag;

            tagFiltersDiv.querySelectorAll('.tag-button').forEach(btn => {
                if (selectedTag === 'all') {
                    btn.style.display = 'inline-block';
                } else {
                    if (btn.dataset.tag === selectedTag || btn.dataset.tag === 'all') {
                        btn.style.display = 'inline-block';
                    } else {
                        btn.style.display = 'none';
                    }
                }
                btn.classList.remove('active');
            });

            button.classList.add('active');
            applyFilter(selectedTag);
        });
    });

    closeDetailViewButton.addEventListener('click', () => {
        showPostsGrid();
        const allButton = tagFiltersDiv.querySelector('[data-tag="all"]');
        if (allButton) {
            allButton.click();
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const initialTag = urlParams.get('tag');

    const initialFilterButton = initialTag ?
                                  tagFiltersDiv.querySelector(`.tag-button[data-tag="${initialTag}"]`) :
                                  tagFiltersDiv.querySelector('[data-tag="all"]');

    if (initialFilterButton) {
        initialFilterButton.click();
    } else {
        tagFiltersDiv.querySelector('[data-tag="all"]').click();
    }

    generatePostCards();
});
