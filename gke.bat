REM ====== Step 5: Update Kubernetes Deployment ======
echo "Tag to be used: %DOCKER_USER%/%IMAGE_NAME%:%BUILD_NUMBER%"
call kubectl set image deployment/%IMAGE_NAME%-deployment %IMAGE_NAME%=%DOCKER_USER%/%IMAGE_NAME%:%BUILD_NUMBER%
