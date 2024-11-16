document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');

    // 이미지 업로드 이벤트 처리
    if (imageUpload) { // imageUpload 요소가 있을 경우에만 동작
        imageUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    // Base64 형식으로 이미지 데이터를 localStorage에 저장
                    localStorage.setItem('savedBackgroundImage', e.target.result);
                    alert('이미지가 저장되었습니다.');
                };

                reader.readAsDataURL(file);
            }
        });
    }

    // 디데이 정보를 표시할 함수
    function displaySavedDday() {
        const savedTitle = localStorage.getItem('savedTitle');
        const savedDate = localStorage.getItem('savedDate');
        const savedTitleColor = localStorage.getItem('savedTitleColor');
        const savedBackgroundImage = localStorage.getItem('savedBackgroundImage');

        const ddayList = document.getElementById('ddayList');
        ddayList.innerHTML = ''; // 이전 내용 초기화

        // 저장된 정보가 있을 경우
        if (savedTitle && savedDate) {
            const ddayItem = document.createElement('div');
            ddayItem.classList.add('dday-item');

            // 제목 색상 적용
            ddayItem.style.color = savedTitleColor || 'black';

            // 이미지 컨테이너 추가
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('img-container');

            const img = document.createElement('img');
            img.src = savedBackgroundImage || '/static/images/default-image.jpg'; // 저장된 이미지 또는 기본 이미지 사용
            img.classList.add('day');

            imgContainer.appendChild(img);

            // 텍스트 컨테이너 추가
            const textContainer = document.createElement('div');
            textContainer.classList.add('text-container');

            const titleElement = document.createElement('h3');
            titleElement.textContent = savedTitle;

            const dateElement = document.createElement('p');
            const dday = calculateDday(savedDate);
            dateElement.textContent = `D-${dday}`;

            textContainer.appendChild(titleElement);
            textContainer.appendChild(dateElement);

            // 생성된 항목을 리스트에 추가
            ddayItem.appendChild(imgContainer);
            ddayItem.appendChild(textContainer);
            ddayList.appendChild(ddayItem);
        } else {
            const noDdayMessage = document.createElement('p');
            noDdayMessage.textContent = '저장된 디데이가 없습니다.';
            ddayList.appendChild(noDdayMessage);
        }
    }

    // D-day 계산 함수
    function calculateDday(date) {
        const today = new Date();
        const targetDate = new Date(date);
        const timeDiff = targetDate - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // 일 단위로 차이 계산
        return daysLeft;
    }

    // 페이지 로드 시 디데이 정보 표시
    displaySavedDday();
});