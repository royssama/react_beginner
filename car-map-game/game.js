// 게임 설정
const CONFIG = {
    canvasWidth: 1000,
    canvasHeight: 600,
    carWidth: 30,
    carHeight: 20,
    carSpeed: 4,
    rotationSpeed: 0.08,
    mapWidth: 2000,
    mapHeight: 1500,
    minimapScale: 0.1
};

// 건물/지역 데이터
const LOCATIONS = [
    {
        id: 1,
        name: "시청",
        icon: "🏛️",
        x: 300,
        y: 200,
        width: 120,
        height: 100,
        color: "#4a90d9",
        description: "도시의 행정 중심지입니다. 각종 민원 업무와 도시 계획을 담당합니다.",
        details: {
            "운영 시간": "09:00 - 18:00",
            "전화번호": "02-1234-5678",
            "주소": "중앙로 1번지",
            "시설": "민원실, 세무과, 도시계획과"
        }
    },
    {
        id: 2,
        name: "중앙공원",
        icon: "🌳",
        x: 600,
        y: 150,
        width: 200,
        height: 180,
        color: "#2d8a4e",
        description: "시민들의 휴식 공간입니다. 넓은 잔디밭과 산책로가 있습니다.",
        details: {
            "운영 시간": "24시간",
            "면적": "50,000㎡",
            "시설": "분수대, 벤치, 산책로, 운동기구",
            "주차": "지하주차장 200대"
        }
    },
    {
        id: 3,
        name: "쇼핑몰",
        icon: "🛒",
        x: 150,
        y: 500,
        width: 150,
        height: 120,
        color: "#d94a7b",
        description: "다양한 브랜드와 맛집이 입점한 대형 쇼핑몰입니다.",
        details: {
            "운영 시간": "10:00 - 22:00",
            "층수": "지하 2층 ~ 지상 8층",
            "입점 매장": "350개 이상",
            "편의시설": "푸드코트, 영화관, 키즈존"
        }
    },
    {
        id: 4,
        name: "대학교",
        icon: "🎓",
        x: 500,
        y: 450,
        width: 180,
        height: 150,
        color: "#8b4513",
        description: "1950년에 설립된 명문 대학교입니다.",
        details: {
            "설립년도": "1950년",
            "학생 수": "25,000명",
            "단과대학": "공과대학, 인문대학, 경영대학 등 12개",
            "캠퍼스 면적": "800,000㎡"
        }
    },
    {
        id: 5,
        name: "병원",
        icon: "🏥",
        x: 850,
        y: 300,
        width: 130,
        height: 110,
        color: "#ff6b6b",
        description: "24시간 응급실을 운영하는 종합병원입니다.",
        details: {
            "운영 시간": "24시간 (응급실)",
            "진료과": "내과, 외과, 소아과 등 32개",
            "병상 수": "1,200개",
            "전화번호": "02-9876-5432"
        }
    },
    {
        id: 6,
        name: "기차역",
        icon: "🚂",
        x: 1200,
        y: 200,
        width: 160,
        height: 100,
        color: "#666",
        description: "KTX와 지역 열차가 운행되는 중앙역입니다.",
        details: {
            "운영 시간": "05:00 - 24:00",
            "일일 이용객": "약 50,000명",
            "노선": "KTX, ITX, 무궁화호",
            "편의시설": "편의점, 카페, 물품보관함"
        }
    },
    {
        id: 7,
        name: "경찰서",
        icon: "🚔",
        x: 1000,
        y: 500,
        width: 100,
        height: 90,
        color: "#1e3a5f",
        description: "시민의 안전을 책임지는 중앙경찰서입니다.",
        details: {
            "운영 시간": "24시간",
            "관할 구역": "중앙구 전체",
            "신고전화": "112",
            "민원실": "09:00 - 18:00"
        }
    },
    {
        id: 8,
        name: "도서관",
        icon: "📚",
        x: 1400,
        y: 400,
        width: 120,
        height: 100,
        color: "#9b59b6",
        description: "50만 권 이상의 장서를 보유한 시립 도서관입니다.",
        details: {
            "운영 시간": "09:00 - 21:00 (화-일)",
            "휴관일": "매주 월요일, 공휴일",
            "장서 수": "500,000권 이상",
            "좌석 수": "800석"
        }
    },
    {
        id: 9,
        name: "스포츠 센터",
        icon: "⚽",
        x: 1600,
        y: 150,
        width: 140,
        height: 120,
        color: "#27ae60",
        description: "다양한 스포츠 시설을 갖춘 종합 체육관입니다.",
        details: {
            "운영 시간": "06:00 - 22:00",
            "시설": "수영장, 헬스장, 농구장, 배드민턴장",
            "회원권": "월 50,000원 ~",
            "주차": "200대"
        }
    },
    {
        id: 10,
        name: "박물관",
        icon: "🏛️",
        x: 300,
        y: 900,
        width: 150,
        height: 130,
        color: "#c9a227",
        description: "지역의 역사와 문화를 전시하는 국립 박물관입니다.",
        details: {
            "운영 시간": "10:00 - 18:00 (화-일)",
            "휴관일": "매주 월요일",
            "입장료": "무료",
            "전시실": "상설전시 5개, 특별전시 2개"
        }
    },
    {
        id: 11,
        name: "호텔",
        icon: "🏨",
        x: 700,
        y: 800,
        width: 130,
        height: 140,
        color: "#e74c3c",
        description: "5성급 럭셔리 호텔로 최고의 서비스를 제공합니다.",
        details: {
            "객실 수": "350실",
            "등급": "5성급",
            "부대시설": "레스토랑, 스파, 피트니스",
            "체크인/아웃": "15:00 / 11:00"
        }
    },
    {
        id: 12,
        name: "공장 지대",
        icon: "🏭",
        x: 1100,
        y: 900,
        width: 200,
        height: 150,
        color: "#7f8c8d",
        description: "첨단 기술 산업 단지입니다.",
        details: {
            "면적": "500,000㎡",
            "입주 기업": "120개",
            "주요 업종": "반도체, 자동차 부품, IT",
            "종업원 수": "약 15,000명"
        }
    },
    {
        id: 13,
        name: "놀이공원",
        icon: "🎢",
        x: 1500,
        y: 700,
        width: 180,
        height: 160,
        color: "#f39c12",
        description: "다양한 놀이기구와 공연이 있는 테마파크입니다.",
        details: {
            "운영 시간": "10:00 - 21:00",
            "놀이기구": "40개 이상",
            "입장료": "성인 50,000원, 어린이 35,000원",
            "연간 방문객": "약 500만 명"
        }
    },
    {
        id: 14,
        name: "해변",
        icon: "🏖️",
        x: 1700,
        y: 1000,
        width: 250,
        height: 100,
        color: "#f4d03f",
        description: "아름다운 백사장과 맑은 바다가 있는 해수욕장입니다.",
        details: {
            "해변 길이": "2.5km",
            "개장 기간": "7월 - 8월",
            "수온": "22-26°C (여름)",
            "편의시설": "샤워실, 탈의실, 파라솔 대여"
        }
    },
    {
        id: 15,
        name: "소방서",
        icon: "🚒",
        x: 100,
        y: 1100,
        width: 100,
        height: 90,
        color: "#c0392b",
        description: "화재 진압과 구조 활동을 담당하는 소방서입니다.",
        details: {
            "운영 시간": "24시간",
            "신고전화": "119",
            "소방차": "10대",
            "소방관": "80명"
        }
    }
];

