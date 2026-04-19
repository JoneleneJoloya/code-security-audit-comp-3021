import { initializeVolunteer } from "./volunteer/volunteer.js";
import { initializeDonation } from "./donation-tracker/donation.js";
import { initializeEventsSignUp } from "./events-signup/events_signup.js";

/**
 * Initialize the main script
 */
async function initialize() {
    const html_list = [
        ['components/header.html', 'header-container', 'header'],
        ['components/nav.html', 'nav-container', 'nav'],
        ['donation-tracker/donation.html', 'donation-section', 'donation section'],
        ['volunteer/volunteer.html', 'volunteer-section', 'volunteer section'],
        ['events-signup/events_signup.html', 'event-signup-section', 'event signup section'],
        ['components/footer.html', 'footer-container', 'footer'],
    ]

    const loaders = html_list.map(item => injectHTML(item[0], item[1], item[2]));

    await Promise.all(loaders);  // WAIT for all HTML to load

    // Now all HTML exists in DOM — safe to initialize
    initializeDonation();
    initializeVolunteer();
    initializeEventsSignUp();
}


/**
 * Inject html file into index.html
 * @param {*} path - Path of the html file
 * @param {*} class_name - Class name to be injected or the parent
 * @param {*} name - Name of the html section
 */
async function injectHTML(path, class_name, name) {
    try {
        const response = await fetch(path);
        const data = await response.text();
        document.getElementById(class_name).innerHTML = data;
    } catch (err) {
        return console.error(`Failed to load ${name}: ${err}`);
    }
}


window.onload = () => {
    initialize();
}