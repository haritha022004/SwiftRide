pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'swiftride:latest'
    }

    stages {

        stage('Check Docker') {
            steps {
                echo "==== Checking Docker ===="
                // Will fail immediately if Docker is not available
                bat 'docker version'
            }
        }

        stage('Run Tests in Docker') {
            steps {
                script {
                    echo "==== Building Dev Docker Image ===="
                    // Build the dev image using Dockerfile.dev
                    bat """
                        docker build -t ${DOCKER_IMAGE}-dev -f Dockerfile.dev .
                    """

                    echo "==== Running Tests in Docker ===="
                    // Run tests and capture exit code
                    def exitCode = bat(script: "docker run --rm ${DOCKER_IMAGE} sh -c \"npm test -- --reporters=default\"", returnStatus: true)
                    echo "Test exit code: ${exitCode}"

                    // Save result for later stage
                    env.TEST_RESULT = (exitCode == 0) ? "success" : "failure"
                }
            }
        }

        stage('Post Status to GitHub PR') {
            when {
                expression { return env.CHANGE_ID != null } // Only for PR builds
            }
            steps {
                // Use withCredentials to securely handle GitHub token
                withCredentials([string(credentialsId: 'github-token', variable: 'TOKEN')]) {
                    script {
                        def state = env.TEST_RESULT
                        def description = (state == "success") ? "All tests passed" : "Some tests failed"
                        def commitSHA = env.GIT_COMMIT

                        echo "Posting commit status to GitHub..."

                        // Single-line bat command, proper Windows escaping
                        bat "curl -H \"Authorization: token %TOKEN%\" -H \"Accept: application/vnd.github.v3+json\" -X POST -d \"{\\\"state\\\":\\\"${state}\\\",\\\"context\\\":\\\"Jenkins CI\\\",\\\"description\\\":\\\"${description}\\\"}\" https://api.github.com/repos/haritha022004/SwiftRide/statuses/${commitSHA}"
                    }
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