/**
 * @jest-environment jsdom
 */

describe('Footer Component', () => {
    beforeEach(() => {
        // Simulate your footer being loaded into the DOM
        document.body.innerHTML = `
      <footer class="site-footer">
        <p>&copy; 2025 PiXELL River Financial Community Support Tracker</p>
        <p>
            <a href="privacy.html">Privacy Policy</a> |
            <a href="terms.html">Terms of Service</a>
        </p>
      </footer>
    `;
    });

    test('Jest is working', () => {
        expect(1 + 1).toBe(2);
    });

    test('Footer has the correct copyright text', () => {
        const footer = document.querySelector('.site-footer p');
        expect(footer.textContent).toContain('© 2025 PiXELL River Financial Community Support Tracker');
    });

    test('Footer has Privacy and Terms links', () => {
        const links = document.querySelectorAll('.site-footer a');
        expect(links[0].textContent).toBe('Privacy Policy');
        expect(links[1].textContent).toBe('Terms of Service');
        expect(links[0].getAttribute('href')).toBe('privacy.html');
        expect(links[1].getAttribute('href')).toBe('terms.html');
    });
});
