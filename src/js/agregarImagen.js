import { Dropzone } from "dropzone";

const token = document.querySelector("#DropZone").value;

//Leer documentacion de dropzone. El ,imagen es del id que tiene el form en agregar-imagen.pug
Dropzone.options.imagen = {
  dictDefaultMessage: "Arrastra las imagenes aquí",
  acceptedFiles: `.png, .jpg, .jpeg`,
  maxFilesize: 5,   //* 5mb 
  maxFiles: 1,      //* cantidad max de archivos
  parallelUploads: 1,   //* se pone lo mismo q en maxFiles
  autoProcessQueue: false, //* Para que no se suba de forma automatica
  addRemoveLinks: true, //* Agrega un enlace para eliminar la imagen
  dictRemoveFile: "Borrar imagen",
  dictMaxFilesExceeded: "El limite es 1 Archivos",  //* Para que no salga el msg por default en ingles
  headers: {
    "CSRF-Token": token,
  },
  paramName: "imagen",
  init: function () {
    const dropzone = this;
    const btnPublicar = document.querySelector("#publicar");

    btnPublicar.addEventListener("click", function () {
      dropzone.processQueue();
    });

    dropzone.on("queuecomplete", function () {
      if (dropzone.getActiveFiles().length == 0) {
        window.location.href = "/mis-propiedades";
      }
    });
  },
};
