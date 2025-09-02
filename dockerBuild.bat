REM ====== Step 2: Build Docker image ======
docker build -t %DOCKER_USER%/%IMAGE_NAME%:%BUILD_NUMBER% .

