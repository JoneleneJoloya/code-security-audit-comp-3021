const CHARITY_NAME = "charity_name";
const DONOR_EMAIL = "donor_email";
const DONATION_AMOUNT = "donation_amount";
const DONATION_DATE = "donation_date";
const DONATION_COMMENT = "donation_comment";

export function initializeDonation() {
    initialize();
}

/**
 * Initializes the donation form by attaching event listeners.
 */
function initialize() {
    const form = document.getElementById("donation_form");
    form.addEventListener("submit", handleFormSubmission);

    fetchRecords();
    calculateNewSummary();
}

/**
 * New Donations Logic
 */

/**
 * Handles the form submission event.
 * @param {*} event - The form submission event.
 * @returns 
 */
export function handleFormSubmission(event) {
    event.preventDefault();
    const form = event.target;

    const form_data = processFormData(form);
    if (!form_data) return null;

    addNewRecord(form_data);  // updates DOM
    saveDatabase(form_data);  // updates localStorage
    clearForm();

    return form_data;
}


export function processFormData(form) {
    clearInputErrors();

    if (!validateForm(form)) return null;

    const form_data = extractFormValues(form);
    return form_data;
}


function clearForm() {
    const form_elements = [CHARITY_NAME,
        DONOR_EMAIL, DONATION_AMOUNT, DONATION_DATE, DONATION_COMMENT
    ];

    for (let item of form_elements) {
        const field = document.getElementById(item);
        if (!field) continue;

        field.value = "";
    }
}


/**
 * Validates all form fields according to predefined validation rules.
 * Uses a list of validation configurations to dynamically apply field-specific validators.
 * @param {form} form
 * @param {dict} form_data
 * @returns {boolean} - `true` if all fields are valid; `false` otherwise.
 */
function validateForm(form) {
    let is_valid = true;

    const validation_list = [
        { element_name: CHARITY_NAME, validator: validateText },
        { element_name: DONOR_EMAIL, validator: validateText },
        { element_name: DONATION_AMOUNT, validator: validateDonationAmount },
        { element_name: DONATION_DATE, validator: validateText },
        { element_name: DONATION_COMMENT, validator: undefined }
    ];

    for (let item of validation_list) {
        const field = form.querySelector(`#${item.element_name}`);

        if (!field) continue;

        if (item.validator) {
            const { is_valid: valid, action_message } =
                validateElement(item.element_name, item.validator, form);

            if (!valid) {
                showInputError(item.element_name + "_label", action_message);
                is_valid = false;
            }
        }
    }

    return is_valid;
}


/**
 * Extract form values into a structured object.
 * @param {*} form
 * @returns {{charity_name: string, donor_email: string, donation_amount: string, donation_date: string, donation_comment: string}} - Object containing trimmed form values.
 */
export function extractFormValues(form) {
    return {
        charity_name: form.querySelector("#charity_name").value.trim(),
        donor_email: form.querySelector("#donor_email").value.trim(),
        donation_amount: form.querySelector("#donation_amount").value.trim(),
        donation_date: form.querySelector("#donation_date").value.trim(),
        donation_comment: form.querySelector("#donation_comment").value.trim()
    };
}


/**
 * Validates a single form element using a provided validator function.
 * Retrieves the input element by name from the global `form` collection and delegates validation.
 * @param {string} element_name - The `name` attribute of the form input to validate.
 * @param {function} validate_action - A validator function that accepts an input element and returns `{ is_valid: boolean, message: string }`.
 * @param {form} form
 * @returns {{ is_valid: boolean, action_message: string }} - Validation result object.
 * @throws {TypeError} If `element_name` is not a string or `validate_action` is not a function.
 * @throws {RangeError} If `element_name` is empty or whitespace-only.
 * @throws {ReferenceError} If `form` is not initialized or the element is not found.
 */
function validateElement(element_name, validate_action, form) {
    let is_valid = false;

    if (typeof element_name !== "string")
        throw new TypeError("validateElement: element_name is not of type string!");

    if (element_name.trim().length <= 0)
        throw new RangeError("validateElement: element_name is empty!");

    if (typeof validate_action !== "function")
        throw new TypeError("validateElement: validate_action is not of type function!");

    if (form === null)
        throw new ReferenceError("validateElement: form has no reference!");

    const input_element = form.querySelector(`#${element_name}`);

    if (input_element === null)
        throw new ReferenceError(`validateElement: cannot find input element with name ${element_name}`);

    const { is_valid: is_action_valid, message: action_message } = validate_action(input_element);


    is_valid = is_action_valid;
    return { is_valid, action_message };
}

/**
 * Validates a text-based input field (e.g., text, email, textarea).
 * Checks that the input value is not empty.
 * @param {HTMLInputElement|HTMLTextAreaElement} input_element - The input element to validate.
 * @returns {{ is_valid: boolean, message: string }} - `is_valid` is `true` if value is non-empty; otherwise `false` with an error message.
 */
export function validateText(input_element) {
    let message = "";
    let is_valid = false;

    if (input_element.value === "") {
        message = "Please enter a value!";
        return { is_valid, message };
    }

    is_valid = true;
    return { is_valid, message };
}


/**
 * Validates the donation amount input field.
 * Checks if a number is entered and if it is positive.
 * @returns {{is_valid: boolean, message: string}} Object with validation status and message
 */
