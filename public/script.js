var coll = document.getElementsByClassName("collapsible");
var i;
var arr = Array.from(coll);
var button = $("#c1");


$(".minus").hide();
$($(this)[0].button[0]).children(".upSort").hide();
$($(this)[0].button[0]).children(".downSort").hide();


if(document.URL.includes("members")){
    $("#members").addClass("current");
} else if(document.URL.includes("petitions")){
    $("#petitions").addClass("current");
} else if(document.URL.includes("proposals")){
    $("#proposals").addClass("current");
}

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            $(this).children(".minus").hide();
            $(this).children(".plus").show();
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            $(this).children(".minus").show();
            $(this).children(".plus").hide();

        }
    });

}

function sortTable(n) {
    let table = $("#memberTable");
    let switching = true;
    let dir = "asc";
    let idNum = n+1;
    let id = $("#c"+idNum);
    let rows, shouldSwitch, x, y, i, switchcount = 0;

    while (switching) {
        console.log($($(this)[0]).children(".upSort"));
        if(dir=="asc" && id[0].classList[0] == "tableActive") {
            $(id[0]).children(".downSort").hide();
            $(id[0]).children(".upSort").show();
        } else if (dir == "desc" && id[0].classList[0] == "tableActive") {
            $(id[0]).children(".upSort").hide();
            $(id[0]).children(".downSort").show();
        } else {
            $(id[0]).children(".upSort").hide();
            $(id[0]).children(".downSort").hide();
        }
        switching = false
        rowsHTML = table[0].rows;

        for(i = 0; i < 3; i++){
            $("#c"+(i+1))[0].classList.remove("tableActive");

        }
         id[0].classList.add("tableActive");


        rows = Array.from(rowsHTML);


        for (i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;

            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;

            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


var form = $('form#registerForm'),
    url = 'https://script.google.com/macros/s/AKfycbwkgy1ksQWFWZLVYtsGc6MB8olSoDgnNSIkspXlqnSpoT8KIKQ/exec';

$('#submit-form').on('click', function(e) {
  e.preventDefault();
  var jqxhr = $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    data: form.serialize()
  }).success(
    // do something
  );
})
// $(function() {
//     $("#myTable").tablesorter();
//   });

// function sort() {
//     $("#memberTable").tablesorter();
// };