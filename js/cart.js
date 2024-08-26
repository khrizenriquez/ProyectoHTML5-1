'use strict'

const showPosition = (position) => {
    const lat = position.coords.latitude
    const lon = position.coords.longitude

    const apiKey = CONFIG.API_KEY
    const flagDiv = document.querySelector('#country-flag')
    flagDiv.innerHTML = 'Nos visitas desde <span id="loading">Cargando...</span>'

    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.statusText}`)
            }
            return response.json()
        })
        .then(data => {
            const country = data.results[0].components.country
            const countryCode = data.results[0].components.country_code.toUpperCase()

            const flagImg = document.createElement('img')
            flagImg.src = `https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`
            flagImg.alt = country
            flagImg.title = country

            flagImg.onload = () => {
                const loadingMessage = document.querySelector('#loading')
                if (loadingMessage) {
                    loadingMessage.style.display = 'none'
                }
            }

            flagDiv.appendChild(flagImg)
        })
        .catch(error => {
            console.error('Error al obtener la información de la ubicación:', error)
            flagDiv.innerHTML = 'No se pudo cargar la bandera del país.'
        })
}

const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError)
    } else {
        alert("La geolocalización no es soportada por este navegador.")
    }
}

const showError = (error) => {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("El usuario denegó la solicitud de geolocalización.")
            break
        case error.POSITION_UNAVAILABLE:
            alert("La información de la ubicación no está disponible.")
            break
        case error.TIMEOUT:
            alert("La solicitud para obtener la ubicación ha caducado.")
            break
        case error.UNKNOWN_ERROR:
            alert("Se ha producido un error desconocido.")
            break
    }
}

const updateCart = () => {
    const cartItems = JSON.parse(sessionStorage.getItem('cart')) || []
    const cartContainer = document.getElementById('cart-items')
    cartContainer.innerHTML = ''

    let total = 0

    cartItems.forEach(item => {
        const productElement = document.createElement('div')
        productElement.classList.add('cart-item')
        
        productElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
            <p>${item.name} - Q${item.price} x ${item.quantity}</p>
        `
        cartContainer.appendChild(productElement)

        total += item.price * item.quantity
    })

    const totalElement = document.createElement('p')
    totalElement.innerHTML = `Total: Q${total}`
    cartContainer.appendChild(totalElement)
}

const addToCart = (productName) => {
    let cartItems = JSON.parse(sessionStorage.getItem('cart')) || []
    const existingProductIndex = cartItems.findIndex(item => item.name === productName)

    if (existingProductIndex !== -1) {
        cartItems[existingProductIndex].quantity += 1
    } else {
        const productElement = document.querySelector(`[data-product^="${productName}"]`)
        const productData = {
            name: productName,
            price: parseFloat(productElement.dataset.product.split(' - ')[1].substring(1)),
            image: productElement.querySelector('img').src,
            quantity: 1
        }
        cartItems.push(productData)
    }

    sessionStorage.setItem('cart', JSON.stringify(cartItems))
    updateCart()
}

const getTotal = () => {
    const cartItems = JSON.parse(sessionStorage.getItem('cart')) || []
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
}

const allowDrop = (ev) => {
    ev.preventDefault()
    ev.currentTarget.classList.add('drag-over')
}

const drag = (ev) => {
    const productData = {
        name: ev.currentTarget.dataset.product.split(' - ')[0],
        price: parseFloat(ev.currentTarget.dataset.product.split(' - ')[1].substring(1)),
        image: ev.currentTarget.querySelector('img').src
    }
    ev.dataTransfer.setData("text", JSON.stringify(productData))
}

const drop = (ev) => {
    ev.preventDefault()
    ev.currentTarget.classList.remove('drag-over')
    const data = JSON.parse(ev.dataTransfer.getData("text"))
    addToCart(data.name)
}

document.addEventListener('DOMContentLoaded', getLocation)

window.onload = () => {
    updateCart()
}