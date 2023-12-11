// 현재 시간을 반환하는 함수
export function getCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString();
}

// 1초마다 현재 시간을 업데이트하는 함수
export function updateClock() {
  const timeElement = document.getElementById('clock');
  if (timeElement) {
    timeElement.textContent = getCurrentTime();
  }
}



