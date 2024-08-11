@echo off
setlocal
set DIR=%~dp0
setx PATH "%PATH%;%DIR%"
echo Power tool installed successfully! You can now use the "power" command.
pause
