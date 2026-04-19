import {
    processFormData, validateDonationAmount, validateText, extractFormValues,
    fetchRecords, saveDatabase, loadDatabase, addNewRecord,
    calculateNewSummary
} from "../donation-tracker/donation.js";

/**
 * Adding a new Donation ========================
 */
test('Integration Test: Form Submission Updates Temporary Data Object', () => {

    document.body.innerHTML = `
    <form id="donation_form">
        <input id="charity_name" name="charity_name" value="Red Cross"/>
        <input id="donor_email" name="donor_email" value="john@example.com"/>
        <input id="donation_amount" name="donation_amount" value="75"/>
        <input id="donation_date" name="donation_date" value="2025-02-10"/>
        <textarea id="donation_comment" name="donation_comment">Keep up the good work</textarea>
        <button type="submit">Submit</button>
    </form>
  `;
    const form = document.getElementById("donation_form");
    const event = new Event("submit");
    Object.defineProperty(event, "target", { value: form });

    const result = processFormData(event.target);


    expect(result).toEqual({
        charity_name: "Red Cross",
        donor_email: "john@example.com",
        donation_amount: "75",
        donation_date: "2025-02-10",
        donation_comment: "Keep up the good work"
    });
});

describe(`Integration Test: Invalid Submission Displays DOM Validation Errors - No values`, () => {

    document.body.innerHTML = `
    <form id="donation_form">
        <div id="charity_name_container">
            <div id="charity_name_label" class="donation_label">
                    <label for="charity_name">Charity Name:</label>
            </div>
            <input id="charity_name" name="charity_name" value=""/>
        </div>

        <div id="donor_email_container" >
            <div id="donor_email_label" class="donation_label">
                    <label for="donor_email">Donor Email:</label>
            </div>
            <input id="donor_email" name="donor_email" value=""/>
        </div>


        <div id="donation_amount_container">
            <div id="donation_amount_label" class="donation_label">
                    <label for="donation_amount">Donation Amount (CAD):</label>
                </div>
            <input id="donation_amount" name="donation_amount" value=""/>
        </div>

        <div id="donation_date_container">
            <div id="donation_date_label" class="donation_label">
                    <label for="donation_date">Date of Donation:</label>
            </div>
            <input id="donation_date" name="donation_date" value=""/>
        </div>

        <div id="donation_comment_container">
            <div id="donation_comment_label" class="donation_label">
                    <label for="donation_comment" id="donation_comment_label">Donor Comment:</label>
            </div>
            <textarea id="donation_comment" name="donation_comment"></textarea>
        </div>
        
       
        <button type="submit">Submit</button>
    </form>
  `;
    const ERROR_CLASS = "error_message";
    const TEXT_VALUE_ERROR_MESSAGE = "Please enter a value!";

    const form = document.getElementById("donation_form");
    let event = new Event("submit");
    Object.defineProperty(event, "target", { value: form });

    let result = processFormData(event.target);
    let error_elements = form.getElementsByClassName(ERROR_CLASS);

    test("Testing charity element", () => {
        expect(error_elements[0].innerText).toEqual(TEXT_VALUE_ERROR_MESSAGE);
    });

    test("Testing email element", () => {
        expect(error_elements[1].innerText).toEqual(TEXT_VALUE_ERROR_MESSAGE);
    });

    test("Testing amount element", () => {
        const AMOUNT_VALUE_INVALID_MESSAGE = "Please enter a valid number.";
        expect(error_elements[2].innerText).toEqual(AMOUNT_VALUE_INVALID_MESSAGE);
    });

    test("Testing date element", () => {
        expect(error_elements[3].innerText).toEqual(TEXT_VALUE_ERROR_MESSAGE);
    });

});


