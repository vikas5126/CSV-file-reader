function find(){
    var input = document.getElementById("search");
    var filter = input.value.toUpperCase();
    var table = document.getElementById("table");
    var tr = table.getElementsByTagName("tr");
    var e = document.getElementById("input");
    var value = e.value;
    // var text = e.options[e.selectedIndex].text;

    for(let i=0; i<tr.length; i++){
       let td = tr[i].getElementsByTagName("td")[value];
       if(td){
        txtValue = td.textContent || td.innerText;
        if(txtValue.toUpperCase().indexOf(filter) > -1){
            tr[i].style.display = "";
        }
        else{
            tr[i].style.display = "none";
        }
       }
    }
}