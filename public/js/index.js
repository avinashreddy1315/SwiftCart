

window.onload= bodyload

let cart_length = 0;


async function bodyload() {
    getcatgories();
    ran = randomNumber();
    const storedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    storedCartItems.map(item =>{
        cart_length = cart_length + item.qty;
    })
    //cart_length = storedCartItems.length;
    
    shopping_cart.setAttribute('data-product-count', cart_length);

}

/*Random Number generator for new products */
function randomNumber() {
    return Math.floor(Math.random() * 5);
}

let ran;






/* is to get categorie name form api */
function getcatgories() {
    fetch("https://dummyjson.com/products/categories")
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data[0].name);
            data.map(categorie =>
                Promise.all([displayCategories(categorie.name), new_arrival(categorie.name)])

            )
        })
}




/* to display categories card  */
function displayCategories(url) {
    fetch(`https://dummyjson.com/products/category/${url}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var card = document.createElement("div");
            card.className = "category_card cat_card"
            card.innerHTML = `
            
            <div class="category_card_hedaer">
            
            <img class="category_card_img" src="${data.products[1].thumbnail}">
            </div>
            <div class="category_card_footer">
            <button  onclick = "show_category(event)" value="${data.products[1].category}" class="category_card_btn btn btn-primary mt-2">${data.products[1].category}</button>
            </div>
        `;
            document.getElementById("category-container").appendChild(card);
        })

        
}




/* onclick event on category card to get the category related items */
function show_category(event) {
    
        console.log(event.currentTarget.value)
        window.location.href=`../../public/html/shop.html?buttonvalue= ${event.currentTarget.value}`;
        
}



/*function is to show the new products */
function new_arrival(newproduct) {
    fetch(`https://dummyjson.com/products/category/${newproduct}`)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            let ran = randomNumber()

            var card = document.createElement("div");
            card.className = "new_arrival_products_card";
            card.id = data.products[ran].id;
            card.addEventListener("click", function(event){
                if (!event.target.closest('.add_to_cart_btn')) {
                    
                    window.location.href=`../../public/html/single_product.html?productId=${event.currentTarget.id}`;
                }
            });
            card.innerHTML = `
            
            <div class="card-header" >
                        
                        <img id="card_img" class="card-img-top" src=${data.products[ran].thumbnail} height="200">
                        <button class="btn_new"><span class="ribbon">NEW</span></button>
                    </div>
                    <div class="description card-body">
                        <span>${data.products[ran].brand ? data.products[ran].brand : 'SwiftCart' }</span>
                        <h5>${data.products[ran].title.slice(0, 25)}</h5>
                        <div class="description desc">
                            <div class="stars-outer">
                                <div class="stars-inner">

                                </div>
                            <span class="number-rating">${data.products[ran].rating}</span>
                            </div>
                            <h4>$${data.products[ran].price}</h4>
                        </div>
                        
                    </div>
                    <div class="card_footer">
                        <button id="${data.products[ran].id}"  onclick = "flyanimation_image(event); add_to_cart(${data.products[ran].id}); event.stopPropagation();" class="add_to_cart_btn">
                            <span class="bi bi-cart-plus"></span>
                        </button>
                    </div>
        `;
            document.getElementById("new_arrival_products_cards").appendChild(card);
        })
}



function flyanimation_image(e, id){
    let product_count = Number(shopping_cart.getAttribute('data-product-count')) || 0;
    //shopping_cart.setAttribute('data-product-count', product_count+1);
    shopping_cart.classList.add('active');
    //getting parent node of the button
    let target_parent = e.currentTarget.parentNode.parentNode;
    target_parent.style.zIndex ='100';
    let img = target_parent.querySelector('img');

    //creating the clone of the same image
    let flying_image = img.cloneNode();
    flying_image.removeAttribute('id');
    flying_image.classList.add('flying_image');
    target_parent.appendChild(flying_image);

    const flying_image_pos = flying_image.getBoundingClientRect();
    const shopping_cart_pos = shopping_cart.getBoundingClientRect();


    let data = {
        left : shopping_cart_pos.left - (shopping_cart_pos.width /2 + flying_image_pos.left + flying_image_pos.width / 2),
        top : shopping_cart_pos.bottom - flying_image_pos.bottom + 30
    }

    
    

    flying_image.style.cssText = `
        --left : ${data.left.toFixed(2)}px;
        --top : ${data.top.toFixed(2)}px;
    `
    
    setTimeout(()=>{
        target_parent.style.zIndex = "";
        target_parent.removeChild(flying_image)
        shopping_cart.classList.remove('active');
    }, 1000)

    
}




const total_stars = 5;

function get_rating(){
    const star_percentage = (4.7/total_stars) * 100;
    const star_percentage_round = `${(star_percentage/10)*10}%`;
    document.querySelector(".stars-inner").style.width = '20%';
}



// is to show menu in small devices
function showmenu() {
    document.getElementById("navbar").style.right = "0px";
}

//is to close the menu in small devices
function closemenu() {
    document.getElementById("navbar").style.right = "-400px"
}

const shopping_cart = document.querySelector('.shopping_cart');




function add_to_cart(id){
    let xyz = true
    const storedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    if(storedCartItems.length == 0){
        push_to_cart(id);
        return;
    }
    else{
        for(let i = 0; i < storedCartItems.length; i++){
            const item = storedCartItems[i];
            if(item.id == id){
                item.qty += 1;
                xyz = false;
            }
        }
        if(xyz){
        push_to_cart(id);
        return;
        }
    }

    sessionStorage.setItem('cartItems', JSON.stringify(storedCartItems)); // Add this line to store the updated cart items
    cart_length = 0;
    storedCartItems.map(item =>{
        cart_length = cart_length + item.qty;
    })
    shopping_cart.setAttribute('data-product-count', cart_length);
    
}

function push_to_cart(id){
    let url = `https://dummyjson.com/products/${id}`;
    
    fetch(url)
     .then(function (response) {
        return response.json();
    })
    .then(function(data){
        const product = data;
        product.qty = 1;
        // Retrieve the current cart items from sessionStorage
        let cartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];

        // Add the product ID to the cartItems array
        cartItems.push(product);

        // Update the cart items in sessionStorage
     sessionStorage.setItem('cartItems', JSON.stringify(cartItems));

     
    const storedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    cart_length = 0;
    storedCartItems.map(item =>{
        cart_length = cart_length + item.qty;
    })
    shopping_cart.setAttribute('data-product-count', cart_length);
    

     
    })
    

    
}









