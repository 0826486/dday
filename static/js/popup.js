// 팝업 열기
function openColorPalette() {
    document.getElementById('colorPalettePopup').classList.remove('hidden');
}

function openImagePicker() {
    document.getElementById('imagePickerPopup').classList.remove('hidden');
}

// 팝업 닫기
function closePopup(popupId) {
    document.getElementById(popupId).classList.add('hidden');
}

// 제목 색상 적용
function updateTitleColor() {
    const color = document.getElementById('titleColorPicker').value;
    document.getElementById('title').style.color = color; // 제목 요소의 ID가 'title'인지 확인
}

function applyTitleColor() {
    closePopup('colorPalettePopup');
}

// 이미지 미리보기
function previewImage(event) {
    const imagePreview = document.getElementById('imagePreview');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Selected Image">`;
    };
    reader.readAsDataURL(file);
}

// 사진 선택 시 미리 보기 생성
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const thumbnailPreview = document.getElementById('imagePreview');
            thumbnailPreview.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: auto;">`;
            thumbnailPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

// 배경 이미지 적용
let selectedBackgroundImage = null;

function applyBackgroundImage() {
    const fileInput = document.getElementById('backgroundImageInput');
    if (fileInput.files.length > 0) {
        const selectedImage = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            // 선택한 이미지를 작은 미리보기로 보여주기
            const thumbnailPreview = document.getElementById('thumbnailPreview');
            thumbnailPreview.style.backgroundImage = `url(${e.target.result})`;
            thumbnailPreview.classList.remove('hidden');
        };
        reader.readAsDataURL(selectedImage);
    }
    closePopup('imagePickerPopup');
}

// 이미지 미리보기
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // 선택된 이미지 미리보기
            const thumbnailPreview = document.getElementById('imagePreview');
            thumbnailPreview.style.backgroundImage = `url(${e.target.result})`;
            thumbnailPreview.classList.remove('hidden'); // 숨김 해제
        };
        reader.readAsDataURL(file);
    }
}

// 저장 버튼 기능
function saveDday() {
    if (selectedBackgroundImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector('.dday-background').style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(selectedBackgroundImage);
    }
    alert('저장되었습니다.');
}

// 이미지 미리보기
function previewImage(event) {
    const file = event.target.files[0];
    const thumbnailPreview = document.getElementById('thumbnailPreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            thumbnailPreview.style.backgroundImage = `url(${e.target.result})`;
            thumbnailPreview.classList.remove('hidden'); // 숨김 클래스를 제거하여 보이게 함
            thumbnailPreview.classList.add('visible'); // visible 클래스를 추가하여 표시
            thumbnailPreview.style.display = 'block'; // 보이게 설정
        };
        reader.readAsDataURL(file);
    }
}

// 저장 버튼 기능
function saveDday() {
    alert('저장되었습니다.');
}