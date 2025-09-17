document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONSTANTS ---
    const CONSTANTS = {
        PAGE_IDS: {
            ORDER_INFO_INQUIRY: 'order-info-inquiry',
            API_INTEGRATION: 'api-integration',
            AUTO_REGISTRATION: 'auto-registration',
            BULK_REGISTRATION: 'bulk-registration',
            AUTO_REGISTRATION_SETTINGS: 'auto-registration-settings',
            AUTO_REGISTRATION_SETTINGS_NEW: 'auto-registration-settings-new'
        }
    };

    // --- DATA CONFIGURATION ---
    const PAGE_CONFIG = {
        [CONSTANTS.PAGE_IDS.AUTO_REGISTRATION]: {
            orderStatus: {
                qoo10jp: ['신규주문', '배송준비'],
                rakuten: ['전체(ALL)', '배송대기중(전체)', '배송대기중(국제배송)', 'ALL(국제배송)'],
                nhn: ['ALL', '결제완료', '상품준비', '배송준비'],
                playauto: ['ALL', '결제완료', '상품준비', '배송준비']
            },
            dateTypes: {
                qoo10jp: ['주문일', '발송처리일'],
                playauto: ['주문일', '결제일', '송장입력일']
            }
        }
    };

    // --- PAGE INITIALIZERS ---
    const pageInitializers = {
        [CONSTANTS.PAGE_IDS.AUTO_REGISTRATION]: initializeAutoRegistrationPage,
        [CONSTANTS.PAGE_IDS.BULK_REGISTRATION]: initializeBulkRegistrationPage,
        [CONSTANTS.PAGE_IDS.AUTO_REGISTRATION_SETTINGS_NEW]: initializeAutoRegistrationSettingsNewPage,
    };
    
    // --- MODAL INITIALIZERS ---
    const modalInitializers = {
        'auto-registration-settings-modal': initializeAutoRegistrationSettingsModal,
    };
    
    function initializeBulkRegistrationPage(contentRoot) {
        const excelFormatSelect = contentRoot.querySelector('[data-id="excel-format-select"]');
        const apiIdSelect = contentRoot.querySelector('[data-id="api-id-select"]');
        const fileInput = contentRoot.querySelector('#file-upload');
        const fileNameDisplay = contentRoot.querySelector('[data-id="file-name"]');
        const defaultFileName = "선택된 파일 없음";

        excelFormatSelect.addEventListener('change', () => {
            const selectedValue = excelFormatSelect.value;
            if (selectedValue && selectedValue.includes('qoo10')) {
                apiIdSelect.disabled = false;
            } else {
                apiIdSelect.disabled = true;
                apiIdSelect.value = '';
            }
        });
        excelFormatSelect.dispatchEvent(new Event('change'));

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                fileNameDisplay.textContent = fileInput.files[0].name;
                fileNameDisplay.classList.remove('text-slate-400');
            } else {
                fileNameDisplay.textContent = defaultFileName;
                fileNameDisplay.classList.add('text-slate-400');
            }
        });
        
        fileNameDisplay.addEventListener('click', (e) => {
            if (fileInput.files.length > 0) {
                fileInput.value = ''; // Clear the file input
                fileNameDisplay.textContent = defaultFileName;
                fileNameDisplay.classList.add('text-slate-400');
                e.stopPropagation();
            }
        });
    }


    function initializeAutoRegistrationPage(contentRoot) {
        const datePicker = contentRoot.querySelector('[data-id="date-range-picker"]');
        if (datePicker) {
            datePicker._flatpickr = flatpickr(datePicker, {
                mode: "range", dateFormat: "Ymd", locale: "ko", 
                onChange: (selectedDates, dateStr, instance) => {
                    if (selectedDates.length === 2) {
                        instance.element.value = `${instance.formatDate(selectedDates[0], "Ymd")} - ${instance.formatDate(selectedDates[1], "Ymd")}`;
                    }
                }
            });
        }

        const mallSelect = contentRoot.querySelector('[data-id="mall-select"]');
        const orderStatusSelect = contentRoot.querySelector('[data-id="order-status-select"]');
        const dateTypeSelect = contentRoot.querySelector('[data-id="date-type-select"]');
        
        const updateDependentSelects = () => {
            const selectedMall = mallSelect.value;
            const config = PAGE_CONFIG[CONSTANTS.PAGE_IDS.AUTO_REGISTRATION];

            populateSelect(orderStatusSelect, config.orderStatus[selectedMall] || []);
            populateSelect(dateTypeSelect, config.dateTypes[selectedMall] || []);
        };

        if (mallSelect) {
            mallSelect.addEventListener('change', updateDependentSelects);
            updateDependentSelects();
        }
    }
    
    function initializeAutoRegistrationSettingsModal(modalElement) {
        // 탭 전환 기능
        const tabButtons = modalElement.querySelectorAll('.tab-button');
        const tabContents = modalElement.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                // 모든 탭 버튼 비활성화
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.classList.add('text-slate-600');
                    btn.classList.remove('text-white', 'bg-[#36005E]');
                });
                
                // 클릭된 탭 버튼 활성화
                button.classList.add('active');
                button.classList.remove('text-slate-600');
                button.classList.add('text-white', 'bg-[#36005E]');
                
                // 모든 탭 컨텐츠 숨기기
                tabContents.forEach(content => {
                    content.classList.add('hidden');
                });
                
                // 선택된 탭 컨텐츠 표시
                const targetContent = modalElement.querySelector(`#${targetTab}-tab`);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                }
            });
        });
        
        // 옵션코드 추가 기능
        const addOptionButton = modalElement.querySelector('#option-exclude-tab .btn-primary');
        const optionInput = modalElement.querySelector('#option-exclude-tab input[type="text"]');
        
        if (addOptionButton && optionInput) {
            addOptionButton.addEventListener('click', () => {
                const optionCode = optionInput.value.trim();
                if (optionCode) {
                    // 옵션코드 추가 로직
                    console.log('Adding option code:', optionCode);
                    optionInput.value = '';
                    // 실제로는 서버에 전송하고 테이블에 추가
                }
            });
        }
        
        // 전체 선택 기능
        const selectAllCheckbox = modalElement.querySelector('#option-exclude-tab thead input[type="checkbox"]');
        const rowCheckboxes = modalElement.querySelectorAll('#option-exclude-tab tbody input[type="checkbox"]');
        
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', () => {
                rowCheckboxes.forEach(checkbox => {
                    checkbox.checked = selectAllCheckbox.checked;
                });
            });
        }
        
        // 개별 체크박스 변경 시 전체 선택 상태 업데이트
        rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const checkedCount = Array.from(rowCheckboxes).filter(cb => cb.checked).length;
                selectAllCheckbox.checked = checkedCount === rowCheckboxes.length;
                selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < rowCheckboxes.length;
            });
        });
    }
    

    // --- NEW: FLOATING LABEL LOGIC ---
    function initializeFloatingLabels(container) {
        const groups = container.querySelectorAll('.floating-label-group');
        groups.forEach(group => {
            const select = group.querySelector('.floating-label-select');
            if (select) {
                const updateState = () => {
                    if (select.value && select.value !== "") {
                        group.classList.add('has-value');
                    } else {
                        group.classList.remove('has-value');
                    }
                };
                select.addEventListener('change', updateState);
                updateState(); // Check initial state
            }
        });
    }

    // --- CORE APP LOGIC ---
    async function initApp() {
        const app = {
            elements: {
                appContainer: document.getElementById('wms-app'),
                sidebarToggle: document.getElementById('sidebar-toggle'),
                sidebarNav: document.getElementById('sidebar-nav'),
                topBarTitle: document.getElementById('top-bar-title'),
                mainContentArea: document.querySelector('main.content-area'),
                // OLD: modal: document.getElementById('api-registration-modal'),
                modal: null, // NEW: Will be loaded dynamically
                modalContainer: null // NEW: Container for dynamic modals
            },
            state: { activeMenu: null, modalOpen: false, lastFocusedElement: null }
        };
        setupEventListeners(app);
        const initialLink = app.elements.sidebarNav.querySelector('a[data-action="navigate"]');
        if(initialLink) {
            await loadContent(app, initialLink);
            setActiveMenu(app, initialLink); 
        }
        lucide.createIcons();
    }
    
    function setupEventListeners(app) {
        app.elements.sidebarToggle.addEventListener('click', () => {
            app.elements.appContainer.classList.toggle('sidebar-collapsed');
        });

        app.elements.sidebarNav.addEventListener('click', async (e) => {
            const target = e.target.closest('a[data-action]');
            if (!target) return;
            e.preventDefault();
            const action = target.dataset.action;
            if (action === 'toggle-submenu') { 
                handleAccordion(app, target);
            } 
            else if (action === 'navigate' && app.state.activeMenu !== target) {
                await loadContent(app, target);
                setActiveMenu(app, target);
            }
        });
        
        document.body.addEventListener('click', async e => {
            const target = e.target.closest('[data-action]');
            
             document.querySelectorAll('[data-id="settings-dropdown"]').forEach(dropdown => {
                if (!dropdown.previousElementSibling.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.add('hidden');
                }
            });

            if (!target) {
                // Check if clicked on modal backdrop
                if (app.elements.modal && e.target === app.elements.modal) { 
                    toggleModal(app, false); 
                }
                return;
            };
            const action = target.dataset.action;
            const formContainer = target.closest('.bg-white');

            switch(action) {
                case 'navigate':
                    if (app.state.activeMenu !== target) {
                        await loadContent(app, target);
                        setActiveMenu(app, target);
                    }
                    break;
                case 'toggle-settings-menu': {
                    const dropdown = target.nextElementSibling;
                    if (dropdown) {
                        document.querySelectorAll('[data-id="settings-dropdown"]').forEach(d => {
                            if (d !== dropdown) d.classList.add('hidden');
                        });
                        dropdown.classList.toggle('hidden');
                    }
                    break;
                }
                case 'open-modal': 
                    console.log('Modal open button clicked', target);
                    console.log('Modal ID:', target.dataset.modalId);
                    toggleModal(app, true, target); 
                    break;
                case 'close-modal': toggleModal(app, false); break;
                case 'clear-select':
                    const floatingGroup = target.closest('.floating-label-group');
                    const select = floatingGroup ? floatingGroup.querySelector('.floating-label-select') : null;
                    
                    if (select && floatingGroup) {
                        select.selectedIndex = 0;
                        select.value = ''; 
                        floatingGroup.classList.remove('has-value');
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    break;
                case 'clear-datepicker':
                    const pickerInput = target.parentElement.querySelector('input');
                    if (pickerInput && pickerInput._flatpickr) { pickerInput._flatpickr.clear(); }
                    break;
                case 'reset-auto-reg-filters':
                    formContainer.querySelectorAll('.floating-label-select').forEach(sel => sel.value = '');
                    const datePickerInput = formContainer.querySelector('[data-id="date-range-picker"]');
                    if (datePickerInput && datePickerInput._flatpickr) { datePickerInput._flatpickr.clear(); }
                    const mallSelect = formContainer.querySelector('[data-id="mall-select"]');
                    if (mallSelect) { mallSelect.dispatchEvent(new Event('change')); }
                    break;
                case 'reset-bulk-reg-filters':
                    formContainer.querySelectorAll('select').forEach(sel => sel.value = '');
                    const excelFormatSelect = formContainer.querySelector('[data-id="excel-format-select"]');
                    if (excelFormatSelect) { excelFormatSelect.dispatchEvent(new Event('change')); }
                    const fileInput = document.getElementById('file-upload');
                    const fileNameDisplay = formContainer.querySelector('[data-id="file-name"]');
                    if (fileInput) fileInput.value = '';
                    if (fileNameDisplay) {
                         fileNameDisplay.textContent = '선택된 파일 없음';
                         fileNameDisplay.classList.add('text-slate-400');
                    }
                    break;
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && app.state.modalOpen) { toggleModal(app, false); }
            if (e.key === 'Tab' && app.state.modalOpen) { handleFocusTrap(e, app); }
        });
    }
    
    function handleAccordion(app, clickedToggle) {
         const allToggles = app.elements.sidebarNav.querySelectorAll('[data-action="toggle-submenu"]');
        allToggles.forEach(toggle => {
            if (toggle !== clickedToggle && toggle.getAttribute('aria-expanded') === 'true') {
                toggleSubmenu(toggle);
            }
        });
        toggleSubmenu(clickedToggle);
    }

    async function loadContent(app, link) {
        const contentId = link.dataset.content;
        const title = link.textContent.trim();
        
        // Reset modal when switching pages
        if (app.elements.modal && !app.elements.modal.classList.contains('hidden')) {
            app.elements.modal.classList.add('hidden');
            app.state.modalOpen = false;
        }
        
        if (!contentId) {
            app.elements.mainContentArea.innerHTML = `
                <div class="content-card p-6 h-full flex items-center justify-center">
                    <h3 class="text-xl font-semibold text-slate-500">${title} 페이지 컨텐츠 영역</h3>
                </div>`;
            app.elements.topBarTitle.textContent = title;
            lucide.createIcons();
            return;
        }

        try {
            const response = await fetch(`./pages/${contentId}.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentHtml = await response.text();
            app.elements.mainContentArea.innerHTML = contentHtml;
            app.elements.topBarTitle.textContent = title;

            if (pageInitializers[contentId]) {
                pageInitializers[contentId](app.elements.mainContentArea);
            }
            initializeFloatingLabels(app.elements.mainContentArea); // Initialize labels for the new content
        } catch (error) {
            console.error('Error loading page content:', error);
            app.elements.mainContentArea.innerHTML = `
                <div class="content-card p-6 h-full flex items-center justify-center">
                    <h3 class="text-xl font-semibold text-red-500">페이지를 불러오는 중 오류가 발생했습니다.</h3>
                    <p class="text-slate-500 mt-2">콘솔을 확인해주세요.</p>
                </div>`;
        } finally {
            lucide.createIcons();
        }
    }

    function populateSelect(selectElement, options) {
        selectElement.innerHTML = '<option value="" disabled selected></option>';
        if (options && options.length > 0) {
            options.forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText.toLowerCase().replace(/[\s\(\)]/g, '_');
                option.textContent = optionText;
                selectElement.appendChild(option);
            });
            selectElement.disabled = false;
        } else {
            selectElement.disabled = true;
        }
    }

    // NEW: Dynamic modal loading function
    async function loadModal(modalId) {
        try {
            const response = await fetch(`./modals/${modalId}.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const modalHtml = await response.text();
            
            // Create modal container if it doesn't exist
            let modalContainer = document.getElementById('dynamic-modal-container');
            if (!modalContainer) {
                modalContainer = document.createElement('div');
                modalContainer.id = 'dynamic-modal-container';
                document.body.appendChild(modalContainer);
            }
            
            modalContainer.innerHTML = modalHtml;
            lucide.createIcons();
            const modal = modalContainer.firstElementChild;
            
            // 모달 초기화 함수 호출
            if (modalInitializers[modalId]) {
                modalInitializers[modalId](modal);
            }
            
            return modal;
        } catch (error) {
            console.error('Error loading modal:', error);
            // FALLBACK: If loading fails, show error
            alert('팝업을 불러오는 중 오류가 발생했습니다.');
            return null;
        }
    }

    // MODIFIED: Enhanced toggleModal with dynamic loading
    async function toggleModal(app, show = true, openerElement = null) {
        console.log('toggleModal called', { show, openerElement, modalId: openerElement?.dataset.modalId });
        
        if (show) {
            // NEW: Load modal dynamically if needed
            if (!app.elements.modal) {
                const modalId = openerElement?.dataset.modalId || 'api-registration-modal';
                console.log('Loading modal:', modalId);
                const modal = await loadModal(modalId);
                if (modal) {
                    app.elements.modal = modal;
                    showModalContent(app, openerElement);
                } else {
                    console.error('Modal loading failed');
                }
            } else {
                console.log('Using existing modal');
                showModalContent(app, openerElement);
            }
        } else {
            if (app.elements.modal) {
                app.elements.modal.classList.add('hidden');
            }
            app.state.modalOpen = false;
            app.state.lastFocusedElement?.focus();
        }
    }
    
    // Helper function to show modal content
    function showModalContent(app, openerElement) {
        console.log('showModalContent called', app.elements.modal);
        app.state.lastFocusedElement = openerElement || document.activeElement;
        app.elements.modal.classList.remove('hidden');
        app.state.modalOpen = true;
        const focusableElements = app.elements.modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        focusableElements[0]?.focus();
    }

    function handleFocusTrap(e, app) {
        if (!app.elements.modal) return; // Safety check
        
        const focusableElements = app.elements.modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { 
            if (document.activeElement === firstElement) { lastElement.focus(); e.preventDefault(); }
        } else { 
            if (document.activeElement === lastElement) { firstElement.focus(); e.preventDefault(); }
        }
    }

    function toggleSubmenu(toggleLink) {
        const submenu = toggleLink.nextElementSibling;
        const isExpanded = toggleLink.getAttribute('aria-expanded') === 'true';
        const newState = isExpanded ? 'collapsed' : 'expanded';
        submenu.dataset.state = newState;
        toggleLink.setAttribute('aria-expanded', !isExpanded);
    }

    function setActiveMenu(app, newActiveMenu) {
        const newParentMenu = newActiveMenu.closest('li[data-menu-id]');

        const allToggles = app.elements.sidebarNav.querySelectorAll('[data-action="toggle-submenu"]');
        allToggles.forEach(toggle => {
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

    // 새로운 자동등록설정 페이지 초기화 함수
function initializeAutoRegistrationSettingsNewPage(contentRoot) {
    // 탭 기능
    const tabButtons = contentRoot.querySelectorAll('.tab-button');
    const tabContents = contentRoot.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // 모든 탭 버튼 비활성화
            tabButtons.forEach(btn => {
                btn.classList.remove('active', 'border-[#36005E]', 'text-[#36005E]');
                btn.classList.add('border-transparent', 'text-slate-500');
            });
            
            // 모든 탭 콘텐츠 숨기기
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });
            
            // 선택된 탭 활성화
            button.classList.add('active', 'border-[#36005E]', 'text-[#36005E]');
            button.classList.remove('border-transparent', 'text-slate-500');
            
            // 선택된 탭 콘텐츠 표시
            const targetContent = contentRoot.querySelector(`#${targetTab}`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });

    // 자동 수집 토글 기능
    const autoCollectionToggle = contentRoot.querySelector('#auto-collection-toggle');
    if (autoCollectionToggle) {
        autoCollectionToggle.addEventListener('change', (e) => {
            console.log('자동 수집 토글:', e.target.checked ? '활성화' : '비활성화');
        });
    }

    // 요일 선택 기능
    const dayButtons = contentRoot.querySelectorAll('.day-btn');
    dayButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('selected');
            if (button.classList.contains('selected')) {
                button.classList.remove('border-slate-300', 'bg-white', 'text-slate-600');
                button.classList.add('border-[#36005E]', 'bg-[#36005E]', 'text-white');
            } else {
                button.classList.remove('border-[#36005E]', 'bg-[#36005E]', 'text-white');
                button.classList.add('border-slate-300', 'bg-white', 'text-slate-600');
            }
        });
    });

    // 쇼핑몰 선택 기능
    const mallButtons = contentRoot.querySelectorAll('.mall-btn');
    mallButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('selected');
            if (button.classList.contains('selected')) {
                button.classList.remove('border-slate-300', 'bg-white', 'text-slate-600');
                button.classList.add('border-[#36005E]', 'bg-[#36005E]', 'text-white');
            } else {
                button.classList.remove('border-[#36005E]', 'bg-[#36005E]', 'text-white');
                button.classList.add('border-slate-300', 'bg-white', 'text-slate-600');
            }
        });
    });

    // 자동 전송 라디오 버튼 기능
    const radioButtons = contentRoot.querySelectorAll('input[name="auto-transmission"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // 모든 라디오 버튼의 라벨 스타일 초기화
            radioButtons.forEach(rb => {
                const label = rb.closest('label');
                if (label) {
                    label.classList.remove('border-[#36005E]', 'bg-[#36005E]/5');
                    label.classList.add('border-slate-300', 'bg-white');
                }
            });
            
            // 선택된 라벨 스타일 적용
            const selectedLabel = e.target.closest('label');
            if (selectedLabel) {
                selectedLabel.classList.remove('border-slate-300', 'bg-white');
                selectedLabel.classList.add('border-[#36005E]', 'bg-[#36005E]/5');
            }
            
            console.log('자동 전송 설정:', e.target.value);
        });
    });

    // 예외처리 탭 테이블 기능
    const exceptionTab = contentRoot.querySelector('#exception-handling');
    if (exceptionTab) {
        // 전체 선택 체크박스
        const selectAllCheckbox = exceptionTab.querySelector('thead input[type="checkbox"]');
        const rowCheckboxes = exceptionTab.querySelectorAll('tbody input[type="checkbox"]');
        
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', (e) => {
                rowCheckboxes.forEach(checkbox => {
                    checkbox.checked = e.target.checked;
                });
            });
        }

        // 개별 체크박스 변경 시 전체 선택 상태 업데이트
        rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const checkedCount = Array.from(rowCheckboxes).filter(cb => cb.checked).length;
                if (selectAllCheckbox) {
                    selectAllCheckbox.checked = checkedCount === rowCheckboxes.length;
                    selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < rowCheckboxes.length;
                }
            });
        });

        // 삭제 버튼 기능
        const deleteButton = Array.from(exceptionTab.querySelectorAll('button')).find(btn => btn.textContent.includes('선택된 항목을 삭제'));
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                const selectedRows = Array.from(rowCheckboxes).filter(cb => cb.checked);
                if (selectedRows.length === 0) {
                    alert('삭제할 항목을 선택해주세요.');
                    return;
                }
                
                if (confirm(`선택된 ${selectedRows.length}개 항목을 삭제하시겠습니까?`)) {
                    console.log('선택된 항목 삭제:', selectedRows.length + '개');
                    // 실제 삭제 로직 구현
                    alert(`${selectedRows.length}개 항목이 삭제되었습니다.`);
                }
            });
        }

        // 등록 버튼 기능
        const registerButton = Array.from(exceptionTab.querySelectorAll('button')).find(btn => btn.textContent.includes('등록'));
        if (registerButton) {
            registerButton.addEventListener('click', () => {
                console.log('새 항목 등록');
                // 등록 모달 또는 페이지로 이동
                alert('새 항목 등록 기능이 실행됩니다.');
            });
        }

        // 페이지 크기 변경
        const pageSizeSelect = exceptionTab.querySelector('select');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => {
                console.log('페이지 크기 변경:', e.target.value);
                // 페이지 크기 변경 로직
            });
        }
    }

    // 버튼 기능 - 이벤트 위임 사용
    contentRoot.addEventListener('click', (e) => {
        if (e.target.textContent === '취소') {
            console.log('취소 버튼 클릭');
            // 폼 초기화 또는 이전 페이지로 이동
        } else if (e.target.textContent === '테스트') {
            console.log('테스트 버튼 클릭');
            // 테스트 실행 로직
            alert('테스트가 실행되었습니다.');
        } else if (e.target.textContent === '저장') {
            console.log('저장 버튼 클릭');
            // 설정 저장 로직
            alert('설정이 저장되었습니다.');
        }
    });
}

    initApp();
});
