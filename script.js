let activities = loadActivities();

// Função para salvar atividades no localStorage
function saveActivities() {
    localStorage.setItem('activities', JSON.stringify(activities));
}

// Função para carregar atividades do localStorage
function loadActivities() {
    return JSON.parse(localStorage.getItem('activities')) || [];
}

// Função para renderizar atividades na tela
function renderActivities() {
    const list = document.getElementById('activity-list');
    list.innerHTML = '';
    activities.forEach((activity, index) => {
        const item = document.createElement('li');
        item.innerHTML = `
            <div>
                <strong>${activity.title}</strong><br>
                <span>${activity.date} às ${activity.time}</span><br>
                <span>${activity.description}</span>
            </div>
            <button onclick="deleteActivity(${index})">Excluir</button>
        `;
        list.appendChild(item);
    });
}

// Função para excluir uma atividade
function deleteActivity(index) {
    activities.splice(index, 1);
    saveActivities();
    renderActivities();
}

// Função para validar o formulário
function validateForm(title, date, time, description) {
    if (!title || !date || !time || !description) {
        alert('Preencha todos os campos!');
        return false;
    }
    return true;
}

// Adicionar evento ao formulário
document.getElementById('activity-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const description = document.getElementById('description').value;

    if (validateForm(title, date, time, description)) {
        activities.push({ title, date, time, description });
        saveActivities();
        renderActivities();
        document.getElementById('activity-form').reset();
    }
});

// Função para exportar o roteiro para PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 10;
    activities.forEach(activity => {
        doc.text(`Título: ${activity.title}`, 10, y);
        y += 10;
        doc.text(`Data: ${activity.date} às ${activity.time}`, 10, y);
        y += 10;
        doc.text(`Descrição: ${activity.description}`, 10, y);
        y += 15;
    });

    doc.save('roteiro_viagem.pdf');
}

// Função para alternar entre temas escuro e claro
const toggleButton = document.getElementById('toggle-theme');
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Função para carregar a previsão do tempo
async function getWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1290404e48364797fd8d5c24ea63c337&units=metric&lang=pt`);
    const data = await response.json();
    console.log(data);

    const weatherDiv = document.getElementById('weather');
    weatherDiv.innerHTML = `
        <h3>Previsão do Tempo em ${data.name}</h3>
        <p>Temperatura: ${data.main.temp}°C</p>
        <p>Condição: ${data.weather[0].description}</p>
    `;
}

// Exemplo de uso da previsão do tempo
getWeather('Campos do Jordão');

// Função para inicializar o mapa
function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -22.7396, lng: -45.5913 }, // Coordenadas de Campos do Jordão
        zoom: 12,
    });

    activities.forEach(activity => {
        if (activity.lat && activity.lng) {
            new google.maps.Marker({
                position: { lat: activity.lat, lng: activity.lng },
                map: map,
                title: activity.title,
            });
        }
    });
}

// Lazy loading para imagens
document.addEventListener('DOMContentLoaded', function () {
    const lazyImages = document.querySelectorAll('.lazy');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => observer.observe(img));
});

// Renderizar atividades ao carregar a página
renderActivities();