describe(`Integration Test: Invalid Submission Displays DOM Validation Errors - No values and Donation Amount not a number`, () => {

    document.body.innerHTML = `
    <form id="donation_form">
        <div id="charity_name_container">
            <div id="charity_name_label" class="donation_label">
                    <label for="charity_name">Charity Name:</label>
            </div>
            <input id="charity_name" name="charity_name" value=""/>
        </div>

        <div id="donor_email_container" >
            <div id="donor_email_label" class="donation_label">
                    <label for="donor_email">Donor Email:</label>
            </div>
            <input id="donor_email" name="donor_email" value=""/>
        </div>


        <div id="donation_amount_container">
            <div id="donation_amount_label" class="donation_label">
                    <label for="donation_amount">Donation Amount (CAD):</label>
                </div>
            <input id="donation_amount" name="donation_amount" value="gbfgrba"/>
        </div>

        <div id="donation_date_container">
            <div id="donation_date_label" class="donation_label">
                    <label for="donation_date">Date of Donation:</label>
            </div>
            <input id="donation_date" name="donation_date" value=""/>
        </div>

        <div id="donation_comment_container">
            <div id="donation_comment_label" class="donation_label">
                    <label for="donation_comment" id="donation_comment_label">Donor Comment:</label>
            </div>
            <textarea id="donation_comment" name="donation_comment"></textarea>
        </div>
        
       
        <button type="submit">Submit</button>
    </form>
  `;
    const ERROR_CLASS = "error_message";
    const TEXT_VALUE_ERROR_MESSAGE = "Please enter a value!";

    const form = document.getElementById("donation_form");
    let event = new Event("submit");
    Object.defineProperty(event, "target", { value: form });

    let result = processFormData(event.target);
    let error_elements = form.getElementsByClassName(ERROR_CLASS);

    test("Testing charity element", () => {
        expect(error_elements[0].innerText).toEqual(TEXT_VALUE_ERROR_MESSAGE);
    });

    test("Testing email element", () => {
        expect(error_elements[1].innerText).toEqual(TEXT_VALUE_ERROR_MESSAGE);
    });

    test("Testing amount element", () => {
        const NOT_A_NUMBER_MESSAGE = "Please enter a valid number.";
        expect(error_elements[2].innerText).toEqual(NOT_A_NUMBER_MESSAGE);

    });

    test("Testing date element", () => {
        expect(error_elements[3].innerText).toEqual(TEXT_VALUE_ERROR_MESSAGE);
    });

});


describe(`Integration Test: Invalid Submission Displays DOM Validation Errors - No values and Donation Amount is negative`, () => {

    document.body.innerHTML = `
    <form id="donation_form">
        <div id="charity_name_container">
            <div id="charity_name_label" class="donation_label">
                    <label for="charity_name">Charity Name:</label>
            </div>
            <input id="charity_name" name="charity_name" value=""/>
        </div>

        <div id="donor_email_container" >
            <div id="donor_email_label" class="donation_label">
                    <label for="donor_email">Donor Email:</label>
            </div>
            <input id="donor_email" name="donor_email" value=""/>
        </div>


        <div id="donation_amount_container">
            <div id="donation_amount_label" class="donation_label">
                    <label for="donation_amount">Donation Amount (CAD):</label>
                </div>
            <input id="donation_amount" name="donation_amount" value="-123456789"/>
        </div>

        <div id="donation_date_container">
            <div id="donation_date_label" class="donation_label">
                    <label for="donation_date">Date of Donation:</label>
            </div>
            <input id="donation_date" name="donation_date" value=""/>
        </div>

        <div id="donation_comment_container">
            <div id="donation_comment_label" class="donation_label">
                    <label for="donation_comment" id="donation_comment_label">Donor Comment:</label>
            </div>
            <textarea id="donation_comment" name="donation_comment"></textarea>
        </div>
        
       
        <button type="submit">Submit</button>
    </form>
  `;
    const ERROR_CLASS = "error_message";
    const TEXT_VALUE_ERROR_MESSAGE = "Please enter a value!";

    const form = document.getElementById("donation_form");
    let event = new Event("submit");
    Object.defineProperty(event, "target", { value: form });

    let result = processFormData(event.target);
    let error_elements = form.getElementsByClassName(ERROR_CLASS);

    test("Testing charity element", () => {
        expect(error_elements[0].innerText).toEqual(TEXT_VALUE_ERROR_MESSAGE);
    });

    test("Testing email element", () => {
        expect(error_elements[1].innerText).toEqual(TEXT_VALUE_ERROR_MESSAGE);
    });

    test("Testing amount element", () => {
        const NOT_A_POSITIVE_NUNBER = "Donation amount must be a positive number!";
        expect(error_elements[2].innerText).toEqual(NOT_A_POSITIVE_NUNBER);

    });

    test("Testing date element", () => {
        expect(error_elements[3].innerText).toEqual(TEXT_VALUE_ERROR_MESSAGE);
    });

});

describe(`Unit Test: Required Field Validation Function Detects Empty Fields`, () => {
    document.body.innerHTML = `
    <form id="donation_form">
        <input id="charity_name" name="charity_name" value=""/>
        <input id="donor_email" name="donor_email" value=""/>
        <input id="donation_amount" name="donation_amount" value=""/>
        <input id="donation_date" name="donation_date" value=""/>
        <button type="submit">Submit</button>
    </form>
    `

    test(`Charity_name has no value`, () => {
        const element = document.getElementById("charity_name");
        validateText(element)
    });

    test(`Donor_email has no value`, () => {
        const element = document.getElementById("donor_email");
        validateText(element)
    });

    test(`Donation_amount has no value`, () => {
        const element = document.getElementById("donation_amount");
        validateDonationAmount(element)
    });

    test(`Donation_date has no value`, () => {
        const element = document.getElementById("donation_date");
        validateText(element)
    });
});

