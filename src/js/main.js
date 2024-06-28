/* Moment 2 DT207G VT24, Åsa Lindskog, sali1502@student.miun.se */

let url = "http://127.0.0.1:3000/api/workexperiences";

getWork();
getWorkId(54);
createWork("Life", "Butiksansvarig", "Stockholm", "2006-08-01", "2014-08-01", "Ansvarig för butikens dagliga drift");
updateWork(55, "Expressen", "Grafiker", "Stockholm", "1989-08-01", "1993-02-15", "Grafiker/redigerare");
deleteWork(53);


// Funktion för att hämta arbetserfarenheter (alla)
async function getWork() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.table(data);
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

// Funktion för att lägga till arbetserfarenhet
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
                "content-type": "Application/json"
            },
            body: JSON.stringify(workexperience)
        });

        const data = await response.json();
        console.table(data);

    } catch (error) {
        console.error("Ett fel uppstod vid postning av arbetserfarenhet: ", error);
    }
}

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

// Funktion för att radera arbetserfarenhet
async function deleteWork(id) {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();
        console.table(data);
    } catch (error) {
        console.error("Ett fel uppstod vid radering av arbetserfarenhet: ", error);
    }
}
