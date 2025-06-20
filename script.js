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

    const tagFiltersDiv = document.getElementById('tagFilters');
    const postsGrid = document.getElementById('postsGrid');
    const allPostCards = Array.from(postsGrid.querySelectorAll('.card'));

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

    function applyTruncationToCards() {
        allPostCards.forEach(card => {
            const contentParagraph = card.querySelector('.card-content p.text-gray-300');
            if (contentParagraph) {
                const fullText = contentParagraph.textContent;
                const truncatedText = truncateText(fullText, 150);
                contentParagraph.textContent = truncatedText;
            }
        });
    }

    function lowerCaseCardDates() {
        document.querySelectorAll('.card .card-date-display').forEach(dateElement => {
            dateElement.textContent = dateElement.textContent.toLowerCase();
        });
    }

    function showPostsGrid() {
        postsGrid.style.display = 'grid';
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

    postsGrid.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (event) => {
            if (event.target.closest('.tag-button')) {
                return;
            }
            showPostDetail(card);
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

    applyTruncationToCards();
    showPostsGrid();

    lowerCaseCardDates();
});
