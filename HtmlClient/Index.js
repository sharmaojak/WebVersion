
var products=null;
var itemDetails=[];
var undeliveredOrderList=[];
var modal = document.getElementById('id01');
var modal1=document.getElementById('id02');
var insertHeaders=true;
var userUniqueId=0;


function getFormData(formId,event,endpoint){
    event.preventDefault();
    let s_data = $('#'+formId).serializeArray();
    console.log("s_data==="+s_data);
    let data = {};
    s_data.forEach(item=>{
      console.log("data[item.name]==="+data[item.name]);
      data[item.name] = item.value;
      console.log("item.value==="+item.value);
    });
    console.log("JSON.stringify(data)==="+JSON.stringify(data));
    $("#loader").show();
    hideForm(formId);
    ajaxCall(data,"POST",endpoint);
    console.log("form id=="+formId+"");
    }

    function hideForm(formId){
        switch(formId){
            case "LoginForm":{
            $("#id01").hide();
            break;
        }
        case "RegisterForm":{
            $("#id02").hide();
            break;
        }
        default:
            break;
        }

    }

    function handlleUI(data,endpoint){
       switch(endpoint){
        case "loginUser": {
        if(data.length>4){
         document.getElementById("id01").style.display="none";
         console.log("inside handleUI=="+products+"inside handleUI");
         document.getElementById("loginRegister").style.display="none";
         $("#logOut").show('slow');
         itemDetailsList=[];
          $("#productCounter").html(itemDetailsList.length);
        $("#cartinfo").show();
        $("#WelcomeUser").show();

         document.getElementById("WelcomeUser").innerHTML="Welcome Dear ,"+JSON.parse(data).userFullName;
         userUniqueId=JSON.parse(data).registerLoginId;
         if(JSON.parse(data).accessRights=="admin"){
            ajaxCall(null,"GET","getUndeliveredOrders");
            return;

         }
         var list=JSON.parse(products);
       for(var k=0;k<list.length;k++){
        $(document.getElementById(list[k].productId).childNodes[2]).show();
       }
        }else{
        showMessage( "Either username or password is incorrect or you have to register");
        }
         $("#loader").hide();
         break;
        }
        case "getUndeliveredOrders" :{
         showUndeliveredOrderList(data);
        break;
        }
        case "registerUser": {
        $("#id02").hide();
          showMessage(data);
          console.log("I am here");
          $("#loader").hide();
         break;
        }
        case "saveOrder": {
              showMessage(data);
             $("#loader").hide();

         break;
        }
        case "productList": {
                    productTable(data);
                 break;
                }
        default:
            break;
    }
}

 function productTable(data){
      if(data!=null)
 $("#loader").hide();
 products=JSON.stringify(data);
 $.each(data, function(key,value) {
    // here `value` refers to the objects
    var elem = document.createElement('div');
    elem.style="margin-top:10px;font-size:25px";
 <!--   elem.setAttribute('class',"containerText");-->
    elem.setAttribute('id',value.productId);

     var img = document.createElement('img');

     img.src=value.productId+".jpg";
    // elem.innerHTML=value.productName;
     elem.appendChild(img);

 var textContent = document.createElement('div');
     textContent.setAttribute('class',"centered");
     textContent.innerHTML=value.productName+" Rs"+value.productRate;
     elem.appendChild(textContent);

 <!-- start Button to add product as text value add to cart-->
     var addToCartButton = document.createElement('button');
           addToCartButton.style="width:auto;font-size:16px;display:none";
          if(value.availabilityInKg>0){
           addToCartButton.innerHTML="Add To Cart";
           addToCartButton.addEventListener("click", (event) => {
           var index=event.target.id;
           var quantity=1;
           console.log("index=================="+index);
           console.log(document.getElementById(value.productId).childNodes[3]);
           $(document.getElementById(value.productId).childNodes[3]).hide();
           $(document.getElementById(value.productId).childNodes[3]).show('slow');
           $(document.getElementById(value.productId).childNodes[3]).hide('slow');
          if(!checkItemInExsitingList(value.productId))
           itemDetails.push(new item( value.productId,value.productName,quantity, value.productRate,quantity*value.productRate,value.gstRate,quantity*value.gstRate) );
            document.getElementById("productCounter").innerHTML=itemDetails.length;
 	        console.log("clicked element j=="+JSON.stringify(itemDetails));
           });
           }else
           addToCartButton.innerHTML="Out Of Stock";
            elem.appendChild(addToCartButton);


 <!--          addToCartButton.setAttribute("id",k);-->
 <!-- end Button to add product as text value add to cart--     -->
 var alert = document.createElement('div');
     alert.setAttribute('class',"centered");
     alert.style.display="none";
 alert.innerHTML=value.productName+" added to cart";
 elem.appendChild(alert);


 document.getElementById("ShriHari").appendChild(elem);
    console.log(value.productName);
    console.log("alert.style.top===="+alert.style.top);
 });



 }

 function showMessage(data){
         $("#message").html(data);
         $("#alertForm").show();


 }

