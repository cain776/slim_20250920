/**
 * WMS System - Enhanced Version (호환성 유지)
 * 기존 코드와 100% 호환되면서 성능 개선
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONSTANTS (기존 구조 유지) ---
    const CONSTANTS = {
        PAGE_IDS: {
            ORDER_INFO_INQUIRY: 'order-info-inquiry',
            ORDER_HOLD_MANAGEMENT: 'order-hold-management',
            NOTICE_BOARD: 'notice-board',
            INQUIRY_MANAGEMENT: 'inquiry-management',
            API_INTEGRATION: 'api-integration',
            AUTO_REGISTRATION: 'auto-registration',
            BULK_REGISTRATION: 'bulk-registration',
            AUTO_REGISTRATION_SETTINGS: 'auto-registration-settings',
            AUTO_REGISTRATION_SETTINGS_NEW: 'auto-registration-settings-new'
        }
    };

    // --- PAGE CONFIG (기존 구조 유지) ---
    const PAGE_CONFIG = {
        [CONSTANTS.PAGE_IDS.API_INTEGRATION]: {
            malls: ['11번가', 'G마켓', '쿠팡', '네이버', '카카오', '인터파크', '위메프', 'SSG', '롯데ON', 'AK몰']
        },
        [CONSTANTS.PAGE_IDS.AUTO_REGISTRATION]: {
            malls: ['전체', '11번가', 'G마켓', '쿠팡', '네이버', '카카오'],
            orderStatus: {
                '전체': ['전체', '신규주문', '배송준비중', '배송중', '배송완료'],
                '11번가': ['전체', '신규주문', '결제완료', '배송준비중', '배송중'],
                'G마켓': ['전체', '입금대기', '결제완료', '배송준비', '배송중', '배송완료'],
                '쿠팡': ['전체', '주문접수', '결제확인', '상품준비', '배송중', '배송완료'],
                '네이버': ['전체', '신규주문', '발송대기', '발송처리', '배송중', '배송완료'],
                '카카오': ['전체', '입금대기', '결제완료', '배송준비', '배송완료']
            },
            dateTypes: {
                '전체': ['주문일', '결제일', '배송일'],
                '11번가': ['주문일시', '결제일시', '발송일시'],
                'G마켓': ['주문일자', '입금일자', '발송일자', '배송완료일'],
                '쿠팡': ['주문일', '결제완료일', '출고일', '배송완료일'],
                '네이버': ['주문일시', '결제일시', '발송일시', '구매확정일'],
                '카카오': ['주문일', '결제일', '발송예정일', '배송완료일']
            }
        }
    };

    // --- 성능 개선: DOM 캐싱 ---
    const domCache = new Map();
    function getCachedElement(selector) {
        if (!domCache.has(selector)) {
            domCache.set(selector, document.querySelector(selector));
        }
        return domCache.get(selector);
    }

    // --- 성능 개선: Debounce 유틸리티 ---
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // --- APP STATE (기존 구조 유지) ---
    const app = {
        state: {
            currentPage: null,
            activeMenu: null,
            sidebarCollapsed: false
        },
        elements: {
            sidebar: getCachedElement('#sidebar-nav'),
            contentArea: getCachedElement('.content-area'),
            topBarTitle: getCachedElement('#top-bar-title'),
            sidebarToggle: getCachedElement('#sidebar-toggle')
        }
    };

    // --- 페이지 초기화 함수들 (기존 구조 유지) ---
    const pageInitializers = {
        [CONSTANTS.PAGE_IDS.API_INTEGRATION]: initializeApiIntegrationPage,
        [CONSTANTS.PAGE_IDS.NOTICE_BOARD]: initializeNoticeBoardPage,
        [CONSTANTS.PAGE_IDS.INQUIRY_MANAGEMENT]: initializeInquiryManagementPage,
        [CONSTANTS.PAGE_IDS.AUTO_REGISTRATION]: initializeAutoRegistrationPage,
        [CONSTANTS.PAGE_IDS.AUTO_REGISTRATION_SETTINGS_NEW]: initializeAutoRegistrationSettingsNewPage,
        [CONSTANTS.PAGE_IDS.BULK_REGISTRATION]: initializeBulkRegistrationPage
    };

    const modalInitializers = {
        'api-integration-modal': initializeApiIntegrationModal,
        'api-registration-modal': initializeApiRegistrationModal,
        'wms-selection-modal': initializeWmsSelectionModal,
        'auto-registration-settings-modal': initializeAutoRegistrationSettingsModal
    };

    // --- 기존 함수들 (성능 개선 적용) ---
    
    function initializeNoticeBoardPage(contentRoot) {
        // 공지사항 페이지 초기화
        console.log('공지사항 페이지 초기화');
    }
    
    function initializeInquiryManagementPage(contentRoot) {
        // 문의관리 페이지 초기화
        console.log('문의관리 페이지 초기화');
        
        // 날짜 피커 초기화 (자동등록과 동일)
        const dateRangePicker = contentRoot.querySelector('[data-id="date-range-picker"]');
        if (dateRangePicker && window.flatpickr) {
            flatpickr(dateRangePicker, {
                mode: "range",
                dateFormat: "Y-m-d",
                locale: "ko",
                placeholder: "날짜를 선택하세요"
            });
        }
    }
    
    function initializeApiIntegrationPage(contentRoot) {
        // console.log('API 연동관리 페이지 초기화');
        
        // 이벤트 위임으로 개선
        contentRoot.addEventListener('click', function(e) {
            // 설정 버튼 처리
            if (e.target.closest('.btn-settings')) {
                const mallCard = e.target.closest('.mall-card');
                const mallName = mallCard?.querySelector('h3')?.textContent;
                // console.log(`${mallName} 설정 클릭`);
            }
            
            // 테스트 버튼 처리
            if (e.target.closest('.btn-test')) {
                const mallCard = e.target.closest('.mall-card');
                const mallName = mallCard?.querySelector('h3')?.textContent;
                // console.log(`${mallName} 테스트 클릭`);
            }
        });
    }

    function initializeAutoRegistrationPage(contentRoot) {
        // console.log('자동등록 페이지 초기화');
        
        // 셀렉트박스 찾기 (다양한 선택자 지원)
        const mallSelect = contentRoot.querySelector('#mall-select, [data-id="mall-select"], select[name="mall"]');
        const orderStatusSelect = contentRoot.querySelector('#order-status-select, [data-id="order-status-select"], select[name="orderStatus"]');
        const dateTypeSelect = contentRoot.querySelector('#date-type-select, [data-id="date-type-select"], select[name="dateType"]');

        const populateSelect = (selectElement, options) => {
            if (!selectElement) return;
            
            // DocumentFragment로 성능 개선
            const fragment = document.createDocumentFragment();
            selectElement.innerHTML = '';
            
            // 첫 번째 옵션은 빈 값으로 (플레이스홀더)
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.disabled = true;
            emptyOption.selected = true;
            fragment.appendChild(emptyOption);
            
            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                fragment.appendChild(optionElement);
            });
            
            selectElement.appendChild(fragment);
            
            // 플로팅 라벨은 값이 선택되었을 때만 활성화
            // 옵션을 채운 직후에는 has-value를 추가하지 않음
            const wrapper = selectElement.closest('.floating-label-group');
            if (wrapper) {
                wrapper.classList.remove('has-value');
            }
        };

        const updateDependentSelects = () => {
            const selectedMall = mallSelect?.value;
            const config = PAGE_CONFIG[CONSTANTS.PAGE_IDS.AUTO_REGISTRATION];

            // 큐텐(qoo10jp)과 플레이오토(playauto)일 때만 활성화
            if (selectedMall === 'qoo10jp' || selectedMall === 'playauto') {
                // 활성화
                if (orderStatusSelect) {
                    orderStatusSelect.disabled = false;
                    const wrapper = orderStatusSelect.closest('.floating-label-group');
                    if (wrapper) wrapper.classList.remove('opacity-50');
                }
                if (dateTypeSelect) {
                    dateTypeSelect.disabled = false;
                    const wrapper = dateTypeSelect.closest('.floating-label-group');
                    if (wrapper) wrapper.classList.remove('opacity-50');
                }
                
                // 옵션 채우기
                populateSelect(orderStatusSelect, config.orderStatus[selectedMall] || 
                    ['전체', '신규주문', '결제완료', '배송준비중', '배송중', '배송완료']);
                populateSelect(dateTypeSelect, config.dateTypes[selectedMall] || 
                    ['주문일', '결제일', '배송일']);
            } else {
                // 비활성화
                if (orderStatusSelect) {
                    orderStatusSelect.disabled = true;
                    orderStatusSelect.innerHTML = '<option value="" disabled selected></option>';
                    const wrapper = orderStatusSelect.closest('.floating-label-group');
                    if (wrapper) {
                        wrapper.classList.add('opacity-50');
                        wrapper.classList.remove('has-value');
                    }
                }
                if (dateTypeSelect) {
                    dateTypeSelect.disabled = true;
                    dateTypeSelect.innerHTML = '<option value="" disabled selected></option>';
                    const wrapper = dateTypeSelect.closest('.floating-label-group');
                    if (wrapper) {
                        wrapper.classList.add('opacity-50');
                        wrapper.classList.remove('has-value');
                    }
                }
            }
        };

        if (mallSelect) {
            mallSelect.addEventListener('change', updateDependentSelects);
            // 초기 상태 설정 - 비활성화 상태로 시작
            if (orderStatusSelect) {
                orderStatusSelect.disabled = true;
                const wrapper = orderStatusSelect.closest('.floating-label-group');
                if (wrapper) wrapper.classList.add('opacity-50');
                
                // 주문상태 선택 시 플로팅 라벨 활성화
                orderStatusSelect.addEventListener('change', function() {
                    const wrapper = this.closest('.floating-label-group');
                    if (wrapper) {
                        if (this.value) {
                            wrapper.classList.add('has-value');
                        } else {
                            wrapper.classList.remove('has-value');
                        }
                    }
                });
            }
            if (dateTypeSelect) {
                dateTypeSelect.disabled = true;
                const wrapper = dateTypeSelect.closest('.floating-label-group');
                if (wrapper) wrapper.classList.add('opacity-50');
                
                // 날짜유형 선택 시 플로팅 라벨 활성화
                dateTypeSelect.addEventListener('change', function() {
                    const wrapper = this.closest('.floating-label-group');
                    if (wrapper) {
                        if (this.value) {
                            wrapper.classList.add('has-value');
                        } else {
                            wrapper.classList.remove('has-value');
                        }
                    }
                });
            }
            updateDependentSelects();
        }
        
        // 데이트피커 초기화
        const datePicker = contentRoot.querySelector('[data-id="date-range-picker"], input[type="date"], .date-picker');
        if (datePicker && window.flatpickr) {
            datePicker._flatpickr = flatpickr(datePicker, {
                mode: "range",
                dateFormat: "Ymd",
                locale: "ko",
                onChange: (selectedDates, dateStr, instance) => {
                    // console.log('날짜 선택:', dateStr);
                    // 플로팅 라벨 업데이트
                    const wrapper = datePicker.closest('.floating-label-group');
                    if (wrapper) {
                        wrapper.classList.add('has-value');
                    }
                }
            });
        }
        
        // 초기화 버튼 처리
        const resetButton = contentRoot.querySelector('[data-action="reset-auto-reg-filters"]');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                // 모든 셀렉트박스 초기화
                contentRoot.querySelectorAll('select').forEach(sel => {
                    sel.value = '';
                    const wrapper = sel.closest('.floating-label-group');
                    if (wrapper) {
                        wrapper.classList.remove('has-value');
                    }
                });
                
                // 데이트피커 초기화
                if (datePicker && datePicker._flatpickr) {
                    datePicker._flatpickr.clear();
                }
                
                // 쇼핑몰 선택 변경 이벤트 발생
                if (mallSelect) {
                    mallSelect.dispatchEvent(new Event('change'));
                }
            });
        }
    }

    function initializeAutoRegistrationSettingsModal(modalElement) {
        // 이벤트 위임으로 탭 처리
        const tabContainer = modalElement.querySelector('.tab-container, [role="tablist"]');
        if (tabContainer) {
            tabContainer.addEventListener('click', function(e) {
                const button = e.target.closest('.tab-button');
                if (!button) return;
                
                const targetTab = button.dataset.tab;
                
                // 즉시 탭 전환 (애니메이션 제거)
                // 모든 탭 버튼 업데이트
                tabContainer.querySelectorAll('.tab-button').forEach(btn => {
                    if (btn === button) {
                        btn.classList.add('active', 'text-white', 'bg-[#36005E]');
                        btn.classList.remove('text-slate-600');
                    } else {
                        btn.classList.remove('active', 'text-white', 'bg-[#36005E]');
                        btn.classList.add('text-slate-600');
                    }
                });
                
                // 모든 탭 컨텐츠 업데이트
                modalElement.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.toggle('hidden', content.id !== `${targetTab}-tab`);
                });
            });
        }
        
        // 옵션코드 추가 기능
        const addOptionButton = modalElement.querySelector('#option-exclude-tab .btn-primary');
        const optionInput = modalElement.querySelector('#option-exclude-tab input[type="text"]');
        const optionList = modalElement.querySelector('#option-exclude-tab ul');
        
        if (addOptionButton && optionInput && optionList) {
            addOptionButton.addEventListener('click', () => {
                const value = optionInput.value.trim();
                if (value) {
                    const li = document.createElement('li');
                    li.className = 'flex items-center justify-between py-2 px-3 bg-slate-50 rounded';
                    li.innerHTML = `
                        <span>${value}</span>
                        <button class="text-red-500 hover:text-red-700">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    `;
                    
                    // 삭제 버튼 이벤트
                    li.querySelector('button').addEventListener('click', () => li.remove());
                    
                    optionList.appendChild(li);
                    optionInput.value = '';
                    
                    if (window.lucide) lucide.createIcons();
                }
            });
        }
    }

    function initializeApiIntegrationModal(modalElement) {
        // console.log('API 연동 모달 초기화');
        // 모달 내부 초기화 로직
    }

    function initializeApiRegistrationModal(modalElement) {
        // console.log('API 등록 모달 초기화');
    }
    
    function initializeWmsSelectionModal(modalElement) {
        // console.log('WMS 선택 모달 초기화');
    }

    function initializeBulkRegistrationPage(contentRoot) {
        // console.log('대량등록 페이지 초기화');
        
        // 셀렉트박스 찾기
        const excelFormatSelect = contentRoot.querySelector('[data-id="excel-format-select"]');
        const apiIdSelect = contentRoot.querySelector('[data-id="api-id-select"]');
        
        // 엑셀 양식 선택에 따른 API ID 활성화 처리
        if (excelFormatSelect && apiIdSelect) {
            // 초기 상태 - API ID 비활성화
            apiIdSelect.disabled = true;
            const apiWrapper = apiIdSelect.closest('.floating-label-group');
            if (apiWrapper) {
                apiWrapper.classList.add('opacity-50');
            }
            
            excelFormatSelect.addEventListener('change', function() {
                const selectedValue = this.value;
                // console.log('선택된 엑셀 양식:', selectedValue);
                
                // jp_qoo10 (일본 Qoo10) 선택 시 API ID 활성화
                if (selectedValue === 'jp_qoo10') {
                    apiIdSelect.disabled = false;
                    if (apiWrapper) {
                        apiWrapper.classList.remove('opacity-50');
                    }
                    // console.log('API ID 활성화');
                } else {
                    // 다른 옵션 선택 시 API ID 비활성화
                    apiIdSelect.disabled = true;
                    apiIdSelect.value = ''; // 선택 초기화
                    if (apiWrapper) {
                        apiWrapper.classList.add('opacity-50');
                        apiWrapper.classList.remove('has-value');
                    }
                    // console.log('API ID 비활성화');
                }
            });
        }
        
        // 파일 선택 처리
        const fileInput = contentRoot.querySelector('#file-upload');
        const fileNameDisplay = contentRoot.querySelector('[data-id="file-name"]');
        
        if (fileInput && fileNameDisplay) {
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    fileNameDisplay.textContent = file.name;
                    fileNameDisplay.classList.add('text-slate-700');
                } else {
                    fileNameDisplay.textContent = '선택된 파일 없음';
                    fileNameDisplay.classList.remove('text-slate-700');
                }
            });
            
            // 파일명 클릭 시 파일 선택 초기화
            fileNameDisplay.addEventListener('click', function() {
                if (fileInput.files.length > 0) {
                    fileInput.value = '';
                    fileNameDisplay.textContent = '선택된 파일 없음';
                    fileNameDisplay.classList.remove('text-slate-700');
                }
            });
        }
        
        // 초기화 버튼 처리
        const resetButton = contentRoot.querySelector('[data-action="reset-bulk-reg-filters"]');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                // 모든 셀렉트박스 초기화
                if (excelFormatSelect) {
                    excelFormatSelect.value = '';
                    const wrapper = excelFormatSelect.closest('.floating-label-group');
                    if (wrapper) wrapper.classList.remove('has-value');
                }
                
                if (apiIdSelect) {
                    apiIdSelect.value = '';
                    apiIdSelect.disabled = true;
                    const wrapper = apiIdSelect.closest('.floating-label-group');
                    if (wrapper) {
                        wrapper.classList.add('opacity-50');
                        wrapper.classList.remove('has-value');
                    }
                }
                
                // 파일 선택 초기화
                if (fileInput) {
                    fileInput.value = '';
                    fileNameDisplay.textContent = '선택된 파일 없음';
                    fileNameDisplay.classList.remove('text-slate-700');
                }
                
                // console.log('대량등록 필터 초기화');
            });
        }
    }

    // 새로운 자동등록설정 페이지 초기화 함수 (이벤트 위임 적용)
    function initializeAutoRegistrationSettingsNewPage(contentRoot) {
        // 이벤트 위임으로 모든 클릭 이벤트 처리
        contentRoot.addEventListener('click', function(e) {
            // 탭 버튼 처리
            const tabButton = e.target.closest('.tab-button');
            if (tabButton) {
                handleTabClick(tabButton, contentRoot);
                return;
            }
            
            // 요일 버튼 처리
            const dayButton = e.target.closest('.day-btn');
            if (dayButton) {
                handleDayButtonClick(dayButton);
                return;
            }
            
            // 전체 선택 체크박스
            if (e.target.id === 'select-all-checkbox') {
                const isChecked = e.target.checked;
                contentRoot.querySelectorAll('tbody input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = isChecked;
                });
                return;
            }
        });
        
        // 체인지 이벤트 위임
        contentRoot.addEventListener('change', function(e) {
            // 자동 수집 토글
            if (e.target.id === 'auto-collection-toggle') {
                // console.log('자동 수집 토글:', e.target.checked ? '활성화' : '비활성화');
                return;
            }
            
            // 쇼핑몰 체크박스
            if (e.target.classList.contains('mall-checkbox')) {
                handleMallCheckbox(e.target);
                return;
            }
            
            // 개별 행 체크박스
            if (e.target.type === 'checkbox' && e.target.closest('tbody')) {
                updateSelectAllCheckbox(contentRoot);
                return;
            }
        });
        
        // 라디오 버튼 스타일 업데이트
        contentRoot.querySelectorAll('input[type="radio"]').forEach(radio => {
            updateRadioStyle(radio);
            radio.addEventListener('change', () => {
                contentRoot.querySelectorAll(`input[name="${radio.name}"]`).forEach(r => {
                    updateRadioStyle(r);
                });
            });
        });
    }

    // 헬퍼 함수들
    function handleTabClick(button, container) {
        const targetTab = button.getAttribute('data-tab');
        
        // 즉시 탭 전환 (애니메이션 제거)
        // 모든 탭 버튼 업데이트
        container.querySelectorAll('.tab-button').forEach(btn => {
            if (btn === button) {
                btn.classList.add('active', 'border-[#36005E]', 'text-[#36005E]');
                btn.classList.remove('border-transparent', 'text-slate-500');
            } else {
                btn.classList.remove('active', 'border-[#36005E]', 'text-[#36005E]');
                btn.classList.add('border-transparent', 'text-slate-500');
            }
        });
        
        // 모든 탭 콘텐츠 업데이트
        container.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('hidden', content.id !== targetTab);
        });
    }

    function handleDayButtonClick(button) {
        button.classList.toggle('selected');
        
        if (button.classList.contains('selected')) {
            button.classList.remove('border-slate-300', 'bg-white', 'text-slate-600');
            button.classList.add('border-[#36005E]', 'bg-[#36005E]', 'text-white');
        } else {
            button.classList.remove('border-[#36005E]', 'bg-[#36005E]', 'text-white');
            button.classList.add('border-slate-300', 'bg-white', 'text-slate-600');
        }
    }

    function handleMallCheckbox(checkbox) {
        const label = checkbox.closest('label');
        if (label) {
            if (checkbox.checked) {
                label.classList.add('ring-2', 'ring-[#36005E]', 'border-[#36005E]');
            } else {
                label.classList.remove('ring-2', 'ring-[#36005E]', 'border-[#36005E]');
            }
        }
    }

    function updateRadioStyle(radio) {
        const label = radio.closest('label');
        if (label) {
            if (radio.checked) {
                label.classList.add('ring-2', 'ring-[#36005E]', 'border-[#36005E]', 'bg-purple-50');
            } else {
                label.classList.remove('ring-2', 'ring-[#36005E]', 'border-[#36005E]', 'bg-purple-50');
            }
        }
    }

    function updateSelectAllCheckbox(container) {
        const selectAll = container.querySelector('#select-all-checkbox');
        const checkboxes = container.querySelectorAll('tbody input[type="checkbox"]');
        const checkedCount = container.querySelectorAll('tbody input[type="checkbox"]:checked').length;
        
        if (selectAll) {
            selectAll.checked = checkedCount === checkboxes.length && checkboxes.length > 0;
            selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
        }
    }

    // --- NAVIGATION & MODAL (기존 코드 유지) ---
    
    function loadContent(pageId) {
        // console.log(`Loading page: ${pageId}`);
        
        // 캐시 확인
        const cached = sessionStorage.getItem(`page_${pageId}`);
        if (cached && Date.now() - JSON.parse(cached).timestamp < 300000) { // 5분 캐시
            renderContent(JSON.parse(cached).html, pageId);
            return;
        }
        
        fetch(`pages/${pageId}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                // 캐시 저장
                sessionStorage.setItem(`page_${pageId}`, JSON.stringify({
                    html: html,
                    timestamp: Date.now()
                }));
                
                renderContent(html, pageId);
            })
            .catch(error => {
                console.error('Error loading content:', error);
                app.elements.contentArea.innerHTML = `
                    <div class="p-8 text-center">
                        <div class="text-red-500 mb-4">
                            <i data-lucide="alert-triangle" class="w-16 h-16 mx-auto"></i>
                        </div>
                        <h2 class="text-2xl font-bold mb-2">페이지를 불러올 수 없습니다</h2>
                        <p class="text-slate-600">${error.message}</p>
                    </div>
                `;
                if (window.lucide) lucide.createIcons();
            });
    }

    function renderContent(html, pageId) {
        requestAnimationFrame(() => {
            app.elements.contentArea.innerHTML = html;
            app.state.currentPage = pageId;
            
            // 탑바 제목 업데이트
            updateTopBarTitle(pageId);
            
            // 페이지별 초기화 실행
            if (pageInitializers[pageId]) {
                pageInitializers[pageId](app.elements.contentArea);
            }
            
            // 아이콘 렌더링
            if (window.lucide) {
                lucide.createIcons();
            }
        });
    }
    
    function updateTopBarTitle(pageId) {
        const titleMap = {
            'order-info-inquiry': '주문정보관리',
            'order-hold-management': '삭제/보류/보관 관리',
            'notice-board': '공지사항',
            'inquiry-management': '문의관리',
            'api-integration': 'API 연동관리',
            'auto-registration': '자동등록(API)',
            'bulk-registration': '대량등록(엑셀)',
            'auto-registration-settings-new': '자동등록 설정'
        };
        
        // 직접 DOM에서 찾기 (캐시 문제 해결)
        const titleElement = document.querySelector('#top-bar-title');
        if (titleElement) {
            titleElement.textContent = titleMap[pageId] || '';
            console.log('Title updated:', pageId, '->', titleMap[pageId]);
        } else {
            console.error('Title element not found');
        }
    }

    function openModal(modalId) {
        // console.log(`Opening modal: ${modalId}`);
        
        fetch(`modals/${modalId}.html`)
            .then(response => response.text())
            .then(html => {
                const modalContainer = document.createElement('div');
                modalContainer.className = 'modal-container';
                modalContainer.innerHTML = html;
                document.body.appendChild(modalContainer);
                
                // 모달 찾기 - 다양한 선택자 지원
                const modalElement = modalContainer.querySelector('.modal, [role="dialog"], #' + modalId) || 
                                   modalContainer.firstElementChild;
                
                if (modalElement) {
                    // 애니메이션 없이 바로 표시
                    
                    if (modalInitializers[modalId]) {
                        modalInitializers[modalId](modalElement);
                    }
                    
                    // 모달 닫기 함수 - 애니메이션 없이 즉시 닫기
                    const closeModal = () => {
                        // console.log('Closing modal:', modalId);
                        modalContainer.remove();
                        // ESC 리스너 제거
                        document.removeEventListener('keydown', handleEsc);
                    };
                    
                    // 닫기 버튼들에 이벤트 추가
                    const closeButtons = modalContainer.querySelectorAll('[data-action="close-modal"], .modal-close, .btn-close, button.close');
                    closeButtons.forEach(button => {
                        button.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            closeModal();
                        });
                    });
                    
                    // 모달 컨테이너 전체에 이벤트 위임
                    modalContainer.addEventListener('click', function(e) {
                        // X 아이콘 또는 닫기 버튼 클릭 처리
                        const closeTarget = e.target.closest('[data-action="close-modal"], [data-lucide="x"], .modal-close');
                        if (closeTarget) {
                            e.preventDefault();
                            e.stopPropagation();
                            closeModal();
                            return;
                        }
                        
                        // 배경 클릭으로 닫기
                        if (e.target === modalElement || e.target === modalContainer) {
                            closeModal();
                        }
                    });
                    
                    // ESC 키로 닫기
                    const handleEsc = (e) => {
                        if (e.key === 'Escape') {
                            closeModal();
                        }
                    };
                    document.addEventListener('keydown', handleEsc);
                    
                    // 아이콘 렌더링 (X 버튼 등) - 즉시 실행
                    if (window.lucide) {
                        lucide.createIcons();
                    }
                }
            })
            .catch(error => {
                console.error('Error loading modal:', error);
            });
    }

    function toggleSubmenu(toggle) {
        const submenu = toggle.parentElement.querySelector('ul');
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        
        requestAnimationFrame(() => {
            toggle.setAttribute('aria-expanded', !isExpanded);
            
            if (submenu) {
                submenu.setAttribute('data-state', isExpanded ? 'collapsed' : 'expanded');
            }
        });
    }

    function setActiveMenu(app, newActiveMenu) {
        const newParentMenu = newActiveMenu.closest('li[data-menu-id]');
        
        // 다른 서브메뉴 닫기
        app.elements.sidebar.querySelectorAll('[data-action="toggle-submenu"]').forEach(toggle => {
            const parentLi = toggle.closest('li[data-menu-id]');
            if (parentLi !== newParentMenu && toggle.getAttribute('aria-expanded') === 'true') {
                toggleSubmenu(toggle);
            }
        });

        if (app.state.activeMenu) {
            app.state.activeMenu.classList.remove('active');
            const oldParentToggle = app.state.activeMenu.closest('li[data-menu-id]')?.querySelector('[data-action="toggle-submenu"]');
            if (oldParentToggle) {
                oldParentToggle.classList.remove('active');
            }
        }
        
        newActiveMenu.classList.add('active');
        
        if (newParentMenu) {
            const toggle = newParentMenu.querySelector('[data-action="toggle-submenu"]');
            toggle?.classList.add('active');
            if (toggle?.getAttribute('aria-expanded') === 'false') {
                toggleSubmenu(toggle);
            }
        }
        
        app.state.activeMenu = newActiveMenu;
    }

    // --- EVENT LISTENERS (이벤트 위임 적용) ---
    
    // 사이드바 이벤트 위임
    if (app.elements.sidebar) {
        app.elements.sidebar.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 네비게이션 링크
            const navLink = e.target.closest('[data-action="navigate"]');
            if (navLink) {
                const contentId = navLink.getAttribute('data-content');
                if (contentId) {
                    loadContent(contentId);
                    // 사이드바 메뉴 항목인 경우에만 setActiveMenu 호출
                    if (navLink.closest('.sidebar')) {
                        setActiveMenu(app, navLink);
                    } else {
                        // 툴바 버튼 등에서 네비게이션한 경우, 해당 메뉴 찾아서 활성화
                        const targetMenuItem = app.elements.sidebar?.querySelector(`[data-action="navigate"][data-content="${contentId}"]`);
                        if (targetMenuItem) {
                            setActiveMenu(app, targetMenuItem);
                        }
                    }
                }
                return;
            }
            
            // 서브메뉴 토글
            const submenuToggle = e.target.closest('[data-action="toggle-submenu"]');
            if (submenuToggle) {
                toggleSubmenu(submenuToggle);
                return;
            }
        });
    }

    // 사이드바 토글
    if (app.elements.sidebarToggle) {
        app.elements.sidebarToggle.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-collapsed');
            app.state.sidebarCollapsed = !app.state.sidebarCollapsed;
        });
    }
    
    // 전체화면 토글 기능
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    if (fullscreenToggle) {
        const expandIcon = fullscreenToggle.querySelector('.fullscreen-icon-expand');
        const compressIcon = fullscreenToggle.querySelector('.fullscreen-icon-compress');
        
        fullscreenToggle.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                // 전체화면 진입
                const elem = document.documentElement;
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) { // Safari
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { // IE11
                    elem.msRequestFullscreen();
                }
            } else {
                // 전체화면 종료
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { // Safari
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE11
                    document.msExitFullscreen();
                }
            }
        });
        
        // 전체화면 상태 변경 감지
        const handleFullscreenChange = () => {
            const expandTooltip = fullscreenToggle.querySelector('.fullscreen-tooltip-expand');
            const compressTooltip = fullscreenToggle.querySelector('.fullscreen-tooltip-compress');
            
            if (document.fullscreenElement) {
                // 전체화면 모드
                expandIcon.classList.add('hidden');
                compressIcon.classList.remove('hidden');
                expandTooltip?.classList.add('hidden');
                compressTooltip?.classList.remove('hidden');
                document.body.classList.add('fullscreen-mode');
            } else {
                // 일반 모드
                expandIcon.classList.remove('hidden');
                compressIcon.classList.add('hidden');
                expandTooltip?.classList.remove('hidden');
                compressTooltip?.classList.add('hidden');
                document.body.classList.remove('fullscreen-mode');
            }
            
            // 아이콘 재렌더링
            if (window.lucide) {
                lucide.createIcons();
            }
        };
        
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);
        
        // F11 키 지원
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F11') {
                e.preventDefault();
                fullscreenToggle.click();
            }
        });
    }

    // 전역 클릭 이벤트 위임
    document.body.addEventListener('click', function(e) {
        // 네비게이션 링크 (사이드바 외부에서)
        const navLink = e.target.closest('[data-action="navigate"]');
        if (navLink && !navLink.closest('.sidebar')) {
            e.preventDefault();
            const contentId = navLink.getAttribute('data-content');
            if (contentId) {
                loadContent(contentId);
                // 해당 사이드바 메뉴 찾아서 활성화
                const targetMenuItem = app.elements.sidebar?.querySelector(`[data-action="navigate"][data-content="${contentId}"]`);
                if (targetMenuItem) {
                    setActiveMenu(app, targetMenuItem);
                }
            }
            return;
        }
        
        // 모달 열기
        const modalTrigger = e.target.closest('[data-action="open-modal"]');
        if (modalTrigger) {
            e.preventDefault();
            const modalId = modalTrigger.getAttribute('data-modal-id');
            if (modalId) {
                openModal(modalId);
            }
            return;
        }
        
        // 셀렉트박스 X 버튼 (clear 버튼) 처리
        if (e.target.closest('.select-clear, .clear-selection, [data-action="clear-select"]')) {
            e.preventDefault();
            e.stopPropagation();
            const selectWrapper = e.target.closest('.floating-label-group, .select-wrapper');
            if (selectWrapper) {
                const select = selectWrapper.querySelector('select');
                if (select) {
                    select.value = '';
                    select.dispatchEvent(new Event('change'));
                    // 플로팅 라벨 업데이트
                    if (!select.value) {
                        selectWrapper.classList.remove('has-value');
                    }
                }
                // X 버튼 숨기기
                const clearBtn = selectWrapper.querySelector('.select-clear, .clear-selection');
                if (clearBtn) {
                    clearBtn.style.display = 'none';
                }
            }
            return;
        }
        
        // 데이트피커 클리어 버튼 처리
        if (e.target.closest('[data-action="clear-datepicker"]')) {
            e.preventDefault();
            const pickerInput = e.target.parentElement.querySelector('input');
            if (pickerInput && pickerInput._flatpickr) {
                pickerInput._flatpickr.clear();
                const wrapper = pickerInput.closest('.floating-label-group');
                if (wrapper) {
                    wrapper.classList.remove('has-value');
                }
            }
            return;
        }
        
        // 특정 액션 버튼들 처리
        const actionButton = e.target.closest('[data-action]');
        if (actionButton) {
            const action = actionButton.getAttribute('data-action');
            
            switch(action) {
                case 'search-auto-reg':
                    // console.log('자동등록 검색');
                    // 검색 로직
                    break;
                    
                case 'reset-auto-reg-filters':
                    const formContainer = actionButton.closest('form, .content-card');
                    if (formContainer) {
                        // 모든 셀렉트박스 초기화
                        formContainer.querySelectorAll('select').forEach(sel => {
                            sel.value = '';
                            const wrapper = sel.closest('.floating-label-group');
                            if (wrapper) {
                                wrapper.classList.remove('has-value');
                            }
                        });
                        
                        // 데이트피커 초기화
                        const datePickerInput = formContainer.querySelector('[data-id="date-range-picker"]');
                        if (datePickerInput && datePickerInput._flatpickr) {
                            datePickerInput._flatpickr.clear();
                        }
                        
                        // 쇼핑몰 선택 변경 이벤트 발생
                        const mallSelect = formContainer.querySelector('[data-id="mall-select"]');
                        if (mallSelect) {
                            mallSelect.dispatchEvent(new Event('change'));
                        }
                    }
                    break;
                    
                case 'reset-api-filters':
                    // 현재 페이지의 모든 셀렉트박스 초기화
                    const allSelects = document.querySelectorAll('.content-area .floating-label-select');
                    allSelects.forEach(select => {
                        select.value = '';
                        const floatingLabelGroup = select.closest('.floating-label-group');
                        if (floatingLabelGroup) {
                            floatingLabelGroup.classList.remove('has-value');
                        }
                    });
                    
                    // 현재 페이지의 모든 체크박스 해제
                    const checkboxes = document.querySelectorAll('.content-area input[type="checkbox"]');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = false;
                    });
                    break;
                case 'reset-inquiry-filters':
                    // 문의관리 페이지의 모든 셀렉트박스 초기화
                    const inquirySelects = document.querySelectorAll('.content-area .floating-label-select');
                    inquirySelects.forEach(select => {
                        select.value = '';
                        const floatingLabelGroup = select.closest('.floating-label-group');
                        if (floatingLabelGroup) {
                            floatingLabelGroup.classList.remove('has-value');
                        }
                    });
                    
                    // 문의관리 페이지의 모든 체크박스 해제
                    const inquiryCheckboxes = document.querySelectorAll('.content-area input[type="checkbox"]');
                    inquiryCheckboxes.forEach(checkbox => {
                        checkbox.checked = false;
                    });
                    break;
                case 'clear-datepicker':
                    // 날짜 피커 초기화 (자동등록과 동일)
                    const dateRangeInput = actionButton.closest('.date-range-picker-group').querySelector('[data-id="date-range-picker"]');
                    if (dateRangeInput) {
                        dateRangeInput.value = '';
                    }
                    break;
            }
        }
    });

    // 셀렉트박스 change 이벤트 처리
    document.addEventListener('change', function(e) {
        if (e.target.tagName === 'SELECT') {
            const selectWrapper = e.target.closest('.floating-label-group, .select-wrapper');
            if (selectWrapper) {
                // 플로팅 라벨 상태 업데이트
                if (e.target.value) {
                    selectWrapper.classList.add('has-value');
                    // X 버튼 표시
                    const clearBtn = selectWrapper.querySelector('.select-clear, .clear-selection');
                    if (clearBtn) {
                        clearBtn.style.display = 'block';
                    }
                } else {
                    selectWrapper.classList.remove('has-value');
                    // X 버튼 숨기기
                    const clearBtn = selectWrapper.querySelector('.select-clear, .clear-selection');
                    if (clearBtn) {
                        clearBtn.style.display = 'none';
                    }
                }
            }
        }
    });
    
    // 검색 입력 디바운스
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            // console.log('Search:', e.target.value);
            // 검색 로직 구현
        }, 300));
    }

    // --- INITIALIZATION ---
    
    // 첫 페이지 로드
    const firstMenuItem = app.elements.sidebar?.querySelector('[data-action="navigate"][data-content]');
    if (firstMenuItem) {
        const contentId = firstMenuItem.getAttribute('data-content');
        loadContent(contentId);
        setActiveMenu(app, firstMenuItem);
    }

    // console.log('WMS System Enhanced - Initialized');
});
