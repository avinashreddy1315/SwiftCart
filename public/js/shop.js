let arr = [];
let arr1 = []
let inputs;
let itemsPerPage = 9;
let currentPage = 1;
const cat_arr = [];
const product_array = [];

let xz = 0;
let bb;
let flagvariable = true

function show_filter(){
    document.getElementById("select_category").style.left = '0px'
}

function close_filter(){
    document.getElementById("select_category").style.left = '-400px'
}


//used for pagination when items are displaed through filter select
let itemsPerPage1 = 9;
let currentPage1 = 1;

//used for pagination when items are displaed through filter search bar
let itemsPerPage2 = 9;
let currentPage2 = 1;

//is used for pushing the category name into cat_arr if truth is 1 and to remove the cat name when truth is 0;
let truth = 1;

//this array to store products when category is selected by filter
let products_array = [];

let inputs_length;

//let home_cat = localStorage.getItem('home_category');







/*function category_clcik_by_homepage(buttonValue){
    console.log(buttonValue)
} */

let cart_length = 0;

async function bodyload() {
    
    await GetAllProducts_categories();
    await Show_Products("https://dummyjson.com/products");
    
    inputs_length = inputs.length;
    inputs[0].checked = true;

    const storedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    storedCartItems.map(item =>{
        cart_length = cart_length + item.qty;
    })
    //cart_length = storedCartItems.length;
    console.log(cart_length);
    shopping_cart.setAttribute('data-product-count', cart_length);

    


}



// is to show menu in small devices
function showmenu() {
    document.getElementById("navbar").style.right = "0px";
}

//is to close the menu in small devices
function closemenu() {
    document.getElementById("navbar").style.right = "-400px"
}
let count = 0;


//is  to show all the products list for filter
async function GetAllProducts_categories() {
    await fetch("https://dummyjson.com/products/categories")
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            data.unshift("All")
            for (var item of data) {
                count++;
                var div = document.createElement("div");
                div.className = "check_box_container"
                div.innerHTML = `
            <input onchange="select_category()" class="inputs form-check-input check_box" type="checkbox" id="${item}" value="${item}">
            <label class="ps-2" for="${item}">${item}</label>
            `
                document.getElementById("check_boxs").appendChild(div);
            }

        })
    inputs = document.querySelectorAll('.inputs');  


}





//is to category select on filter
function select_category() {
    let val = false;
    flagvariable = true
    if (event.target.value == "All") {
        flagvariable = true
        Show_Products("https://dummyjson.com/products");
        for (let i = 1; i < inputs.length; i++) {
            inputs[i].checked = false;
           
        }
        cat_arr.length = 0;
        
        return;
        
    }
    else {
        /* Show_Products(`https://dummyjson.com/products/category/${event.target.value}`) */
        //is to checkout the all box when user selects  any other category
        if (event.target.value != "All") {
            inputs[0].checked = false;
        }

        if (cat_arr.length < 1) {
            cat_arr.push(event.target.value)
            truth = 1;
            val = true;
            Show_Products_by_cat(event.target.value);

        }
        else {
            cat_arr.map((item, index) => {
                if (item == event.target.value) {
                    cat_arr.splice(index, 1)
                    val = true;
                    truth = 0;
                    Show_Products_by_cat(event.target.value);

                }
            })


        }
        if (val == false) {
            cat_arr.push(event.target.value);
            truth = 1
            Show_Products_by_cat(event.target.value);


        }


    }
}




//is function is to get the elements of the selected category and store it products_array
async function Show_Products_by_cat(item) {
    
    const data = await fetch(`https://dummyjson.com/products/category/${item}`);
    const res = await data.json();
    if (truth == 1) {
        res.products.map((product) => {
            products_array.push(product);
        })
    }
    else {
        products_array = products_array.filter(it => it.category !== item);


    }
    

    show_products_of_selected_cat(products_array, itemsPerPage1, currentPage1)
}


//this is the function to show products of selected cat
function show_products_of_selected_cat(products_array, itemsPerPage1, currentPage1) {
    if (cat_arr.length == 0) {
        inputs[0].checked = true;
        Show_Products("https://dummyjson.com/products");
    }
    
    document.getElementById("all_products_cards").innerHTML = '';
    console.log(products_array);
    display_product_card(products_array, itemsPerPage1, currentPage1);

    
}