// 도로 데이터
const ROADS = [
    { x1: 0, y1: 350, x2: 2000, y2: 350, width: 60 },
    { x1: 0, y1: 700, x2: 2000, y2: 700, width: 60 },
    { x1: 0, y1: 1050, x2: 2000, y2: 1050, width: 60 },
    { x1: 250, y1: 0, y2: 1500, x2: 250, width: 50 },
    { x1: 600, y1: 0, y2: 1500, x2: 600, width: 50 },
    { x1: 1000, y1: 0, y2: 1500, x2: 1000, width: 50 },
    { x1: 1450, y1: 0, y2: 1500, x2: 1450, width: 50 },
    { x1: 1800, y1: 0, y2: 1500, x2: 1800, width: 50 }
];

// 게임 상태
let gameState = {
    car: {
        x: CONFIG.mapWidth / 2,
        y: CONFIG.mapHeight / 2,
        angle: 0,
        speed: 0
    },
    camera: {
        x: 0,
        y: 0
    },
    keys: {},
    nearbyLocation: null,
    showingPopup: false
};

// 캔버스 초기화
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
canvas.width = CONFIG.canvasWidth;
canvas.height = CONFIG.canvasHeight;

const minimapCanvas = document.getElementById('minimap-canvas');
const minimapCtx = minimapCanvas.getContext('2d');
minimapCanvas.width = CONFIG.mapWidth * CONFIG.minimapScale;
minimapCanvas.height = CONFIG.mapHeight * CONFIG.minimapScale;

