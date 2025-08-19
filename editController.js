import { getNestedValue, setNestedValue } from "./editUtils.js";
import { createField, createArrayItem } from "./editFormRenderer.js";

// moved populateSimpleFields from editFormRenderer.js
export function populateSimpleFields(editorForm, currentContent, getNestedValue) {
    editorForm.querySelectorAll('input[type="text"], input[type="url"], textarea').forEach(input => {
        const path = input.dataset.path;
        if (path) {
            let value = getNestedValue(currentContent, path);
            if (path.endsWith('.techTags') && Array.isArray(value)) {
                value = value.join(', ');
            } else if (path.endsWith('.details') && Array.isArray(value)) {
                 value = value.join('\n'); // For CV experience details
            }
            input.value = value !== undefined ? value : '';
        }
    });
}

// moved populateArrayFields from editFormRenderer.js
export function populateArrayFields(editorForm, currentContent, schemas, createField, createArrayItem, renderForm, getNestedValue) {
    for (const arrayPath in schemas) {
        if (schemas[arrayPath].__type === 'object' || schemas[arrayPath].__type === 'string') {
            const containerId = `${arrayPath.replace(/\./g, '-')}-container`;
            const containerElem = document.getElementById(containerId);
            if (containerElem) {
                const arrayData = getNestedValue(currentContent, arrayPath);
                if (Array.isArray(arrayData)) {
                    arrayData.forEach((item, index) => {
                        if (schemas[arrayPath].__type === 'string') {
                            // Handle simple string arrays (like cv.projectsSection.list)
                            const itemDiv = document.createElement('div');
                            itemDiv.className = 'array-item';
                            itemDiv.dataset.index = index;

                            const fieldWrapper = createField('Project Name', 'text', `${arrayPath}[${index}]`, item);
                            itemDiv.appendChild(fieldWrapper);

                            const controlsDiv = document.createElement('div');
                            controlsDiv.className = 'array-item-controls';
                            const removeButton = document.createElement('button');
                            removeButton.textContent = 'Remove';
                            removeButton.type = 'button';
                            removeButton.addEventListener('click', () => {
                                const arrayRef = getNestedValue(currentContent, arrayPath);
                                if (Array.isArray(arrayRef)) {
                                    arrayRef.splice(index, 1);
                                    renderForm();
                                }
                            });
                            controlsDiv.appendChild(removeButton);
                            itemDiv.appendChild(controlsDiv);
                            containerElem.appendChild(itemDiv);

                        } else {
                            // Handle object arrays
                            createArrayItem(containerId, item, index, schemas[arrayPath], getNestedValue, currentContent, renderForm);
                        }
                    });
                }
            }
        }
    }
}

// moved collectSimpleFields from editFormRenderer.js
export function collectSimpleFields(editorForm, formData, setNestedValue) {
    editorForm.querySelectorAll('input[type="text"], input[type="url"], textarea').forEach(input => {
        const path = input.dataset.path;
        if (path) {
            let value = input.value;
            if (path.endsWith('.techTags')) {
                value = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            } else if (path.endsWith('.details')) {
                value = value.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            }
            setNestedValue(formData, path, value);
        }
    });
}

// moved collectArrayFields from editFormRenderer.js
export function collectArrayFields(editorForm, formData, schemas, setNestedValue) {
    for (const arrayPath in schemas) {
        const containerId = `${arrayPath.replace(/\./g, '-')}-container`;
        const containerElem = document.getElementById(containerId);
        if (containerElem) {
            const items = Array.from(containerElem.querySelectorAll('.array-item'));
            const newArray = [];
            items.forEach(itemDiv => {
                if (schemas[arrayPath].__type === 'string') {
                    // Simple string array
                    const input = itemDiv.querySelector('input');
                    if (input) {
                        newArray.push(input.value.trim());
                    }
                } else {
                    // Object array
                    const newItem = {};
                    itemDiv.querySelectorAll('input, textarea').forEach(input => {
                        const fieldPath = input.dataset.path;
                        if (fieldPath) {
                            const key = fieldPath.split('.').pop();
                            let value = input.value;
                            if (key === 'techTags') {
                                value = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                            } else if (key === 'details') {
                                 value = value.split('\n').map(line => line.trim()).filter(line => line.length > 0);
                            }
                            newItem[key] = value;
                        }
                    });
                    newArray.push(newItem);
                }
            });
            setNestedValue(formData, arrayPath, newArray);
        }
    }
}

export function populateForm(editorForm, currentContent, schemas, renderFormCallback) {
    // Clear existing array content
    document.querySelectorAll('[id$="-container"]').forEach(container => {
        container.innerHTML = '';
    });

    populateSimpleFields(editorForm, currentContent, getNestedValue);
    populateArrayFields(editorForm, currentContent, schemas, createField, createArrayItem, renderFormCallback, getNestedValue);
}

export function collectFormData(editorForm, originalPageContent, schemas) {
    const formData = JSON.parse(JSON.stringify(originalPageContent)); // Start with original structure

    collectSimpleFields(editorForm, formData, setNestedValue);
    collectArrayFields(editorForm, formData, schemas, setNestedValue);
    
    return formData;
}

export function addArrayItem(currentContent, arrayPath, schemas) {
    const arrayRef = getNestedValue(currentContent, arrayPath);
    if (Array.isArray(arrayRef)) {
        const newEntrySchema = schemas[arrayPath];
        let newItem;
        if (newEntrySchema.__type === 'string') {
            newItem = ''; // Empty string for simple string arrays
        } else {
            newItem = {};
            for (const key in newEntrySchema) {
                if (key === '__type' || key === '__hidden') continue;
                newItem[key] = ''; // Initialize with empty strings
            }
        }
        arrayRef.push(newItem);
    }
}

// moved displayMessage from edit.html
export function displayMessage(messageDiv, msg, type) {
    messageDiv.textContent = msg;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}