//function for previous button in pagination
function prev() {

    if (cat_arr.length == 0) {
        if ((currentPage * itemsPerPage) / arr.length) {
            currentPage--;
            Show_Products("https://dummyjson.com/products");
        }
    }
    if (products_array.length != 0) {
        
        if ((currentPage1 * itemsPerPage1) / products_array.length) {
            currentPage1--;  
        }
        show_products_of_selected_cat(products_array, itemsPerPage1, currentPage1);
    }
}

//function for next button in pagination
function next() {
    if (cat_arr.length == 0) {
        if ((currentPage * itemsPerPage) / arr.length) {
            currentPage++;
            Show_Products("https://dummyjson.com/products");
        }
    }
    if (products_array.length != 0) {
        if ((currentPage1 * itemsPerPage1) / products_array.length) {
            currentPage1++;
        }
        show_products_of_selected_cat(products_array, itemsPerPage1, currentPage1);
    }


}


//is to show all the products
async function Show_Products(url) {
    if(flagvariable){

   
    document.getElementById("all_products_cards").innerHTML = '';
    await fetch(url)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            arr = data.products;
            
            const indexOfLastPage = currentPage * itemsPerPage;

            const indexOfFirstPage = indexOfLastPage - itemsPerPage;
            const currentItems = arr.slice(indexOfFirstPage, indexOfLastPage);
            if (indexOfLastPage >= arr.length) {
                document.getElementById("next_btn").disabled = true;
            }
            else {
                document.getElementById("next_btn").disabled = false;
            }

            if (indexOfFirstPage == 0) {
                document.getElementById("prev_btn").disabled = true;
            }
            else {
                document.getElementById("prev_btn").disabled = false;
            }
            currentItems.map((item) => {
                var card = document.createElement("div");
                card.className = "product_card"
                card.id = item.id;
                card.addEventListener("click", function(event){
                    if (!event.target.closest('.add_to_cart_btn')) {
                        console.log(event.currentTarget.id);
                        window.location.href=`single_product.html?productId=${event.currentTarget.id}`;
                    }
                });
                card.innerHTML = `
            <div class="card-header" >
                        
                        <img id="card_img" class="card-img-top" src=${item.thumbnail} height="200">
                        
                    </div>
                    <div class="description card-body">
                        <span>${item.brand}</span>
                        <h5>${item.title.slice(0, 25)}</h5>
                        <div class="description desc">
                            <div class="stars-outer">
                                <div class="stars-inner">

                                </div>
                            <span class="number-rating">${item.rating}</span>
                        </div>
                        <h4>$${item.price}</h4>
                        </div>
                        
                    </div>
                    <div class="card_footer">
                        <button id="${item.id}" onclick = "flyanimation_image(event); add_to_cart(${item.id}); event.stopPropagation();" class="add_to_cart_btn">
                            <span class="bi bi-cart-plus"></span>
                        </button>
                    </div>
        `;
                document.getElementById("all_products_cards").appendChild(card);
            }) 
        })
    }
}


//is to search items by search bar
document.getElementById('search_box').addEventListener('input', async function hello (event) {
    document.getElementById("all_products_cards").innerHTML = '';
    arr1.length = 0;
    if (event.target.value == '') {
        flagvariable = true
        Show_Products("https://dummyjson.com/products");
        for (let i = 1; i < inputs.length; i++) {
            inputs[i].checked = false;
        }
        inputs[0].checked = true;
        
        
    }
    else {
        const data = await fetch(`https://dummyjson.com/products/search?q=${event.target.value}`)
        const res = await data.json();
        console.log(res.products.length);
        if(res.products.length == 0){
            document.getElementById("all_products_cards").innerHTML = `
                <div class="d-flex justify-content-center flex-column ">
                    <img src="../../public/images/no_search.png" width="300px">
                    <h2>Oop's No Result</h2>
                </div>
                
            `
            for (let i = 0; i < inputs.length; i++) {
                    inputs[i].checked = false;
            }
            document.getElementById("next_btn").disabled = true;
            document.getElementById("prev_btn").disabled = true;
        }
        res.products.map(item => {
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i].value == item.category) {

                    inputs[i].checked = true;
                }
            }
            var card = document.createElement("div");
            card.className = "product_card"
            card.id = item.id;
                card.addEventListener("click", function(event){
                    console.log(event.currentTarget.id);
                    window.location.href=`single_product.html?productId_from_shop= ${event.currentTarget.id}`;
                });
            card.innerHTML = `
            <div class="card-header" >
                        
                        <img id="card_img" class="card-img-top" src=${item.thumbnail} height="200">
                        
                    </div>
                    <div class="description card-body">
                        <span>${item.brand}</span>
                        <h5>${item.title.slice(0, 25)}</h5>
                        <div class="description desc">
                            <div class="stars-outer">
                                <div class="stars-inner">

                                </div>
                            <span class="number-rating">${item.rating}</span>
                        </div>
                        <h4>$${item.price}</h4>
                        </div>
                        
                    </div>
                    <div class="card_footer">
                        <button id="${item.id}" onclick = "flyanimation_image(event); add_to_cart(${item.id}); event.stopPropagation();" class="add_to_cart_btn">
                            <span class="bi bi-cart-plus"></span>
                        </button>
                    </div>
        `;
            document.getElementById("all_products_cards").appendChild(card);
        })
 
    }



})


