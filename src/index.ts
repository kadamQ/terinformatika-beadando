import "./style.css";

/**
 * A térkép kezdõ pozíciójának a beállítása
 */
function initMap(): void {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
            zoom: 15.25,
            center: {lat: 47.5524851, lng: 21.6305302},
        }
    );

    directionsRenderer.setMap(map);

    (document.getElementById("submit") as HTMLElement).addEventListener(
        "click",
        () => {
            calculateAndDisplayRoute(directionsService, directionsRenderer);
        }
    );
}

/**
 * Kiszámolja és megjeleníti az útvonalakat
 */
function calculateAndDisplayRoute(
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer
) {
    const waypts: google.maps.DirectionsWaypoint[] = [];
    const checkboxArray = document.getElementById(
        "waypoints"
    ) as HTMLSelectElement;

    for (let pub of checkboxArray.children) {
        if ((pub.children[0].children[0] as HTMLInputElement).checked) {
            waypts.push({
                location: (pub.children[0].children[0] as HTMLInputElement).value,
                stopover: true,
            });
        }
    }
    /**
     * Kezdő- és végpontok meghatározása, travel mode beállítása gyaloglásra
     */
    directionsService
        .route({
            origin: "OEC Hostel III, Debrecen, 4002",
            destination: "Debreceni Egyetem Informatikai Kar, Debrecen, Kassai út 26, 4028",
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.WALKING,
        })
        .then((response) => {
            directionsRenderer.setDirections(response);

            const route = response.routes[0];
            const summaryPanel = document.getElementById(
                "directions-panel"
            ) as HTMLElement;
            const sumPanel = document.getElementById(
                "sum-panel"
            ) as HTMLElement;

            summaryPanel.innerHTML = "";
            sumPanel.innerHTML = "";

            /**
             * A megtett távolság és eltelt idő kiszámítása a kezdőponttól a végpontig
             */
            const abc = "ABCDEFGHIJKLMOPQRSTUVWXYZ";
            let fullDistance = 0;
            let fullDuration = 0;
            for (let i = 0; i < route.legs.length; i++) {
                const routeSegment = i + 1;

                summaryPanel.innerHTML += `<div class="card mt-2">` + (i === route.legs.length - 1 ?
                        `<h5 class="card-header">` + 'Végállomás: ' + abc[routeSegment] + `</h5>` :
                        `<h5 class="card-header">` + routeSegment + '. megálló: ' + abc[routeSegment] + `</h5>`) +
                    `<div class="card-body">
                <h5 class="card-title">
                    <div class="row">
                        <div class="col">
                            <p>&#9200;` + route.legs[i].duration!.text + `</p>
                        </div>
                        <div class="col text-end">
                            <p>&#128207;` + route.legs[i].distance!.text + `</p>
                        </div>
                    </div>
                </h5>
                <p class="card-text">Indulás: ` + route.legs[i].start_address + `</p>
                <p class="card-text">Érkezés: ` + route.legs[i].end_address + `</p>
            </div>
        </div>`
                fullDistance += parseFloat(route.legs[i].distance!.text);
                fullDuration += parseFloat(route.legs[i].duration!.text);
            }
            sumPanel.innerHTML += `<div class="card mt-2">
          <h5 class="card-header">Összegzés</h5>
          <div class="card-body">
            <h5 class="card-title">
              <div class="row">
                  <div class="col">
                      <p class="mb-0">&#9200;` + fullDuration + ` perc</p>
                  </div>
                  <div class="col text-end">
                      <p class="mb-0">&#128207;` + fullDistance.toFixed(1) + ` km</p>
                  </div>
              </div>
            </h5>
          </div>
      </div>`
        })
        .catch((e) => window.alert("Directions request failed due to " + status));
}

export {initMap};