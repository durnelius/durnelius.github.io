document.addEventListener("DOMContentLoaded", () => {
    const ml = document.getElementById("menu-list");
    if (!ml) {
        console.error("Element with ID 'menu-list' not found.");
        return;
    }

    let mb = ml.cloneNode(true);
    mb.removeAttribute('id');
    mb.classList = "";
    mb.classList.add("menu-blur");
    ml.parentNode.parentNode.after(mb);

    const mi = document.getElementById("menu-icon");
    mi.addEventListener("click", function () {
        mi.classList.toggle("opened");
        mb.classList.toggle("show");
    });

    // Check if the particle container already exists
    let particleContainer = document.getElementById('particle-container');
    if (!particleContainer) {
        particleContainer = document.createElement('canvas');
        particleContainer.id = 'particle-container';
        document.body.appendChild(particleContainer);
    }

    // Create the nav
    const nav = document.createElement('nav');
    const navContainer = document.createElement('div');
    navContainer.id = 'nav-container';
    const brand = document.createElement('p');
    brand.id = 'brand';
    const brandHighlight = document.createElement('span');
    brandHighlight.id = 'brand-highlight';
    brandHighlight.textContent = 'duhas';
    const lol = document.createElement('span');
    lol.id = 'lol';
    lol.textContent = '.LOL';
    brand.appendChild(brandHighlight);
    brand.appendChild(lol);

    const navItems = document.createElement('div');
    navItems.id = 'nav-items';
    const menuIcon = document.createElement('button');
    menuIcon.id = 'menu-icon';
    menuIcon.type = 'button';
    menuIcon.setAttribute('aria-label', 'Mobile menu');
    const menuIconImg = document.createElement('img');
    menuIconImg.classList.add('unselectable');
    menuIconImg.src = '/assets/menu.svg';
    menuIconImg.alt = 'Menu Icon';
    menuIconImg.width = 30;
    menuIconImg.height = 30;
    menuIcon.appendChild(menuIconImg);

    const menuList = document.createElement('ul');
    menuList.id = 'menu-list';
    menuList.classList.add('unselectable');
    const menuItems = ['Home', 'Nezinau', 'Tuscia'].map(text => {
        const listItem = document.createElement('li');
        const anchor = document.createElement('a');
        anchor.classList.add('unselectable');
        anchor.href = '/';
        anchor.textContent = text;
        listItem.appendChild(anchor);
        return listItem;
    });
    menuList.append(...menuItems);

    navItems.appendChild(menuIcon);
    navItems.appendChild(menuList);
    navContainer.appendChild(brand);
    navContainer.appendChild(navItems);
    nav.appendChild(navContainer);
    document.body.appendChild(nav);

    // Create the snowflakes animation (all year long)
    const canvas = particleContainer;
    const ctx = canvas.getContext('2d');

    // Resize the canvas to fit the window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight > 500 ? window.innerHeight : 500;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const numImages = 16; // Number of snowflakes
    const images = [];
    const imageSrc = '/assets/sniegas.svg'; // Path to the snowflake image

    // Create and initialize snowflakes
    for (let i = 0; i < numImages; i++) {
        const img = new Image();
        img.src = imageSrc;
        images.push({
            img: img,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height + 30,
            dx: 0.25,
            dy: -(0.5 + Math.random() / 2) / (30 / 100),
            size: 10 + Math.random() * 20, // Random size for each snowflake
        });
    }

    // Function to animate the snowflakes
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        images.forEach(image => {
            image.x -= image.dx; // Move snowflake horizontally
            image.y -= image.dy; // Move snowflake vertically

            if (image.x < 0 - image.size || image.x > canvas.width + image.size) {
                image.y = canvas.height + 30;
                image.x = Math.random() * canvas.width;
                image.dy = -(0.5 + Math.random() / 2) / (30 / 100);
            }

            if (image.y > canvas.height) {
                image.y = 0;
                image.x = Math.random() * canvas.width;
                image.dy = -(0.5 + Math.random() / 2) / (30 / 100);
            }

            ctx.drawImage(image.img, image.x, image.y, image.size, image.size);
        });

        requestAnimationFrame(animate);
    }

    animate();
});
