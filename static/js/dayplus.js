document.addEventListener('DOMContentLoaded', function() {
    // 디데이 색상 변경 기능
    function changeColor(selectedElement) {
        const days = document.querySelectorAll('.day');

        // 모든 요소의 색상을 원래대로 되돌림
        days.forEach(day => {
            day.classList.remove('active');
        });

        // 클릭한 요소에 색상을 추가
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
        window.location.href = "{{ url_for('plus') }}";  // Flask의 라우트 경로로 이동
    }

    // 저장 버튼에 이벤트 리스너 추가
    const saveButton = document.getElementById('saveButton');  // id로 선택
    if (saveButton) {
        saveButton.addEventListener('click', saveData);
    } else {
        console.error('저장 버튼을 찾을 수 없습니다.');
    }

    // 각 디데이 항목에 색상 변경 이벤트 추가
    const dayElements = document.querySelectorAll('.day');
    dayElements.forEach(dayElement => {
        dayElement.addEventListener('click', function() {
            changeColor(dayElement);
        });
    });
});