/*Pojo structure for item start*/
    function item( productId,productName,quantity, price,totalprice,gst,totalGST){
        this.productId=productId;
        this.productName=productName;
        this. quantity=quantity;
        this.price=price;
        this.totalprice=totalprice;
        this.gst=gst;
        this.totalGST=totalGST;
}

 function registerLogin( registerLoginId,userAddress,userName, password,retypePassword,accessRights,mobileNumber,userFullName){
        this.registerLoginId=registerLoginId;
        this.userAddress=userAddress;
        this. userName=userName;
        this.password=password;
        this.retypePassword=retypePassword;
        this.accessRights=accessRights;
        this.mobileNumber=mobileNumber;
        this.userFullName=userFullName;
}


    function OrderDetails(status,itemDetails,registerLogin,gstOfOrderDetail,totalPrice){
        this.status=status;
        this.itemDetails=itemDetails;
        this.registerLogin=registerLogin;
        this.gstOfOrderDetail=gstOfOrderDetail;
        this.totalPrice=totalPrice;
    }


/*Pojo structure for item end*/

 function viewData(gstOfOrderDetail,totalPrice){

   var OrderDetail=new OrderDetails("created",itemDetails,new registerLogin(userUniqueId,"","","","","","",""),gstOfOrderDetail,totalPrice);
   console.log(JSON.stringify(OrderDetail));
   $("#billForm").hide();
   $("#loader").show();
    ajaxCall(OrderDetail,"POST","saveOrder");

   }





function checkItemInExsitingList(currentId){
        for(var alreadyExist=0;alreadyExist<itemDetails.length;alreadyExist++ ){
                console.log("Existed in loop");
                if(currentId==itemDetails[alreadyExist].productId){
                console.log("Existed");
                itemDetails[alreadyExist].quantity=itemDetails[alreadyExist].quantity+1;
                itemDetails[alreadyExist].totalprice=(itemDetails[alreadyExist].quantity)*(itemDetails[alreadyExist].price);
                return true;
                }
           }


}


function showUndeliveredOrderList(data){
      $("#loader").hide();
      var dom= document.getElementById("ShriHari");
        $("#UndeliveredOrdersList").show();

        dom.innerHTML="";
         var table= document.getElementById("UndeliveredOrdersList");
               $("#UndeliveredOrdersList tr").remove();
                   var rowHeader = table.insertRow(0);
                   rowHeader.appendChild(returnTableHeader("OrderID"));
                   rowHeader.appendChild(returnTableHeader("Total Price"));
                   rowHeader.appendChild(returnTableHeader("Details"));
                   var orderList=JSON.stringify(data);
                   console.log("orderList==="+orderList);
                   console.log("length=="+data.length);
                   for(var index=0;index<data.length;index++){
                       var row = table.insertRow(1+index);
                       var cell1 = row.insertCell(0);
                       var cell2 = row.insertCell(1);
                       var cell3 = row.insertCell(2);
                       cell1.innerHTML=data[index].orderDetailId;
                       cell2.innerHTML=data[index].totalPrice;
                       console.log("data[index]=="+data[index].itemDetails[index].productName);
                       this.UndeliveredOrdersList[index]=data[index];
                       cell3.innerHTML="<button onclick=showTable("+index+")>click to view details</button>";
                       }

       /* $.each(data, function(key,value) {
            // here `value` refers to the objects
            var elem = document.createElement('div');
            elem.style="margin-top:10px;font-size:25px";
         <!--   elem.setAttribute('class',"containerText");-->
            elem.setAttribute('id',value.orderDetailId);
         var textContent = document.createElement('div');
             textContent.setAttribute('class',"centered");
             textContent.innerHTML=value.orderDetailId;
             elem.appendChild(textContent);

         <!--  Button to view details of the order-->
             var addToCartButton = document.createElement('Detail');
                   addToCartButton.style="width:auto;font-size:16px;display:block";
                    elem.appendChild(addToCartButton);


            dom.appendChild(elem);
            console.log(value.orderDetailId+"====Value");

         });*/


}



