@echo off
echo 빠른 복구 시스템
echo =================
echo.

REM 가장 최근 백업 찾기
for /f "delims=" %%i in ('dir /b /od ..\OMS_backup_* 2^>nul') do set latest_backup=%%i

if "%latest_backup%"=="" (
    echo 백업을 찾을 수 없습니다!
    echo 새 백업을 생성하시겠습니까? (Y/N)
    set /p create_backup=
    if /i "%create_backup%"=="Y" (
        set timestamp=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%
        set timestamp=%timestamp: =0%
        xcopy /E /I /Y "." "..\OMS_backup_%timestamp%"
        echo 백업 생성 완료!
    )
) else (
    echo 최근 백업: %latest_backup%
    echo 이 백업으로 복구하시겠습니까? (Y/N)
    set /p confirm=
    if /i "%confirm%"=="Y" (
        xcopy /E /I /Y "..\%latest_backup%\*" "."
        echo 복구 완료!
    )
)

pause
