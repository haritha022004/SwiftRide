pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = 'swiftride-frontend-test:latest'
        BACKEND_IMAGE  = 'swiftride-backend-test:latest'
    }

    stages {
        stage('Check Docker') {
            steps {
                bat 'docker version'
            }
        }

        stage('Build Test Images') {
            parallel {
                stage('Build Frontend Image') {
                    steps {
                        bat "docker build -f Dockerfile.frontend -t ${FRONTEND_IMAGE} ."
                    }
                }
                stage('Build Backend Image') {
                    steps {
                        bat "docker build -f Dockerfile.backend -t ${BACKEND_IMAGE} ."
                    }
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        script {
                            echo "==== Running Frontend Tests ===="
                            def exitCode = bat(script: "docker run --rm ${FRONTEND_IMAGE}", returnStatus: true)
                            echo "Frontend exit code: ${exitCode}"
                            env.FRONTEND_RESULT = (exitCode == 0) ? "success" : "failure"
                        }
                    }
                }
                stage('Backend Tests') {
                    steps {
                        script {
                            echo "==== Running Backend Tests ===="
                            def exitCode = bat(script: "docker run --rm ${BACKEND_IMAGE}", returnStatus: true)
                            echo "Backend exit code: ${exitCode}"
                            env.BACKEND_RESULT = (exitCode == 0) ? "success" : "failure"
                        }
                    }
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
                        def overall = (env.FRONTEND_RESULT == "success" && env.BACKEND_RESULT == "success") ? "success" : "failure"
                        def description = "Frontend: ${env.FRONTEND_RESULT}, Backend: ${env.BACKEND_RESULT}"
                        def commitSHA = env.GIT_COMMIT

                        echo "Posting commit status to GitHub..."
                        bat "curl -H \"Authorization: token %TOKEN%\" -H \"Accept: application/vnd.github.v3+json\" -X POST -d \"{\\\"state\\\":\\\"${overall}\\\",\\\"context\\\":\\\"Jenkins CI\\\",\\\"description\\\":\\\"${description}\\\"}\" https://api.github.com/repos/haritha022004/SwiftRide/statuses/${commitSHA}"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                def subjectLine = (env.CHANGE_ID != null) ?
                    "PR #${env.CHANGE_ID} Build ${currentBuild.currentResult}" :
                    "Branch ${env.BRANCH_NAME} Build ${currentBuild.currentResult}"

                emailext(
                    subject: subjectLine,
                    body: """<h3>Jenkins Build Notification</h3>
                             <p><b>Result:</b> ${currentBuild.currentResult}</p>
                             <p><b>Frontend:</b> ${env.FRONTEND_RESULT}</p>
                             <p><b>Backend:</b> ${env.BACKEND_RESULT}</p>
                             <p><b>Job:</b> ${env.JOB_NAME}</p>
                             <p><b>Build #:</b> ${env.BUILD_NUMBER}</p>
                             <p><b>Branch/PR:</b> ${env.BRANCH_NAME}</p>
                             <p><b>URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>""",
                    to: "anjalilingampet@gmail.com"
                )
            }
            echo "Pipeline finished. Check console output and PR status."
        }
    }
}