# MongoDB and Server Management Script for PowerShell
# Usage: .\manage-services.ps1

function Show-Menu {
    Clear-Host
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "  Trackify - MongoDB & Server Management" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Check MongoDB Status" -ForegroundColor Yellow
    Write-Host "2. Start MongoDB Service" -ForegroundColor Yellow
    Write-Host "3. Stop MongoDB Service" -ForegroundColor Yellow
    Write-Host "4. Start Node.js Server" -ForegroundColor Yellow
    Write-Host "5. View MongoDB Logs (last 20 lines)" -ForegroundColor Yellow
    Write-Host "6. Start Everything (MongoDB + Server)" -ForegroundColor Yellow
    Write-Host "7. Stop Everything" -ForegroundColor Yellow
    Write-Host "8. Test MongoDB Connection" -ForegroundColor Yellow
    Write-Host "9. Exit" -ForegroundColor Yellow
    Write-Host ""
}

function Check-MongoStatus {
    Write-Host ""
    Write-Host "Checking MongoDB Service Status..." -ForegroundColor Cyan
    Write-Host ""
    
    $service = Get-Service MongoDB -ErrorAction SilentlyContinue
    
    if ($service) {
        Write-Host "Service Name: $($service.Name)" -ForegroundColor Green
        Write-Host "Status: $($service.Status)" -ForegroundColor Green
        Write-Host "Start Type: $($service.StartType)" -ForegroundColor Green
        
        if ($service.Status -eq "Running") {
            Write-Host "[OK] MongoDB is running!" -ForegroundColor Green
        } else {
            Write-Host "[WARNING] MongoDB is not running" -ForegroundColor Red
        }
    } else {
        Write-Host "[ERROR] MongoDB service not found. Install MongoDB first!" -ForegroundColor Red
    }
    
    Write-Host ""
    Read-Host "Press Enter to continue"
}

