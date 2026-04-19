import {deleteEvent, validate} from "../events-signup/events_signup.js"

beforeEach(() => {
    // Clears both the localStorage and global event_signup array before each test
    deleteEvent(0); 
});

test('Integration Test: Form Submission Updates Temporary Data Object', () => {

    document.body.innerHTML = `
    <form id="event_form">
        <fieldset>
        <input id="event_name" name="event_name" value="Graduation Party"/>
        <input id="rep_name" name="rep_name" value="John Smith"/>
        <input id="rep_email" name="rep_email" value="JohnSmith@example.ca"/>
        <select id="role_select">
            <option value="">--Please select role--</option>
            <option value="sponsor" selected>sponsor</option>
            <option value="participant">participant</option>
            <option value="organizer">organizer</option>
        </select>
        </fieldset>
        <button type="submit">Submit Signup</button>
    </form>

    <table id="event_table">
        <tbody></tbody>
    </table>

    <ul id="event_summary_list"></ul>
    <p id="event_table_error"></p>
  `;
    const event_form = document.getElementById("event_form");
    const event = new Event("submit");
    Object.defineProperty(event, "target", { value: event_form });
    
    const result = validate(event);

    expect(result).toEqual({
        event_name: "Graduation Party",
        rep_name: "John Smith",
        rep_email: "JohnSmith@example.ca",
        role: "sponsor",
    });
});

// This integration test also covers the unit test for empty fields
describe(`Integration Test: Invalid Submission Displays DOM Validation Errors - No values/ empty fields`, () => {

    document.body.innerHTML = `
    <form id="event_form">
        <fieldset>
            <div id="event_name_input">
                <input id="event_name" name="event_name" value=""/>
                <div class="error" id="event_name_error"></div>
            </div>
            <div id="rep_name_input">
                <input id="rep_name" name="rep_name" value=""/>
                <div class="error" id="rep_name_error"></div>
            </div>
            <div id="rep_email_input">
                <input id="rep_email" name="rep_email" value=""/>
                <div class="error" id="rep_email_error"></div>
            </div>
            <div id="role_selection_input">
                <select id="role_select">
                    <option value="" selected>--Please select role--</option>
                    <option value="sponsor">sponsor</option>
                    <option value="participant">participant</option>
                    <option value="organizer">organizer</option>
                </select>
                <div class="error" id="role_select_error"></div>
            </div>
        </fieldset>
        <button type="submit">Submit Signup</button>
    </form>
  `;
    const event_form = document.getElementById("event_form");
    const event = new Event("submit");
    Object.defineProperty(event, "target", { value: event_form });

    validate(event);

    expect(document.getElementById("event_name_error").innerText).toBe("Please enter the event name.");
    expect(document.getElementById("rep_name_error").innerText).toBe("Please enter the company representative's name.");
    expect(document.getElementById("rep_email_error").innerText).toBe("Please enter your email address.");
    expect(document.getElementById("role_select_error").innerText).toBe("Please select a role.");
});

// This integration test also covers the unit test for invalid email formats
describe(`Integration Test: Invalid Submission Displays DOM Validation Errors - empty fields and invalid email`, () => {

    document.body.innerHTML = `
    <form id="event_form">
        <fieldset>
            <div id="event_name_input">
                <input id="event_name" name="event_name" value=""/>
                <div class="error" id="event_name_error"></div>
            </div>
            <div id="rep_name_input">
                <input id="rep_name" name="rep_name" value=""/>
                <div class="error" id="rep_name_error"></div>
            </div>
            <div id="rep_email_input">
                <input id="rep_email" name="rep_email" value="John"/>
                <div class="error" id="rep_email_error"></div>
            </div>
            <div id="role_selection_input">
                <select id="role_select">
                    <option value="" selected>--Please select role--</option>
                    <option value="sponsor">sponsor</option>
                    <option value="participant">participant</option>
                    <option value="organizer">organizer</option>
                </select>
                <div class="error" id="role_select_error"></div>
            </div>
        </fieldset>
        <button type="submit">Submit Signup</button>
    </form>
  `;
    const event_form = document.getElementById("event_form");
    const event = new Event("submit");
    Object.defineProperty(event, "target", { value: event_form });

    validate(event);

    expect(document.getElementById("event_name_error").innerText).toBe("Please enter the event name.");
    expect(document.getElementById("rep_name_error").innerText).toBe("Please enter the company representative's name.");
    expect(document.getElementById("rep_email_error").innerText).toBe("Please enter a valid email address.");
    expect(document.getElementById("role_select_error").innerText).toBe("Please select a role.");
});


test(`Unit test: Data Processing Function Returns Correct Temporary Data Object`, () => {

    const fakeForm = {
        querySelector: (selector) => {
            return {
                value:
                    selector === "#event_name" ? "Graduation Party" :
                    selector === "#rep_name" ? "John Smith" :
                    selector === "#rep_email" ? "JohnSmith@example.ca" :
                    selector === "#role_select" ? "sponsor" :
                    ""
            };
        }
    };

    // mimics submission button
    const event = new Event("submit");
    // event points to fakeform
    Object.defineProperty(event, "target", { value: fakeForm });

    // function not necessary for fakeForm, 
    // updated as an empty function for unit testing
    event.preventDefault = () => {};

    const result = validate(event);

    expect(result).toEqual({
        event_name: "Graduation Party",
        rep_name: "John Smith",
        rep_email: "JohnSmith@example.ca",
        role: "sponsor",
    });
});

// MILESTONE 2 JEST TEST
test(`Integration Test: Form Submission Updates LocalStorage`, () => {

    document.body.innerHTML = `
    <form id="event_form">
        <fieldset>
        <input id="event_name" name="event_name" value="Graduation Party"/>
        <input id="rep_name" name="rep_name" value="John Smith"/>
        <input id="rep_email" name="rep_email" value="JohnSmith@example.ca"/>
        <select id="role_select">
            <option value="">--Please select role--</option>
            <option value="sponsor" selected>sponsor</option>
            <option value="participant">participant</option>
            <option value="organizer">organizer</option>
        </select>
        </fieldset>
        <button type="submit">Submit Signup</button>
    </form>

    <table id="event_table">
        <tbody></tbody>
    </table>

    <ul id="event_summary_list"></ul>
    <p id="event_table_error"></p>
  `;
    const event_form = document.getElementById("event_form");
    const event = new Event("submit");
    Object.defineProperty(event, "target", { value: event_form });
    event.preventDefault = () => {};

    validate(event);
    
    const stored_event_signups = localStorage.getItem("event_signups");
    const parsed_event_signups = JSON.parse(stored_event_signups)

    expect(parsed_event_signups.length).toBe(1);
    console.log(`Debugging: current local storage: ${stored_event_signups}`)

    expect(parsed_event_signups[0].event_name).toBe("Graduation Party");
    expect(parsed_event_signups[0].rep_name).toBe("John Smith");
    expect(parsed_event_signups[0].rep_email).toBe("JohnSmith@example.ca");
    expect(parsed_event_signups[0].role).toBe("sponsor");

});
