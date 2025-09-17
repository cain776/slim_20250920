@echo off
echo ========================================
echo     OMS 백업 관리 시스템
echo ========================================
echo.
echo 1. 전체 백업 생성
echo 2. 특정 파일 백업
echo 3. 백업 목록 보기
echo 4. 백업 복원
echo 5. Git 커밋 (버전 저장)
echo 6. Git 이전 버전으로 복귀
echo 7. 종료
echo.
set /p choice="선택하세요 (1-7): "

if %choice%==1 goto FULL_BACKUP
if %choice%==2 goto FILE_BACKUP
if %choice%==3 goto LIST_BACKUP
if %choice%==4 goto RESTORE_BACKUP
if %choice%==5 goto GIT_COMMIT
if %choice%==6 goto GIT_REVERT
if %choice%==7 exit

:FULL_BACKUP
set timestamp=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%
xcopy /E /I /Y "." "..\OMS_backup_%timestamp%"
echo 백업 완료: OMS_backup_%timestamp%
pause
goto :eof

:FILE_BACKUP
set /p filename="백업할 파일 경로 입력: "
set timestamp=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%
copy "%filename%" "%filename%.backup_%timestamp%"
echo 파일 백업 완료: %filename%.backup_%timestamp%
pause
goto :eof

:LIST_BACKUP
dir /B ..\OMS_backup_* 2>nul
dir /B *.backup_* 2>nul
pause
goto :eof

:RESTORE_BACKUP
set /p backup_name="복원할 백업 이름 입력: "
xcopy /E /I /Y "..\%backup_name%" "."
echo 복원 완료
pause
goto :eof

:GIT_COMMIT
set /p message="커밋 메시지 입력: "
git add .
git commit -m "%message%"
echo Git 커밋 완료
pause
goto :eof

:GIT_REVERT
git log --oneline -10
set /p commit="복귀할 커밋 해시 입력: "
git checkout %commit%
echo 복귀 완료
pause
goto :eof
