// editUtils.js

export function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function setNestedValue(obj, path, value) {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]] || typeof current[parts[i]] !== 'object') {
            current[parts[i]] = {};
        }
        current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
}

export const schemas = {
    'header.socialLinks': {
        __type: 'object',
        iconClass: { type: 'text', label: 'Icon Class (e.g., fab fa-github)' },
        href: { type: 'url', label: 'URL' },
        label: { type: 'text', label: 'Accessibility Label' }
    },
    'header.navLinks': {
        __type: 'object',
        href: { type: 'text', label: 'URL' },
        text: { type: 'text', label: 'Display Text' }
    },
    'webApps.projects': {
        __type: 'object',
        imgSrc: { type: 'url', label: 'Image URL' },
        imgAlt: { type: 'text', label: 'Image Alt Text' },
        iconClass: { type: 'text', label: 'Icon Class' },
        title: { type: 'text', label: 'Title' },
        description: { type: 'text', label: 'Description', textArea: true },
        techTags: { type: 'text', label: 'Tech Tags (comma separated)' },
        repoLink: { type: 'url', label: 'Repository Link' },
        demoLink: { type: 'url', label: 'Demo Link' }
    },
    'webDesign.projects': {
        __type: 'object',
        imgSrc: { type: 'url', label: 'Image URL' },
        imgAlt: { type: 'text', label: 'Image Alt Text' },
        iconClass: { type: 'text', label: 'Icon Class' },
        title: { type: 'text', label: 'Title' },
        description: { type: 'text', label: 'Description', textArea: true },
        techTags: { type: 'text', label: 'Tech Tags (comma separated)' },
        repoLink: { type: 'url', label: 'Repository Link' },
        demoLink: { type: 'url', label: 'Demo Link' }
    },
    'skills.categories': {
        __type: 'object',
        heading: { type: 'text', label: 'Category Heading' },
        iconClass: { type: 'text', label: 'Icon Class' },
        description: { type: 'text', label: 'Description', textArea: true }
    },
    'prompts.promptsList': {
        __type: 'object',
        iconClass: { type: 'text', label: 'Icon Class' },
        title: { type: 'text', label: 'Title' },
        description: { type: 'text', label: 'Description', textArea: true },
        link: { type: 'url', label: 'Link' }
    },
    'services.servicesList': {
        __type: 'object',
        iconClass: { type: 'text', label: 'Icon Class' },
        title: { type: 'text', label: 'Title' },
        description: { type: 'text', label: 'Description', textArea: true }
    },
    'cv.experience': {
        __type: 'object',
        title: { type: 'text', label: 'Job Title' },
        period: { type: 'text', label: 'Period' },
        details: { type: 'text', label: 'Details (one per line)', textArea: true }
    },
    'cv.education': {
        __type: 'object',
        degree: { type: 'text', label: 'Degree' },
        field: { type: 'text', label: 'Field' },
        institution: { type: 'text', label: 'Institution' },
        year: { type: 'text', label: 'Year' }
    },
    'cv.projectsSection.list': {
        __type: 'string',
        value: { type: 'text', label: 'Project Name' }
    }
};