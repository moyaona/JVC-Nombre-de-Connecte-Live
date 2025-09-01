// ==UserScript==
// @name         JVC - Nombre de Connectés Live
// @version      1.1
// @description  Affiche un compteur flottant du nombre de connectés, sur les topics et la liste des sujets.
// @author       moyaona
// @updateURL https://github.com/moyaona/JVC-Nombre-de-Connectes-Live/raw/refs/heads/main/JVC%20-%20Nombre%20de%20Connect%C3%A9s%20Live.user.js
// @downloadURL https://github.com/moyaona/JVC-Nombre-de-Connectes-Live/raw/refs/heads/main/JVC%20-%20Nombre%20de%20Connect%C3%A9s%20Live.user.js
// @match        https://www.jeuxvideo.com/forums/42-*-*-*-*-*-*-*.htm
// @match        https://www.jeuxvideo.com/forums/0-*-*-*-*-*-*-*.htm
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://image.noelshack.com/fichiers/2025/33/7/1755381689-logo-jvc-nbrcos.png
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. Style CSS avec l'icône statique ---
    GM_addStyle(`
        #jvc-sticky-connectes {
            position: fixed;
            top: 105px;
            right: 20px;
            z-index: 9999;
            background-color: #2d2d2d; /* Fond gris anthracite */
            color: #e0e0e0; /* Texte gris clair */
            border: 1px solid #444; /* Bordure assortie */
            padding: 6px 12px;
            border-radius: 5px;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            font-size: 15px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            display: none;
            align-items: center; /* Pour bien aligner le texte et l'icône */
            gap: 8px; /* Espace entre le nombre et l'icône */
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            transform: translateY(-20px);
        }
        #jvc-sticky-connectes.visible {
            display: flex;
            opacity: 1;
            transform: translateY(0);
        }
        #jvc-sticky-connectes .live-icon {
            width: 8px;
            height: 8px;
            background-color: #ff5252; /* Rouge pour l'icône */
            border-radius: 50%;
            /* L'animation a été retirée */
        }
    `);

    // --- 2. Création de l'élément flottant ---
    const stickyElement = document.createElement('div');
    stickyElement.id = 'jvc-sticky-connectes';
    stickyElement.innerHTML = `<span class="count">...</span><span class="live-icon"></span>`;
    document.body.appendChild(stickyElement);
    const countSpan = stickyElement.querySelector('.count');

    // --- 3. Logique principale ---
    function run() {
        const topicSpan = document.querySelector('.nb-connect-fofo');
        if (topicSpan) {
            init(topicSpan.closest('.card'), () => topicSpan.textContent);
            return;
        }

        const statsCard = document.querySelector('.col-md-4 .card:first-child');
        if (statsCard && statsCard.textContent.includes('connecté(s)')) {
             init(statsCard, () => {
                const strongs = statsCard.querySelectorAll('strong');
                for (const strong of strongs) {
                    if (strong.nextSibling && strong.nextSibling.textContent.includes('connecté(s)')) {
                        return strong.textContent.trim();
                    }
                }
                return '0';
            });
        }
    }

    // --- 4. Fonction d'initialisation ---
    function init(originalContainer, getTextFunction) {
        if (!originalContainer) return;

        const originalPosition = originalContainer.getBoundingClientRect().top + window.pageYOffset;

        const updateText = () => {
            const fullText = getTextFunction();
            const number = parseInt(fullText, 10);
            if (!isNaN(number)) {
                countSpan.textContent = number;
            }
        };

        updateText();
        setInterval(updateText, 5000);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > originalPosition) {
                stickyElement.classList.add('visible');
            } else {
                stickyElement.classList.remove('visible');
            }
        }, { passive: true });
    }

    setTimeout(run, 500);

})();