// DOM 요소
const posXEl = document.getElementById('pos-x');
const posYEl = document.getElementById('pos-y');
const areaNameEl = document.getElementById('area-name');
const modal = document.getElementById('popup-modal');
const popupIcon = document.getElementById('popup-icon');
const popupTitle = document.getElementById('popup-title');
const popupDescription = document.getElementById('popup-description');
const popupDetails = document.getElementById('popup-details');
const closeBtn = document.querySelector('.close-btn');
const popupCloseBtn = document.getElementById('popup-close-btn');

// 키보드 이벤트
document.addEventListener('keydown', (e) => {
    gameState.keys[e.key.toLowerCase()] = true;
    gameState.keys[e.key] = true;
    
    if (e.key === ' ' && gameState.nearbyLocation && !gameState.showingPopup) {
        showPopup(gameState.nearbyLocation);
    }
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
    }
});

document.addEventListener('keyup', (e) => {
    gameState.keys[e.key.toLowerCase()] = false;
    gameState.keys[e.key] = false;
});

// 팝업 닫기
closeBtn.addEventListener('click', hidePopup);
popupCloseBtn.addEventListener('click', hidePopup);
modal.addEventListener('click', (e) => {
    if (e.target === modal) hidePopup();
});

function showPopup(location) {
    gameState.showingPopup = true;
    modal.classList.remove('hidden');
    
    popupIcon.textContent = location.icon;
    popupTitle.textContent = location.name;
    popupDescription.textContent = location.description;
    
    popupDetails.innerHTML = '';
    for (const [key, value] of Object.entries(location.details)) {
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';
        detailItem.innerHTML = `
            <span class="detail-label">${key}</span>
            <span class="detail-value">${value}</span>
        `;
        popupDetails.appendChild(detailItem);
    }
}

function hidePopup() {
    gameState.showingPopup = false;
    modal.classList.add('hidden');
}

// 자동차 업데이트
function updateCar() {
    if (gameState.showingPopup) return;
    
    const { car, keys } = gameState;
    
    // 가속/감속
    if (keys['arrowup'] || keys['w']) {
        car.speed = Math.min(car.speed + 0.2, CONFIG.carSpeed);
    } else if (keys['arrowdown'] || keys['s']) {
        car.speed = Math.max(car.speed - 0.2, -CONFIG.carSpeed / 2);
    } else {
        car.speed *= 0.95;
        if (Math.abs(car.speed) < 0.1) car.speed = 0;
    }
    
    // 회전
    if (car.speed !== 0) {
        if (keys['arrowleft'] || keys['a']) {
            car.angle -= CONFIG.rotationSpeed * Math.sign(car.speed);
        }
        if (keys['arrowright'] || keys['d']) {
            car.angle += CONFIG.rotationSpeed * Math.sign(car.speed);
        }
    }
    
    // 이동
    car.x += Math.cos(car.angle) * car.speed;
    car.y += Math.sin(car.angle) * car.speed;
    
    // 맵 경계
    car.x = Math.max(CONFIG.carWidth, Math.min(CONFIG.mapWidth - CONFIG.carWidth, car.x));
    car.y = Math.max(CONFIG.carHeight, Math.min(CONFIG.mapHeight - CONFIG.carHeight, car.y));
    
    // 카메라 업데이트
    gameState.camera.x = car.x - CONFIG.canvasWidth / 2;
    gameState.camera.y = car.y - CONFIG.canvasHeight / 2;
    gameState.camera.x = Math.max(0, Math.min(CONFIG.mapWidth - CONFIG.canvasWidth, gameState.camera.x));
    gameState.camera.y = Math.max(0, Math.min(CONFIG.mapHeight - CONFIG.canvasHeight, gameState.camera.y));
    
    // UI 업데이트
    posXEl.textContent = Math.round(car.x);
    posYEl.textContent = Math.round(car.y);
    
    // 근처 건물 체크
    checkNearbyLocations();
}

