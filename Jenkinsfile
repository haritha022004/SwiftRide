pipeline {
    agent any
    environment {
        GITHUB_TOKEN = credentials('github-token')
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t my-app:test .'
            }
        }

        stage('Run Tests in Docker') {
            steps {
                sh '''
                mkdir -p test-results
                docker run --rm -v $WORKSPACE/test-results:/tests my-app:test npm test -- --reporters=jest-junit
                '''
            }
        }

        stage('Publish Test Results') {
            steps {
                junit 'test-results/*.xml'
            }
        }
    }
    post {
        success {
            script {
                githubNotify(
                    context: 'Jenkins Tests',
                    status: 'SUCCESS',
                    description: 'All test cases passed!'
                )
            }
        }
        failure {
            script {
                githubNotify(
                    context: 'Jenkins Tests',
                    status: 'FAILURE',
                    description: 'Some test cases failed!'
                )
            }
        }
    }
}