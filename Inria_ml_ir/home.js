const pages = document.querySelectorAll(".page");
let currentPageIndex = 0;

function goToPage(page){
    if (page - 1 === currentPageIndex) return;
    const nextPage = pages[page-1];
    const currentPage = pages[currentPageIndex];

    console.log(nextPage, currentPage);

    currentPage.classList.add("stored");

    setTimeout(() =>{
        currentPage.classList.add("d-none");
        nextPage.classList.remove("d-none");
        setTimeout(() => {
            nextPage.classList.remove("stored");
        }, 100)
    }, 200);


    currentPageIndex = page - 1;
}