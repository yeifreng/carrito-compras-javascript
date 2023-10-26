
const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();

let carrito = {};

document.addEventListener('DOMContentLoaded', cargar);

function cargar(){

    fetch(url);

    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        mostrarCarrito();
    }

}


cards.addEventListener('click', addCarrito);

items.addEventListener('click', btnAccion);

const url = "api.json"

fetch(url) 
.then(response => response.json())
.then(data => mostrarDatos(data))

.catch( error => console.log(error) )



//funcion para mostrar los datos de la api 

function mostrarDatos(data){
for(i in data){

    templateCard.querySelector('h5').textContent = data[i].title;
    templateCard.querySelector('p').textContent = data[i].precio;
    templateCard.querySelector('img').setAttribute("src", data[i].thumbnailUrl);
    templateCard.querySelector('.btn-dark').dataset.id = data[i].id;


    const clone = templateCard.cloneNode(true)

    fragment.appendChild(clone)
    
}
cards.appendChild(fragment);

//console.log(data)

}


//funcion para agregar la informacion al carrito de compras

function addCarrito(e){

    //console.log(e.target);
    //console.log(e.target.classList.contains('btn-dark'))
    //si hago click sobre un elemento y ese elemento contiene la clase btn-dark, me hace lo siguiente
    if (e.target.classList.contains('btn-dark')) {

        setCarrito(e.target.parentElement)
        
    }

    e.stopPropagation();
}

function btnAccion(e){

    if (e.target.classList.contains('btn-info')) {

        console.log(carrito[e.target.dataset.id])

        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto};

        mostrarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {

        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id];
        }

        mostrarCarrito()
    }
    
    e.stopPropagation();
}

function setCarrito(objeto){
    const producto = {

        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    //Si en el carrito ya existe el producto seleccionado
    if (carrito.hasOwnProperty(producto.id)) {
        //tomamos el producto y le modificamos solo la propiedad cantidad, agregandole uno mas
        producto.cantidad = carrito[producto.id].cantidad + 1;
    }

    carrito[producto.id] = {...producto}
    mostrarCarrito();
    //console.log(carrito);

}

function mostrarCarrito(){

    items.innerHTML = '';

    for(productos in carrito){

        templateCarrito.querySelector('th').textContent = carrito[productos].id;
        templateCarrito.querySelectorAll('td')[0].textContent = carrito[productos].title;
        templateCarrito.querySelectorAll('td')[1].textContent = carrito[productos].cantidad;
        templateCarrito.querySelectorAll('td')[2].textContent = carrito[productos].precio;
        templateCarrito.querySelector('.btn-info').dataset.id = carrito[productos].id;
        templateCarrito.querySelector('.btn-danger').dataset.id = carrito[productos].id;
        templateCarrito.querySelector('span').textContent = carrito[productos].cantidad * carrito[productos].precio;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);
    }

    items.appendChild(fragment);

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito));

}

function pintarFooter(){

    footer.innerHTML = '';
    if (Object.keys(carrito).length === 0) {

        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`

        return
    }

 // sumar cantidad y sumar totales
 const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
 const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)

 //const nCantidad = Object.values(carrito).reduce(ncantidad, 0);
 //function ncantidad(acc, {cantidad}){
 //    return acc + cantidad;    
 //}

 //const nPrecio = Object.values(carrito).reduce(nprecio,0);
 //function nprecio(acc, {cantidad, precio}){
 //    return acc + cantidad*precio;    
 //}

 templateFooter.querySelectorAll('td')[0].textContent = nCantidad
 templateFooter.querySelector('span').textContent = nPrecio

 const clone = templateFooter.cloneNode(true)
 fragment.appendChild(clone)

 footer.appendChild(fragment)

 const btnVaciar = document.getElementById('vaciar-carrito');

 btnVaciar.addEventListener('click', vaciar);

 function vaciar(){

    carrito = {}

    mostrarCarrito()

 }
   

}