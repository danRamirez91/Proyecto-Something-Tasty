 
 const cards = document.getElementById('cards')
 const items = document.getElementById('items')
 const footer = document.getElementById('footer')
 const templateCard = document.getElementById('template-card').content
 const templateFooter = document.getElementById('template-footer').content
 const templateCarrito = document.getElementById('template-carrito').content
 
 const fragment = document.createDocumentFragment()
 let carrito = {}
 
 
 document.addEventListener('DOMContentLoaded', () => {
     fetchData()                                                        //Metodo que espera a que se lea el documento Html y despues se ejecuta
     if(localStorage.getItem('carrito')){
         carrito = JSON.parse(localStorage.getItem('carrito'))
         pintarCarrito()
     }
 })
 cards.addEventListener('click', e => {
     addCarrito(e)
 })

 items.addEventListener('click', e => {
     btnAccion(e)
 })
 
 //Método para recuperar información desde el archivo json de los productos, método async para hacer uso de await y esperar los datos del json.
 const fetchData = async () => {
     try{
        const res = await fetch('datos.json')
        const data = await res.json()
        pintarCards(data)
    }catch(error){}
 }

 const pintarCards = data => {    //Esta funcion se utiliza para llenar el componente Items con las cards, dependd
    data.forEach(producto => {
        templateCard.querySelector('h4').textContent = producto.title
        templateCard.querySelector('h5').textContent = producto.descripcion
        templateCard.querySelector('p').textContent =  producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.img)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}
// 
const addCarrito = e =>{
    //console.log(e.target)
    //console.log(e.target.classList.contains('btn-dark'))
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)

    }
    e.stopPropagation()
}

setCarrito = item => {
    //console.log(objeto)
    const producto = {
        id: item.querySelector('.btn-dark').dataset.id,
        title: item.querySelector('h4').textContent,
        precio: item.querySelector('p').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
       producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    pintarCarrito()
}
    //Funcion para mostrar los productos que son parte del carrito e irlos acomodando en la tabla,
    // tambien se utiliza para actualizar los datos cada vez que existe un cambio en el objeto carrito.
const pintarCarrito = () => {
    console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id 
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        

        const clone = templateCarrito.cloneNode(true) 
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}
 
    // Funcion que genera el footer donde se muestran los totales de productos y total de precio 
const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - No ha seleccionado productos!</th>'      
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc,{cantidad,precio}) => acc + cantidad * precio ,0) 
    
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
     fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()     
    })

}

//función que toma el evento de click como parametro para realizar el aumento o la disminución de cantidades
const btnAccion = e => {
    //Condicion para aumentar la cantidad al ser presionado el boton de +
    if(e.target.classList.contains('btn-info')){
        console.log(carrito[e.target.dataset.id])
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++                                  //Se aumenta en 1 la cantidad 
        carrito[e.target.dataset.id] = {...producto}         //
        pintarCarrito()
    }
    //Condición para disminuir la cantidad al presionar el botón de -
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        //Condición 
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}
