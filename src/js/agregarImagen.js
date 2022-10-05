import { Dropzone } from "dropzone"

const token = document.querySelector("#DropZone").value

//Leer documentacion de dropzone. El ,imagen es del id que tiene el form en agregar-imagen.pug
Dropzone.options.imagen = {
    dictDefaultMessage: "Arrastra las imagenes aquí",
    acceptedFiles: `.png, .jpg, .jpeg`,
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: "Borrar imagen",
    dictMaxFilesExceeded: "El limite es 1 Archivos",
    headers : {
        "CSRF-Token": token
    },
    paramName: "imagen",
    init: function(){
        const dropzone = this
        const btnPublicar = document.querySelector("#publicar")

        btnPublicar.addEventListener("click", function(){
            dropzone.processQueue()
        })

        dropzone.on("queuecomplete", function(){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href = "/mis-propiedades"
            }
        })
    }
}