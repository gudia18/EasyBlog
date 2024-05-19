// script.js

document.addEventListener('DOMContentLoaded', function () {
    loadPosts();
    loadCategories();
    loadTags();
    document.getElementById('search').addEventListener('input', searchPosts);
});

async function loadPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';

    const response = await fetch('posts.json');
    const posts = await response.json();

    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
}

function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <button class="view-comments" data-post-id="${post.id}">View Comments</button>
        <div class="comments" id="comments-${post.id}"></div>
    `;

    const viewCommentsBtn = postElement.querySelector('.view-comments');
    viewCommentsBtn.addEventListener('click', () => loadComments(post.id));

    return postElement;
}

async function loadComments(postId) {
    const commentsContainer = document.getElementById(`comments-${postId}`);
    commentsContainer.innerHTML = '';

    const response = await fetch(`comments/comments${postId}.json`);
    const comments = await response.json();

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.textContent = comment.text;
        commentsContainer.appendChild(commentElement);
    });
}

async function loadCategories() {
    const categoriesContainer = document.getElementById('categories');
    const response = await fetch('categories.json');
    const categories = await response.json();

    categories.forEach(category => {
        const categoryElement = createFilterElement(category.name, 'category');
        categoriesContainer.appendChild(categoryElement);
    });
}

async function loadTags() {
    const tagsContainer = document.getElementById('tags');
    const response = await fetch('tags.json');
    const tags = await response.json();

    tags.forEach(tag => {
        const tagElement = createFilterElement(tag.name, 'tag');
        tagsContainer.appendChild(tagElement);
    });
}

function createFilterElement(name, type) {
    const element = document.createElement('li');
    element.textContent = name;
    element.classList.add(type);
    element.addEventListener('click', () => filterPosts(type, name));
    return element;
}

function searchPosts(event) {
    const searchTerm = event.target.value.toLowerCase();
    const posts = document.querySelectorAll('.post');

    posts.forEach(post => {
        const title = post.querySelector('h2').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            post.style.display = '';
        } else {
            post.style.display = 'none';
        }
    });
}

function filterPosts(type, name) {
    const posts = document.querySelectorAll('.post');

    posts.forEach(post => {
        const category = post.querySelector(`.${type}`);
        if (category && category.textContent === name) {
            post.style.display = '';
        } else {
            post.style.display = 'none';
        }
    });
}
