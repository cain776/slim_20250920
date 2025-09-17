# 📦 WMS System - eXpert slim

> 통합 주문 관리 시스템 (Warehouse Management System)

## 📋 프로젝트 개요

**eXpert slim**은 다양한 온라인 쇼핑몰의 주문을 통합 관리하는 WMS(Warehouse Management System)입니다. 
API 연동과 엑셀 파일을 통한 주문 수집, 자동 등록, 재고 관리 등의 기능을 제공합니다.

### 주요 특징
- 🚀 **다중 쇼핑몰 통합 관리**
- 📊 **실시간 주문 정보 조회**
- 🔄 **자동 주문 수집 및 등록**
- 📈 **엑셀 대량 등록 지원**
- 🎯 **직관적인 사용자 인터페이스**

## 🛠️ 기술 스택

### Frontend
- **HTML5** / **CSS3** / **JavaScript (ES6+)**
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **Lucide Icons** - 아이콘 라이브러리
- **Flatpickr** - 날짜 선택기

### 주요 라이브러리
```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Pretendard Font -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-jp.min.css" />

<!-- Lucide Icons -->
<script src="https://unpkg.com/lucide@latest"></script>

<!-- Flatpickr -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
```

## 📁 프로젝트 구조

```
0920/
├── index.html              # 메인 페이지
├── start-server.bat        # 로컬 서버 실행 스크립트
├── backup-manager.bat      # 백업 관리 도구
├── quick-restore.bat       # 빠른 복구 도구
│
├── css/
│   └── main.css           # 메인 스타일시트
│
├── js/
│   ├── main.js            # 메인 JavaScript
│   └── change-tracker.js  # 변경사항 추적 시스템
│
├── pages/                 # 페이지 컴포넌트
│   ├── api-integration.html
│   ├── auto-registration.html
│   ├── auto-registration-settings-new.html
│   ├── bulk-registration.html
│   └── order-info-inquiry.html
│
└── modals/                # 모달 컴포넌트
    ├── api-integration-modal.html
    ├── api-registration-modal.html
    └── auto-registration-settings-modal.html
```

## 🚀 시작하기

### 필요 사항
- 최신 웹 브라우저 (Chrome, Firefox, Edge 등)
- Python 3.x (로컬 서버 실행용)

### 설치 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/cain776/slim_20250920.git
cd slim_20250920
```

2. **로컬 서버 실행**

#### 방법 1: 배치 파일 사용 (Windows)
```bash
.\start-server.bat
```

#### 방법 2: Python 직접 실행
```bash
python -m http.server 8000
```

3. **브라우저에서 접속**
```
http://localhost:8000
```

## 💼 주요 기능

### 1. 주문 관리
- **주문정보관리**: 통합 주문 조회 및 관리
- **주문 검색**: 다양한 조건으로 주문 검색
- **주문 수정/삭제**: 주문 정보 편집 기능
- **엑셀 내보내기**: 주문 데이터 엑셀 다운로드

### 2. API 연동
- **쇼핑몰 API 연동**: 11번가, G마켓, 쿠팡 등
- **실시간 주문 수집**: API를 통한 자동 주문 수집
- **상태 동기화**: 주문 상태 실시간 업데이트

### 3. 자동 등록
- **자동 수집 설정**: 수집 스케줄 관리
- **예외 처리**: 수집 오류 관리
- **대상 쇼핑몰 선택**: 선택적 쇼핑몰 수집

### 4. 대량 등록
- **엑셀 업로드**: 대량 주문 데이터 업로드
- **데이터 검증**: 업로드 데이터 유효성 검사
- **일괄 처리**: 대량 데이터 일괄 등록

## 🔧 개발 도구

### 백업 관리
- `backup-manager.bat`: 체계적인 백업 관리 시스템
- `quick-restore.bat`: 빠른 복구 도구
- `change-tracker.js`: 실시간 변경사항 추적

### Git 명령어
```bash
# 변경사항 커밋
git add .
git commit -m "커밋 메시지"
git push

# 브랜치 관리
git checkout -b feature/새기능
git merge main

# 이전 버전 복구
git log --oneline
git checkout [커밋해시]
```

## 📊 성능 최적화

### 적용된 최적화
- ✅ CSS 특정성 개선으로 `!important` 최소화
- ✅ 이벤트 위임 패턴 적용
- ✅ DOM 조작 최적화
- ✅ 효율적인 클래스 관리

### 예정된 개선사항
- 📌 가상 스크롤링 구현
- 📌 코드 스플리팅
- 📌 리소스 레이지 로딩
- 📌 상태 관리 시스템 도입

## 🤝 기여하기

버그 리포트, 기능 제안, 풀 리퀘스트를 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이센스

이 프로젝트는 비공개 프로젝트입니다. 무단 복제 및 배포를 금지합니다.

## 👥 개발팀

- **개발**: cain776
- **최종 업데이트**: 2025년 1월 (개발 진행 중)

## 📞 문의

프로젝트 관련 문의사항은 GitHub Issues를 통해 남겨주세요.

---

<div align="center">
  <strong>eXpert slim</strong> - Warehouse Management System<br>
  Made with ❤️ by cain776
</div>
