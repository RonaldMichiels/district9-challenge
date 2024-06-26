class EventsComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // HTML template
    const template = `
        <template id="events-template">
          <table>
            <thead>
              <tr>
                <th>Naam</th>
                <th>Datum</th>
                <th>Locatie</th>
              </tr>
            </thead>
            <tbody id="events-container">
              <!-- Evenementen worden hier ingeladen -->
            </tbody>
          </table>
        </template>
      `;

    // CSS styles
    const styles = `
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }
        
        th,
        td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }
        
        th {
          background-color: #f4f4f4;
        }
        
        .event-link {
          color: #007bff;
          text-decoration: none;
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

    // Append template and styles to shadow DOM
    const templateElement = document.createElement("template");
    templateElement.innerHTML = template.trim();
    this.shadowRoot.appendChild(templateElement.content.cloneNode(true));

    const styleElement = document.createElement("style");
    styleElement.textContent = styles.trim();
    this.shadowRoot.appendChild(styleElement);

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

      // Sort
      eventsData.sort((a, b) => new Date(a.startdate) - new Date(b.startdate));

      console.log("Events data:", eventsData);

      // Wait for template to be appended to shadow DOM -> not working
      await customElements.whenDefined("events-component");

      // Now query for the container inside the shadow DOM
      const container = this.shadowRoot.querySelector("#events-container");
      console.log("Events container:", container); // Check if container is found -> always null ??

      if (!container) {
        throw new Error("Container element not found in the shadow DOM");
      }

      // Populate the container with event data
      container.innerHTML = eventsData
        .map(
          (event) => `
          <tr>
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
