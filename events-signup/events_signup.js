export function initializeEventsSignUp() {
    console.log("Events Signup section has been initialized");

    loadFromLocalStorage();
    renderEventTable();

    eventLoad();
}

// Temporary global array to store temporary data object.
const event_signups = [];

/**
 *Saves global array, event_signups, to the localStorage
 */
function saveToLocalStorage() {
    // localStorage can only store strings, so we need to convert our array of objects into a JSON
    localStorage.setItem("event_signups", JSON.stringify(event_signups));
    console.log(`Event stored in localStorage: ${localStorage.getItem("event_signups")}`)
}

/**
 *Retrieves the event signups from localStorage and pushes it back to the global array 
 * when web application is refreshed/loading.
 */
function loadFromLocalStorage() {

    // retrieves stringified event signups from localStorage
    const stored_event_signups = localStorage.getItem("event_signups");
    if (stored_event_signups) {

        // parses this string
        const parsed_event_signups = JSON.parse(stored_event_signups);

        // Then pushes it back to the cleared global array
        // "..." spreads the array [], instead of making it into an object [[]]
        event_signups.length = 0; 
        event_signups.push(...parsed_event_signups);
    }
}

/**
 *Displays the breakdown of signups by role as a list.
 */
function updateEventSummaryList() {
    // event summary list section
    const event_summary_list = document.getElementById("event_summary_list");
    if (!event_summary_list) return;

    // Clear any data in the list
    event_summary_list.innerHTML = "";

    // Count for breakdown
    const event_roles = {
        sponsor: 0,
        participant: 0,
        organizer: 0
    }

    for (let i = 0; i < event_signups.length; i++) {
        const signup = event_signups[i];
        const role = signup.role;

        if (role === "sponsor") {
            event_roles.sponsor = event_roles.sponsor + 1;
        } else if (role === "participant") {
            event_roles.participant = event_roles.participant + 1;
        } else if (role === "organizer") {
            event_roles.organizer = event_roles.organizer + 1;
        }
    }

    event_summary_list.innerHTML = `
        <li><strong>Sponsors:</strong> ${event_roles.sponsor}</li>
        <li><strong>Participants:</strong> ${event_roles.participant}</li>
        <li><strong>Organizers:</strong> ${event_roles.organizer}</li>
        <li><strong>Total Signups:</strong> ${event_signups.length}</li>
    `;

}

/**
 *Attaches event listeners to event signup form.
 */
function eventLoad() {
    const event_form = document.getElementById("event_form");
    if (!event_form) {
        console.error("Event form not found.");
        return;
    }

    // listener for button
    event_form.addEventListener("submit", validate);

}

/**
 * Validates the event signup form fields based on validation rules in
 * formHasErrors function. If form has errors it will call the form to 
 * prevent form from submission.
 * @param {Event} event - The form submission event.
 * @returns {Object|boolean} - Returns the data object from form submission 
 * if all fields are valid; `false` otherwise.
 */
export function validate(event) {
    clearAllErrors();

    if (formHasErrors()) {
		// 	Prevents the form from submitting
		event.preventDefault();
        console.log("Event form submission has been called");
		return false;
	}

    // Create and store data object
    let new_event_signup = createEventDataObject();
    event_signups.push(new_event_signup);

    console.log("Stored event signup:", new_event_signup);
    console.log("All events:", event_signups);

    // Helps prevent page from reloading during signup formation.
    event.preventDefault();

    saveToLocalStorage();
    // Load the event table
    renderEventTable();
    updateEventSummaryList();

    return new_event_signup;
}

/**
 * Displays the events from the global array as a table. Each event (row) also 
 * incorporates a delete button to allow the user to delete specific rows.
 * @param {Object} signup - The event signup object containing:
 *      @property {string} event_name - Name of the event
 *      @property {string} rep_name - Name of the company representative
 *      @property {string} rep_email - Email of the representative
 *      @property {string} role - Role of the representative (e.g. sponsor, participant, or organizer)
 * @param {number} index - The index of the event in the global event_signups array.
 */

