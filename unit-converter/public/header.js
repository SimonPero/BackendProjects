const options = [
    { name: 'Length', href: './length.html' },
    { name: 'Weight', href: './weight.html' },
    { name: 'Temperature', href: './temperature.html' }
];

function generateNav(current) {
    const navList = document.getElementById('nav-list');
    navList.innerHTML = '';

    options.forEach(option => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = option.href;
        a.textContent = option.name;
        if (option.name === current) {
            a.classList.add('current-a');
        } else {
            a.classList.add('a-style-none');
        }
        li.appendChild(a);
        navList.appendChild(li);
    });
}

const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
generateNav(currentPage.charAt(0).toUpperCase() + currentPage.slice(1)); 
