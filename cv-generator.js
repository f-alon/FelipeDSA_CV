// CV Generator Application
class CVGenerator {
    constructor() {
        this.cvData = {};
        this.init();
    }

    init() {
        this.extractDataFromHTML();
        this.setupEventListeners();
    }

    extractDataFromHTML() {
        // Extraer datos del header
        const header = document.querySelector('.header');
        if (header) {
            this.cvData.personalInfo = {
                name: header.querySelector('h1')?.textContent || '',
                email: this.extractContactInfo('Email:'),
                phone: this.extractContactInfo('Teléfono:'),
                linkedin: this.extractContactInfo('LinkedIn:'),
                github: this.extractContactInfo('GitHub:'),
                location: this.extractContactInfo('Ubicación:')
            };
        }

        // Extraer perfil profesional
        const profileSection = document.querySelector('.section');
        if (profileSection && profileSection.querySelector('.section-title')?.textContent.includes('Perfil Profesional')) {
            this.cvData.profile = profileSection.querySelector('p')?.textContent || '';
        }

        // Extraer educación
        this.cvData.education = this.extractSectionData('Educación');

        // Extraer experiencia profesional
        this.cvData.experience = this.extractSectionData('Experiencia Profesional');

        // Extraer habilidades técnicas
        this.cvData.skills = this.extractSkillsData();

        // Extraer publicaciones y proyectos
        this.cvData.publications = this.extractSectionData('Publicaciones y Proyectos');

        // Extraer certificaciones
        this.cvData.certifications = this.extractSectionData('Certificaciones');

        // Extraer idiomas
        this.cvData.languages = this.extractLanguagesData();

        // Extraer referencias
        this.cvData.references = this.extractSectionData('Referencias');
    }

    extractContactInfo(label) {
        const contactInfo = document.querySelector('.contact-info');
        if (!contactInfo) return '';

        const lines = contactInfo.querySelectorAll('p');
        for (let line of lines) {
            const text = line.textContent;
            if (text.includes(label)) {
                return text.split(label)[1]?.trim() || '';
            }
        }
        return '';
    }

    extractSectionData(sectionTitle) {
        const sections = document.querySelectorAll('.section');
        for (let section of sections) {
            const title = section.querySelector('.section-title');
            if (title && title.textContent.includes(sectionTitle)) {
                const entries = [];
                const entryElements = section.querySelectorAll('.entry');
                
                entryElements.forEach(entry => {
                    const entryData = {
                        title: entry.querySelector('.entry-title')?.textContent || '',
                        date: entry.querySelector('.entry-date')?.textContent || '',
                        subtitle: entry.querySelector('.entry-subtitle')?.textContent || '',
                        description: entry.querySelector('.entry-description')?.textContent?.trim() || ''
                    };
                    entries.push(entryData);
                });
                return entries;
            }
        }
        return [];
    }

    extractSkillsData() {
        const skillsSection = document.querySelector('.skills-grid');
        if (!skillsSection) return [];

        const skills = [];
        const skillCategories = skillsSection.querySelectorAll('.skill-category');
        
        skillCategories.forEach(category => {
            const title = category.querySelector('h4')?.textContent || '';
            const skillsText = category.querySelector('p')?.textContent || '';
            skills.push({
                category: title,
                skills: skillsText.split(',').map(s => s.trim())
            });
        });
        return skills;
    }

    extractLanguagesData() {
        const languagesSection = document.querySelector('.section');
        if (!languagesSection) return [];

        const sections = document.querySelectorAll('.section');
        for (let section of sections) {
            const title = section.querySelector('.section-title');
            if (title && title.textContent.includes('Idiomas')) {
                const languages = [];
                const languageItems = section.querySelectorAll('.entry-description p');
                
                languageItems.forEach(item => {
                    const text = item.textContent;
                    if (text.includes(':')) {
                        const [language, level] = text.split(':');
                        languages.push({
                            language: language.replace(/\*/g, '').trim(),
                            level: level.trim()
                        });
                    }
                });
                return languages;
            }
        }
        return [];
    }

    setupEventListeners() {
        const generateBtn = document.getElementById('generate-cv-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateCV());
        }
    }

    generateCV() {
        try {
            // Crear ventana nueva
            const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
            
            // Generar HTML del CV
            const cvHTML = this.generateCVHTML();
            
            // Escribir el HTML en la nueva ventana
            newWindow.document.write(cvHTML);
            newWindow.document.close();
            
            // Enfocar la nueva ventana
            newWindow.focus();
            
        } catch (error) {
            console.error('Error generando CV:', error);
            alert('Error al generar el CV. Por favor, inténtelo de nuevo.');
        }
    }

    generateCVHTML() {
        return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - ${this.cvData.personalInfo.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: bold;
        }

        .header .contact-info {
            font-size: 1.1em;
            color: #666;
        }

        .section {
            margin-bottom: 25px;
        }

        .section-title {
            font-size: 1.4em;
            font-weight: bold;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }

        .entry {
            margin-bottom: 20px;
        }

        .entry-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 5px;
        }

        .entry-title {
            font-weight: bold;
            font-size: 1.1em;
        }

        .entry-date {
            font-style: italic;
            color: #666;
        }

