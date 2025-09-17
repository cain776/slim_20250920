/**
 * 변경사항 추적 및 복구 시스템
 * 모든 코드 변경을 자동으로 추적하고 필요시 즉시 복구
 */

class ChangeTracker {
    constructor() {
        this.changes = [];
        this.maxHistory = 50; // 최대 50개 변경 이력 보관
        this.currentIndex = -1;
        this.loadFromStorage();
    }

    /**
     * 변경사항 기록
     * @param {string} type - 변경 타입 (create, update, delete)
     * @param {string} path - 파일 경로
     * @param {string} oldContent - 이전 내용
     * @param {string} newContent - 새 내용
     * @param {string} description - 변경 설명
     */
    recordChange(type, path, oldContent, newContent, description = '') {
        const change = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type,
            path,
            oldContent,
            newContent,
            description,
            applied: true
        };

        // 현재 인덱스 이후의 변경사항 제거 (새 분기 생성)
        if (this.currentIndex < this.changes.length - 1) {
            this.changes = this.changes.slice(0, this.currentIndex + 1);
        }

        this.changes.push(change);
        this.currentIndex++;

        // 최대 이력 초과시 오래된 것 제거
        if (this.changes.length > this.maxHistory) {
            this.changes.shift();
            this.currentIndex--;
        }

        this.saveToStorage();
        this.logChange(change);
    }

    /**
     * 실행 취소 (Undo)
     */
    undo() {
        if (this.currentIndex < 0) {
            console.log('취소할 변경사항이 없습니다.');
            return null;
        }

        const change = this.changes[this.currentIndex];
        this.currentIndex--;
        
        console.log(`[UNDO] ${change.path} - ${change.description}`);
        return {
            path: change.path,
            content: change.oldContent,
            change: change
        };
    }

    /**
     * 다시 실행 (Redo)
     */
    redo() {
        if (this.currentIndex >= this.changes.length - 1) {
            console.log('다시 실행할 변경사항이 없습니다.');
            return null;
        }

        this.currentIndex++;
        const change = this.changes[this.currentIndex];
        
        console.log(`[REDO] ${change.path} - ${change.description}`);
        return {
            path: change.path,
            content: change.newContent,
            change: change
        };
    }

    /**
     * 특정 시점으로 복구
     * @param {number} changeId - 복구할 변경사항 ID
     */
    restoreTo(changeId) {
        const targetIndex = this.changes.findIndex(c => c.id === changeId);
        if (targetIndex === -1) {
            console.error('해당 변경사항을 찾을 수 없습니다.');
            return null;
        }

        const restorePoints = [];
        
        // 현재 위치에서 목표 지점까지 역방향 복구
        for (let i = this.currentIndex; i > targetIndex; i--) {
            restorePoints.push({
                path: this.changes[i].path,
                content: this.changes[i].oldContent
            });
        }

        this.currentIndex = targetIndex;
        return restorePoints;
    }

    /**
     * 변경 이력 조회
     * @param {number} count - 조회할 개수
     */
    getHistory(count = 10) {
        const start = Math.max(0, this.changes.length - count);
        return this.changes.slice(start).reverse().map(change => ({
            ...change,
            isCurrent: this.changes.indexOf(change) === this.currentIndex
        }));
    }

    /**
     * 특정 파일의 변경 이력
     * @param {string} path - 파일 경로
     */
    getFileHistory(path) {
        return this.changes.filter(c => c.path === path);
    }

    /**
     * 변경사항 로그
     */
    logChange(change) {
        const time = new Date(change.timestamp).toLocaleTimeString();
        console.group(`📝 [${time}] ${change.type.toUpperCase()}: ${change.path}`);
        console.log(`Description: ${change.description || 'No description'}`);
        if (change.type === 'update') {
            console.log(`Old size: ${change.oldContent?.length || 0} bytes`);
            console.log(`New size: ${change.newContent?.length || 0} bytes`);
        }
        console.groupEnd();
    }

    /**
     * 저장소에 저장
     */
    saveToStorage() {
        try {
            localStorage.setItem('changeTracker', JSON.stringify({
                changes: this.changes,
                currentIndex: this.currentIndex
            }));
        } catch (e) {
            console.error('Failed to save changes to storage:', e);
        }
    }

    /**
     * 저장소에서 로드
     */
    loadFromStorage() {
        try {
            const data = localStorage.getItem('changeTracker');
            if (data) {
                const parsed = JSON.parse(data);
                this.changes = parsed.changes || [];
                this.currentIndex = parsed.currentIndex || -1;
            }
        } catch (e) {
            console.error('Failed to load changes from storage:', e);
        }
    }

    /**
     * 변경 이력 내보내기
     */
    exportHistory() {
        const data = {
            exportDate: new Date().toISOString(),
            changes: this.changes,
            currentIndex: this.currentIndex
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], 
            { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `change-history-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * 변경 이력 가져오기
     * @param {File} file - 가져올 JSON 파일
     */
    async importHistory(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            this.changes = data.changes;
            this.currentIndex = data.currentIndex;
            this.saveToStorage();
            console.log('변경 이력을 성공적으로 가져왔습니다.');
        } catch (e) {
            console.error('Failed to import history:', e);
        }
    }

    /**
     * 초기화
     */
    reset() {
        if (confirm('모든 변경 이력을 삭제하시겠습니까?')) {
            this.changes = [];
            this.currentIndex = -1;
            this.saveToStorage();
            console.log('변경 이력이 초기화되었습니다.');
        }
    }
}

// 전역 인스턴스 생성
window.changeTracker = new ChangeTracker();

// 사용 예시:
// changeTracker.recordChange('update', 'js/main.js', oldContent, newContent, '이벤트 위임 적용');
// const undoData = changeTracker.undo();
// const history = changeTracker.getHistory(20);
