function changeColor(selectedElement) {
    // 모든 .day 요소를 가져옴
    const days = document.querySelectorAll('.day');

    // 모든 요소의 색상을 원래대로 되돌림
    days.forEach(day => {
        day.classList.remove('active');
    });

    // 클릭한 요소에 색상을 추가함.
    selectedElement.classList.add('active');
}

// 저장 버튼을 클릭했을 때 실행되는 함수
function saveData() {
    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;

    // 이미지 선택이 있으면 미리보기 이미지 URL 저장
    const imageInput = document.getElementById("backgroundImageInput");
    const imageUrl = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : '';

    // 로컬 저장소에 데이터 저장
    localStorage.setItem("savedTitle", title);
    localStorage.setItem("savedDate", date);
    localStorage.setItem("savedImageUrl", imageUrl);

    // 저장 알림
    alert("저장되었습니다.");

    // plus.html로 이동
    window.location.href = "/html/plus.html";
}