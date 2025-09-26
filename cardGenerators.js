import { webAppsData, servicesData, promptsData, webDesignData } from "./data.js";

// Function to generate HTML for a generic Project card (used for both Web Apps and Web Design)
export function createProjectCard(project) {
    const techTagsHtml = project.techTags.map(tag => `<span class="tech-tag">${tag}</span>`).join('');

    // Decide which links to show based on availability
    const demoLinkHtml = project.demoLink && project.demoLink !== '#' ?
        `<a href="${project.demoLink}" class="repo-link"><i class="fas fa-external-link-alt"></i> View Demo</a>` : '';
    const repoLinkHtml = project.repoLink && project.repoLink !== '#' ?
        `<a href="${project.repoLink}" class="repo-link"><i class="fab fa-github"></i> View Repository</a>` : '';

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
                ${repoLinkHtml}
                ${demoLinkHtml}
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
    return `
        <div class="project-card">
            <div class="project-header">
                <i class="${prompt.iconClass}"></i>
                <h3>${prompt.title}</h3>
            </div>
            <p>${prompt.description}</p>
            <div class="project-footer">
                <a href="${prompt.link}" class="repo-link">
                    <i class="fas fa-external-link-alt"></i> View on PromptBase
                </a>
            </div>
        </div>
    `;
}