export function validateDonationAmount(input_element) {
    let message = "";
    let is_valid = false;

    if (input_element == null)
        throw new ReferenceError("Number input element of form is null");

    if (input_element.value === "") {
        message = "Please enter a valid number.";
        return { is_valid, message };
    }

    const number_value = Number(input_element.value);

    if (Number.isNaN(number_value)) {
        message = "Please enter a valid number.";
        return { is_valid, message };
    }

    if (number_value < 0) {
        message = "Donation amount must be a positive number!";
        return { is_valid, message };
    }

    is_valid = true;
    return { is_valid, message };
}


/**
 * Displays an error message next to a form label.
 * Creates and inserts a `<span>` with class `error_message` after the label element.
 * Also links the input to the error via `aria-describedby` for accessibility.
 * @param {string} input_id - The ID of the associated label element (e.g., "personal_name_label").
 * @param {string} message - The error message to display.
 */
function showInputError(input_id, message) {
    const input_element = document.getElementById(input_id);
    if (!input_element) return;

    const error_id = input_id + "_error";
    // Create new error message
    const errorDisplay = document.createElement("span");
    errorDisplay.id = error_id;
    errorDisplay.innerText = message;
    errorDisplay.className = "error_message";
    errorDisplay.setAttribute("aria-describedby", error_id);

    input_element.appendChild(errorDisplay);
    input_element.setAttribute("aria-describedby", error_id);
}

/**
 * Clears all previously displayed input error messages.
 * Removes all elements with the "error_message" class from the DOM.
 */
function clearInputErrors() {
    const error_elements = document.getElementsByClassName("error_message");

    // Loop backwards since HTMLCollection is live and mutating during iteration
    for (let i = error_elements.length - 1; i >= 0; i--) {
        const element = error_elements[i];
        element.remove();
    }
}

/**
 * Donation Records
 */

export function addNewRecord(data) {
    if ((typeof data) !== "object")
        throw new ReferenceError(`Adding an invalid record!`);

    const donation_table = document.getElementById(`donation_table`);
    if (donation_table === undefined || donation_table === null)
        throw new ReferenceError(`Donation Table cannot be found in document!`);

    const tbody = donation_table.querySelector("tbody");
    const new_row = tbody.insertRow();

    const charity_name_cell = new_row.insertCell();
    const amount_cell = new_row.insertCell();
    const date_cell = new_row.insertCell();
    const comment_cell = new_row.insertCell();
    const delete_cell = new_row.insertCell();

    charity_name_cell.textContent = data.charity_name;
    amount_cell.textContent = data.donation_amount;
    date_cell.textContent = data.donation_date;
    comment_cell.textContent = data.donation_comment || ""; // If comment is not defined then do nothing


    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete_btn";

    // Unique key for localStorage
    const key = `${data.charity_name}-${data.donation_amount}-${data.donation_date}`;

    deleteButton.addEventListener("click", function () {
        new_row.remove();
        removeRecordFromDatabase(key);
        calculateNewSummary();
    });

    delete_cell.appendChild(deleteButton);
    calculateNewSummary();
}

export function fetchRecords() {
    const db = loadDatabase();

    const donation_table = document.getElementById("donation_table");
    if (!donation_table) throw new ReferenceError("Donation table not found!");

    const tbody = donation_table.querySelector("tbody") || donation_table;
    tbody.innerHTML = ""; // clear before loading new rows

    for (const key in db) {
        const record = db[key];
        addNewRecord(record);
    }
}


export function calculateNewSummary() {
    const AMOUNT_INDEX = 1;
    const amount_cells = getColumnCells(`donation_table`, AMOUNT_INDEX);

    let new_sum = 0;
    for (let i = 1; i < amount_cells.length; i++) {
        const element = amount_cells[i];
        try {
            const value = Number(element.textContent)
            new_sum += value;
        }
        catch (err) {
            console.error(`Donation Table: (${i}) row amount cannot be parsed into a number!`);
        }
    }

    const donation_value = document.getElementById(`donation_summary_value`);
    donation_value.innerText = `${new_sum}`;
    return new_sum

}

function getColumnCells(tableId, columnIndex) {
    const table = document.getElementById(tableId);
    if (table === undefined || table === null)
        throw new ReferenceError(`Donation Table cannot be found in document!`);

    const rows = table.rows;

    const columnCells = [];

    for (let i = 0; i < rows.length; i++) {
        const cell = rows[i].cells[columnIndex];
        if (cell) columnCells.push(cell);
    }

    return columnCells;
}

export function saveDatabase(donation) {
    if (typeof donation !== "object")
        throw new ReferenceError("Adding an invalid record!");

    let db = loadDatabase();

    // Unique key based on charity, amount, date
    const key = `${donation.charity_name}-${donation.donation_amount}-${donation.donation_date}`;

    db[key] = donation;

    setLocalStorage("donation_db", db);
}

function removeRecordFromDatabase(key) {
    const db = loadDatabase();
    if (db[key]) {
        delete db[key];
        setLocalStorage("donation_db", db);
    }
}


export function loadDatabase() {
    const db = getLocalStorage("donation_db");
    return db || {}; // return empty object if nothing exists
}


function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}
