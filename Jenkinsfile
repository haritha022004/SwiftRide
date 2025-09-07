pipeline {
    agent any

    environment {
        TEST_IMAGE   = 'swiftride-test:latest' // used only for CI tests
    }

    stages {

        stage('Check Docker') {
            steps {
                echo "==== Checking Docker ===="
                bat 'docker version'
            }
        }

        stage('Build Test Image') {
            steps {
                script {
                    echo "==== Building Docker Test Image ===="
                    bat "docker build -f Dockerfile.dev -t ${TEST_IMAGE} ."
                }
            }
        }

        stage('Run Tests in Docker') {
            steps {
                script {
                    echo "==== Running Tests in Docker ===="
                    def exitCode = bat(script: "docker run --rm ${TEST_IMAGE}", returnStatus: true)
                    echo "Test exit code: ${exitCode}"

                    env.TEST_RESULT = (exitCode == 0) ? "success" : "failure"
                }
            }
        }

        stage('Post Status to GitHub PR') {
            when {
                expression { return env.CHANGE_ID != null }
            }
            steps {
                withCredentials([string(credentialsId: 'github-token', variable: 'TOKEN')]) {
                    script {
                        def state = env.TEST_RESULT
                        def description = (state == "success") ? "All tests passed" : "Some tests failed"
                        def commitSHA = env.GIT_COMMIT

                        echo "Posting commit status to GitHub..."

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