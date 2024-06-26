class EventsComponent extends HTMLElement {
  constructor() {
    super();

    // Load template and styles
    const template = `
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Naam</th>
              <th>Datum</th>
              <th>Locatie</th>
            </tr>
          </thead>
          <tbody id="events-container">
            <!-- Evenementen worden hier ingeladen -->
          </tbody>
        </table>
      `;

    const styles = `
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          font-family: sans-serif;
          color: #041c27;
        }
        
        th,
        td {
          border: 1px solid #041c27;
          padding: 8px;
          text-align: left;
          background-color: #ffffff;
        }

        td:hover {
          background-color: #f2f2f3;
        }

        th {
          background-color: #005c86;
          color: white;
        }

        img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 1px solid #ccc;
        }
        
        .event-link {
          color: #3894ff;
          text-decoration: none;
          font-weight: bold;
        }
        
        .event-link:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 600px) {
          table {
            font-size: 14px;
          }
          
          th,
          td {
            padding: 6px;
          }
        }
      `;

    // Set innerHTML directly on the custom element
    this.innerHTML = `
        <style>${styles}</style>
        ${template}
      `;

    // After template and styles are loaded, load events
    this.loadEvents();
  }

  async loadEvents() {
    try {
      const response = await fetch("events-component/events.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const eventsData = await response.json();

      // Sort events by startdate
      eventsData.sort((a, b) => new Date(a.startdate) - new Date(b.startdate));

      console.log("Events data:", eventsData);

      // Query for the container inside the component
      const eventsContainer = this.querySelector("#events-container");

      console.log("Events container:", eventsContainer);

      if (!eventsContainer) {
        throw new Error("Container element not found in the component");
      }

      // Populate the container with event data
      eventsContainer.innerHTML = eventsData
        .map(
          (event) => `
              <tr>
                <td><img src="${event.image}"></td>
                <td><a href="${event.link}" target="_blank" class="event-link">${event.name}</a></td>
                <td>${event.startdate} - ${event.enddate}</td>
                <td>${event.location}</td>
              </tr>
            `
        )
        .join("");
    } catch (error) {
      console.error("Error loading events:", error);
    }
  }
}

customElements.define("events-component", EventsComponent);
