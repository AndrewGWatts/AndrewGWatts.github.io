// populateContent.js

export function populateHeader(headerData) {
    const profilePicture = document.getElementById('profile-picture');
    if (profilePicture) {
        profilePicture.src = headerData.profilePictureSrc;
        profilePicture.alt = headerData.profilePictureAlt;
    }
    const headerName = document.getElementById('header-name');
    if (headerName) headerName.textContent = headerData.name;

    const socialIconsContainer = document.getElementById('social-icons');
    if (socialIconsContainer) {
        socialIconsContainer.innerHTML = headerData.socialLinks.map(link => `
            <a href="${link.href}" aria-label="${link.label}"><i class="${link.iconClass}"></i></a>
        `).join('');
    }

    const navLinksContainer = document.getElementById('nav-links');
    if (navLinksContainer) {
        navLinksContainer.innerHTML = headerData.navLinks.map(link => `
            <li><a href="${link.href}">${link.text}</a></li>
        `).join('');
    }
}

export function populateAbout(aboutData) {
    const aboutHeading = document.getElementById('about-heading');
    if (aboutHeading) aboutHeading.textContent = aboutData.heading;
    const aboutIntro = document.getElementById('about-intro');
    if (aboutIntro) aboutIntro.textContent = aboutData.intro;
}

export function populateSkills(skillsData) {
    const skillsHeading = document.getElementById('skills-heading');
    if (skillsHeading) skillsHeading.textContent = skillsData.heading;
    const skillsGrid = document.getElementById('skills-grid');
    if (skillsGrid) {
        skillsGrid.innerHTML = skillsData.categories.map(cat => `
            <h3><i class="${cat.iconClass}"></i> ${cat.heading}</h3>
            <p>${cat.description}</p>
        `).join('');
    }
}

export function populateContact(contactData) {
    const contactHeading = document.getElementById('contact-heading');
    if (contactHeading) contactHeading.textContent = contactData.heading;
    const contactEmail = document.getElementById('contact-email');
    if (contactEmail) contactEmail.textContent = contactData.email;
    const contactLinkedinLink = document.getElementById('contact-linkedin-link');
    if (contactLinkedinLink) {
        contactLinkedinLink.href = contactData.linkedin.href;
        contactLinkedinLink.textContent = contactData.linkedin.text;
    }
    const contactGithubLink = document.getElementById('contact-github-link');
    if (contactGithubLink) {
        contactGithubLink.href = contactData.github.href;
        contactGithubLink.textContent = contactData.github.text;
    }
}

export function populateFooter(footerData, element = null) {
    const footerCopyright = element || document.getElementById('footer-copyright');
    if (footerCopyright) footerCopyright.textContent = footerData.copyright;
}

export function populateCV(cvData) {
    document.getElementById('cv-heading').textContent = cvData.title;
    document.getElementById('cv-summary').textContent = cvData.summary;

    const experienceContainer = document.getElementById('cv-experience');
    experienceContainer.innerHTML = cvData.experience.map(exp => `
        <p><strong>${exp.title}</strong> | ${exp.period}</p>
        <ul>
            ${exp.details.map(detail => `<li>${detail}</li>`).join('')}
        </ul>
    `).join('');

    const educationContainer = document.getElementById('cv-education');
    educationContainer.innerHTML = cvData.education.map(edu => `
        <p><strong>${edu.degree}</strong> | ${edu.field} | ${edu.institution} | ${edu.year}</p>
    `).join('');

    document.getElementById('cv-skills-languages').innerHTML = `<strong>Languages:</strong> ${cvData.skills.languages}`;
    document.getElementById('cv-skills-libraries').innerHTML = `<strong>Libraries & Frameworks:</strong> ${cvData.skills.librariesFrameworks}`;
    document.getElementById('cv-skills-ai-nlp').innerHTML = `<strong>AI/NLP Tools:</strong> ${cvData.skills.aiNlpTools}`;
    document.getElementById('cv-skills-tools-platforms').innerHTML = `<strong>Tools & Platforms:</strong> ${cvData.skills.toolsPlatforms}`;
    document.getElementById('cv-skills-educational').innerHTML = `<strong>Educational Skills:</strong> ${cvData.skills.educationalSkills}`;

    document.getElementById('cv-projects-intro').innerHTML = cvData.projectsSection.intro;
    const projectsListContainer = document.getElementById('cv-projects-list');
    projectsListContainer.innerHTML = cvData.projectsSection.list.map(item => `<li>${item}</li>`).join('');

    document.getElementById('cv-awards').textContent = cvData.awards;
}

