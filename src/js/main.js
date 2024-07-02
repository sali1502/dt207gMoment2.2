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

            // Kalla på funktionen för att lägga till data med data från formuläret
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

            // Kalla på funktionen för att uppdatera data med formulärdata
            await updateWork(
                id,
                form.compayname.value,
                form.jobtitle.value,
                form.location.value,
                form.startdate.value,
                form.enddate.value,
                form.description.value
            );

            // Omdirigera till startsidan
            window.location.href = "http://localhost:1234/index.html";
        });

        // När webbläsarfönstret laddas..
        window.onload = async function () {
            // Hämta URL-parametrarna
            let params = new URLSearchParams(window.location.search);
            let id = params.get("id");
            if (id) {
                let workExperience = await getWorkById(id);
                document.getElementById("updateWorkForm").dataset.id = id;
                document.getElementById("compayname").value = workExperience.compayname;
                document.getElementById("jobtitle").value = workExperience.jobtitle;
                document.getElementById("location").value = workExperience.location;
                document.getElementById("startdate").value = workExperience.startdate;
                document.getElementById("enddate").value = workExperience.enddate;
                document.getElementById("description").value = workExperience.description;
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

// Lägg till nya arbetserfarenheter
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
        return data;
    } catch (error) {
        console.error("Ett fel uppstod vid hämtning av specifik arbetserfarenhet: ", error);
    }
}

// Händelselyssnare för att skicka uppdaterad data
document.getElementById('updateWorkForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Hämta värden från formulär
    let id = document.getElementById('id').value;
    let compayname = document.getElementById('compayname').value;
    let jobtitle = document.getElementById('jobtitle').value;
    let location = document.getElementById('location').value;
    let startdate = document.getElementById('startdate').value;
    let enddate = document.getElementById('enddate').value;
    let description = document.getElementById('description').value;

    // Payload
    const workExperience = {
        compayname: compayname,
        jobtitle: jobtitle,
        location: location,
        startdate: startdate,
        enddate: enddate,
        description: description
    };

    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workExperience)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Update successful:', data);

        // Omdirigera till startsidan
        window.location.href = "http://localhost:1234/index.html";
    } catch (error) {
        console.error("Ett fel uppstod vid uppdatering av arbetserfarenhet: ", error);
    }
});

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

// Radera arbetserfarenheter
async function deleteWork(id) {
    if (!id) {
        console.error("Ingen id angiven för radering av arbetserfarenhet.");
        return;
    }

    try {
        const response = await fetch(`${url}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Något gick fel: ${response.statusText}`);
        }

        console.log("Arbetserfarenhet raderad");
        displayDeleteMessage("Arbetserfarenhet raderad");

        await getWork();
    } catch (error) {
        console.error("Ett fel uppstod vid radering av arbetserfarenhet: ", error);
    }
}

// Visa meddelande för raderade arbetserfarenheter
function displayDeleteMessage(message) {
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