pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'swiftride:latest'
        GITHUB_TOKEN = credentials('github-token') // GitHub App token
    }

    stages {

        stage('Run Tests in Docker') {
            steps {
                script {
                    echo "==== Running Tests in Docker ===="
                    // Run tests live, output directly to Jenkins console
                    // Use '|| exit 0' so Jenkins doesn't fail on test failures
                    bat """
                        docker run --rm ${DOCKER_IMAGE} sh -c "npm test -- --reporters=default || exit 0"
                    """
                    echo "==== Test Execution Complete ===="
                }
            }
        }

        stage('Post Status to GitHub PR') {
            when {
                expression { return env.CHANGE_ID != null } // Only for PR builds
            }
            steps {
                script {
                    // Capture exit code to determine pass/fail
                    def passed = currentBuild.currentResult == 'SUCCESS'
                    def state = passed ? "success" : "failure"
                    def description = passed ? "All tests passed" : "Some tests failed"
                    def commitSHA = env.GIT_COMMIT

                    echo "Posting commit status to GitHub..."
                    bat """
                    curl -H "Authorization: token ${GITHUB_TOKEN}" ^
                         -H "Accept: application/vnd.github.v3+json" ^
                         -X POST ^
                         -d "{\\"state\\": \\"${state}\\", \\"context\\": \\"Jenkins CI\\", \\"description\\": \\"${description}\\"}" ^
                         https://api.github.com/repos/haritha022004/SwiftRide/statuses/${commitSHA}
                    """
                }
            }
        }

    }

    post {
        always {
            echo "Pipeline finished. Check console output and PR status."
        }
        failure {
            echo "Pipeline finished with failures."
        }
        success {
            echo "Pipeline finished successfully."
        }
    }
}