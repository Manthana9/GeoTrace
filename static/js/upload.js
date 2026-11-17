
const fileInput = document.getElementById("fileInput");
const browseButton = document.getElementById("browseButton");
const dropZone = document.getElementById("dropZone");
const previewSection = document.getElementById("previewSection");
const previewGrid = document.getElementById("previewGrid");
const imageCount = document.getElementById("imageCount");
const generateButton = document.getElementById("generateButton");

let selectedFiles = [];

browseButton.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", (event) => {
    addFiles(event.target.files);
    fileInput.value = "";
});

function addFiles(files) {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/heic",
        "image/heif"
    ];

    Array.from(files).forEach(file => {
        if (!allowedTypes.includes(file.type)) {
            alert(`${file.name} is not a supported image format.`);
            return;
        }

        const alreadyAdded = selectedFiles.some(
            existing => existing.name === file.name &&
                        existing.size === file.size
        );

        if (!alreadyAdded) {
            selectedFiles.push(file);
        }
    });

    renderPreviews();
}

function renderPreviews() {
    previewGrid.innerHTML = "";

    selectedFiles.forEach((file, index) => {
        const card = document.createElement("div");
        card.className = "preview-card";

        const image = document.createElement("img");
        image.alt = file.name;

        const imageURL = URL.createObjectURL(file);
        image.src = imageURL;

        const name = document.createElement("p");
        name.textContent = file.name;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-button";
        removeButton.type = "button";
        removeButton.textContent = "×";
        removeButton.setAttribute("aria-label", `Remove ${file.name}`);

        removeButton.addEventListener("click", () => {
            URL.revokeObjectURL(imageURL);
            selectedFiles.splice(index, 1);
            renderPreviews();
        });

        card.appendChild(image);
        card.appendChild(removeButton);
        card.appendChild(name);

        previewGrid.appendChild(card);
    });

    const count = selectedFiles.length;

    imageCount.textContent = `${count} image${count === 1 ? "" : "s"}`;

    previewSection.classList.toggle("hidden", count === 0);
    generateButton.disabled = count === 0;
}

dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragover");

    addFiles(event.dataTransfer.files);
});


generateButton.addEventListener("click", async () => {

    if (selectedFiles.length === 0) return;

    generateButton.disabled = true;
    generateButton.textContent = "Preparing photographs...";

    try {
        const photos = await Promise.all(
            selectedFiles.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();

                    reader.onload = () => {
                        resolve({
                            name: file.name,
                            data: reader.result
                        });
                    };

                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            })
        );

        sessionStorage.setItem(
            "geotracePhotos",
            JSON.stringify(photos)
        );

        window.location.href = "/results/";

    } catch (error) {
        alert("Could not prepare the selected photographs.");
        generateButton.disabled = false;
        generateButton.textContent = "Generate Location →";
    }
});