function Start-MongoService {
    Write-Host ""
    Write-Host "Starting MongoDB Service..." -ForegroundColor Cyan
    Write-Host ""
    
    try {
        Start-Service MongoDB -ErrorAction Stop
        Write-Host "[OK] MongoDB service started successfully!" -ForegroundColor Green
        Write-Host "Waiting for MongoDB to be ready..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    } catch {
        Write-Host "[ERROR] Failed to start MongoDB: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Read-Host "Press Enter to continue"
}

function Stop-MongoService {
    Write-Host ""
    Write-Host "Stopping MongoDB Service..." -ForegroundColor Cyan
    Write-Host ""
    
    try {
        Stop-Service MongoDB -ErrorAction Stop -Force
        Write-Host "[OK] MongoDB service stopped!" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] Failed to stop MongoDB: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Read-Host "Press Enter to continue"
}

function Start-NodeServer {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "  Starting Node.js Server" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Server will run on: http://localhost:3000" -ForegroundColor Green
    Write-Host "Landing Page: http://localhost:3000" -ForegroundColor Green
    Write-Host "Login: http://localhost:3000/login.html" -ForegroundColor Green
    Write-Host "Register: http://localhost:3000/registeration.html" -ForegroundColor Green
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    Set-Location $PSScriptRoot
    & node server.js
}

function View-MongoLogs {
    Write-Host ""
    Write-Host "Recent MongoDB Logs (last 20 lines):" -ForegroundColor Cyan
    Write-Host ""
    
    $logPath = "C:\Program Files\MongoDB\Server\8.0\log\mongod.log"
    
    if (Test-Path $logPath) {
        Get-Content $logPath -Tail 20
    } else {
        Write-Host "[ERROR] MongoDB log file not found at: $logPath" -ForegroundColor Red
    }
    
    Write-Host ""
    Read-Host "Press Enter to continue"
}

function Start-Everything {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "  Starting MongoDB and Node.js Server" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Check and start MongoDB
    Write-Host "Step 1: Checking MongoDB Service..." -ForegroundColor Yellow
    $service = Get-Service MongoDB -ErrorAction SilentlyContinue
    
    if ($service.Status -ne "Running") {
        Write-Host "Starting MongoDB..." -ForegroundColor Cyan
        try {
            Start-Service MongoDB -ErrorAction Stop
            Write-Host "[OK] MongoDB started" -ForegroundColor Green
            Start-Sleep -Seconds 3
        } catch {
            Write-Host "[ERROR] Could not start MongoDB: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "[OK] MongoDB is already running" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Step 2: Starting Node.js Server..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Open your browser to: http://localhost:3000" -ForegroundColor Green
    Write-Host ""
    
    Set-Location $PSScriptRoot
    & node server.js
}

function Stop-Everything {
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "  Stopping Services" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Stop MongoDB
    Write-Host "Stopping MongoDB Service..." -ForegroundColor Yellow
    try {
        Stop-Service MongoDB -ErrorAction Stop -Force
        Write-Host "[OK] MongoDB stopped" -ForegroundColor Green
    } catch {
        Write-Host "[WARNING] MongoDB may already be stopped" -ForegroundColor Yellow
    }
    
    # Stop Node.js
    Write-Host "Stopping Node.js Server..." -ForegroundColor Yellow
    $nodeProcess = Get-Process node -ErrorAction SilentlyContinue
    if ($nodeProcess) {
        Stop-Process -Name node -Force -ErrorAction SilentlyContinue
        Write-Host "[OK] Node.js server stopped" -ForegroundColor Green
    } else {
        Write-Host "[INFO] No running Node.js server found" -ForegroundColor Cyan
    }
    
    Write-Host ""
    Read-Host "Press Enter to continue"
}

function Test-MongoConnection {
    Write-Host ""
    Write-Host "Testing MongoDB Connection..." -ForegroundColor Cyan
    Write-Host ""
    
    # Check if MongoDB is running
    $service = Get-Service MongoDB -ErrorAction SilentlyContinue
    
    if ($service.Status -ne "Running") {
        Write-Host "[ERROR] MongoDB service is not running!" -ForegroundColor Red
        Write-Host "Please start MongoDB first." -ForegroundColor Yellow
        Write-Host ""
        Read-Host "Press Enter to continue"
        return
    }
    
    # Check if port 27017 is listening
    Write-Host "Checking port 27017..." -ForegroundColor Cyan
    $port = Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue
    
    if ($port) {
        Write-Host "[OK] MongoDB is listening on port 27017" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Could not confirm MongoDB on port 27017" -ForegroundColor Yellow
        Write-Host "MongoDB may be starting up - please wait a moment and try again" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Test Results:" -ForegroundColor Cyan
    Write-Host "- MongoDB Service: $($service.Status)" -ForegroundColor Green
    Write-Host "- Port 27017: $(if ($port) { 'Listening' } else { 'Not detected (give it a moment)' })" -ForegroundColor Green
    Write-Host ""
    Write-Host "To connect with Node.js server, ensure:" -ForegroundColor Yellow
    Write-Host "1. MongoDB service is Running (as above)" -ForegroundColor Yellow
    Write-Host "2. Start the Node.js server with option 6 (Start Everything)" -ForegroundColor Yellow
    Write-Host ""
    
    Read-Host "Press Enter to continue"
}

# Main loop
while ($true) {
    Show-Menu
    $choice = Read-Host "Enter your choice (1-9)"
    
    switch ($choice) {
        "1" { Check-MongoStatus }
        "2" { Start-MongoService }
        "3" { Stop-MongoService }
        "4" { Start-NodeServer }
        "5" { View-MongoLogs }
        "6" { Start-Everything }
        "7" { Stop-Everything }
        "8" { Test-MongoConnection }
        "9" { 
            Write-Host ""
            Write-Host "Goodbye!" -ForegroundColor Green
            exit 
        }
        default { Write-Host "Invalid choice. Please try again." -ForegroundColor Red }
    }
}
