// editFormRenderer.js
export function createField(label, type, path, value, isTextArea = false) {
    const wrapper = document.createElement('div');
    wrapper.className = 'field-wrapper';

    const labelElem = document.createElement('label');
    labelElem.textContent = label + ':';
    wrapper.appendChild(labelElem);

    let inputElem;
    if (isTextArea) {
        inputElem = document.createElement('textarea');
        inputElem.rows = 3; // Default rows for textareas
    } else {
        inputElem = document.createElement('input');
        inputElem.type = type;
    }
    inputElem.value = value;
    inputElem.dataset.path = path;
    wrapper.appendChild(inputElem);
    return wrapper;
}

export function createArrayItem(containerId, itemData, index, schema, getNestedValue, currentContent, renderForm) {
    // containerId is like "header-socialLinks-container"
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'array-item';
    itemDiv.dataset.index = index;

    for (const key in schema) {
        if (key === '__type' || key === '__hidden') continue;

        const fieldType = schema[key].type || 'text';
        const fieldLabel = schema[key].label || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        const fieldValue = itemData[key] !== undefined ? itemData[key] : '';
        const isTextArea = schema[key].textArea || false;

        const fieldWrapper = createField(fieldLabel, fieldType, `${containerId.replace('-container', '')}[${index}].${key}`, fieldValue, isTextArea);
        itemDiv.appendChild(fieldWrapper);
    }

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'array-item-controls';
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.type = 'button';
    
    // Fix: Use the correct array path
    const arrayPath = containerId.replace('-container', '').replace(/-/g, '.');
    
    removeButton.addEventListener('click', () => {
        const arrayRef = getNestedValue(currentContent, arrayPath);
        if (Array.isArray(arrayRef)) {
            arrayRef.splice(index, 1);
            renderForm();
        }
    });
    
    controlsDiv.appendChild(removeButton);
    itemDiv.appendChild(controlsDiv);
    container.appendChild(itemDiv);
}