@echo off
chcp 65001 >nul
cd /d "%~dp0"

where javac >nul 2>&1
if errorlevel 1 (
  echo.
  echo [오류] JDK가 설치되어 있지 않습니다. JRE만으로는 백엔드를 빌드할 수 없습니다.
  echo.
  echo 해결 방법:
  echo   1. Amazon Corretto 8 JDK 설치
  echo      https://docs.aws.amazon.com/corretto/latest/corretto-8-ug/downloads-list.html
  echo   2. 설치 후 새 명령 프롬프트를 열고 javac -version 으로 확인
  echo   3. 다시 run-backend.bat 실행
  echo.
  pause
  exit /B 1
)

echo Maven Wrapper로 Spring Boot를 시작합니다...
echo 최초 실행 시 Maven 다운로드로 시간이 걸릴 수 있습니다.
echo.

call mvnw.cmd spring-boot:run
pause