async function addEventToTable(signup, index) {
    const event_table = document.getElementById("event_table");
    const event_table_body = event_table.getElementsByTagName("tbody")[0];
    const error_msg = document.getElementById("event_table_error");

    const row = document.createElement("tr");
    row.setAttribute("data-index", index);

    try 
    {
        // Clear loading message
        error_msg.textContent = "";

        // Create a row
        row.innerHTML = `
        <td>${signup.event_name}</td>
        <td>${signup.rep_name}</td>
        <td>${signup.rep_email}</td>
        <td>${signup.role}</td>
        <td>
            <button 
                class="delete-btn" 
                aria-label="Delete this event Signup"
            >Delete</button>
        </td>`;

        // Add Delete button event listener
        const delete_button = row.getElementsByTagName("button")[0];
        delete_button.addEventListener("click", () => {
            deleteEvent(index);
        });

        // Append the new event signup row to the table
        event_table_body.appendChild(row);

    } 
    catch (error) 
    {
        console.error("Failed to populate event signups:", error.message);
        error_msg.textContent = "Error please refresh or try again later.";
    }
}

/**
 * Deletes the event in the table. It also deletes this event in the local storage 
 * and updates the event summary list accordingly.
 * @param {number} index - The index of the event in the global event_signups array.
 */
export function deleteEvent(index) {

    try 
    {
        // Remove from global array
        event_signups.splice(index, 1);

        // save the updated array to local storage
        saveToLocalStorage();

        // refreshing: render event table again once deleted
        renderEventTable();

        // refreshing: showing updated array to summary
        updateEventSummaryList();
    }
    catch (error) 
    {
        console.error("Error received from deleting event:", error.message);
    }
}

/**
 * Renders the event signups as a table by calling the addEventToTable function
 * after preparing the table. It prepares by clearing previous results and error messages.
 */
function renderEventTable() {
    const event_table = document.getElementById("event_table");
    // Stops the function if event table is empty, aids in testing
    if (!event_table) return;
    const event_table_body = event_table.getElementsByTagName("tbody")[0];
    if (!event_table_body) return;

    const error_msg = document.getElementById("event_table_error");

    // Clear previous results
    event_table_body.innerHTML = "";
    error_msg.textContent = "";

    try 
    {
        if (!event_signups || event_signups.length === 0) {

            // refreshes the event summary list
            updateEventSummaryList();

            return;
        }

        // Clear loading message
            error_msg.textContent = "";

        event_signups.forEach((signup, index) => {
            addEventToTable(signup, index);
        });

        updateEventSummaryList();
    }
    catch (error) 
    {
        console.error("Failed to load event signups data:", error.message);
        error_msg.textContent = "Failed to load data, please refresh or try again later.";
    }
}

/**
 * Validates the event signup form fields based on validation rules.
 * Provides the appropriate error message related to the specific
 * form field in which an error has been found.
 * @returns {boolean} - `true` if error has been found; `false` otherwise.
 */
function formHasErrors() {

    let errorFlag = false;


    const event_name = document.getElementById("event_name").value.trim();
    const rep_name = document.getElementById("rep_name").value.trim();
    const rep_email = document.getElementById("rep_email").value.trim();
    const role = document.getElementById("role_select").value;

    if (event_name === "") {
        showError("event_name", "Please enter the event name.")
        errorFlag = true;
    }

    if (rep_name === "") {
        showError("rep_name", "Please enter the company representative's name.")
        errorFlag = true;
    }

    if (rep_email === "") {
        showError("rep_email", "Please enter your email address.")
        errorFlag = true;
    } else if (!/\S+@\S+\.\S+/.test(rep_email)) {
        showError("rep_email", "Please enter a valid email address.")
        errorFlag = true;
    }

    if (role === "") {
        showError("role_select", "Please select a role.");
        errorFlag = true;
    }
    
    return errorFlag;
}

/**
 * Creates and returns a temporary data object containing
 * values from user input in the event signup form.
 */
function createEventDataObject() {
    const data_object = {
        event_name: document.getElementById("event_name").value.trim(),
        rep_name: document.getElementById("rep_name").value.trim(),
        rep_email: document.getElementById("rep_email").value.trim(),
        role: document.getElementById("role_select").value
    };

    return data_object;
}


/**
 * Clears previously populated error messages due from incorrect 
 * input in formfields. removes the inner text from the error class
 * elements instead of removing the element entirely.
 */
function clearAllErrors() {
    const error_elements = document.getElementsByClassName("error");

    // Loop backwards since HTMLCollection is live and mutating during iteration
    for (let i = error_elements.length - 1; i >= 0; i--) {
        error_elements[i].innerText = "";
    }
}

/**
 * Populates the appropriate error message and displays this beside
 * the form field input element.
 * @param {string} id - The ID of the associated label element (e.g., "personal_name_label").
 * @param {string} message - The error message to display.
 */
function showError(id, message) {
    const errorField = document.getElementById(id + "_error");
    if (!errorField) return;

    errorField.innerText = message;
    errorField.style.display = "block";
}