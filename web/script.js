const TYPE_COLORS = {
    normal:   { base: "#A8A878", dark: "#6D6D4E" },
    fire:     { base: "#F08030", dark: "#9C531F" },
    water:    { base: "#6890F0", dark: "#445E9C" },
    electric: { base: "#F8D030", dark: "#A1871F" },
    grass:    { base: "#78C850", dark: "#4E8234" },
    ice:      { base: "#98D8D8", dark: "#638D8D" },
    fighting: { base: "#C03028", dark: "#7D1F1A" },
    poison:   { base: "#A040A0", dark: "#682A68" },
    ground:   { base: "#E0C068", dark: "#927D44" },
    flying:   { base: "#A890F0", dark: "#6D5E9C" },
    psychic:  { base: "#F85888", dark: "#A13959" },
    bug:      { base: "#A8B820", dark: "#6D7815" },
    rock:     { base: "#B8A038", dark: "#786824" },
    ghost:    { base: "#705898", dark: "#493963" },
    dragon:   { base: "#7038F8", dark: "#4924A1" },
    dark:     { base: "#705848", dark: "#49392F" },
    steel:    { base: "#B8B8D0", dark: "#787887" },
    fairy:    { base: "#EE99AC", dark: "#9B6470" },
};

function sanitizeQuery(q) {
    if (q == null) return '';
    let s = String(q).toLowerCase().replace(/-/g, ' ');
    s = s.replace(/[^a-z0-9]+/g, '');
    return s;
}

function renderTypes(el, types) {
    el.textContent = '';
    if (!types || types.length === 0) {
        el.textContent = '-';
        return;
    }
    types.forEach(type => {
        const span = document.createElement('span');
        span.className = 'type-badge';
        span.textContent = type;
        const colors = TYPE_COLORS[String(type).toLowerCase()];
        if (colors) {
            span.style.background = colors.base;
            span.style.color = "#000";
            span.style.borderColor = colors.dark;
        }
        el.appendChild(span);
    });
}

function setTiming(id, ms) {
    const el = document.getElementById(id);
    if (ms == null) {
        el.textContent = '';
        el.className = 'timing';
        return;
    }
    const duration = Math.round(ms);
    let color = 'timing-red';
    if (duration <= 20) color = 'timing-green';
    else if (duration <= 50) color = 'timing-yellow';
    el.textContent = duration + ' ms';
    el.className = 'timing ' + color;
}

function renderPokeapiCard(data) {
    const idEl = document.getElementById('pokeapi-id');
    const imgEl = document.getElementById('pokeapi-img');
    const nameEl = document.getElementById('pokeapi-name');
    const typesEl = document.getElementById('pokeapi-types');
    const jsonEl = document.getElementById('pokeapi-json');

    const id = data?.id ?? '-';
    const name = data?.name ?? '-';
    const img = data?.sprites?.front_default ?? '';
    const types = Array.isArray(data?.types)
        ? data.types.map(t => t?.type?.name).filter(Boolean)
        : [];

    idEl.textContent = '# ' + id;
    nameEl.textContent = name;
    if (img) {
        imgEl.src = img;
        imgEl.alt = name + ' sprite';
    } else {
        imgEl.src = '';
        imgEl.alt = 'Sin imagen';
    }
    renderTypes(typesEl, types);
    jsonEl.textContent = JSON.stringify(data, null, 2);
}

function renderMipokeapiCard(data) {
    const idEl = document.getElementById('mipokeapi-id');
    const imgEl = document.getElementById('mipokeapi-img');
    const nameEl = document.getElementById('mipokeapi-name');
    const typesEl = document.getElementById('mipokeapi-types');
    const jsonEl = document.getElementById('mipokeapi-json');

    const id = data?.id ?? '-';
    const name = data?.name ?? '-';
    const img = data?.image_url ?? '';
    const types = Array.isArray(data?.types) ? data.types : [];

    idEl.textContent = '# ' + id;
    nameEl.textContent = name;
    if (img) {
        imgEl.src = img;
        imgEl.alt = name + ' sprite';
    } else {
        imgEl.src = '';
        imgEl.alt = 'Sin imagen';
    }
    renderTypes(typesEl, types);
    jsonEl.textContent = JSON.stringify(data, null, 2);
}

