const urlParams = new URLSearchParams(window.location.search);
let  productId = urlParams.get('productId');
/*let productId_from_shop = urlParams.get('productId_from_shop');*/

/*let productId_from_cart = urlParams.get('productId_from_cart');*/





let z;
let url;
const shopping_cart = document.querySelector('.shopping_cart');

let cart_length = 0;

function bodyload(){
    const storedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    storedCartItems.map(item =>{
        cart_length = cart_length + item.qty;
    })
    //cart_length = storedCartItems.length;
    console.log("cart length:-", cart_length);
    shopping_cart.setAttribute('data-product-count', cart_length);

    /*if(productId_from_shop != null){
        productId = productId_from_shop
    }*/
    
    if(productId != null){
        productId = productId.replace(/\s+/g, '');
        url = `https://dummyjson.com/products/${productId}`
        show_single_product(url, productId);
    }

    
    
    
}



async function show_single_product(url, product_id){
    z = true;
    const storedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    let id = parseInt(product_id);
    for(let i = 0; i < storedCartItems.length; i++){
        const item = storedCartItems[i];
        if(item.id == id){
           z = false;
        }
    }
    
    console.log(url, id);

    await fetch(url)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            show_category_product(data.category);
            var single_product = document.getElementById("Product_Details");
            single_product.innerHTML = `
            <div class="single_product_image">
            <img src=${data.thumbnail} width="100%"  id="main_img"  height="450px">
            <div class="small_image_group mt-3 d-flex justify-content-between">
                ${data.images.map(im=>
                    
                    `
                    <div class="small_image_col">
                        <img onclick='small_img(event)';  class="small_image" src=${im} width="100%" height="125px">
                    </div>
                `
                )}
            </div>
        </div>
        <div class="single_product_details">
            <!--add category in the place of smart  phones-->
            <h6><a href="../../public/index.html">Home / </a><a href="shop.html">Shop / </a>${data.category}</h6>
            <h5>${data.brand}</h5>
            <!--add tilte of the product-->
            <h4 id="title">${data.title}</h4>
            <!--Add price of the product-->
            <h3 id="price">$${data.price}.00</h3>
            <div  class="d-flex">
                <span id="rating">Rating </span>
                <div class="stars-outer">
                    
                    <div class="stars-inner">
    
                    </div>
                <span class="number-rating">${data.rating}</span>
                </div>
            </div>
            
            <div id="${data.id}" class="quantity_addtocart mt-3">
            
                 <!--is to select the quentity-->
                 <!-- <input id="quantity" type="number" value="1" width="200px">-->
                 <!--is to add to cart btn-->
                 <!-- <button id="${data.id}" onclick = "add_cart_single_product(event, ${data.id}); event.stopPropagation();" class="btn btn-primary"><span class="fw-6 bi bi-cart-plus"></span> Add To Cart</button>-->
            </div>
            
            <h4 id="product_details">Producat Details</h4>
            <!--description of the product-->
            <span id="description">${data.description} <button onclick="show_more()" id="show_more">show more...</button></span>

             <span id="description1">${data.description} Explore a diverse array of products, from cutting-edge electronics to 
            fashion-forward clothing and apparel, functional home and kitchen essentials, and performance-driven fitness and 
            sports gear. Each category offers a unique blend of style, functionality, and innovation, ensuring that you find 
            the perfect solution to suit your lifestyle needs. Whether you're looking to stay connected with the latest technology, 
            express your personal style with trendy apparel, elevate your living space with stylish home decor, or achieve your fitness goals
             with high-performance gear,our curated selection has something for everyone.<button onclick="show_less()" id="show_less">show less</button></span>
           

        </div>
            `
        })

        show_btn(z);
       
}


function show_btn(z){
    let div = document.querySelector(".quantity_addtocart");
    div.innerHTML=``;
    console.log(z, "enterged into show_btn function")
    if(z){
        console.log("if z is true")
        div.innerHTML = `
        <button id="${div.id}" onclick = "add_cart_single_product(event, ${div.id}); event.stopPropagation();" class="btn btn-primary"><span class="fw-6 bi bi-cart-plus"></span> Add To Cart</button>
        `
    }
    else{
        console.log("if z is false")
        div.innerHTML = `
        <button id="${div.id}" onclick = "window.location.href = 'cart.html'; event.stopPropagation();" class="btn btn-primary"><span class="fw-6 bi bi-cart-check"></span> Go To Cart</button>
        `
    } 
    
}



function add_cart_single_product(e, id){
    
    //let product_qty = parseInt(e.currentTarget.parentNode.querySelector("#quantity").value);
    //console.log(typeof(product_qty));
    let xyz = true
    const storedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    if(storedCartItems.length == 0){
        push_to_cart_single_product(id);
            z= false;
            show_btn(z);
        return;
    }
    else{
        for(let i = 0; i < storedCartItems.length; i++){
            const item = storedCartItems[i];
            if(item.id == id){
               /* if(item.qty == product_qty){
                    item.qty += product_qty;
                }
                item.qty = product_qty; */
                console.log("item is alredy added to cart")
                xyz = false;
            }
        }
        if(xyz){
            push_to_cart_single_product(id);
            z= false;
            show_btn(z)
            return;
        }
    }

    sessionStorage.setItem('cartItems', JSON.stringify(storedCartItems)); // Add this line to store the updated cart items
    cart_length = 0;
    storedCartItems.map(item =>{
        cart_length = cart_length + item.qty;
    })
    shopping_cart.setAttribute('data-product-count', cart_length);
    z= false;
    show_btn(z)
    
    
}


