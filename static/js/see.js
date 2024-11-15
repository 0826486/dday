document.addEventListener('DOMContentLoaded', function() {
    // 디데이 정보를 표시할 함수
    function displaySavedDday() {
        const savedTitle = localStorage.getItem('savedTitle');
        const savedDate = localStorage.getItem('savedDate');
        const savedTitleColor = localStorage.getItem('savedTitleColor');
        const savedBackgroundImage = localStorage.getItem('savedBackgroundImage');

        const ddayList = document.getElementById('ddayList');
        
        // 저장된 정보가 있을 경우
        if (savedTitle && savedDate) {
            // 디데이 항목을 동적으로 생성
            const ddayItem = document.createElement('div');
            ddayItem.classList.add('dday-item');
            ddayItem.style.color = savedTitleColor || 'black'; // 저장된 제목 색상 적용

            // 제목과 날짜 표시
            const titleElement = document.createElement('h3');
            titleElement.textContent = savedTitle;

            const dateElement = document.createElement('p');
            dateElement.textContent = `D-day: ${savedDate}`;

            // 배경 이미지가 저장되어 있으면 배경 적용
            if (savedBackgroundImage) {
                ddayItem.style.backgroundImage = savedBackgroundImage;
                ddayItem.style.backgroundSize = 'cover';
                ddayItem.style.backgroundPosition = 'center';
            }

            // 생성된 항목을 리스트에 추가
            ddayItem.appendChild(titleElement);
            ddayItem.appendChild(dateElement);
            ddayList.appendChild(ddayItem);
        } else {
            const noDdayMessage = document.createElement('p');
            noDdayMessage.textContent = '저장된 디데이가 없습니다.';
            ddayList.appendChild(noDdayMessage);
        }
    }

    // 페이지 로드 시 디데이 정보 표시
    displaySavedDday();
});