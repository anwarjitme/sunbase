
const jsonData = [
    {
        id: "c0ac49c5-871e-4c72-a878-251de465e6b4",
        type: "input",
        label: "Sample Label",
        placeholder: "Sample placeholder"
    },
    {
        id: "146e69c2-1630-4a27-9d0b-f09e463a66e4",
        type: "select",
        label: "Sample Label",
        options: ["Sample Option", "Sample Option", "Sample Option"]
    },
    {
        id: "45002ecf-85cf-4852-bc46-529f94a758f5",
        type: "input",
        label: "Sample Label",
        placeholder: "Sample Placeholder"
    },
    {
        id: "680cff8d-c7f9-40be-8767-e3d6ba420952",
        type: "textarea",
        label: "Sample Label",
        placeholder: "Sample Placeholder"
    },
];


const getData = () => {
    const data = localStorage.getItem('formData');
    return data ? JSON.parse(data) : jsonData;
};
let localData = getData();
// Save data to localStorage
const saveFormData = () => {
    localStorage.setItem('formData', JSON.stringify(localData));
};



const formContainer = document.getElementById('form-container');
const saveButton = document.getElementById('save-button');

function renderForm() {
    formContainer.innerHTML = null; 
    localData.forEach(data => {
        const element = document.createElement('div');
        element.className = 'form-element';
        element.setAttribute('data-id', data.id);
        element.setAttribute('draggable', 'true');

        const label = document.createElement('label');
        label.innerText = data.label;
        label.contentEditable = true; // Make label editable

        let input;
        if (data.type === 'input') {
            input = document.createElement('input');
            input.placeholder = data.placeholder;
            input.setAttribute('data-placeholder', data.placeholder); // Store original placeholder
        } else if (data.type === 'select') {
            input = document.createElement('select');

          
            data.options.forEach((option, index) => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.innerText = option;
                input.appendChild(optionElement);
            });

            // Create a container for options
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'options-container';

            // Button to add a new option
            const addOptionBtn = document.createElement('button');
            addOptionBtn.innerHTML = '<i class="fas fa-plus"></i>'; // Plus icon
            addOptionBtn.className = 'option-btn'; // Added class for styling
            addOptionBtn.onclick = () => {
                const newOption = prompt('Enter new option:');
                if (newOption) {
                    data.options.push(newOption);
                    renderForm();
                    saveFormData(); // Save changes to localStorage
                }
            };
            optionsContainer.appendChild(addOptionBtn);

          
            data.options.forEach((option, index) => {
                const optionWrapper = document.createElement('div');
                optionWrapper.className = 'option-wrapper';

                const optionInput = document.createElement('input');
                optionInput.value = option;
                optionInput.className = 'option-input';
                optionInput.oninput = () => {
                    data.options[index] = optionInput.value;
                    saveFormData(); 
                };

               
                const removeOptionBtn = document.createElement('button');
                removeOptionBtn.innerHTML = '<i class="fas fa-trash"></i>'; 
                removeOptionBtn.className = 'remove-btn';
                removeOptionBtn.onclick = () => {
                    data.options.splice(index, 1);
                    renderForm();
                    saveFormData(); 
                };

                optionWrapper.appendChild(optionInput);
                optionWrapper.appendChild(removeOptionBtn);
                optionsContainer.appendChild(optionWrapper);
            });

            element.appendChild(optionsContainer); 
        } else if (data.type === 'textarea') {
            input = document.createElement('textarea');
            input.placeholder = data.placeholder;
            input.setAttribute('data-placeholder', data.placeholder); 
        }

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; 
        deleteButton.className = 'remove-btn';
        deleteButton.onclick = () => {
            const index = localData.findIndex(item => item.id === data.id);
            localData.splice(index, 1);
            renderForm();
            saveFormData(); // Save changes to localStorage
        };

        element.appendChild(label);
        element.appendChild(input);
        element.appendChild(deleteButton);
        formContainer.appendChild(element);

        // Drag and Drop functionality
        element.addEventListener('dragstart', () => {
            element.classList.add('dragging');
        });

        element.addEventListener('dragend', () => {
            element.classList.remove('dragging');
        });

        formContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingElement = document.querySelector('.dragging');
            const drugCommon = [...formContainer.querySelectorAll('.form-element:not(.dragging)')];
            const nextSibling = drugCommon.find(el => {
                return e.clientY <= sibling.getBoundingClientRect().top + el.clientHeight / 2;
            });
            formContainer.insertBefore(draggingElement, nextSibling);
        });
    });
}


function saveForm() {
    const currentFormState = localData.map(data => {
        const element = document.querySelector(`div[data-id='${data.id}']`);
        if (!element) return null; // Skip if element is not found

        const label = element.querySelector('label');
        const input = element.querySelector('input, select, textarea');

        if (data.type === 'select') {
            const options = Array.from(input.options).map(option => option.value);
            return {
                ...data,
                label: label.innerText,
                options: options
            };
        } else {
            return {
                ...data,
                label: label.innerText,
                placeholder: input.placeholder,
                value: input.value 
            };
        }
    }).filter(item => item !== null); 

    console.log(JSON.stringify(currentFormState, null, 2));

    // Clear the form data after saving
   localData = localData.map(data => {
        return {
            ...data,
            value: undefined 
        };
    });
    
    saveFormData(); 
    renderForm(); // Re-render dom
}


document.getElementById('add-input').addEventListener('click', () => {
    const newId = 'input-' + Date.now();
    localData.push({
        id: newId,
        type: 'input',
        label: 'New Input',
        placeholder: 'Placeholder'
    });
    renderForm();
    saveFormData();
});

document.getElementById('add-select').addEventListener('click', () => {
    const newId = 'select-' + Date.now();
    localData.push({
        id: newId,
        type: 'select',
        label: 'New Select',
        options: ['Option 1', 'Option 2']
    });
    renderForm();
    saveFormData(); 
});

document.getElementById('add-textarea').addEventListener('click', () => {
    const newId = 'textarea-' + Date.now();
    localData.push({
        id: newId,
        type: 'textarea',
        label: 'New Textarea',
        placeholder: 'Placeholder'
    });
    renderForm();
    saveFormData(); 
});
saveButton.addEventListener('click', saveForm);
renderForm();
sampleData