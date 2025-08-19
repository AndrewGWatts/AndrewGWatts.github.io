// Main edit.js - moved from edit.html inline script
import { pageContent as originalPageContent } from "./data.js";
import { schemas } from "./editUtils.js";
import { populateForm, collectFormData, addArrayItem, displayMessage } from "./editController.js";
import { populateFooter } from "./populateContent.js";

const editorForm = document.getElementById('editor-form');
const saveButton = document.getElementById('saveButton');
const downloadButton = document.getElementById('downloadButton');
const resetButton = document.getElementById('resetButton');
const clearAllButton = document.getElementById('clearAllButton');
const messageDiv = document.getElementById('message');
const footerCopyrightEditor = document.getElementById('footer-copyright-editor');

let currentContent = JSON.parse(JSON.stringify(originalPageContent));

function generateFormStructure() {
    const formStructure = {
        metadata: `
            <h3 class="section-title">Metadata</h3>
            <label for="metadata-title">Page Title:</label>
            <input type="text" id="metadata-title" data-path="metadata.title">
            <label for="metadata-cvTitle">CV Page Title:</label>
            <input type="text" id="metadata-cvTitle" data-path="metadata.cvTitle">
        `,
        header: `
            <h3 class="section-title">Header</h3>
            <label for="header-profilePictureSrc">Profile Picture URL:</label>
            <input type="url" id="header-profilePictureSrc" data-path="header.profilePictureSrc">
            <label for="header-profilePictureAlt">Profile Picture Alt Text:</label>
            <input type="text" id="header-profilePictureAlt" data-path="header.profilePictureAlt">
            <label for="header-name">Name:</label>
            <input type="text" id="header-name" data-path="header.name">
            <h4 class="sub-section-title">Social Links</h4>
            <div id="header-socialLinks-container"></div>
            <button type="button" class="add-item-button" data-array="header.socialLinks">Add Social Link</button>
            <h4 class="sub-section-title">Navigation Links</h4>
            <div id="header-navLinks-container"></div>
            <button type="button" class="add-item-button" data-array="header.navLinks">Add Nav Link</button>
        `,
        about: `
            <h3 class="section-title">About Me</h3>
            <label for="about-heading">Heading:</label>
            <input type="text" id="about-heading" data-path="about.heading">
            <label for="about-intro">Introduction:</label>
            <textarea id="about-intro" data-path="about.intro"></textarea>
        `,
        webapps: `
            <h3 class="section-title">Web Apps</h3>
            <label for="webApps-heading">Heading:</label>
            <input type="text" id="webApps-heading" data-path="webApps.heading">
            <h4 class="sub-section-title">Projects</h4>
            <div id="webApps-projects-container"></div>
            <button type="button" class="add-item-button" data-array="webApps.projects">Add Web App Project</button>
        `,
        webdesign: `
            <h3 class="section-title">Web Design</h3>
            <label for="webDesign-heading">Heading:</label>
            <input type="text" id="webDesign-heading" data-path="webDesign.heading">
            <h4 class="sub-section-title">Projects</h4>
            <div id="webDesign-projects-container"></div>
            <button type="button" class="add-item-button" data-array="webDesign.projects">Add Web Design Project</button>
        `,
        skills: `
            <h3 class="section-title">Tools & Skills</h3>
            <label for="skills-heading">Heading:</label>
            <input type="text" id="skills-heading" data-path="skills.heading">
            <h4 class="sub-section-title">Categories</h4>
            <div id="skills-categories-container"></div>
            <button type="button" class="add-item-button" data-array="skills.categories">Add Skill Category</button>
        `,
        prompts: `
            <h3 class="section-title">Educational Prompts</h3>
            <label for="prompts-heading">Heading:</label>
            <input type="text" id="prompts-heading" data-path="prompts.heading">
            <label for="prompts-buttonTextMore">"See More" Button Text:</label>
            <input type="text" id="prompts-buttonTextMore" data-path="prompts.buttonTextMore">
            <label for="prompts-buttonTextLess">"See Less" Button Text:</label>
            <input type="text" id="prompts-buttonTextLess" data-path="prompts.buttonTextLess">
            <h4 class="sub-section-title">Prompts List</h4>
            <div id="prompts-promptsList-container"></div>
            <button type="button" class="add-item-button" data-array="prompts.promptsList">Add Prompt</button>
        `,
        services: `
            <h3 class="section-title">Services</h3>
            <label for="services-heading">Heading:</label>
            <input type="text" id="services-heading" data-path="services.heading">
            <label for="services-buttonTextMore">"See More" Button Text:</label>
            <input type="text" id="services-buttonTextMore" data-path="services.buttonTextMore">
            <label for="services-buttonTextLess">"See Less" Button Text:</label>
            <input type="text" id="services-buttonTextLess" data-path="services.buttonTextLess">
            <h4 class="sub-section-title">Services List</h4>
            <div id="services-servicesList-container"></div>
            <button type="button" class="add-item-button" data-array="services.servicesList">Add Service</button>
        `,
        contact: `
            <h3 class="section-title">Contact</h3>
            <label for="contact-heading">Heading:</label>
            <input type="text" id="contact-heading" data-path="contact.heading">
            <label for="contact-email">Email:</label>
            <input type="text" id="contact-email" data-path="contact.email">
            <h4 class="sub-section-title">LinkedIn</h4>
            <label for="contact-linkedin-text">LinkedIn Text:</label>
            <input type="text" id="contact-linkedin-text" data-path="contact.linkedin.text">
            <label for="contact-linkedin-href">LinkedIn URL:</label>
            <input type="url" id="contact-linkedin-href" data-path="contact.linkedin.href">
            <h4 class="sub-section-title">GitHub</h4>
            <label for="contact-github-text">GitHub Text:</label>
            <input type="text" id="contact-github-text" data-path="contact.github.text">
            <label for="contact-github-href">GitHub URL:</label>
            <input type="url" id="contact-github-href" data-path="contact.github.href">
        `,
        footer: `
            <h3 class="section-title">Footer</h3>
            <label for="footer-copyright">Copyright Text:</label>
            <input type="text" id="footer-copyright" data-path="footer.copyright">
        `,
        cv: `
            <h3 class="section-title">CV Content</h3>
            <label for="cv-title">Title:</label>
            <input type="text" id="cv-title" data-path="cv.title">
            <label for="cv-summary">Summary:</label>
            <textarea id="cv-summary" data-path="cv.summary"></textarea>
            <h4 class="sub-section-title">Work Experience</h4>
            <div id="cv-experience-container"></div>
            <button type="button" class="add-item-button" data-array="cv.experience">Add Work Experience</button>
            <h4 class="sub-section-title">Education</h4>
            <div id="cv-education-container"></div>
            <button type="button" class="add-item-button" data-array="cv.education">Add Education Entry</button>
            <h4 class="sub-section-title">Skills (CV Specific)</h4>
            <label for="cv-skills-languages">Languages:</label>
            <input type="text" id="cv-skills-languages" data-path="cv.skills.languages">
            <label for="cv-skills-librariesFrameworks">Libraries & Frameworks:</label>
            <input type="text" id="cv-skills-librariesFrameworks" data-path="cv.skills.librariesFrameworks">
            <label for="cv-skills-aiNlpTools">AI/NLP Tools:</label>
            <input type="text" id="cv-skills-aiNlpTools" data-path="cv.skills.aiNlpTools">
            <label for="cv-skills-toolsPlatforms">Tools & Platforms:</label>
            <input type="text" id="cv-skills-toolsPlatforms" data-path="cv.skills.toolsPlatforms">
            <label for="cv-skills-educationalSkills">Educational Skills:</label>
            <input type="text" id="cv-skills-educationalSkills" data-path="cv.skills.educationalSkills">
            <h4 class="sub-section-title">Projects Section (CV Specific)</h4>
            <label for="cv-projectsSection-intro">Projects Intro:</label>
            <textarea id="cv-projectsSection-intro" data-path="cv.projectsSection.intro"></textarea>
            <h4 class="sub-section-title">Projects List (CV Specific)</h4>
            <div id="cv-projectsSection-list-container"></div>
            <button type="button" class="add-item-button" data-array="cv.projectsSection.list">Add CV Project Item</button>
            <label for="cv-awards">Awards & Recognition:</label>
            <textarea id="cv-awards" data-path="cv.awards"></textarea>
        `
    };

    // Generate the form
    editorForm.innerHTML = Object.entries(formStructure).map(([id, html]) => `
        <div class="form-group" id="${id}">
            ${html}
        </div>
    `).join('');

    // Populate the form
    renderForm();
}

