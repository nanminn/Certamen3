import { getAll, remove, save, selectOne, update } from "./firestore.js"
let id = ''
//addEventListener permite invocar eventos(click,change,blur)
document.getElementById('btnSave').addEventListener('click', () => {
    //sirve para validar los campos 
    document.querySelectorAll('.form-control').forEach(item => {
        verificar(item.id)
    })
    if (document.querySelectorAll('.is-invalid').length == 0) {
        const personajes = {
            vía: document.getElementById('vía').value,
            nom: document.getElementById('nombre').value,
            ele: document.getElementById('elemento').value,
            fecha: document.getElementById('fecha').value,
            col: document.getElementById('color').value,
            res: document.getElementById('residencia').value,
            arma: document.getElementById('arma').value
        }
        //si el id es vacio se guarda
        if(id == ''){            
            Swal.fire({
                title: '¿Quieres guardar?',
                icon: 'question',
                showDenyButton: true,
                confirmButtonText: 'Guardar',
                denyButtonText: "No Guardar",
                }).then((result) => {
                if (result.isConfirmed) {
                    save(personajes)
                Swal.fire('Guardado!', '', 'success')
                $('a[id^="saveButton"]').click();
                }
                })
        }
        else{
            update(id,personajes)
            Swal.fire({
                title: '¡Actualizado!',
                text: 'Los datos del personajes han sido actualizados',
                icon: 'success'
            })
        }
        limpiar()
        id = ''        
    }
})
//DOMContentLoaded es un vento que se activa al recargar la página web
window.addEventListener('DOMContentLoaded', () => {
    //getAll es la función que recibe la colección de datos
    getAll(datos => {
        let tabla = ''
        //recorriendo la colección, para mostrar uno a uno los documentos en la tabla
        datos.forEach(doc => {
            //asigna el documento a la variable item(los valores están en data())
            const item = doc.data()
            tabla += `<tr>
                <td>${item.vía}</td>
                <td>${item.nom}</td>
                <td>${item.ele}</td>
                <td>${item.fecha}</td>
                <td>${item.col}</td>
                <td>${item.res}</td>
                <td>${item.arma}</td>
                <td nowrap>
                    <input type="button" class="btn btn-danger" value="Eliminar" 
                    id="${doc.id}">
                    <input type="button" class="btn btn-warning" value="Editar"
                        id="${doc.id}">
                </td>
            </tr>`
        })
        document.getElementById('contenido').innerHTML = tabla
        //recorrer todos los botones eliminar
        document.querySelectorAll('.btn-danger').forEach(btn => {
            //indentificar a que botón se le hizo click
            btn.addEventListener('click', () => {
                Swal.fire({
                    title: "¿Está seguro de eliminar el registro?",
                    text: "No podrá revertir los cambios",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Eliminar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        //invocar a la función que permite eliminar un documento según su id
                        remove(btn.id)
                        Swal.fire({
                            title: "Eliminado!",
                            text: "Su registro ha sido eliminado",
                            icon: "success"
                        })
                    }
                })
            })
        })
        //recorrer todos los botones editar 
        document.querySelectorAll('.btn-warning').forEach(btn => {
            //indentificmos a que botón se le hizo click 
            //asyn y await permite que la función espera en segundo plano la respuesta
            btn.addEventListener('click',async()=>{
                //invocamos a la función que retornar el documento seleccionado
                const per= await selectOne(btn.id)
                //accedemos a los datos del documento
                const e = per.data()
                //asignar los datos del documento a los input
                document.getElementById('vía').value = e.vía
                document.getElementById('nombre').value = e.nom
                document.getElementById('elemento').value = e.ele
                document.getElementById('fecha').value = e.fecha
                document.getElementById('color').value = e.col
                document.getElementById('residencia').value = e.res
                document.getElementById('arma').value = e.arma
                //dejar vía de solo lectura
                document.getElementById('vía').readOnly = true
                //guardar por editar
                document.getElementById('btnSave').value = 'Editar'
                //se asigna el id del documento seleccionado a la variable
                id = per.id
            })
        })
    })
})