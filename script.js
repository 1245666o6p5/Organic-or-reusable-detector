const URL = "./tm-my-image-model(1)/";

let model, webcam, labelContainer, maxPredictions;

async function init() {

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;

    webcam = new tmImage.Webcam(300, 300, flip);

    await webcam.setup();

    await webcam.play();

    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);

    labelContainer = document.getElementById("label-container");

    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {

    const prediction = await model.predict(webcam.canvas);

    let highest = prediction[0];

    for (let i = 1; i < prediction.length; i++) {
        if (prediction[i].probability > highest.probability) {
            highest = prediction[i];
        }
    }

    labelContainer.innerHTML =
        `<h2>${highest.className}</h2>
         <p>Confidence: ${(highest.probability * 100).toFixed(2)}%</p>`;
}
