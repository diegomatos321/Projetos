window.addEventListener("DOMContentLoaded", init);

function init()
{
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");
  let isDragSupported = true;
  
  if (!('draggable' in dropZone) || !('ondragstart' in dropZone && 'ondrop' in dropZone))
  {
    alert("Não há suporte para Drag");
    isDragSupported = false;
  }

  if (isDragSupported)
  {
    handleDragFor(dropZone);
  }

  fileInput.addEventListener("change", handleFileSelect);
}

function handleFileSelect(event)
{
  const files = event.target.files;
  readFilesAndInsertIntoDOM(files);
}

function handleDragFor(element)
{
  element.addEventListener("drop", handleDrop);
  element.addEventListener("dragover", handleDragOver);
  element.addEventListener("dragenter", handleDragEnter);
  element.addEventListener("dragleave", handleDragLeave);
}

function handleDrop(event)
{
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";

  const files = event.dataTransfer.files;
  readFilesAndInsertIntoDOM(files);
}

function readFilesAndInsertIntoDOM(files)
{
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    insertFileIntoDOM(file);
  }
}

async function insertFileIntoDOM(file)
{
  const listaArquivos = document.getElementById("lista-arquivos");

  const arquivo = document.createElement("li");
  arquivo.setAttribute("id", `arquivo-${file.name}`);
  arquivo.classList.add("arquivo");

  const previewArquivo = document.createElement("div");
  previewArquivo.classList.add("preview-arquivo");

  const imgPreview = document.createElement("img");
  imgPreview.setAttribute("width", "121");
  imgPreview.classList.add("img-preview");
  imgPreview.setAttribute("src", "image-placeholder.png");

  if (file.type.match('image.*')) {
    try 
    {
      const image = await readImageFrom(file);

      imgPreview.setAttribute("src", image);
    } 
    catch (error) 
    {
      console.error(error);
    }
  }
  
  imgPreview.setAttribute("alt", file.name);
  previewArquivo.appendChild(imgPreview);

  const fileNamePreview = document.createElement("p");
  fileNamePreview.textContent = file.name;
  previewArquivo.appendChild(fileNamePreview);

  const progressPreview = document.createElement("progress");
  progressPreview.setAttribute("value", "1");
  progressPreview.setAttribute("max", "100");
  previewArquivo.appendChild(progressPreview);

  arquivo.appendChild(previewArquivo);
  listaArquivos.appendChild(arquivo);
}

function readImageFrom(file)
{
  const image = new Promise(readImage);

  function readImage(resolve, reject)
  {
    let reader = new FileReader();

    reader.addEventListener("load", (event) => resolve(event.target.result));
    reader.addEventListener("error", (event) => reject(reader.error));
  
    reader.readAsDataURL(file);  
  }

  return image;
}

function handleDragOver(event)
{
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";

  writeOnElement("file-label", "Solte aqui !");
}

function handleDragLeave(event) 
{
  console.log("drag leave");

  writeOnElement("file-label", "<strong>Escolha os arquivos</strong> ou solte-os aqui.");
}

function handleDragEnter(event) 
{
  console.log("Drag enter");

  writeOnElement("file-label", "Solte aqui !");
}

function writeOnElement(id, content)
{
  const element = document.getElementById(id);

  if (element.innerHTML === content) return
  element.innerHTML = content;
}