function min_price(event){
    console.log(event.currentTarget.value);
    
}



//is to show the cards
function display_product_card(array, ipp, cp){
    
    document.getElementById("all_products_cards").innerHTML = '';
    const ilp = cp * ipp;
    const ifp = ilp - ipp;
    const ci = array.slice(ifp, ilp);
    console.log(ci);
    
    if (ilp >= array.length) {
        document.getElementById("next_btn").disabled = true;
    }
    else {
        document.getElementById("next_btn").disabled = false;
    }

    if (ifp == 0) {
        document.getElementById("prev_btn").disabled = true;
    }
    else {
        document.getElementById("prev_btn").disabled = false;
    }
    ci.map((item) => {
        var card = document.createElement("div");
        card.className = "product_card"
        card.id = item.id;
        card.addEventListener("click", function(event){
            if (!event.target.closest('.add_to_cart_btn')) {
                console.log(event.currentTarget.id);
                window.location.href=`single_product.html?productId=${event.currentTarget.id}`;
            }
        });
        card.innerHTML = `
    <div class="card-header" >
                
                <img id="card_img" class="card-img-top" src=${item.thumbnail} height="200">
                
            </div>
            <div class="description card-body">
                <span>${item.brand}</span>
                <h5>${item.title.slice(0, 25)}</h5>
                <div class="description desc">
                    <div class="stars-outer">
                        <div class="stars-inner">

                        </div>
                    <span class="number-rating">${item.rating}</span>
                </div>
                <h4>$${item.price}</h4>
                </div>
                
            </div>
            <div class="card_footer">
                <button id="${item.id}" onclick = "flyanimation_image(event); add_to_cart(${item.id}); event.stopPropagation();" class="add_to_cart_btn">
                    <span class="bi bi-cart-plus"></span>
                </button>
            </div>
`;
        document.getElementById("all_products_cards").appendChild(card);
    }) 
}


//to clear all the filters
function clear_all(){
    for(let i = 0; i<inputs.length; i++){
        inputs[i].checked = false;
    }
   
    document.getElementById("all_products_cards").innerHTML = `
                <div class="d-flex justify-content-center flex-column ">
                    <img src="../../public/images/no_search.png" width="300px">
                    <h2>Oop's No Result select a category</h2>
                </div>
                
    `;
    document.getElementById("next_btn").disabled = true;
    
    
}


const urlParams = new URLSearchParams(window.location.search);
let  buttonValue = urlParams.get('buttonvalue');



if(buttonValue != null){
    cat_by_indexpage(buttonValue) ;
    
}



function cat_by_indexpage(butt){
    flagvariable = false
    document.getElementById("all_products_cards").innerHTML='';
    bb = butt.replace(/\s+/g, '');
    let url = `https://dummyjson.com/products/category/${bb}`;
    fetch(url)
    .then(function (response){
        return response.json();
    })
    .then(function(data){
        console.log(data.products);
        document.getElementById("all_products_cards").innerHTML = '';
        display_product_card(data.products, itemsPerPage, currentPage);
        show_products_of_selected_cat(products_array, itemsPerPage1, currentPage1)
    })

    
    
    
    
 
}

const shopping_cart = document.querySelector('.shopping_cart');

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