function showPokeapiError(msg, rawJson) {
    document.getElementById('pokeapi-id').textContent = '# -';
    document.getElementById('pokeapi-img').src = 'images/question.png';
    document.getElementById('pokeapi-img').alt = 'Sin imagen';
    document.getElementById('pokeapi-name').textContent = msg || 'Error';
    document.getElementById('pokeapi-types').textContent = '-';
    document.getElementById('pokeapi-json').textContent = rawJson ? (typeof rawJson === 'string' ? rawJson : JSON.stringify(rawJson, null, 2)) : '';
}

function showMipokeapiError(msg, rawJson) {
    document.getElementById('mipokeapi-id').textContent = '# -';
    document.getElementById('mipokeapi-img').src = 'images/question.png';
    document.getElementById('mipokeapi-img').alt = 'Sin imagen';
    document.getElementById('mipokeapi-name').textContent = msg || 'Error';
    document.getElementById('mipokeapi-types').textContent = '-';
    document.getElementById('mipokeapi-json').textContent = rawJson ? (typeof rawJson === 'string' ? rawJson : JSON.stringify(rawJson, null, 2)) : '';
}

async function searchPokeapi(query) {
    const key = sanitizeQuery(query);
    if (key === '') {
        setTiming('pokeapi-timing', null);
        showPokeapiError('Vacío');
        return;
    }
    const start = performance.now();
    try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + encodeURIComponent(key));
        if (!res.ok) {
            let errText = '';
            try { errText = await res.text(); } catch (e) { errText = ''; }
            setTiming('pokeapi-timing', performance.now() - start);
            showPokeapiError('No encontrado', errText || { error: 'Pokemon no encontrado' });
            return;
        }
        const data = await res.json();
        setTiming('pokeapi-timing', performance.now() - start);
        renderPokeapiCard(data);
    } catch (e) {
        setTiming('pokeapi-timing', performance.now() - start);
        showPokeapiError('Error de conexión');
    }
}

async function searchMipokeapi(query) {
    const key = sanitizeQuery(query);
    if (key === '') {
        setTiming('mipokeapi-timing', null);
        showMipokeapiError('Vacío');
        return;
    }
    const start = performance.now();
    try {
        const res = await fetch('http://localhost:5000/pokemon/' + encodeURIComponent(key));
        if (!res.ok) {
            let errJson = null;
            try { errJson = await res.json(); } catch (e) { errJson = await res.text().catch(() => null); }
            setTiming('mipokeapi-timing', performance.now() - start);
            showMipokeapiError('No encontrado', errJson);
            return;
        }
        const data = await res.json();
        setTiming('mipokeapi-timing', performance.now() - start);
        renderMipokeapiCard(data);
    } catch (e) {
        setTiming('mipokeapi-timing', performance.now() - start);
        showMipokeapiError('Error de conexión');
    }
}

function debounce(fn, delay) {
    let timer = null;
    const debounced = function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
    debounced.cancel = function () {
        clearTimeout(timer);
        timer = null;
    };
    return debounced;
}

function init() {
    const pokeInput = document.getElementById('pokeapi-input');
    const miInput = document.getElementById('mipokeapi-input');

    const debouncedPoke = debounce(searchPokeapi, 2000);
    const debouncedMi = debounce(searchMipokeapi, 2000);

    const onEnter = (fn) => (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fn();
        }
    };

    pokeInput.addEventListener('keydown', onEnter(() => {
        debouncedPoke.cancel();
        searchPokeapi(pokeInput.value);
    }));
    pokeInput.addEventListener('input', () => debouncedPoke(pokeInput.value));

    miInput.addEventListener('keydown', onEnter(() => {
        debouncedMi.cancel();
        searchMipokeapi(miInput.value);
    }));
    miInput.addEventListener('input', () => debouncedMi(miInput.value));

    pokeInput.value = 'pikachu';
    miInput.value = 'pikachu';
    searchPokeapi('pikachu');
    searchMipokeapi('pikachu');
}

document.addEventListener('DOMContentLoaded', init);