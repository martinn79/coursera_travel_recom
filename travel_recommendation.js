function get_recommendations(keyword) {
    return new Promise((resolve, reject) => {
        fetch("travel_recommendation_api.json")
        .then(response => { return response.json(); })
        .then(results => {    
            if (keyword === "city" || keyword === "country") {
                let result = [];
                results.countries.forEach(country => {
                    result = result.concat(country.cities);
                });
                resolve(result);
            } else if (keyword === "temple") {
                resolve(results.temples);
            } else if (keyword === "beach") {
                resolve(results.beaches);
            } else {
                resolve([]);
            }
        })
    });
}

document.getElementById("btSearch").addEventListener("click", function() {
    var keyword = document.getElementById("tbSearch").value;
    if (!(keyword && keyword.length)) {
        console.log("No keyword entered.");
        container.innerHTML = "<p>No results match your keyword search.</p>";
        return;
    }
    keyword = keyword.toLowerCase();
    get_recommendations(keyword)
    .then(items => {
        const container = document.getElementById("recommendations");
        container.innerHTML = "";

        items.forEach(item => {
            console.log(item);   
            const options = { timeZone: item.timezone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
            const localTime = (new Date()).toLocaleTimeString("en-us", options);
            let recommendation = document.createElement("div");
            recommendation.classList.add("result");            
            recommendation.innerHTML = `<div class="recLocalTime">Local time: ${localTime}</div><div class="recImage"></div><div class="recImg"><img src="${item.imageUrl}" alt="${item.name}"></div><div class="recName"><h3>${item.name}</h3></div><div class="recDescription">${item.description}</div>`;
            container.append(recommendation);
        });
    });
});

document.getElementById("btSearchClear").addEventListener("click", function() {
    document.getElementById("tbSearch").value = null;
    document.getElementById("recommendations").innerHTML = ""
});