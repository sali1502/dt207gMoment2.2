/* Moment 2.2 DT207G VT24, Åsa Lindskog, sali1502@student.miun.se */

"use strict";

let url = "http://127.0.0.1:3000/api/workexperiences";

document.addEventListener('DOMContentLoaded', (event) => {

    // Kolla om element för att skriva ut data finns
    if (document.getElementById("workexperienceList")) {
        // Om det finns, hämta data
        getWork();
    }

    // Kolla om element för att lägga till data finns
    if (document.getElementById("addWorkForm")) {
        // Om det finns, lägg till en händelselyssnare på "Lägg till"-knappen
        document.getElementById("addWorkForm").addEventListener("submit", function (event) {
            event.preventDefault();
            let form = event.target;

            // Kalla på funktionen för att lägga till data
            createWork(
                form.compayname.value,
                form.jobtitle.value,
                form.location.value,
                form.startdate.value,
                form.enddate.value,
                form.description.value
            );
        });
    }

    // Kolla om element för att uppdatera data finns
    if (document.getElementById("updateWorkForm")) {
        // Om det finns, lägg en händelselyssnare på knappen "Uppdatera"
        document.getElementById("updateWorkForm").addEventListener("submit", async function (event) {
            event.preventDefault();
            let form = event.target;
            let id = form.dataset.id;

            // Kalla på funktionen för att uppdatera data från formulär
            await updateWork(
                id,
                form.compayname.value,
                form.jobtitle.value,
                form.location.value,
                form.startdate.value,
                form.enddate.value,
                form.description.value
            );
        });

        // När webbläsarfönstret laddas..
        window.onload = async function () {
            // Hämta URL-parametrar med formulärdata
            let params = new URLSearchParams(window.location.search);
            let id = params.get("id");
            if (id) {
                let dataset = await getWorkById(id);
                document.getElementById("updateWorkForm").dataset.id = id;
                document.getElementById("compayname").value = dataset.compayname;
                document.getElementById("jobtitle").value = dataset.jobtitle;
                document.getElementById("location").value = dataset.location;
                document.getElementById("startdate").value = dataset.startdate;
                document.getElementById("enddate").value = dataset.enddate;
                document.getElementById("description").value = dataset.description;
            }
        };
    }
});

/* HÄMTA DATA - CRUD READ/GET */

// Hämta arbetserfarenheter och läs ut till skärmen
async function getWork() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Sortera efter datum - descending - äldsta datum först
        data.sort((a, b) => new Date(a.startdate) - new Date(b.startdate));

        // Skriv ut till DOM
        let list = document.getElementById("workexperienceList");
        list.innerHTML = "";

        data.forEach(item => {
            let listItem = document.createElement("li");
            let compayname = document.createElement("div");
            compayname.className = "compayname";
            compayname.textContent = item.compayname;
            listItem.appendChild(compayname);

            let jobtitle = document.createElement("div");
            jobtitle.className = "jobtitle";
            jobtitle.textContent = `Titel: ${item.jobtitle}`;
            listItem.appendChild(jobtitle);

            let location = document.createElement("div");
            location.className = "location";
            location.textContent = `Ort: ${item.location}`;
            listItem.appendChild(location);

            let startdate = document.createElement("div");
            startdate.className = "startdate";
            startdate.textContent = `Startdatum: ${formatDate(item.startdate)}`;
            listItem.appendChild(startdate);

            let enddate = document.createElement("div");
            enddate.className = "enddate";
            enddate.textContent = `Slutdatum: ${formatDate(item.enddate)}`;
            listItem.appendChild(enddate);

            let description = document.createElement("div");
            description.className = "description";
            description.textContent = `Beskrivning: ${item.description}`;
            listItem.appendChild(description);

            let buttonContainer = document.createElement("div");
            buttonContainer.className = "button-container";

            let deleteButton = document.createElement("button");
            deleteButton.className = "deleteBtn";
            deleteButton.textContent = "Radera";
            deleteButton.onclick = () => deleteWork(item.id);
            buttonContainer.appendChild(deleteButton);

            let updateButton = document.createElement("button");
            updateButton.className = "updateBtn";
            updateButton.textContent = "Uppdatera";
            updateButton.onclick = () => {
                window.location.href = `http://localhost:1234/update.html?id=${item.id}`;
            };

            buttonContainer.appendChild(updateButton);
            listItem.appendChild(buttonContainer);
            list.appendChild(listItem);
        });

    } catch (error) {
        console.error("Ett fel uppstod vid hämtning av arbetserfarenhet: ", error);
    }
}

/* LÄGG TILL DATA - CRUD CREATE/POST */

// Lägg till ny arbetserfarenhet
async function createWork(compayname, jobtitle, location, startdate, enddate, description) {

    let workexperience = {
        compayname: compayname,
        jobtitle: jobtitle,
        location: location,
        startdate: startdate,
        enddate: enddate,
        description: description
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(workexperience)
        });

        const data = await response.json();
        console.table(data);

        await getWork();

    } catch (error) {
        console.error("Ett fel uppstod när arbetserfarenhet skulle läggas till: ", error);
    }

    // Omdirigera till startsidan
    window.location.href = "http://localhost:1234/index.html";
}

/* UPPDATERA DATA - CRUD UPDATE/PUT */

// Hämta arbetserfarenhet med id
async function getWorkById(id) {
    try {
        const response = await fetch(`${url}/${id}`);
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error("Ett fel uppstod vid hämtning av arbetserfarenhet: ", error);
    }
}

// Uppdatera arbetserfarenhet
async function updateWork(id, compayname, jobtitle, location, startdate, enddate, description) {

    // Payload
    let workexperience = {
        compayname: compayname,
        jobtitle: jobtitle,
        location: location,
        startdate: startdate,
        enddate: enddate,
        description: description
    };

    try {
        const response = await fetch(`${url}/${id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(workexperience)
        });
        const data = await response.json();
        console.table(data);

    } catch (error) {
        console.error("Ett fel uppstod vid uppdatering av arbetserfarenhet: ", error);
    }
    // Omdirigera till startsidan
    window.location.href = "http://localhost:1234/index.html";

}

/* RADERA DATA - CRUD DELETE/DELETE */

// Radera arbetserfarenheter med meddelande
async function deleteWork(id) {
    if (!id) {
        console.error("Ingen id angiven för radering av arbetserfarenhet.");
        return;
    }

    try {
        const response = await fetch(`${url}/${id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Något gick fel: ${response.statusText}`);
        }

        console.log("Arbetserfarenhet raderad");
        displayMessage("Arbetserfarenhet raderad");

        await getWork();
    } catch (error) {
        console.error("Ett fel uppstod vid radering av arbetserfarenhet: ", error);
    }
}

// Meddelande för raderade arbetserfarenheter
function displayMessage(message) {
    let messageContainer = document.getElementById("messageContainer");
    messageContainer.innerText = message;
}

// Formatera datumsträng till format yyyy-mm-dd
function formatDate(dateString) {
    let date = new Date(dateString);
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
}