const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
const input = document.querySelector('input');
const shortUrlBtn = document.querySelector('.short-url');
const urlContainer = document.querySelector('.url-container');
const error = document.querySelector('.error');


if (localStorage.getItem('savedLinks')) urlContainer.innerHTML = localStorage.getItem('savedLinks');



menu.addEventListener('click', () => {
    nav.classList.toggle('show');
});

shortUrlBtn.addEventListener('click', () => {
    let longUrl = input.value.trim();
    if (longUrl === '') {
        input.classList.add('active')
        error.classList.add('active')
        return
    }
    else {

        fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Invalid URL or server issue');
                }
                return response.text();
            })
            .then(shortUrl => {
                urlContainer.innerHTML += `
            <div class="url flex between">
                <p class="link-left">${longUrl}</p>
                <hr />
                <p class="link-right">
                    <a href="${shortUrl}" target="_blank">${shortUrl}</a>
                    <span class="copy-btn">Copy</span>
                </p>
            </div>
        `;


                localStorage.setItem('savedLinks', urlContainer.innerHTML)
            })
            .catch((err) => {
                error.textContent = 'Please enter a valid URL'
                error.classList.add('active');
            });

    }

    input.value = ''
});

input.addEventListener('focus', () => {
    input.classList.remove('active')
    error.classList.remove('active')
})


urlContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('copy-btn')) {
        const linkElement = event.target.parentElement.querySelector('a');
        if (linkElement) {
            const textToCopy = linkElement.href;

            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    event.target.textContent = 'Copied!';
                    event.target.style.backgroundColor = 'hsl(260, 8%, 14%)'
                })
                .catch(err => console.error('Clipboard copy failed:', err));
        }
    }
});