describe(`Unit Test: Donation Amount Validation for Non-Numeric or Negative Values`, () => {


    test(`Donation_amount has Non-numeric`, () => {
        document.body.innerHTML = `
            <form id="donation_form">
                <input id="charity_name" name="charity_name" value=""/>
                <input id="donor_email" name="donor_email" value=""/>
                <input id="donation_amount" name="donation_amount" value="adsfg"/>
                <input id="donation_date" name="donation_date" value=""/>
                <button type="submit">Submit</button>
            </form>
            `
        const element = document.getElementById("donation_amount");
        validateDonationAmount(element)
    });

    test(`Donation_amount is Negative value`, () => {
        document.body.innerHTML = `
            <form id="donation_form">
                <input id="charity_name" name="charity_name" value=""/>
                <input id="donor_email" name="donor_email" value=""/>
                <input id="donation_amount" name="donation_amount" value="-123456789"/>
                <input id="donation_date" name="donation_date" value=""/>
                <button type="submit">Submit</button>
            </form>
            `
        const element = document.getElementById("donation_amount");
        validateDonationAmount(element)
    });
});

test("Data Processing Function Returns Correct Temporary Data Object", () => {

    const fakeForm = {
        querySelector: (selector) => {
            return {
                value:
                    selector === "#charity_name" ? "Red Cross" :
                        selector === "#donor_email" ? "john@example.com" :
                            selector === "#donation_amount" ? "75" :
                                selector === "#donation_date" ? "2025-02-10" :
                                    selector === "#donation_comment" ? "Keep up the good work" :
                                        ""
            };
        }
    };

    const result = extractFormValues(fakeForm);

    expect(result).toEqual({
        charity_name: "Red Cross",
        donor_email: "john@example.com",
        donation_amount: "75",
        donation_date: "2025-02-10",
        donation_comment: "Keep up the good work"
    });
});

/**
 * Rendering Donation History ========================
 */

test('Integration Test: Donation Table Updates After localStorage Additions', () => {

    localStorage.clear();
    document.body.innerHTML = `
        <table id="donation_table">
            <thead>
                <tr>
                    <th>Charity Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Comment</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        <span id="donation_summary_value">0</span>
    `;
    const donation = {
        charity_name: "Red Cross",
        donor_email: "donor@example.com",
        donation_amount: "50",
        donation_date: "2025-11-30",
        donation_comment: "Great cause"
    };

    // 2. Save it to localStorage
    saveDatabase(donation);

    // 3. Check that it exists in localStorage
    const db = loadDatabase();
    const key = `${donation.charity_name}-${donation.donation_amount}-${donation.donation_date}`;
    expect(db[key]).toEqual(donation);

    // 4. Fetch records to populate the table
    fetchRecords();

    // 5. Check that tbody has one row
    const tbody = document.querySelector("#donation_table tbody");
    expect(tbody.rows.length).toBe(1);

    // 6. Check that the row has correct values
    const row = tbody.rows[0];
    expect(row.cells[0].textContent).toBe(donation.charity_name);
    expect(row.cells[1].textContent).toBe(donation.donation_amount);
    expect(row.cells[2].textContent).toBe(donation.donation_date);
    expect(row.cells[3].textContent).toBe(donation.donation_comment);

    // 7. Check that the summary updates correctly
    const summary = calculateNewSummary();
    expect(summary).toBe(50);
});

