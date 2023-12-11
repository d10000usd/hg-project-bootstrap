<template>
  <div>
    <!-- a 헤더 바 -->
    <header v-if="showHeaderA" class="header-a">
      <nav class="title navbar navbar-expand-lg bg-body-tertiary">
        <div>
          <RouterLink class="navbar-brand copy " to="/NaviJsonView">NaviJson</RouterLink>
          <RouterLink class="navbar-brand copy " to="/TelegramView">TelegramView  </RouterLink>
          <RouterLink class="navbar-brand copy " to="/TsWebsocket_main">Report  </RouterLink>
          <RouterLink class="navbar-brand copy " to="/RealTimeChartView">ct  </RouterLink>
          <RouterLink class="navbar-brand copy " to="/WebSearchView">WSV  </RouterLink>
        </div>
      </nav>
    </header>
    <!-- b 헤더 바 -->
    <header v-else class=" header-b ">
      <RouterLink class="navbar-brand copy " to="/NaviJsonView">NaviJson | </RouterLink>
      <RouterLink class="navbar-brand copy " to="/TsWebsocket_allView">전체 | </RouterLink>
      <RouterLink class="navbar-brand copy " to="/TsWebsocket_holdView">보유 | </RouterLink>
      <RouterLink class="navbar-brand copy " to="/TsWebsocket_watchView">관심 |</RouterLink>
      <RouterLink class="navbar-brand copy " to="/TsWebsocket_all_orderingView">테이블 </RouterLink> 
      <RouterLink class="grid-cell"
        :to="{ name: 'TsWebsocket_Report', query: { message: JSON.stringify(['KRW-BTC']) } }">
        BTC
      </RouterLink>
    </header>
    <!-- 여기에 나머지 내용 추가 -->
  </div>
</template>
<script setup>

import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink } from 'vue-router'
const showHeaderA = ref(true);

// 스크롤 이벤트 핸들러를 등록합니다.
const handleScroll = () => {
  if (window.scrollY > 280) {
    // 스크롤 위치가 100 이상이면 a 헤더 바를 숨기고 b 헤더 바를 표시합니다.
    showHeaderA.value = false;
  } else {
    // 스크롤 위치가 100 미만이면 a 헤더 바를 표시하고 b 헤더 바를 숨깁니다.
    showHeaderA.value = true;
  }
};

onMounted(() => {
  // 스크롤 이벤트 리스너를 등록합니다.
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  // 컴포넌트가 소멸될 때 스크롤 이벤트 리스너를 제거합니다.
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped  >
/* 공통 스타일 */
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: right;
  align-items: center;
  height: 60px;
  color: white;
  z-index: 2;
  /* 헤더 바의 층위를 설정합니다. */
}

/* a 헤더 바 스타일 */
.header-a {
  background-color: rgb(255, 255, 255);
  font-size: 12px;
  /* 크게 만들기 */
  height: 50px;
  font-size: 16px;
  margin-bottom: 150px;
  z-index: 112;

}

/* b 헤더 바 스타일 */
.header-b {
  background-color: black;
  font-size: 24px;
  /* 크게 만들기 */
  height: 50px;
  font-size: 16px;
  margin-bottom: 150px;
  z-index: 112;
  /* 작게 만들기 */
}

.spacing {
  margin: 60px;
}

.title {
  font-size: 1.3rem;
  font-weight: bold;
  line-height: 1.2;
}

.copy {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  font-style: italic;
  line-height: 1.35;
}
</style>