function checkNearbyLocations() {
    const { car } = gameState;
    let foundLocation = null;
    
    for (const loc of LOCATIONS) {
        const centerX = loc.x + loc.width / 2;
        const centerY = loc.y + loc.height / 2;
        const distance = Math.sqrt(
            Math.pow(car.x - centerX, 2) + Math.pow(car.y - centerY, 2)
        );
        
        if (distance < Math.max(loc.width, loc.height) / 2 + 50) {
            foundLocation = loc;
            break;
        }
    }
    
    gameState.nearbyLocation = foundLocation;
    
    // 근접 알림 표시/숨김
    let alertEl = document.querySelector('.proximity-alert');
    if (foundLocation) {
        areaNameEl.textContent = foundLocation.name;
        if (!alertEl && !gameState.showingPopup) {
            alertEl = document.createElement('div');
            alertEl.className = 'proximity-alert';
            alertEl.textContent = `${foundLocation.icon} ${foundLocation.name} - Space 키로 정보 보기`;
            document.body.appendChild(alertEl);
        } else if (alertEl) {
            alertEl.textContent = `${foundLocation.icon} ${foundLocation.name} - Space 키로 정보 보기`;
        }
    } else {
        areaNameEl.textContent = '-';
        if (alertEl) {
            alertEl.remove();
        }
    }
}

// 그리기 함수들
function drawMap() {
    const { camera } = gameState;
    
    // 배경 (잔디)
    ctx.fillStyle = '#3d7a4a';
    ctx.fillRect(0, 0, CONFIG.canvasWidth, CONFIG.canvasHeight);
    
    // 잔디 패턴
    ctx.fillStyle = '#4a8a5a';
    for (let x = -camera.x % 40; x < CONFIG.canvasWidth; x += 40) {
        for (let y = -camera.y % 40; y < CONFIG.canvasHeight; y += 40) {
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 도로 그리기
    ctx.fillStyle = '#444';
    for (const road of ROADS) {
        const x = road.x1 - camera.x;
        const y = road.y1 - camera.y;
        const w = road.x2 - road.x1 || road.width;
        const h = road.y2 - road.y1 || road.width;
        ctx.fillRect(x - (road.x1 === road.x2 ? road.width/2 : 0), 
                     y - (road.y1 === road.y2 ? road.width/2 : 0), 
                     road.x1 === road.x2 ? road.width : w, 
                     road.y1 === road.y2 ? road.width : h);
    }
    
    // 도로 중앙선
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 15]);
    for (const road of ROADS) {
        ctx.beginPath();
        ctx.moveTo(road.x1 - camera.x, road.y1 - camera.y);
        ctx.lineTo(road.x2 - camera.x, road.y2 - camera.y);
        ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // 건물 그리기
    for (const loc of LOCATIONS) {
        const x = loc.x - camera.x;
        const y = loc.y - camera.y;
        
        // 화면 밖 체크
        if (x + loc.width < 0 || x > CONFIG.canvasWidth ||
            y + loc.height < 0 || y > CONFIG.canvasHeight) continue;
        
        // 건물 그림자
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(x + 5, y + 5, loc.width, loc.height);
        
        // 건물 본체
        ctx.fillStyle = loc.color;
        ctx.fillRect(x, y, loc.width, loc.height);
        
        // 건물 테두리
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, loc.width, loc.height);
        
        // 아이콘과 이름
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(loc.icon, x + loc.width / 2, y + loc.height / 2);
        
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeText(loc.name, x + loc.width / 2, y + loc.height + 15);
        ctx.fillText(loc.name, x + loc.width / 2, y + loc.height + 15);
    }
}

