/* Moment 2 DT207G VT24, Åsa Lindskog, sali1502@student.miun.se */

let url = "http://127.0.0.1:3000/api/workexperiences";

getWork();
createWork();
//getWorkId(id);
//updateWork(id);


// Funktion för att hämta data från API och läsa ut alla arbetserfarenheter till skärmen
async function getWork() {
    try {
        const response = await fetch(url);
        const data = await response.json();

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
            updateButton.onclick = () => updateWorkExperience(item.id);
            buttonContainer.appendChild(updateButton);

            listItem.appendChild(buttonContainer);
            list.appendChild(listItem);
        });

    } catch (error) {
        console.error("Ett fel uppstod vid hämtning av arbetserfarenhet: ", error);
    }
}

// Funktion för att hämta arbetserfarenhet med id
async function getWorkId(id) {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: "GET"
        });
        const data = await response.json();
        console.table(data);
    } catch (error) {
        console.error("Ett fel uppstod vid hämtning av arbetserfarenheter med id: ", error);
    }
}

// Funktion för att skapa ny arbetserfarenhet från input i formulär
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

    } catch (error) {
        console.error("Ett fel uppstod när arbetserfarenhet skulle läggas till: ", error);
    }
}

document.getElementById("addWork").addEventListener("submit", function (event) {
    event.preventDefault();
    let form = event.target;
    createWork(
        form.compayname.value,
        form.jobtitle.value,
        form.location.value,
        form.startdate.value,
        form.enddate.value,
        form.description.value
    );
});

// Funktion för att radera arbetserfarenhet
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

        console.log("Arbetserfarenhet raderad.");
        // Listan uppdateras efter radering
        await getWork();
    } catch (error) {
        console.error("Ett fel uppstod vid radering av arbetserfarenhet: ", error);
    }
}

// Ladda befintliga arbetserfarenhter när sidan laddas
document.addEventListener("DOMContentLoaded", getWork);

// Funktion för att uppdatera arbetserfarenhet
async function updateWork(id, compayname, jobtitle, location, startdate, enddate, description) {

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
}

// Funktion för att formatera datumsträng till format yyyy-mm-dd
function formatDate(dateString) {
    let date = new Date(dateString);
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

