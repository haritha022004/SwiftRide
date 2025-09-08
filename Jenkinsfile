pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'swiftride:latest'
    }

    stages {

        stage('Check Docker') {
            steps {
                echo "==== Checking Docker ===="
                bat 'docker version'
            }
        }

        stage('Run Tests in Docker') {
            steps {
                script {
                    echo "==== Running Tests in Docker ===="
                    def exitCode = bat(script: "docker run --rm ${DOCKER_IMAGE} sh -c \"npm test -- --reporters=default\"", returnStatus: true)
                    echo "Test exit code: ${exitCode}"
                    env.TEST_RESULT = (exitCode == 0) ? "success" : "failure"
                }
            }
        }

        stage('Post Status to GitHub PR') {
            when {
                expression { return env.CHANGE_ID != null } // Only for PR builds
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
            emailext(
                subject: "❌ Jenkins Build Failed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """Hello Team,

The Jenkins build has FAILED.

Project: ${env.JOB_NAME}
Build Number: ${env.BUILD_NUMBER}
Branch: ${env.GIT_BRANCH}
Result: FAILURE
Check console: ${env.BUILD_URL}

Regards,
Jenkins
""",
                to: "anjalilingampet@gmail.com, haritha022004@gmail.com, teammate1@gmail.com"
            )
        }
        success {
            echo "Pipeline finished successfully."
            emailext(
                subject: "✅ Jenkins Build Success - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """Hello Team,

The Jenkins build has PASSED.

Project: ${env.JOB_NAME}
Build Number: ${env.BUILD_NUMBER}
Branch: ${env.GIT_BRANCH}
Result: SUCCESS
Check console: ${env.BUILD_URL}

Regards,
Jenkins
""",
                to: "anjalilingampet@gmail.com, haritha022004@gmail.com, teammate1@gmail.com"
            )
        }
    }
}
