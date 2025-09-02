REM ====== Step 3: Push to Docker Hub ======
echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
docker push %DOCKER_USER%/%IMAGE_NAME%:%BUILD_NUMBER%
