pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = "smartlms-backend"
        DOCKER_IMAGE_FRONTEND = "smartlms-frontend"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Static Code Analysis') {
            steps {
                echo 'Running Static Code Analysis...'
                // sh 'pylint backend/**/*.py'
                // sh 'cd frontend && npm run lint'
            }
        }

        stage('Backup Previous Deployment') {
            steps {
                echo 'Backing up...'
                // sh 'tar -czf backup_$(date +%F).tar.gz ...'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker Images...'
                sh 'docker-compose build'
            }
        }

        stage('Create Docker Network') {
            steps {
                echo 'Creating Network...'
                // Docker compose handles this, but explicitly:
                // sh 'docker network create lms_network || true'
            }
        }

        stage('Deploy Containers') {
            steps {
                echo 'Deploying...'
                sh 'docker-compose up -d'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Checking Health...'
                sleep 10
                sh 'curl -f http://localhost/ || exit 1'
                sh 'curl -f http://localhost/api/ || exit 1'
            }
        }
    }
}
