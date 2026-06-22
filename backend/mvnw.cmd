@REM Maven Wrapper for Windows
@echo off
setlocal EnableDelayedExpansion

if "%JAVA_HOME%"=="" (
  for /f "delims=" %%i in ('powershell -NoProfile -Command "& {(java -XshowSettings:properties -version 2>&1 | Select-String 'java.home').Line.Split('=')[1].Trim()}"') do (
    set "JAVA_HOME=%%i"
  )
)

if "%JAVA_HOME%"=="" (
  echo Error: JAVA_HOME not found. Java JDK 8 이상을 설치하세요.
  exit /B 1
)

if not exist "%JAVA_HOME%\bin\java.exe" (
  echo Error: JAVA_HOME path is invalid: "%JAVA_HOME%"
  exit /B 1
)

set "MAVEN_PROJECTBASEDIR=%~dp0"
if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%"

set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain"

"%JAVA_HOME%\bin\java.exe" -classpath "%WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %WRAPPER_LAUNCHER% %*
exit /B %ERRORLEVEL%
