pipeline {
    agent { label 'windows' }

    // Define the tools that will be used.
    // These must be pre-configured in "Manage Jenkins" > "Global Tool Configuration".
    // - 'NodeJS-20' for Node.js v20.x
    // - 'Python-3.11' for Python v3.11.x (using ShiningPanda plugin or similar)
    tools {
        nodejs 'NodeJS-20'
        pyenv 'Python-3.11' 
    }

    stages {
        // Stage 1: Download source code from GitHub
        stage('Checkout') {
            steps {
                echo 'Downloading code from repository...'
                // Clones the specified repository
                git url: 'https://github.com/AntoniHub/REM_Waste.git', branch: 'main'
            }
        }

        // Stage 2: Run API tests
        stage('Run API Tests') {
            steps {
                // Executes inside the API tests directory
                dir('REM/API Tests') {
                    echo 'Installing Python dependencies for API tests...'
                    bat 'pip install pytest requests'

                    echo 'Installing Node.js dependencies for API tests...'
                    bat 'npm install -g json-server@1.0.0-beta.3'

                    echo 'Starting json-server in background...'
                    // Starts the server in background on Windows
                    bat 'start /b json-server --watch db.json --port 3001'
                    // Waits 5 seconds to ensure the server starts properly
                    bat 'timeout /t 5'

                    echo 'Running API tests with pytest...'
                    bat 'pytest -v'
                }
            }
            // The 'post' block always runs after the stage, regardless of result.
            post {
                always {
                    echo 'Cleaning up json-server process...'
                    // Finds process using port 3001 and terminates it.
                    // Ignores error if the process no longer exists (returnStatus: true).
                    bat script: '''
                        for /f "tokens=5" %%a in ('netstat -aon ^| findstr "3001"') do (
                            taskkill /F /PID %%a
                        )
                    ''', returnStatus: true
                }
            }
        }

        // Stage 3: Run UI tests
        stage('Run UI Tests') {
            steps {
                // Executes inside the UI tests directory
                dir('REM/UI Tests') {
                    echo 'Installing npm dependencies for UI tests...'
                    // Assumes a 'package.json' exists in this directory.
                    bat 'npm install'

                    echo 'Running UI tests...'
                    bat 'npx playwright test'
                }
            }
        }
    }
}