function showTable( indexOfList){

    console.log("undeliveredOrder===="+indexOfList);

    var orderFlag=false;
    if(indexOfList!=null){
      orderFlag=true;
      this.itemDetails=this.UndeliveredOrdersList[indexOfList].itemDetails;
      console.log("itemDetails===");
    }

    if(itemDetails.length==0){
     showMessage("You have not added any product in the cart, add at least one product to cart");
     return;
    }
    document.getElementById("billForm").style.display="block";
    var table=document.getElementById("itemsDetailsTable");
    table.style.display="block";
                $("#itemsDetailsTable tr").remove();
                   var rowHeader = table.insertRow(0);
                   rowHeader.appendChild(returnTableHeader("Product Name"));
                   rowHeader.appendChild(returnTableHeader("Quantity"));
                   rowHeader.appendChild(returnTableHeader("Rate"));
                   rowHeader.appendChild(returnTableHeader("GST %"));
                   rowHeader.appendChild(returnTableHeader("Total Price"));
                   if(!orderFlag){
                     rowHeader.appendChild(returnTableHeader("Remove From List"));
                   }
                   else{
                     rowHeader.appendChild(returnTableHeader(this.UndeliveredOrdersList[indexOfList].registerLogin.userFullName+this.UndeliveredOrdersList[indexOfList].registerLogin.userAddress));
                   }
                   var totalPrice=0;
                   for(var index=0;index<itemDetails.length;index++){
                    var row = table.insertRow(1+index);
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    var cell6 = row.insertCell(5);
                    cell1.innerHTML = itemDetails[index].productName;
                    cell2.innerHTML = itemDetails[index].quantity;
                    cell3.innerHTML = itemDetails[index].totalprice/itemDetails[index].quantity;
                    cell4.innerHTML = itemDetails[index].gst;
                    cell5.innerHTML = itemDetails[index].totalprice;
                    totalPrice=totalPrice+itemDetails[index].totalprice;
                    if(!orderFlag)
                    cell6.innerHTML="<button onclick=removeItem(this.parentNode.parentNode)>Remove</button>";

                   }
                   console.log("itemDetails.length======"+itemDetails.length)
                    var totalAmountRow= table.insertRow(itemDetails.length+1);
                    totalAmountRow.insertCell(0).innerHTML="Total Amount";
                    var cell2 = totalAmountRow.insertCell(1);
                    var cell3 = totalAmountRow.insertCell(2);
                     var totalGSTOfOrder=(totalPrice*5/100);
                     totalAmountRow.insertCell(3).innerHTML=totalGSTOfOrder;
                    totalAmountRow.insertCell(4).innerHTML=totalPrice;
                    if(!orderFlag)
                    totalAmountRow.insertCell(5).innerHTML="<button onclick=viewData("+totalGSTOfOrder+","+totalPrice+")>Save Order</button>";
                    else
                     totalAmountRow.insertCell(5).innerHTML=UndeliveredOrdersList[indexOfList].registerLogin.userFullName;
}





    /* Method to generate Table Header start*/
    function returnTableHeader(CellHeaderName){
        var headerCellName=document.createElement('TH');
        headerCellName.innerHTML=CellHeaderName;
       // headerCellName.setAttribute("style","border:1px solid black");
        return headerCellName;
    }
/*Method to generate Table Header end*/

/*method to remove an item from the productList start*/

function removeItem(selectedIndex){
   console.log("selectedIndex==============="+selectedIndex.rowIndex);
 itemDetails.splice(selectedIndex.rowIndex-1,1);
showTable(null);
}
/*method to remove an item from the productList start*/




function ajaxCall(payload,methodType,endpoint){
    var value=null;
    var dataReceived=null;
    $.ajax({
      type: methodType,
      contentType:  "application/json",
      crossOrigin: true,
//      url: "http://43.204.140.113:8080/"+endpoint,
        url: "http://localhost:8080/"+endpoint,
      data: JSON.stringify(payload),
      async: false,
      success: function (data) {
      value=JSON.stringify(data);
        console.log("response===="+value);
            if((endpoint=="productList")||(endpoint=="getUndeliveredOrders"))
             value=data;
 }
    });
    handlleUI(value,endpoint);
    }

    function cleanData(variable){
            console.log("variable==="+variable);
            $("#cartinfo").hide();


            $("#WelcomeUser").hide();
            $("#logOut").hide();
            $("#loginRegister").show();
            var list=JSON.parse(products);
           for(var k=0;k<list.length;k++)
            $(document.getElementById(list[k].productId).childNodes[2]).hide();
    }


// When the user clicks anywhere outside of the modal, close it
/*
window.onclick = function(event) {
      console.log("event clicked");
    if (event.target == modal) {
        modal.style.display = "none";
    }else if(event.target==modal1){
    modal1.style.display="none";
    }
}*/