function push_to_cart_single_product(id){
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

     /*const storedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
     storedCartItems.map((pro)=>{
        console.log(pro)
     }) */
    const storedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    cart_length = 0;
    storedCartItems.map(item =>{
        cart_length = cart_length + item.qty;
    })
    shopping_cart.setAttribute('data-product-count', cart_length);
   

     
    })
}


function small_img(event){
    console.log(event.currentTarget.src);
    document.getElementById('main_img').src = event.currentTarget.src;
}

function show_category_product(category){
    val = false;
    document.getElementById("same_category_feature_products_cards").innerHTML=``;
    var cat = category.replace(/\s+/g, '');;
    fetch(`https://dummyjson.com/products/category/${cat}`)
    .then(function(response){
        return response.json();
    })
    .then(function (data){
        for(const product of data.products){
            if(product.id == productId){
                continue;
            }
            else{
                var card = document.createElement("div");
                card.className = "same_category_products_card";
                card.id = product.id;
            card.addEventListener("click", function(event){
                productId = event.currentTarget.id.replace(/\s+/g, '');
                url = `https://dummyjson.com/products/${productId}`;
                show_single_product(url, productId);  
            }); 
            card.innerHTML = `
            <div class="card-header" >
                        
                        <img id="card_img" class="card-img-top" src=${product.thumbnail} height="200">
                    </div>
                    <div class="description card-body">
                        <span>${product.brand}</span>
                        <h5>${product.title.slice(0, 25)}</h5>
                        <div class="description desc">
                            <div class="stars-outer">
                                <div class="stars-inner">

                                </div>
                            <span class="number-rating">${product.rating}</span>
                            </div>
                            <h4>$${product.price}.00</h4>
                        </div>
                        
                    </div>
                    <div class="card_footer">
                        <button id="${product.id}" onclick = "flyanimation_image(event); add_to_cart(${product.id}); event.stopPropagation();" class="add_to_cart_btn">
                            <span class="bi bi-cart-plus"></span>
                        </button>
                    </div>
        `;
            document.getElementById("same_category_feature_products_cards").appendChild(card);
            }
        }
    })
}


function show_img(id){
    console.log(id);
}







/*function flyanimation_image_big(e){
    
    let product_count = Number(shopping_cart.getAttribute('data-product-count')) || 0;
    //shopping_cart.setAttribute('data-product-count', product_count+1);
    shopping_cart.classList.add('active');
    //getting parent node of the button
    let target_parent = e.currentTarget.parentNode.parentNode.parentNode;
    let target_parent_append = e.currentTarget.parentNode.parentNode.parentNode.querySelector(".single_product_image");
    console.log(target_parent_append);
    target_parent.style.zIndex ='100';
    let img = target_parent.querySelector('#main_img');

    //creating the clone of the same image
    let flying_image = img.cloneNode();
    flying_image.removeAttribute('id');
    flying_image.classList.add('flying_image');
    target_parent_append.appendChild(flying_image);

    const flying_image_pos = flying_image.getBoundingClientRect();
    const shopping_cart_pos = shopping_cart.getBoundingClientRect();


    let data = {
        left : shopping_cart_pos.left - (shopping_cart_pos.width /2 + flying_image_pos.left + flying_image_pos.width / 2),
        top : shopping_cart_pos.bottom - flying_image_pos.bottom + 50
    }

    
    

    flying_image.style.cssText = `
        --left : ${data.left.toFixed(2)}px;
        --top : ${data.top.toFixed(2)}px;
    `
    
    setTimeout(()=>{
        target_parent_append.zIndex = "";
        target_parent_append.removeChild(flying_image)
        shopping_cart.classList.remove('active');
    }, 1000) 
} */

/* for same category product */
function flyanimation_image(e){
    
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
                item.qty = 1;
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
    console.log(url);
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

     /*const storedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
     storedCartItems.map((pro)=>{
        console.log(pro)
     }) */
    const storedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    cart_length = 0;
    storedCartItems.map(item =>{
        cart_length = cart_length + item.qty;
    })
    shopping_cart.setAttribute('data-product-count', cart_length);
    console.log(cart_length);

     
    })
    

    
}

// is to show menu in small devices
function showmenu() {
    document.getElementById("navbar").style.right = "0px";
}

//is to close the menu in small devices
function closemenu() {
    document.getElementById("navbar").style.right = "-400px"
}


function show_more(){
    document.getElementById("description").style.display="none";
    document.getElementById("description1").style.display="block";
}


function show_less(){
    document.getElementById("description1").style.display="none";
    document.getElementById("description").style.display="block";
}