function renderForm() {
    populateForm(editorForm, currentContent, schemas, renderForm);
    populateFooter({ copyright: currentContent.footer.copyright }, footerCopyrightEditor);
}

// Add event listeners for "Add Item" buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-item-button')) {
        const arrayPath = e.target.dataset.array;
        addArrayItem(currentContent, arrayPath, schemas);
        renderForm();
    }
});

// Smooth scrolling for navigation
document.querySelectorAll('.nav-panel a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

saveButton.addEventListener('click', () => {
    try {
        currentContent = collectFormData(editorForm, originalPageContent, schemas);
        renderForm();
        displayMessage(messageDiv, 'Changes applied to editor (download to persist).', 'success');
    } catch (e) {
        displayMessage(messageDiv, 'Error: Could not apply changes. Check console for details.', 'error');
        console.error('Save error:', e);
    }
});

downloadButton.addEventListener('click', () => {
    try {
        const dataToDownload = JSON.stringify(collectFormData(editorForm, originalPageContent, schemas), null, 4);
        const blob = new Blob([`export const pageContent = ${dataToDownload};`], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        displayMessage(messageDiv, 'data.js downloaded successfully!', 'success');
    } catch (e) {
        displayMessage(messageDiv, 'Error: Could not download file. See console.', 'error');
        console.error('Download error:', e);
    }
});

resetButton.addEventListener('click', () => {
    currentContent = JSON.parse(JSON.stringify(originalPageContent));
    renderForm();
    displayMessage(messageDiv, 'Content reset to original.', 'success');
});

clearAllButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        currentContent = {
            metadata: { title: "", cvTitle: "" },
            header: { name: "", profilePictureSrc: "", profilePictureAlt: "", socialLinks: [], navLinks: [] },
            about: { heading: "", intro: "" },
            webApps: { heading: "", projects: [] },
            webDesign: { heading: "", projects: [] },
            skills: { heading: "", categories: [] },
            prompts: { heading: "", buttonTextMore: "", buttonTextLess: "", promptsList: [] },
            services: { heading: "", buttonTextMore: "", buttonTextLess: "", servicesList: [] },
            contact: { heading: "", email: "", linkedin: { text: "", href: "" }, github: { text: "", href: "" } },
            footer: { copyright: "" },
            cv: {
                title: "",
                summary: "",
                experience: [],
                education: [],
                skills: {
                    languages: "",
                    librariesFrameworks: "",
                    aiNlpTools: "",
                    toolsPlatforms: "",
                    educationalSkills: ""
                },
                projectsSection: { intro: "", list: [] },
                awards: ""
            }
        };
        renderForm();
        displayMessage(messageDiv, 'All data cleared. Download to save empty state.', 'success');
    }
});

// Initial render
generateFormStructure();