test("Integration Test: Page Loads and Renders Persisted localStorage Donation Data", () => {
    document.body.innerHTML = `
        <table id="donation_table">
            <thead>
                <tr>
                    <th>Charity Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Comment</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        <span id="donation_summary_value">0</span>
    `;

    const sampleDonation1 = {
        charity_name: "Red Cross",
        donor_email: "john@example.com",
        donation_amount: "100",
        donation_date: "2025-11-30",
        donation_comment: "Keep up the good work"
    };

    const sampleDonation2 = {
        charity_name: "UNICEF",
        donor_email: "jane@example.com",
        donation_amount: "50",
        donation_date: "2025-12-01",
        donation_comment: "Important cause"
    };

    const db = {};
    const key1 = `${sampleDonation1.charity_name}-${sampleDonation1.donation_amount}-${sampleDonation1.donation_date}`;
    const key2 = `${sampleDonation2.charity_name}-${sampleDonation2.donation_amount}-${sampleDonation2.donation_date}`;
    db[key1] = sampleDonation1;
    db[key2] = sampleDonation2;

    localStorage.setItem("donation_db", JSON.stringify(db));

    fetchRecords();

    const tbody = document.querySelector("#donation_table tbody");
    expect(tbody.rows.length).toBe(2);

    // Row 1
    const row1 = tbody.rows[0];
    expect(row1.cells[0].textContent).toBe(sampleDonation1.charity_name);
    expect(row1.cells[1].textContent).toBe(sampleDonation1.donation_amount);
    expect(row1.cells[2].textContent).toBe(sampleDonation1.donation_date);
    expect(row1.cells[3].textContent).toBe(sampleDonation1.donation_comment);

    // Row 2
    const row2 = tbody.rows[1];
    expect(row2.cells[0].textContent).toBe(sampleDonation2.charity_name);
    expect(row2.cells[1].textContent).toBe(sampleDonation2.donation_amount);
    expect(row2.cells[2].textContent).toBe(sampleDonation2.donation_date);
    expect(row2.cells[3].textContent).toBe(sampleDonation2.donation_comment);

    // Summary total
    const summary = calculateNewSummary();
    expect(summary).toBe(150);
});

test("Unit Test: Total Donation Calculation Function", () => {
    document.body.innerHTML = `
        <table id="donation_table">
            <thead>
                <tr>
                    <th>Charity Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Comment</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Red Cross</td>
                    <td>100</td>
                    <td>2025-11-30</td>
                    <td>Great work</td>
                    <td></td>
                </tr>
                <tr>
                    <td>UNICEF</td>
                    <td>50</td>
                    <td>2025-12-01</td>
                    <td>Important cause</td>
                    <td></td>
                </tr>
                <tr>
                    <td>Charity A</td>
                    <td>25</td>
                    <td>2025-12-02</td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <span id="donation_summary_value">0</span>
    `;

    calculateNewSummary();

    const summary = calculateNewSummary();
    expect(summary).toBe(175);
});

test("Unit Test: Delete Function Updates Table and localStorage", () => {
    document.body.innerHTML = `
        <table id="donation_table">
            <thead>
                <tr>
                    <th>Charity Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Comment</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        <span id="donation_summary_value">0</span>
    `;

    const donation = {
        charity_name: "Red Cross",
        donor_email: "john@example.com",
        donation_amount: "100",
        donation_date: "2025-11-30",
        donation_comment: "Great work"
    };

    // Save in localStorage
    const key = `${donation.charity_name}-${donation.donation_amount}-${donation.donation_date}`;
    localStorage.setItem("donation_db", JSON.stringify({ [key]: donation }));

    addNewRecord(donation);

    const tbody = document.querySelector("#donation_table tbody");
    expect(tbody.rows.length).toBe(1);
    let summary = calculateNewSummary();
    expect(summary).toBe(100);

    const deleteButton = tbody.rows[0].querySelector(".delete_btn");
    deleteButton.click();

    expect(tbody.rows.length).toBe(0); // row removed

    const dbAfterDelete = loadDatabase();
    expect(dbAfterDelete[key]).toBeUndefined(); // removed from localStorage

    summary = calculateNewSummary();
    expect(summary).toBe(0);

});

test("Unit Test: Summary Updates Correctly After Record Deletion", () => {
    document.body.innerHTML = `
        <table id="donation_table">
            <thead>
                <tr>
                    <th>Charity Name</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Comment</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        <span id="donation_summary_value">0</span>
    `;

    const donation1 = {
        charity_name: "Red Cross",
        donor_email: "a@example.com",
        donation_amount: "100",
        donation_date: "2025-11-30",
        donation_comment: ""
    };

    const donation2 = {
        charity_name: "UNICEF",
        donor_email: "b@example.com",
        donation_amount: "50",
        donation_date: "2025-12-01",
        donation_comment: ""
    };

    addNewRecord(donation1);
    addNewRecord(donation2);

    const tbody = document.querySelector("#donation_table tbody");
    let summary = calculateNewSummary();


    expect(summary).toBe(150);
    expect(tbody.rows.length).toBe(2);

    const deleteButton1 = tbody.rows[0].querySelector(".delete_btn");
    deleteButton1.click();

    summary = calculateNewSummary();
    expect(summary).toBe(50); // Only donation2 remains
    expect(tbody.rows.length).toBe(1);
    expect(tbody.rows[0].cells[0].textContent).toBe("UNICEF");

    const deleteButton2 = tbody.rows[0].querySelector(".delete_btn");
    deleteButton2.click();

    summary = calculateNewSummary();
    expect(summary).toBe(0);
    expect(tbody.rows.length).toBe(0);
});