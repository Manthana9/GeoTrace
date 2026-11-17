
const resultsList = document.getElementById("resultsList");

let uploadedPhotos = [];

try {
    uploadedPhotos = JSON.parse(
        sessionStorage.getItem("geotracePhotos") || "[]"
    );
} catch (error) {
    uploadedPhotos = [];
}

if (uploadedPhotos.length === 0) {
    uploadedPhotos = [
        {
            name: "Sample photograph",
            data: null
        }
    ];
}

const sampleLocation = {
    name: "Bengaluru, Karnataka",
    latitude: 12.9716,
    longitude: 77.5946,
    address: "Bengaluru, Karnataka, India",
    landmark: "Sample landmark — not detected"
};

uploadedPhotos.forEach((photo, index) => {

    const card = document.createElement("section");
    card.className = "result-card";

    card.innerHTML = `
        <div class="result-top">

            <div class="photo-panel">
                ${
                    photo.data
                    ? `<img src="${photo.data}" alt="Uploaded photograph">`
                    : `<div class="photo-placeholder">
                        <span>⌖</span>
                        Sample photo preview
                       </div>`
                }
            </div>

            <div class="location-panel">

                <span class="result-label">PHOTO ${String(index + 1).padStart(2, "0")}</span>

                <h2>${sampleLocation.name}</h2>

                <p class="location-description">
                    This is illustrative location information.
                    Actual detection will be connected to the backend.
                </p>

                <div class="detail-row">
                    <span>Latitude</span>
                    <span>${sampleLocation.latitude}</span>
                </div>

                <div class="detail-row">
                    <span>Longitude</span>
                    <span>${sampleLocation.longitude}</span>
                </div>

                <div class="detail-row">
                    <span>Address</span>
                    <span>${sampleLocation.address}</span>
                </div>

                <div class="detail-row">
                    <span>Nearest landmark</span>
                    <span>${sampleLocation.landmark}</span>
                </div>

                <span class="source-tag">DEMO DATA · NOT DETECTED</span>

            </div>

        </div>

        <div class="map-heading">
            <h3>Explore on the map</h3>
            <span>Illustrative sample coordinates</span>
        </div>

        <div class="result-map" id="map-${index}"></div>

        <a
            class="directions-button"
            href="https://www.google.com/maps/dir/?api=1&destination=${sampleLocation.latitude},${sampleLocation.longitude}"
            target="_blank"
            rel="noopener noreferrer"
        >
            Get Directions →
        </a>
    `;

    resultsList.appendChild(card);

    const map = L.map(`map-${index}`).setView(
        [sampleLocation.latitude, sampleLocation.longitude],
        13
    );

    
L.tileLayer(
    "https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png?key=cb1_5azp_1_a23180143840a80cdc8e2234",
    {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 20
    }
).addTo(map);


    L.marker([
        sampleLocation.latitude,
        sampleLocation.longitude
    ]).addTo(map)
      .bindPopup("Illustrative sample location")
      .openPopup();
});