        .entry-subtitle {
            font-style: italic;
            color: #666;
            margin-bottom: 5px;
        }

        .entry-description {
            margin-left: 0;
            text-align: justify;
        }

        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }

        .skill-category {
            margin-bottom: 15px;
        }

        .skill-category h4 {
            font-weight: bold;
            margin-bottom: 5px;
            color: #333;
        }

        .skill-category p {
            color: #666;
            font-size: 0.95em;
        }

        .language-item {
            margin-bottom: 5px;
        }

        @media print {
            body {
                max-width: none;
                margin: 0;
                padding: 15px;
            }
            
            .section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${this.cvData.personalInfo.name}</h1>
        <div class="contact-info">
            <p>Email: ${this.cvData.personalInfo.email} | Teléfono: ${this.cvData.personalInfo.phone}</p>
            <p>LinkedIn: ${this.cvData.personalInfo.linkedin} | GitHub: ${this.cvData.personalInfo.github}</p>
            <p>Ubicación: ${this.cvData.personalInfo.location}</p>
        </div>
    </div>

    ${this.cvData.profile ? `
    <div class="section">
        <h2 class="section-title">Perfil Profesional</h2>
        <p>${this.cvData.profile}</p>
    </div>
    ` : ''}

    ${this.generateEducationHTML()}
    ${this.generateExperienceHTML()}
    ${this.generateSkillsHTML()}
    ${this.generatePublicationsHTML()}
    ${this.generateCertificationsHTML()}
    ${this.generateLanguagesHTML()}
    ${this.generateReferencesHTML()}

    <div style="text-align: center; margin-top: 40px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
        <p><strong>CV Generado automáticamente</strong> - ${new Date().toLocaleDateString('es-ES')}</p>
    </div>
</body>
</html>
        `;
    }

    generateEducationHTML() {
        if (!this.cvData.education.length) return '';
        
        let html = '<div class="section"><h2 class="section-title">Educación</h2>';
        
        this.cvData.education.forEach(entry => {
            html += `
            <div class="entry">
                <div class="entry-header">
                    <div class="entry-title">${entry.title}</div>
                    <div class="entry-date">${entry.date}</div>
                </div>
                <div class="entry-subtitle">${entry.subtitle}</div>
                <div class="entry-description">
                    <p>${entry.description}</p>
                </div>
            </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    generateExperienceHTML() {
        if (!this.cvData.experience.length) return '';
        
        let html = '<div class="section"><h2 class="section-title">Experiencia Profesional</h2>';
        
        this.cvData.experience.forEach(entry => {
            html += `
            <div class="entry">
                <div class="entry-header">
                    <div class="entry-title">${entry.title}</div>
                    <div class="entry-date">${entry.date}</div>
                </div>
                <div class="entry-subtitle">${entry.subtitle}</div>
                <div class="entry-description">
                    <p>${entry.description}</p>
                </div>
            </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    generateSkillsHTML() {
        if (!this.cvData.skills.length) return '';
        
        let html = '<div class="section"><h2 class="section-title">Habilidades Técnicas</h2><div class="skills-grid">';
        
        this.cvData.skills.forEach(skill => {
            html += `
            <div class="skill-category">
                <h4>${skill.category}</h4>
                <p>${skill.skills.join(', ')}</p>
            </div>
            `;
        });
        
        html += '</div></div>';
        return html;
    }

    generatePublicationsHTML() {
        if (!this.cvData.publications.length) return '';
        
        let html = '<div class="section"><h2 class="section-title">Publicaciones y Proyectos</h2>';
        
        this.cvData.publications.forEach(entry => {
            html += `
            <div class="entry">
                <div class="entry-header">
                    <div class="entry-title">${entry.title}</div>
                    <div class="entry-date">${entry.date}</div>
                </div>
                <div class="entry-subtitle">${entry.subtitle}</div>
                <div class="entry-description">
                    <p>${entry.description}</p>
                </div>
            </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    generateCertificationsHTML() {
        if (!this.cvData.certifications.length) return '';
        
        let html = '<div class="section"><h2 class="section-title">Certificaciones</h2>';
        
        this.cvData.certifications.forEach(entry => {
            html += `
            <div class="entry">
                <div class="entry-header">
                    <div class="entry-title">${entry.title}</div>
                    <div class="entry-date">${entry.date}</div>
                </div>
                <div class="entry-subtitle">${entry.subtitle}</div>
            </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    generateLanguagesHTML() {
        if (!this.cvData.languages.length) return '';
        
        let html = '<div class="section"><h2 class="section-title">Idiomas</h2><div class="entry-description">';
        
        this.cvData.languages.forEach(lang => {
            html += `<p><strong>${lang.language}:</strong> ${lang.level}</p>`;
        });
        
        html += '</div></div>';
        return html;
    }

    generateReferencesHTML() {
        if (!this.cvData.references.length) return '';
        
        let html = '<div class="section"><h2 class="section-title">Referencias</h2><div class="entry-description">';
        
        this.cvData.references.forEach(ref => {
            html += `<p>${ref.description}</p>`;
        });
        
        html += '</div></div>';
        return html;
    }
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new CVGenerator();
});
