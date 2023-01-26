// variables 
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// eventos 
eventListener();
function eventListener(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    /* formulario.addEventListener('submit', agregarGasto); */
    formulario.addEventListener('submit', agregarGasto);
}

// clases
class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }
    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;

        console.log(this.restante)
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}


class UI{
 
   insertarPresupuesto(cantidad){
    // extraer el valor
    const {presupuesto, restante} = cantidad;
    // agregar al html
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;

  }

    imprimirAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');
        
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //mensaje de error
        divMensaje.textContent = mensaje;

        // insertar en el html
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        // quitar el html
        setTimeout(() => {
            divMensaje.remove();
        } , 3000);    
    }
    mostrarGastos(gastos){

        this.limpiarHTML();

        // iterar sobre los gastos
        gastos.forEach(gasto => {
            const {nombre, cantidad, id} = gasto;
            // Crear LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            // agregar el html del gasto
            nuevoGasto.innerHTML = `
                ${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>
            
            `;

            // boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            nuevoGasto.appendChild(btnBorrar);
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }

            // agregar al html
            gastoListado.appendChild(nuevoGasto);
        });
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        // comprobar 25
        if((presupuesto / 4) > restante){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        }

        // comprobar 50
        else if((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
            
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // si el total es 0 o menor
        if(restante <= 0){
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}
const ui = new UI();
let presupuesto;

// funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }

    // presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);  
    console.log(presupuesto);

    // se pasa el objeto completo de presupuesto
    ui.insertarPresupuesto(presupuesto);
}

// añade gastos

function agregarGasto(e){
  e.preventDefault();

  // leer los datos del formulario
  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);

  // Validar
  if (nombre === '' || cantidad === ''){
      ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
      return;
  } else if (cantidad <= 0 || isNaN(cantidad)){
      ui.imprimirAlerta('Cantidad no valida', 'error');
  }
  // mensaje de todo bien
    ui.imprimirAlerta('Gasto agregado correctamente');


  // generar un objeto con el gasto
    const gasto = {nombre, cantidad, id: Date.now()}
    // aañadir un nuevo gasto
    presupuesto.nuevoGasto(gasto)

    // imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    // Reinicia el formulario
    formulario.reset();
}

// eliminar gasto

function eliminarGasto(id){
    // eliminar gasto del objeto
    presupuesto.eliminarGasto(id);
    // eliminar los gastos del html
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
 }