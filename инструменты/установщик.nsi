Unicode true
Name "Цифровая цепочка КМГ"
OutFile "инструменты\выход\POKAZ_KMG_Setup.exe"
InstallDir "$LOCALAPPDATA\Programs\POKAZ_KMG"
RequestExecutionLevel user
SetCompressor /SOLID lzma
ShowInstDetails show

Page directory
Page instfiles
UninstPage uninstConfirm
UninstPage instfiles

Section "Показ" SEC_MAIN
  SetOutPath "$INSTDIR"
  File /r "инструменты\пакет\*.*"
  WriteUninstaller "$INSTDIR\Удалить показ.exe"
  CreateDirectory "$SMPROGRAMS\Цифровая цепочка КМГ"
  CreateShortcut "$SMPROGRAMS\Цифровая цепочка КМГ\Запустить показ.lnk" "$INSTDIR\Запуск показа.cmd"
  CreateShortcut "$SMPROGRAMS\Цифровая цепочка КМГ\Удалить показ.lnk" "$INSTDIR\Удалить показ.exe"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\POKAZ_KMG" "DisplayName" "Цифровая цепочка КМГ"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\POKAZ_KMG" "UninstallString" '$"$INSTDIR\Удалить показ.exe$"'
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\POKAZ_KMG" "InstallLocation" "$INSTDIR"
  ExecShell "open" "$INSTDIR\Запуск показа.cmd"
SectionEnd

Section "Uninstall"
  Delete "$SMPROGRAMS\Цифровая цепочка КМГ\Запустить показ.lnk"
  Delete "$SMPROGRAMS\Цифровая цепочка КМГ\Удалить показ.lnk"
  RMDir "$SMPROGRAMS\Цифровая цепочка КМГ"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\POKAZ_KMG"
  RMDir /r "$INSTDIR"
SectionEnd
