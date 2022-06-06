 
 const items = document.getElementById('items')
 const templateCard = document.getElementById('template-card').content
 const fragment = document.createDocumentFragment()
 
 
 document.addEventListener('DOMContentLoaded', () => {
     fetchData()
 })
 
 const fetchData = async () => {
     try{
        const res = await fetch('datos.json')
        const data = await res.json()
        pintarCards(data)
    }catch(error){}
 }

 const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector('h4').textContent = producto.title
        templateCard.querySelector('h5').textContent = producto.descripcion
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.img)

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
}