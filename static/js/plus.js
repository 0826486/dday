document.getElementById('saveButton').addEventListener('click', function() {
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const imageUrl = document.getElementById('imageUrl').value;

    // 입력 값이 모두 있는지 확인
    if (title && date && imageUrl) {
        const savedDdays = JSON.parse(localStorage.getItem("savedDdays")) || [];
        savedDdays.push({ title, date, imageUrl });
        localStorage.setItem("savedDdays", JSON.stringify(savedDdays));

        // 저장 후 디데이 보기 페이지로 이동
        window.location.href = '/html/plus.html'; 
    } else {
        alert('모든 필드를 입력해주세요.');
    }
});

function loadDdays() {
    const savedDdays = JSON.parse(localStorage.getItem("savedDdays")) || [];

    savedDdays.forEach(dday => {
        const newDday = document.createElement('div');
        newDday.innerHTML = `
            <div>
                <img src="${dday.imageUrl}" class="day">
                <div class="text-container">
                    <p class="test">${dday.title}</p>
                    <p class="test">D-${calculateDaysUntil(dday.date)}</p>
                </div>
            </div>
        `;
        document.querySelector('.new-d-day-container').appendChild(newDday);
    });
}

function calculateDaysUntil(targetDate) {
    const today = new Date();
    const endDate = new Date(targetDate);
    const timeDiff = endDate - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff >= 0 ? daysDiff : 0;
}

// saveData 함수 - 서버로 데이터 전송
function saveData() {
    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const imageInput = document.getElementById("backgroundImageInput");
    const imageUrl = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : '';

    fetch('/add_dday', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, date, imageUrl })
    })
    .then(response => {
        if (response.ok) {
            alert("저장되었습니다.");
            window.location.href = "/html/plus.html"; // 페이지 이동
        } else {
            alert("저장에 실패했습니다.");
        }
    })
    .catch(error => console.error('Error:', error));
}

// 페이지 로드 시 loadDdays 함수 호출
window.onload = loadDdays;