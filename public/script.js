var coll = document.getElementsByClassName("collapsible");
var i;
var arr = Array.from(coll);

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