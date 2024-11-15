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

        // 선택된 요소의 인덱스를 로컬 저장소에 저장하여 상태 유지
        const selectedIndex = Array.from(days).indexOf(selectedElement);
        localStorage.setItem('selectedDayIndex', selectedIndex);
    }

    // 페이지 로드 시 마지막으로 선택된 디데이 색상 복원
    function restoreColor() {
        const selectedIndex = localStorage.getItem('selectedDayIndex');
        if (selectedIndex !== null) {
            const days = document.querySelectorAll('.day');
            const selectedElement = days[selectedIndex];
            if (selectedElement) {
                selectedElement.classList.add('active');
            }
        }
    }

    // 색상 복원 호출
    restoreColor();

    // 각 디데이 항목에 클릭 이벤트 추가
    const dayElements = document.querySelectorAll('.day');
    dayElements.forEach(day => {
        day.addEventListener('click', function() {
            changeColor(day);
        });
    });

    // 제목 색상 선택
    function openColorPalette() {
        document.getElementById('colorPalettePopup').classList.remove('hidden');
    }

    function updateTitleColor() {
        const titleColor = document.getElementById('titleColorPicker').value;
        document.getElementById('title').style.color = titleColor;
    }

    function applyTitleColor() {
        const titleColor = document.getElementById('titleColorPicker').value;
        localStorage.setItem('titleColor', titleColor);  // 색상 저장
        closePopup('colorPalettePopup');
    }

    function closePopup(popupId) {
        document.getElementById(popupId).classList.add('hidden');
    }

    // 이미지 선택
    function openImagePicker() {
        document.getElementById('imagePickerPopup').classList.remove('hidden');
    }

    function previewImage(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imagePreview = document.getElementById('thumbnailPreview');
                imagePreview.style.backgroundImage = `url(${e.target.result})`;
                imagePreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    }

    function applyBackgroundImage() {
        const imageUrl = document.getElementById('thumbnailPreview').style.backgroundImage;
        localStorage.setItem('backgroundImage', imageUrl);  // 배경 이미지 URL 저장
        closePopup('imagePickerPopup');
    }

    // 저장 버튼 클릭 시 로컬스토리지에 데이터 저장
    document.getElementById('saveButton').addEventListener('click', function() {
        const title = document.getElementById('title').value;
        const date = document.getElementById('date').value;

        // 색상, 배경 이미지 정보도 함께 저장
        const titleColor = localStorage.getItem('titleColor');
        const backgroundImage = localStorage.getItem('backgroundImage');

        // 로컬 스토리지에 디데이 정보 저장
        localStorage.setItem('savedTitle', title);
        localStorage.setItem('savedDate', date);
        localStorage.setItem('savedTitleColor', titleColor);
        localStorage.setItem('savedBackgroundImage', backgroundImage);

        // 저장 후 see 페이지로 이동
        window.location.href = "{{ url_for('see') }}";
    });
});