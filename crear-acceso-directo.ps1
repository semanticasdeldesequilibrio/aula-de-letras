$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Aula de Letras.lnk")
$Shortcut.TargetPath = "C:\Users\MIGUEL\aula-de-letras\iniciar-proyecto.bat"
$Shortcut.WorkingDirectory = "C:\Users\MIGUEL\aula-de-letras"
$Shortcut.Description = "Iniciar plataforma Aula de Letras"
$Shortcut.Save()
Write-Host "Acceso directo creado en el escritorio"
