pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'raishab0001'
        DOCKER_CREDENTIALS_ID = 'dockerHubCred'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/sahilrai8006-prog/slms.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker-compose build'
            }
        }

        stage('Tag Images') {
            steps {
                bat 'docker tag lms-backend:latest %DOCKERHUB_USERNAME%/lms-backend:latest'
                bat 'docker tag lms-frontend:latest %DOCKERHUB_USERNAME%/lms-frontend:latest'
            }
        }

        stage('Docker Hub Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerHubCred',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                bat 'docker push %DOCKERHUB_USERNAME%/lms-backend:latest'
                bat 'docker push %DOCKERHUB_USERNAME%/lms-frontend:latest'
            }
        }

        stage('Deploy Containers') {
            steps {
                bat 'docker-compose down'
                bat 'docker-compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                powershell '''
                Write-Host "Waiting for containers..."
                Start-Sleep -Seconds 15

                try {
                    Invoke-WebRequest http://localhost:8090 -UseBasicParsing
                    Write-Host "✅ Application is UP via Nginx"
                } catch {
                    if ($_.Exception.Response.StatusCode -eq 404) {
                        Write-Host "⚠️ App running (404 acceptable)"
                        exit 0
                    } else {
                        throw
                    }
                }
                '''
            }
        }
    }

    post {
        always {
            bat 'docker logout'
        }
        success {
            echo '✅ LMS CI/CD PIPELINE SUCCESS'
        }
        failure {
            echo '❌ LMS CI/CD PIPELINE FAILED'
        }
    }
}
