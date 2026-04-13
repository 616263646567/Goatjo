/**
 * Persists Gojo vs Sukuna domain background across pages (style.html switcher → site-wide).
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'jjk-domain-mode';

    function getMode() {
        try {
            return localStorage.getItem(STORAGE_KEY) === 'sukuna' ? 'sukuna' : 'gojo';
        } catch (e) {
            return 'gojo';
        }
    }

    function setMode(mode) {
        if (mode !== 'gojo' && mode !== 'sukuna') return;
        try {
            localStorage.setItem(STORAGE_KEY, mode);
        } catch (e) {}
    }

    function restoreStylePage() {
        var bgImage = document.getElementById('bg-image');
        var domainBg = document.getElementById('domain-bg');
        if (!bgImage || !domainBg) return false;

        var mode = getMode();
        var isGojo = mode === 'gojo';
        var body = document.body;
        body.classList.toggle('gojo-active', isGojo);
        body.classList.toggle('sukuna-active', !isGojo);

        var imgSrc = isGojo ? 'assets/images/voidd.jpg' : 'assets/images/yes.png';
        bgImage.style.backgroundImage = "url('" + imgSrc + "')";
        bgImage.classList.add('visible');

        domainBg.style.background = isGojo
            ? 'linear-gradient(180deg, rgba(1,10,24,0.75) 0%, rgba(0,0,0,0.9) 100%)'
            : 'linear-gradient(180deg, rgba(16,0,0,0.75) 0%, rgba(0,0,0,0.9) 100%)';
        domainBg.style.opacity = '0.85';

        if (typeof window.__jjkSyncParticles === 'function') {
            window.__jjkSyncParticles(mode);
        }
        return true;
    }

    function applyHtmlClassSync() {
        var root = document.documentElement;
        if (!root.hasAttribute('data-domain-sync')) return;

        var sukuna = getMode() === 'sukuna';
        root.classList.toggle('sukuna-mode', sukuna);

        var body = document.body;
        if (body) {
            body.classList.remove('theme-gojo', 'theme-sukuna');
            body.classList.add(sukuna ? 'theme-sukuna' : 'theme-gojo');
        }
    }

    function init() {
        if (restoreStylePage()) return;
        applyHtmlClassSync();
    }

    window.DomainTheme = {
        getMode: getMode,
        setMode: setMode,
        restoreStylePage: restoreStylePage,
        applyHtmlClassSync: applyHtmlClassSync
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 0);
    }
})();
