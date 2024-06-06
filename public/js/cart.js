

let storedCartItems;
let total_price = 0;
let original_price = 0;

let qty = 0;


function bodyload(){
    storedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    show_cart_item(storedCartItems);
    calculate_total_price(storedCartItems)
    calculate_original_price(storedCartItems)
    
    quantity_calculator(storedCartItems);
    show_total_price();
    
    
}




function show_cart_item(storedCartItems){
    
    var cart_product = document.querySelector(".cart_products");
    cart_product.innerHTML=``
    if(storedCartItems.length == 0){
        cart_product.innerHTML=`no cart items`
    }
    else{
        storedCartItems.map(item =>{
            let original_price = (item.price)/(1-(item.discountPercentage/100));
            let div = document.createElement("div");
            div.classList="cart_item";
            div.id=`${item.id}`;
            div.addEventListener("click", function(event){
                if (!event.target.closest('.delete_btn') & !event.target.closest('.qty_reducer') & !event.target.closest('.qty_increase')) {
                    window.location.href=`single_product.html?productId=${event.currentTarget.id}`;
                }
            });
            div.innerHTML=`
                    <div id="image_details">
                        <!--Image link-->
                        <img id="product_image" src = ${item.thumbnail} width="140px" height="110px">
                    </div>
                        <!-- discerption and price before and after discount-->
                    <div class="mt-3">
                        <div>
                                <!--Brand and title-->
                                <h6 id="brand">${item.brand ? item.brand : 'SwiftCart'}</h6>
                                <h5 id="title">${item.title.slice(0, 21)}</h5>
                        </div>
                        <div class="prices">
                                <!--original price-->
                                <p><s id="original_price">$${original_price.toFixed(2)}</s></p>
                                <!--after discount price-->
                                <p id="after_discount_price">$${item.price}</p>
                                <!--discount percentage-->
                                <p id="discount_percentage">${item.discountPercentage} Off</p>
                        </div>
                    </div>
                    <div id="quantity">
                            <button class="qty_reducer" onclick="quantity_reducer(this, event); event.stopPropagation();" >-</button>
                            <input class="product_qunatity" type="number" value="1" min="1" max="10" step="1">
                            <button class="qty_increase" onclick="quantity_increaser(this, event)">+</button>
                    </div>
                    <div id="delete_item">
                        <button id="${item.id}" onclick="delete_product_from_cart(event)" class="delete_btn btn btn-danger"><span class="bi bi-trash"></span></button>
                    </div>
                        

            `
            cart_product.appendChild(div);
        })
    }
    
} 

function quantity_calculator(storedCartItems){
    qty = 0;
    storedCartItems.map(item =>{
        qty += parseInt(item.qty);
    })
    show_total_price();
    calculate_total_price(storedCartItems)
    calculate_original_price(storedCartItems)
}

function calculate_total_price(storedCartItems){
    total_price = 0;
    storedCartItems.map(item =>{
        
        total_price = total_price + (item.price * parseInt(item.qty));
    })
    //console.log("total price:", total_price);
    show_total_price();

}


function calculate_original_price(storedCartItems){
    original_price = 0;
    let previous_price = 0;
    storedCartItems.map(item =>{
        previous_price = (previous_price + parseInt((item.price * item.qty)/(1-(item.discountPercentage/100))))
    })
    original_price = previous_price;
    //console.log("original price:",previous_price.toFixed(2));
    //console.log("original price:",original_price);
    show_total_price();

}



// Function to reduce quantity
function quantity_reducer(btn, e) {
    var input = btn.nextElementSibling;
    var parentnode = e.currentTarget.parentNode.parentNode.id;
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        if (parseInt(input.value) === 1) {
            btn.disabled = true;
        }
    }
    const storedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    storedCartItems.map(item =>{
        if(parentnode == item.id){
            item.qty = parseInt(input.value);

        }
    })

    sessionStorage.setItem('cartItems', JSON.stringify(storedCartItems)); // Add this line to store the updated cart items
    quantity_calculator(storedCartItems)
    console.log(storedCartItems);
}

// Function to increase quantity
function quantity_increaser(btn, e) {
    var input = btn.previousElementSibling;
    var parentnode = e.currentTarget.parentNode.parentNode.id;
    if (parseInt(input.value) < 10) {
        input.value = parseInt(input.value) + 1;
        btn.previousElementSibling.previousElementSibling.disabled = false;
    }
    const storedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    storedCartItems.map(item =>{
        if(parentnode == item.id){
            item.qty = parseInt(input.value);
        }
    })
    sessionStorage.setItem('cartItems', JSON.stringify(storedCartItems)); // Add this line to store the updated cart items
    quantity_calculator(storedCartItems)
    console.log(storedCartItems);
}


function show_total_price(){
    let discount_amount = original_price-total_price;
    document.querySelector("#show_prices").innerHTML=`
    <div class="d-flex justify-content-between">
                            <div>
                                <p class="pp">Price (${qty} item)</p>
                                <p class="pp">Discount</p>
                                <p class="pp">Delivey Charges</p>
                            </div>
                            <div id="all_amounts">
                                <!--Price of all the items-->
                                <p class="pp">$ ${parseFloat((total_price).toFixed(2))}</p>
                                <!--Discount for all the items-->
                                <p class="pp" id="discount_amount"> -$ ${parseFloat((discount_amount).toFixed(3))}</p>
                                <!--Delivery charges-->
                                <p class="pp" id="delivey_charges"><s>$20</s> Free</p>
                                
                            </div>
                        </div>
                        <hr class="new_1">
                        <div id="total_amount" class="d-flex justify-content-between">
                            <p >Total Amount</p>
                            <!--Total amount of cart-->
                            <p>$ ${parseFloat((total_price).toFixed(2))}</p>
                        </div>
                        <hr class="new_1">
                        <p id="saving_amount">You will save $ ${parseFloat((discount_amount).toFixed(3))} on this order</p>
    `
}


function setInputValueFromSessionStorage(){
    storedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    
    var product_qty_element = document.querySelectorAll('.product_qunatity');
    product_qty_element.forEach(function(element) {

        var parentElement = element.parentNode.parentNode.id;
        
        storedCartItems.map(item =>{
            if(parentElement == item.id){
                element.value = item.qty;
            }
        })
    });
}


function delete_product_from_cart(e){
    
    //e.currentTarget.parentNode.parentNode.style.right = "100px";
    
    storedCartItems = JSON.parse(sessionStorage.getItem('cartItems')) || [];
    storedCartItems.map((item, index) =>{
        if(item.id == e.currentTarget.id){
            console.log(index);
            storedCartItems.splice(index, 1);
        }
    })
    sessionStorage.setItem('cartItems', JSON.stringify(storedCartItems));
    show_cart_item(storedCartItems);
    quantity_calculator(storedCartItems);

}


// is to show menu in small devices
function showmenu() {
    document.getElementById("navbar").style.right = "0px";
}

//is to close the menu in small devices
function closemenu() {
    document.getElementById("navbar").style.right = "-400px"
}




