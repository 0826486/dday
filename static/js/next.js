document.querySelector('.right').addEventListener('click', function() {
    const content = document.querySelector('.content');
    content.style.transform = 'translateX(-100%)'; // 오른쪽으로 이동
});

document.querySelector('.left').addEventListener('click', function() {
    const content = document.querySelector('.content');
    content.style.transform = 'translateX(0)'; // 원래 위치로 돌아옴
});