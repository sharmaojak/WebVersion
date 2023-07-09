
var products=null;
var itemDetails=[];
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
    ajaxCall(data,endpoint);
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
        case "registerUser": {
        $("#id02").hide();
          showMessage(data);
          $("#loader").hide();
         break;
        }
        case "saveOrder": {

              showMessage(data);
             $("#loader").hide();

         break;
        }
        default:
            break;
    }
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
    ajaxCall(OrderDetail,"saveOrder");

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





function showTable(){
    console.log("inside shoow table");
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
                   rowHeader.appendChild(returnTableHeader("Remove From List"));
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
                    cell3.innerHTML = itemDetails[index].price;
                    cell4.innerHTML = itemDetails[index].gst;
                    cell5.innerHTML = itemDetails[index].totalprice;
                    totalPrice=totalPrice+itemDetails[index].totalprice;
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
                    totalAmountRow.insertCell(5).innerHTML="<button onclick=viewData("+totalGSTOfOrder+","+totalPrice+")>Save Order</button>";
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
showTable();
}
/*method to remove an item from the productList start*/




function ajaxCall(payload,endpoint){
    var value=null;
    $.ajax({
      type: "POST",
      contentType:  "application/json",
      crossOrigin: true,
//      url: "http://43.204.140.113:8080/"+endpoint,
        url: "http://localhost:8080/"+endpoint,
      data: JSON.stringify(payload),
      async: false,
      success: function (data) {
      value=data;
        console.log("response===="+JSON.stringify(data));
        console.log("Value in success==="+JSON.stringify(value));
 }
    });

    handlleUI(JSON.stringify(value),endpoint);
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

