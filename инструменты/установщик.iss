; Установка в профиль пользователя не требует прав администратора.
#define Имя "Цифровая цепочка КМГ"
#define Версия GetEnv("ПОКАЗ_ВЕРСИЯ")
[Setup]
AppId={{3F97BFE1-DC63-42F5-BA78-94F72346C6DB}
AppName={#Имя}
AppVersion={#Версия}
DefaultDirName={localappdata}\Programs\POKAZ_KMG
DefaultGroupName={#Имя}
PrivilegesRequired=lowest
OutputDir=выход
OutputBaseFilename=POKAZ_KMG_Setup
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
UninstallDisplayName={#Имя}
ArchitecturesAllowed=x64compatible
DisableProgramGroupPage=yes

[Files]
Source: "пакет\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\{#Имя}"; Filename: "{app}\Запуск показа.cmd"; WorkingDir: "{app}"
Name: "{autodesktop}\{#Имя}"; Filename: "{app}\Запуск показа.cmd"; WorkingDir: "{app}"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Создать ярлык на рабочем столе"; GroupDescription: "Дополнительные задачи:"

[Run]
Filename: "{app}\Запуск показа.cmd"; Description: "Запустить показ"; Flags: postinstall skipifsilent shellexec nowait