function drawCar() {
    const { car, camera } = gameState;
    const screenX = car.x - camera.x;
    const screenY = car.y - camera.y;
    
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(car.angle);
    
    // 자동차 몸체
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(-CONFIG.carWidth / 2, -CONFIG.carHeight / 2, CONFIG.carWidth, CONFIG.carHeight);
    
    // 자동차 지붕
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(-CONFIG.carWidth / 4, -CONFIG.carHeight / 3, CONFIG.carWidth / 2, CONFIG.carHeight / 1.5);
    
    // 앞유리
    ctx.fillStyle = '#85c1e9';
    ctx.fillRect(CONFIG.carWidth / 6, -CONFIG.carHeight / 4, CONFIG.carWidth / 5, CONFIG.carHeight / 2);
    
    // 헤드라이트
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(CONFIG.carWidth / 2 - 3, -CONFIG.carHeight / 3, 3, 5);
    ctx.fillRect(CONFIG.carWidth / 2 - 3, CONFIG.carHeight / 3 - 5, 3, 5);
    
    // 바퀴
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(-CONFIG.carWidth / 2 + 2, -CONFIG.carHeight / 2 - 3, 8, 6);
    ctx.fillRect(-CONFIG.carWidth / 2 + 2, CONFIG.carHeight / 2 - 3, 8, 6);
    ctx.fillRect(CONFIG.carWidth / 2 - 10, -CONFIG.carHeight / 2 - 3, 8, 6);
    ctx.fillRect(CONFIG.carWidth / 2 - 10, CONFIG.carHeight / 2 - 3, 8, 6);
    
    ctx.restore();
}

function drawMinimap() {
    const scale = CONFIG.minimapScale;
    
    // 배경
    minimapCtx.fillStyle = '#2d5a3d';
    minimapCtx.fillRect(0, 0, minimapCanvas.width, minimapCanvas.height);
    
    // 도로
    minimapCtx.fillStyle = '#444';
    for (const road of ROADS) {
        if (road.x1 === road.x2) {
            minimapCtx.fillRect(road.x1 * scale - road.width * scale / 2, 
                               road.y1 * scale, 
                               road.width * scale, 
                               (road.y2 - road.y1) * scale);
        } else {
            minimapCtx.fillRect(road.x1 * scale, 
                               road.y1 * scale - road.width * scale / 2, 
                               (road.x2 - road.x1) * scale, 
                               road.width * scale);
        }
    }
    
    // 건물
    for (const loc of LOCATIONS) {
        minimapCtx.fillStyle = loc.color;
        minimapCtx.fillRect(loc.x * scale, loc.y * scale, 
                           loc.width * scale, loc.height * scale);
    }
    
    // 카메라 뷰
    minimapCtx.strokeStyle = '#00d4ff';
    minimapCtx.lineWidth = 2;
    minimapCtx.strokeRect(gameState.camera.x * scale, 
                         gameState.camera.y * scale,
                         CONFIG.canvasWidth * scale, 
                         CONFIG.canvasHeight * scale);
    
    // 자동차 위치
    minimapCtx.fillStyle = '#ff0';
    minimapCtx.beginPath();
    minimapCtx.arc(gameState.car.x * scale, 
                   gameState.car.y * scale, 
                   5, 0, Math.PI * 2);
    minimapCtx.fill();
}

// 게임 루프
function gameLoop() {
    updateCar();
    drawMap();
    drawCar();
    drawMinimap();
    requestAnimationFrame(gameLoop);
}

// 게임 시작
console.log('🚗 2D 자동차 지도 탐험 게임 시작!');
console.log('방향키 또는 WASD로 조종, Space로 정보 보기');
gameLoop();
