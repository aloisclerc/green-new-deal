var coll = document.getElementsByClassName("collapsible");
var i;
var arr = Array.from(coll);
var button = $("#c1");


$(".minus").hide();

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
    console.log(n);
    let table = $("#memberTable");
    let switching = true;
    let dir = "asc";
    let rows, shouldSwitch, x, y;

    while (switching) {
        switching = false
        rowsHTML = table[0].rows;

        rows = Array.from(rowsHTML);
        console.log(rows);


        for (var i = 1; i < rows.length - 1; i++) {
            shouldSwitch = false;

            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];
            console.log(x);

            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}
// $(function() {
//     $("#myTable").tablesorter();
//   });

// function sort() {
//     $("#memberTable").tablesorter();
// };