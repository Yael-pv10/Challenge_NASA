//Librerias
AOS.init();
feather.replace();

// Funcion para simular la API del clima, por que no he buscado una, solo me he dedicado a la App web jajaja
function fetchWeatherData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                uvIndex: Math.floor(Math.random() * 12), // 0-11
                airQuality: Math.floor(Math.random() * 300) + 1, // 1-300
                temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
                humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
                condition: ['Soleado', 'Parcialmente nublado', 'Nublado', 'Lluvioso'][Math.floor(Math.random() * 4)]
            });
        }, 1000);
    });
}

// Update UI with weather data
async function updateWeatherUI() {
    const data = await fetchWeatherData();
    
    //Indice UV 
    const uvValue = data.uvIndex;
    document.getElementById('uv-value').textContent = uvValue;
    document.getElementById('uv-meter').style.width = `${Math.min(uvValue * 8.33, 100)}%`;
    
    let uvLevel, uvClass, uvRecommendation;
    if (uvValue <= 2) {
        uvLevel = "Bajo";
        uvClass = "uv-low";
        uvRecommendation = "Protección solar no necesaria. Puedes disfrutar del día con seguridad.";
    } else if (uvValue <= 5) {
        uvLevel = "Moderado";
        uvClass = "uv-moderate";
        uvRecommendation = "Usa protección solar SPF 30+, gorra y gafas de sol. Busca sombra al mediodía.";
    } else if (uvValue <= 7) {
        uvLevel = "Alto";
        uvClass = "uv-high";
        uvRecommendation = "Protección solar necesaria. Usa SPF 30+, gorra, gafas y camisa. Reduce exposición al mediodía.";
    } else if (uvValue <= 10) {
        uvLevel = "Muy Alto";
        uvClass = "uv-very-high";
        uvRecommendation = "Protección solar extrema necesaria. Evita el sol entre 10am-4pm. Usa SPF 50+, ropa protectora y sombra.";
    } else {
        uvLevel = "Extremo";
        uvClass = "uv-extreme";
        uvRecommendation = "¡Peligro! Evita el sol al mediodía. Protección máxima necesaria. Permanece en interiores si es posible.";
    }
    
    const uvLevelElement = document.getElementById('uv-level');
    uvLevelElement.textContent = uvLevel;
    uvLevelElement.className = `px-4 py-2 rounded-full text-white font-medium ${uvClass}`;
    document.getElementById('uv-recommendation').textContent = uvRecommendation;

    // Calidad del aire
    const airValue = data.airQuality;
    document.getElementById('air-value').textContent = airValue;
    document.getElementById('air-meter').style.width = `${Math.min(airValue / 3, 100)}%`;
    
    let airLevel, airClass, airRecommendation;
    if (airValue <= 50) {
        airLevel = "Buena";
        airClass = "air-good";
        airRecommendation = "La calidad del aire es satisfactoria y la contaminación del aire presenta poco o ningún riesgo.";
    } else if (airValue <= 100) {
        airLevel = "Moderada";
        airClass = "air-moderate";
        airRecommendation = "La calidad del aire es aceptable; sin embargo, algunos contaminantes pueden ser moderadamente preocupantes para un número muy pequeño de personas que son inusualmente sensibles a la contaminación del aire.";
    } else if (airValue <= 150) {
        airLevel = "Dañina para grupos sensibles";
        airClass = "air-unhealthy-sensitive";
        airRecommendation = "Los miembros de grupos sensibles pueden experimentar efectos en la salud. El público en general no es probable que se vea afectado.";
    } else if (airValue <= 200) {
        airLevel = "Dañina";
        airClass = "air-unhealthy";
        airRecommendation = "Todos pueden comenzar a experimentar efectos en la salud; los miembros de grupos sensibles pueden experimentar efectos más graves.";
    } else if (airValue <= 300) {
        airLevel = "Muy Dañina";
        airClass = "air-very-unhealthy";
        airRecommendation = "Advertencias de salud de condiciones de emergencia. Es más probable que toda la población se vea afectada.";
    } else {
        airLevel = "Peligrosa";
        airClass = "air-hazardous";
        airRecommendation = "Alerta de salud: todos pueden experimentar efectos más graves para la salud. Evita actividades al aire libre.";
    }
    
    const airLevelElement = document.getElementById('air-level');
    airLevelElement.textContent = airLevel;
    airLevelElement.className = `px-4 py-2 rounded-full text-white font-medium ${airClass}`;
    document.getElementById('air-recommendation').textContent = airRecommendation;

    // Otros datos del clima
    document.getElementById('temperature').textContent = `${data.temperature}°C`;
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('condition').textContent = data.condition;

    // Create notifications based on conditions
    createNotifications(uvLevel, airLevel, uvRecommendation, airRecommendation);
}

function createNotifications(uvLevel, airLevel, uvRec, airRec) {
    const notificationsContainer = document.getElementById('notifications');
    notificationsContainer.innerHTML = '';

    // UV Notification
    if (uvLevel === "Alto" || uvLevel === "Muy Alto" || uvLevel === "Extremo") {
        const notification = document.createElement('div');
        notification.className = 'notification bg-white rounded-lg shadow-lg p-4 flex items-start';
        notification.innerHTML = `
            <div class="mr-3 p-2 rounded-full bg-yellow-100 text-yellow-600">
                <i data-feather="sun"></i>
            </div>
            <div>
                <h4 class="font-semibold text-gray-800">Alerta de radiación UV</h4>
                <p class="text-sm text-gray-600">${uvRec}</p>
            </div>
        `;
        notificationsContainer.appendChild(notification);
    }

    // Notificacion de la calidad del aire
    if (airLevel === "Dañina para grupos sensibles" || airLevel === "Dañina" || airLevel === "Muy Dañina" || airLevel === "Peligrosa") {
        const notification = document.createElement('div');
        notification.className = 'notification bg-white rounded-lg shadow-lg p-4 flex items-start mt-3';
        notification.innerHTML = `
            <div class="mr-3 p-2 rounded-full bg-red-100 text-red-600">
                <i data-feather="alert-triangle"></i>
            </div>
            <div>
                <h4 class="font-semibold text-gray-800">Alerta de calidad del aire</h4>
                <p class="text-sm text-gray-600">${airRec}</p>
            </div>
        `;
        notificationsContainer.appendChild(notification);
    }

    feather.replace();
}

// Inicializar 
updateWeatherUI();

// Actualizacion temporal cada 5 min jajaja
setInterval(updateWeatherUI, 300000);