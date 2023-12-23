Unlike Wayland, Mac-like touchpad gestures don't work on X11. To find whether your Ubuntu is Wayland or X11 you can run one of the following commands:

```
loginctl show-session $(awk '/tty/ {print $1}' <(loginctl)) -p Type | awk -F= '{print $2}'
```

or 

```
echo $XDG_SESSION_TYPE
```

If your Ubuntu is X11 follow the below steps:

1. In the Terminal, enter
   ```
   sudo apt update && sudo apt upgrade; sudo apt install gnome-tweaks gnome-shell-extensions gnome-shell-extension-manager
   ```
2. Once you had installed the Extension Manager. Open it and search for X11 and you will find the extension "X11 Gestures". Install it.
   ![[../../assets/Pasted image 20230520175259.png]]
3. Go back to terminal and add the touchegg repository:
   `sudo add-apt-repository ppa:touchegg/stable`
4. Install touchegg `sudo apt install touchegg`
5. Run systemctl to check if touchegg is running `systemctl status touchegg`

3 fingers to the left or right will switch workspace, 3 fingers down will expose all the windows and swiping 3 fingers down again will show all the apps.