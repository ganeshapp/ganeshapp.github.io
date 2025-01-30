---
title: Cursor Appimage Launcher
date: 2024-11-24
tags: 
- Linux
- Coding
---
[Cursor.com](https://www.cursor.com/) provides an AppImage for Linux. But it doesn't provide a launcher for it. So you have to manually run the AppImage file to start Cursor.

To create a launcher for Cursor, you can create a `.desktop` file.

1.  Download the AppImage file from [Cursor.com](https://www.cursor.com/).
2.  Rename it to `cursor.AppImage`.
3.  Place it in a directory, say `~/Applications`.
4.  Make it executable by running `chmod +x ~/Applications/cursor.AppImage`.
5.  Download the Cursor icon from [Cursor.com](https://www.cursor.com/).
    1.  In the website right click and view the Page Source.
    2.  Look for the `<link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48"/>` tag.
    3.  Copy the URL of the icon ([https://www.cursor.com/favicon-48x48.png](https://www.cursor.com/favicon-48x48.png))
    4.  Save it as `cursor.png` in the same directory as the AppImage file.
6.  Create a file named `cursor.desktop` in `~/.local/share/applications` directory. Here is an example of a `.desktop` file for Cursor:

```ini
[Desktop Entry]
Name=Cursor
Exec=home/user/Applications/cursor.AppImage
Icon=home/user/Applications/cursor.png
Terminal=false
Type=Application
Categories=Development;
```

7. If the icon is not showing up in the application menu, try running

```
xdg-desktop-menu install cursor.desktop
```

8. If the icon is still not showing up, try running

```
xdg-desktop-menu forceupdate
```

9. If the icon is showing up as a gear icon, then you will first have to do the following:

First run the appimage file to get the `WM_CLASS` value. Once it is open go to terminal and run

```
xprop WM_CLASS
```

Then click on the gear icon of the application and then click somewhere else in the application. You should see the `WM_CLASS` value in the terminal.

Then go back to the `.desktop` file and replace the `WM_CLASS` value with the value you saw in the terminal.

Example:

```
[Desktop Entry]
Name=LM Studio
Exec=/home/gapp/Applications/lmstudio.AppImage --no-sandbox
Icon=/home/gapp/Applications/lmstudio.png
StartupWMClass=LM Studio
Type=Application
Terminal=false
```


