# Project Development Overview

![Jest Tests](https://github.com/alcoranpaul/COMP_2230_project/actions/workflows/test.yml/badge.svg)
## Group Members
- Himanshu Agestya
- Jonelene Marie Joloya
- Paul Adrian Reyes

## Overview

This project consists of **three main components** that form the full webpage:

1. **Donation Tracker**
2. **Volunteer Hours Tracker**
3. **Event Sign-Up**

Each developer is responsible for one component.

---

## Evaluation

### **Individual Evaluation**
Each person will be graded on **their assigned component**, based on the project rubric.

### **Group Evaluation**
Graded through **GitHub collaboration**, including:

* Issues
* Pull Requests
* Code Reviews
* Collaboration workflow
* Branch and merge practices

---

## GitHub Workflow

### Cloning the Repository

To start working on the project, clone the repository:

```bash
git clone https://github.com/alcoranpaul/COMP_2230_project.git
cd COMP_2230_PROJECT
````

Install dependencies:

```bash
npm install
```

---

### Branching Strategy

* **All development work should be pushed to the `development` branch.**
* **Paul** is responsible for merging the `development` branch into `master`.
* This ensures `master` is always stable and only contains tested and reviewed code.

---

### Reviewing Pull Requests (PRs)

This project requires **mandatory peer review** before merging.

Reviewer flow:

| Author       | Reviewer |
| ------------ | -------- |
| **Paul**     | Himanshu |
| **Jonelene** | Paul     |
| **Himanshu** | Jonelene |

**Rules:**

* Every PR must have an assigned reviewer.
* The **reviewer**, not the author, performs the merge.
* Provide constructive feedback when necessary.
* PRs must target the `development` branch.

---

## Issues Workflow

Use GitHub **Issues** whenever a problem, improvement, or question arises.

**Examples of valid issues:**

* “This function needs documentation.”
* “Form validation fails on empty input.”
* “LocalStorage not updating correctly.”

Make sure to include:

* Clear title
* Description
* Screenshots (if applicable)
* Tags/Labels
* Assignee

---

## Pull Requests (PRs)

### **PR Requirements**

Every PR must include:

* Assigned **reviewer**
* Description of changes
* Linked Issues (GitHub auto-closing keywords)

**Example (auto-close):**

```
Closes #10
```

### **PR Tags / Labels**

Attach relevant labels on the right side of the PR:

* `Reviewer`
* `Milestone`
* `Issue`
* `Enhancement` / `Bug` (if applicable)

### **Important Rule**

* **Reviewer merges the PR**, not the contributor.
* PRs must always be created against `development`.

---

### Testing and Continuous Integration

Automated testing is implemented using **Jest**.

#### Writing tests
- JS Module/File
    - Export any funciton you want to test using `export`.
- Test file
    - Import the function you wan to test using `import`.

Exmaple:
```js
// donation.js
export function handleFormSubmission(event) {
    event.preventDefault();
    const form = event.target;
    return {
        charity_name: form.charity_name.value,
        donor_email: form.donor_email.value,
        donation_amount: form.donation_amount.value,
        donation_date: form.donation_date.value,
        donation_comment: form.donation_comment.value
    };
}
```
```js
// donation.test.js
import { handleFormSubmission } from "../donation-tracker/donation.js";

test("Form submission returns correct data", () => {
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
    const event = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "target", { value: form });

    const result = handleFormSubmission(event);


    expect(result).toEqual({
        charity_name: "Red Cross",
        donor_email: "john@example.com",
        donation_amount: "75",
        donation_date: "2025-02-10",
        donation_comment: "Keep up the good work"
    });
});

```

#### Run tests locally

```bash
npm test
```

* This runs all Jest tests and outputs results in the console.
* Ensure all tests pass before creating a PR.

#### How testing works on PRs

1. Every PR is automatically tested via **GitHub Actions**.
2. The workflow runs Jest tests on the PR branch.
3. Test results are reported in the PR conversation.
4. PRs **cannot be merged** if tests fail (depending on branch protection rules).

#### Writing and running tests

* **Unit tests:** Check individual functions (e.g., form validation, calculation functions).
* **Integration tests:** Check full user flows (e.g., submitting a form updates localStorage and table).
* Tests are stored in the `__tests__` folder or alongside the JS files.

---

## Milestones

There are **two project milestones**:

### **Milestone 1 — Initial Setup & Basic Functionality**

**Due:** **Nov 29**
Includes:

* Setting up project structure
* Building initial UI layouts
* Form creation
* Temporary (non-persistent) data handling
* Stage One functionality + Jest tests

### **Milestone 2 — Advanced Functionality & Finalization**

**Due:** **Dec 4–5**
Includes:

* Tables
* LocalStorage persistence
* Summaries & calculations
* Record deletion
* Stage Two functionality + Jest tests
* Cleanup & final refinements
