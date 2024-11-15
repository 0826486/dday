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

    // 디데이 저장 버튼 클릭 이벤트
    document.getElementById('saveButton').addEventListener('click', function() {
        const title = document.getElementById('title').value;
        const date = document.getElementById('date').value;
        const imageUrl = document.getElementById('thumbnailPreview').style.backgroundImage.replace('url("', '').replace('")', '');  // 미리보기 이미지 URL 가져오기

        if (!title || !date || !imageUrl) {
            alert('제목, 날짜, 이미지 URL을 모두 입력해주세요!');
            return;
        }

        // 디데이 추가 API 호출
        fetch('/add_dday', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                date: date,
                imageUrl: imageUrl
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            // 디데이 추가 후 입력 필드 초기화
            document.getElementById('title').value = '';
            document.getElementById('date').value = '';
            document.getElementById('thumbnailPreview').style.backgroundImage = '';  // 미리보기 초기화
        })
        .catch(error => {
            console.error('디데이 추가 중 오류 발생:', error);
        });
    });

    // 디데이 목록 가져오기
    function getDdys() {
        fetch('/get_ddays')
            .then(response => response.json())
            .then(data => {
                const ddayListContainer = document.getElementById('ddayList');
                ddayListContainer.innerHTML = '';  // 기존 목록 초기화

                // 각 디데이 항목을 화면에 추가
                data.forEach(dday => {
                    const ddayElement = document.createElement('div');
                    ddayElement.classList.add('dday-item');
                    ddayElement.innerHTML = `
                        <div class="dday-title">${dday.title}</div>
                        <div class="dday-date">${dday.date}</div>
                        <div class="dday-image" style="background-image: url('${dday.imageUrl}')"></div>
                    `;
                    ddayListContainer.appendChild(ddayElement);
                });
            })
            .catch(error => {
                console.error('디데이 목록 가져오기 중 오류 발생:', error);
            });
    }

    // 페이지 로딩 시 디데이 목록을 가져옴
    getDdys();

    // 색상 복원 기능 호출
    restoreColor();
});