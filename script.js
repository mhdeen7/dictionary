const inputElement = document.getElementById("search");
const btn = document.getElementById("btn");
const resultsDiv = document.querySelector(".results");
const errorDiv = document.getElementById("error");
const definitionEl = document.getElementById("definitions");
const synonymsEl = document.getElementById("synonyms");
const sourceEl = document.getElementById("source-details");
const pronunciationEl = document.getElementById("pronunciation");
const audioEl = document.getElementById("audio");

async function fetchAPI(word) {
    resultsDiv.style.display = "block";
    resultsDiv.innerHTML = "⏳ Searching...";

    try {
        const url =`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        const response = await fetch(url);
        const data = await response.json();

        if(!Array.isArray(data) || data.length === 0){
            throw new Error("word not found")
        }
        const wordData = data[0];

        const definition =
            wordData.meanings[0]?.definitions[0]?.definition ||
            "No definition available";

        const example =
            wordData.meanings[0]?.definitions[0]?.example ||
            "No example available";

        const synonyms =
            wordData.meanings[0]?.definitions[0]?.synonyms || [];

        const partOfSpeech =
            wordData.meanings[0]?.partOfSpeech || "Not specified";

        const source =
            wordData.sourceUrls?.[0] || "No source available";

        const phonetic =
            wordData.phonetic || "No pronunciation available";

        const audio =
            wordData.phonetics?.find(p => p.audio)?.audio;

        resultsDiv.innerHTML = `
            <h2>${word}</h2>
            <p><strong>Definition:</strong> ${definition}</p>
            <p><strong>Part of Speech:</strong> ${partOfSpeech}</p>
            <p><strong>Example:</strong> ${example}</p>
            <p><strong>Synonyms:</strong> ${
                synonyms.length > 0 ? synonyms.join(", ") : "None"
            }</p>
            <p><strong>Pronunciation:</strong> ${phonetic}</p>
            <p><a href="${source}" target="_blank">🔗 Source</a></p>
            

             ${
                  audio
                  ? `<audio controls src="${audio}"></audio>`
                  : `<p>No audio available</p>`
                }
        `;

        if (audio) {
            audioEl.src = audio;
            audioEl.style.display = "block";
        } else {
            audioEl.style.display = "none";
        }
    } catch (error) {
        resultsDiv.style.display = "none";
        errorDiv.style.display = "block";
        errorDiv.textContent = "❌ Word not found or network error";
        
    }
}

btn.addEventListener("click", () => {
    const word = inputElement.value.trim();

    if (!word) {
        errorDiv.style.display = "block";
        errorDiv.textContent = "⚠️ Please enter a word";
        resultsDiv.style.display = "none";
        return;
    }

    fetchAPI(word);
});

inputElement.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        const word = inputElement.value.trim();

        if (!word) {
            errorDiv.style.display = "block";
            errorDiv.textContent = "⚠️ Please enter a word";
            resultsDiv.style.display = "none";
            return;
        }

        fetchAPI(word);
    }
});
