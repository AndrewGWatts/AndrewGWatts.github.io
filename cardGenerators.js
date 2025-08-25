import { webAppsData, servicesData, promptsData, webDesignData } from "./data.js";

// Function to generate HTML for a generic Project card (used for both Web Apps and Web Design)
export function createProjectCard(project) {
    const techTagsHtml = project.techTags.map(tag => `<span class="tech-tag">${tag}</span>`).join('');

    const linksHtml = project.links.map(link => `
        <a href="${link.url}" class="repo-link" target="_blank" rel="noopener noreferrer">
            <i class="${link.icon}"></i> ${link.text}
        </a>
    `).join('');

    return `
        <div class="project-card carousel-item">
            <img src="${project.imgSrc}" alt="${project.imgAlt}" class="project-thumbnail">
            <div class="project-header">
                <i class="${project.iconClass}"></i>
                <h3>${project.title}</h3>
            </div>
            <p>${project.description}</p>
            <div class="project-footer">
                ${techTagsHtml}
                ${linksHtml}
            </div>
        </div>
    `;
}

// Function to generate HTML for a Service card
export function createServiceCard(service) {
    return `
        <div class="service-card">
            <div class="service-header">
                <i class="${service.iconClass}"></i>
                <h3>${service.title}</h3>
            </div>
            <div class="service-details">
                 <p class="service-description">${service.description}</p>
            </div>
        </div>
    `;
}

// Function to generate HTML for a Prompt card
export function createPromptCard(prompt) {
    const linksHtml = prompt.links.map(link => `
        <a href="${link.url}" class="repo-link" target="_blank" rel="noopener noreferrer">
            <i class="${link.icon}"></i> ${link.text}
        </a>
    `).join('');

    return `
        <div class="project-card">
            <div class="project-header">
                <i class="${prompt.iconClass}"></i>
                <h3>${prompt.title}</h3>
            </div>
            <p>${prompt.description}</p>
            <div class="project-footer">
                ${linksHtml}
            </div>
        </div>
    `;
}

