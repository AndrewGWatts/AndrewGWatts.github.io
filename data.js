<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CMS Admin</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
  <style>
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #0d1117;
        color: #c9d1d9;
        margin: 0;
        padding: 0;
        line-height: 1.6;
        overflow-x: hidden;
    }
    .container {
        max-width: 960px;
        margin: 0 auto;
        padding: 20px;
    }
    section {
        background-color: #161b22;
        margin-bottom: 2rem;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    h2 { color: #f0f6fc; border-bottom: 2px solid #444; padding-bottom: 0.75rem; margin-bottom: 1.5rem; }
    .item { border: 1px solid #30363d; padding: 1rem; margin-bottom: 1rem; border-radius: 6px; position: relative; background-color: #21262d; }
    label { display: block; margin: 5px 0 2px; color: #58a6ff; }
    input, textarea, select { width: 100%; padding: 5px; margin-bottom: 10px; background-color: #0d1117; border: 1px solid #30363d; border-radius: 4px; color: #c9d1d9; }
    textarea { resize: vertical; min-height: 50px; }
    button { margin-top: 10px; padding: 8px 15px; border-radius: 6px; cursor: pointer; border: none; }
    .delete-btn { position: absolute; top: 10px; right: 10px; background: #f44336; color: white; }
    .add-btn { background: #238636; color: white; margin-bottom: 20px; }
    .preview-img { max-width: 100px; margin-top: 5px; border-radius: 4px; }
    .icon-preview { margin-top: 5px; font-size: 1.5rem; }
    .icon-picker { margin-bottom: 10px; }
  </style>
</head>
<body>
<div class="container">
<h1 contenteditable="true">Admin CMS</h1>
<input type="file" id="fileInput" accept=".js">
<button onclick="exportData()">Export Updated data.js</button>

<div id="editor"></div>
</div>

<script>
const faIcons = [
  'fas fa-clock','fas fa-brain','fas fa-code-branch','fas fa-gamepad','fas fa-globe','fas fa-palette','fas fa-rocket','fas fa-comments','fas fa-keyboard','fas fa-chalkboard','fas fa-code','fas fa-graduation-cap','fas fa-book-open','fas fa-star','fas fa-book','fas fa-chalkboard-teacher','fas fa-atlas','fas fa-laptop-code','fas fa-user-cog','fas fa-store','fas fa-tv','fas fa-desktop','fas fa-mobile-alt','fas fa-cogs','fas fa-magic','fas fa-film','fas fa-microphone','fas fa-external-link-alt','fab fa-github'
];

let data = {};

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const text = await file.text();
    const cleaned = text.replace(/export const /g, '');
    data = {};
    eval(cleaned);
    renderEditor();
  }
});

function renderEditor() {
  const container = document.getElementById('editor');
  container.innerHTML = '';
  for (const key in data) {
    const section = document.createElement('section');
    const sectionTitle = document.createElement('h2');
    sectionTitle.contentEditable = true;
    sectionTitle.innerText = key;
    sectionTitle.addEventListener('input', () => {
      const newKey = sectionTitle.innerText;
      if (newKey !== key) {
        data[newKey] = data[key];
        delete data[key];
        renderEditor();
      }
    });

    const addButton = document.createElement('button');
    addButton.classList.add('add-btn');
    addButton.innerText = 'Add New Item';
    addButton.onclick = () => addItem(sectionTitle.innerText);

    section.appendChild(sectionTitle);
    section.appendChild(addButton);

    if(Array.isArray(data[key])){
      data[key].forEach((item, idx) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = () => deleteItem(key, idx);
        itemDiv.appendChild(deleteBtn);

        for (const field in item) {
          const label = document.createElement('label');
          label.innerText = field;
          let input;
          if(['description','links','title','imgAlt','imgSrc'].includes(field)){
            input = document.createElement('textarea');
          } else if(field==='techTags'){
            input = document.createElement('input');
          } else if(field==='iconClass'){
            input = document.createElement('select');
            input.classList.add('icon-picker');
            faIcons.forEach(icon => {
              const option = document.createElement('option');
              option.value = icon;
              option.text = icon;
              if(icon === item[field]) option.selected = true;
              input.appendChild(option);
            });
          } else {
            input = document.createElement('input');
          }

          input.value = Array.isArray(item[field]) ? item[field].join(', ') : item[field];
          input.dataset.section = key;
          input.dataset.index = idx;
          input.dataset.field = field;
          input.addEventListener('input', (e)=>{
            let value = e.target.value;
            if(field==='techTags') value=value.split(',').map(t=>t.trim());
            item[field] = value;
            if(field==='imgSrc') imgPreview.src=value;
            if(field==='iconClass') iconPreview.className=value;
          });

          itemDiv.appendChild(label);
          itemDiv.appendChild(input);

          if(field==='imgSrc'){
            var imgPreview=document.createElement('img');
            imgPreview.src=item[field];
            imgPreview.classList.add('preview-img');
            itemDiv.appendChild(imgPreview);
          }

          if(field==='iconClass'){
            var iconPreview=document.createElement('i');
            iconPreview.className=item[field];
            iconPreview.classList.add('icon-preview');
            itemDiv.appendChild(iconPreview);
          }

          if(field==='links'){
            item.links.forEach((linkObj, linkIdx)=>{
              const linkDiv = document.createElement('div');
              const linkTextLabel = document.createElement('label');
              linkTextLabel.innerText='Link Text';
              const linkTextInput=document.createElement('input');
              linkTextInput.value=linkObj.text;
              linkTextInput.addEventListener('input',e=>linkObj.text=e.target.value);

              const linkUrlLabel=document.createElement('label');
              linkUrlLabel.innerText='Link URL';
              const linkUrlInput=document.createElement('input');
              linkUrlInput.value=linkObj.url;
              linkUrlInput.addEventListener('input',e=>linkObj.url=e.target.value);

              const linkIconLabel=document.createElement('label');
              linkIconLabel.innerText='Link Icon';
              const linkIconSelect=document.createElement('select');
              faIcons.forEach(icon=>{
                const option=document.createElement('option');
                option.value=icon;
                option.text=icon;
                if(icon===linkObj.icon) option.selected=true;
                linkIconSelect.appendChild(option);
              });
              linkIconSelect.addEventListener('input',e=>linkObj.icon=e.target.value);

              linkDiv.appendChild(linkTextLabel);
              linkDiv.appendChild(linkTextInput);
              linkDiv.appendChild(linkUrlLabel);
              linkDiv.appendChild(linkUrlInput);
              linkDiv.appendChild(linkIconLabel);
              linkDiv.appendChild(linkIconSelect);

              itemDiv.appendChild(linkDiv);
            });
            const addLinkBtn=document.createElement('button');
            addLinkBtn.classList.add('add-btn');
            addLinkBtn.innerText='Add Link';
            addLinkBtn.onclick=()=>{item.links.push({text:'',url:'',icon:'fas fa-external-link-alt'}); renderEditor();};
            itemDiv.appendChild(addLinkBtn);
          }
        }
        section.appendChild(itemDiv);
      });
    }
    container.appendChild(section);
  }
}

function addItem(section){
  const sample={};
  if(Array.isArray(data[section]) && data[section].length>0){
    const first=data[section][0];
    for(const field in first) sample[field]=Array.isArray(first[field])?[]:'';
  }
  if(Array.isArray(data[section])) data[section].push(sample);
  renderEditor();
}

function deleteItem(section,idx){
  if(Array.isArray(data[section])) data[section].splice(idx,1);
  renderEditor();
}

function exportData(){
  let output='';
  for(const key in data){
    output+=`export const ${key} = ${JSON.stringify(data[key],null,4)};

`;
  }
  const blob=new Blob([output],{type:'text/javascript'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='data.js';
  a.click();
  URL.revokeObjectURL(url);
}
</script>

</body>
</html>
